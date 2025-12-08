import {
  ClipboardEventHandler,
  FocusEventHandler,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import MaskFormat, { getMaskRange } from './MaskFormat';
import { getTemplateWithoutBrackets } from './formatUtils';
import { useCalendarContext } from '../Calendar';

export interface UseDateInputFormatterProps {
  /**
   * Format pattern (e.g., "YYYY-MM-DD", "HH:mm:ss")
   */
  format: string;
  /**
   * Current value
   */
  value?: string;
  /**
   * Change handler receiving formatted value and raw digits
   */
  onChange?: (formattedValue: string, rawDigits: string) => void;
  /**
   * Input ref for controlling selection
   */
  inputRef?: React.RefObject<HTMLInputElement | null>;
  /**
   * Focus event handler
   */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /**
   * Blur event handler
   */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /**
   * Custom validation function. Return true if valid, false to clear the value.
   * Called after format validation passes.
   */
  validate?: (isoDate: string) => boolean;
}

/**
 * Hook for formatting date/time input with mask format
 */
export function useDateInputFormatter(props: UseDateInputFormatterProps) {
  const {
    format,
    value: externalValue = '',
    onChange,
    inputRef,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    validate,
  } = props;

  const { parseFormattedValue, isValid, valueLocale, formatToString } =
    useCalendarContext();

  const maskFormat = useRef(new MaskFormat(format)).current;
  const [internalValue, setInternalValue] = useState(
    externalValue || getTemplateWithoutBrackets(format),
  );

  // Track focus state
  const [focused, setFocused] = useState(false);

  /**
   * Check if value is completely filled and valid
   */
  const isValueComplete = useCallback(
    (val: string): boolean => {
      return maskFormat.match(val);
    },
    [maskFormat],
  );

  // Sync external value - only update internal when external explicitly changes
  const prevExternalValue = useRef(externalValue);
  useEffect(() => {
    // Only sync when external value actually changes (not caused by our own onChange)
    if (externalValue !== prevExternalValue.current) {
      prevExternalValue.current = externalValue;
      if (externalValue) {
        setInternalValue(externalValue);
      } else {
        // External cleared - reset to template
        setInternalValue(getTemplateWithoutBrackets(format));
      }
    }
  }, [externalValue, format]);

  /**
   * Trigger value change
   */
  const triggerChange = useCallback(
    (newValue: string, cursorPosition?: number) => {
      setInternalValue(newValue);

      // Only trigger onChange if value is complete and valid
      if (onChange && isValueComplete(newValue)) {
        // Try to parse and validate the formatted value
        const isoDate = parseFormattedValue(newValue, format);

        // Validate format and custom validation (e.g., time step)
        if (isoDate && (!validate || validate(isoDate))) {
          const rawDigits = newValue.replace(/[^0-9]/g, '');
          onChange(isoDate, rawDigits);
        }
      }

      // Restore cursor position after React re-renders
      if (cursorPosition !== undefined && inputRef?.current) {
        requestAnimationFrame(() => {
          inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
        });
      }
    },
    [
      onChange,
      inputRef,
      isValueComplete,
      parseFormattedValue,
      format,
      validate,
    ],
  );

  /**
   * Handle focus event
   */
  const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setFocused(true);
      onFocusProp?.(e);
      // If value doesn't match format, fill with format template
      if (!maskFormat.match(internalValue)) {
        triggerChange(getTemplateWithoutBrackets(format));
      }
    },
    [format, internalValue, maskFormat, triggerChange, onFocusProp],
  );

  /**
   * Handle blur event - clear incomplete values
   */
  const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setFocused(false);
      onBlurProp?.(e);

      // If value is incomplete, clear it and notify parent
      if (!isValueComplete(internalValue)) {
        const templateValue = getTemplateWithoutBrackets(format);
        setInternalValue(templateValue);
        // Notify parent that value is cleared
        if (onChange) {
          onChange('', '');
        }
      } else {
        // Value is complete, validate it
        const isoDate = parseFormattedValue(internalValue, format);

        if (!isoDate) {
          // Invalid date/time format, clear it
          const templateValue = getTemplateWithoutBrackets(format);
          setInternalValue(templateValue);
          if (onChange) {
            onChange('', '');
          }
        } else if (validate && !validate(isoDate)) {
          // Custom validation failed (e.g., time step validation), clear it
          const templateValue = getTemplateWithoutBrackets(format);
          setInternalValue(templateValue);
          if (onChange) {
            onChange('', '');
          }
        }
      }
    },
    [
      format,
      internalValue,
      isValueComplete,
      onChange,
      onBlurProp,
      parseFormattedValue,
      validate,
    ],
  );

  /**
   * Handle key down for mask input
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      const templateValue = getTemplateWithoutBrackets(format);

      if (key === 'Tab') {
        e.stopPropagation();
        return;
      }

      // Backspace
      if (key === 'Backspace') {
        e.preventDefault();

        const cursorPos = (e.target as HTMLInputElement).selectionStart || 0;
        if (cursorPos === 0) return;

        // Check if cursor is on a separator
        let isSeparatorPos = true;
        for (const cell of maskFormat.maskCells) {
          if (cursorPos > cell.start && cursorPos <= cell.end) {
            isSeparatorPos = false;
            break;
          }
        }

        if (isSeparatorPos) {
          // On separator, move cursor to previous editable position
          let prevPos = cursorPos - 1;
          while (prevPos >= 0) {
            let found = false;
            for (const cell of maskFormat.maskCells) {
              if (prevPos >= cell.start && prevPos < cell.end) {
                // Check if this position has a digit
                if (/\d/.test(internalValue[prevPos])) {
                  found = true;
                  break;
                }
              }
            }
            if (found) break;
            prevPos--;
          }

          if (prevPos < 0) return;

          // Clear that position
          const newValue = internalValue.split('');
          newValue[prevPos] = templateValue[prevPos];
          triggerChange(newValue.join(''), prevPos);
          return;
        }

        // Find which cell the cursor is in
        let targetCellIndex = -1;
        let posInCell = -1;

        for (let i = 0; i < maskFormat.maskCells.length; i++) {
          const cell = maskFormat.maskCells[i];
          if (cursorPos > cell.start && cursorPos <= cell.end) {
            targetCellIndex = i;
            posInCell = cursorPos - cell.start;
            break;
          }
        }

        if (targetCellIndex === -1) return;

        const targetCell = maskFormat.maskCells[targetCellIndex];
        const clearPos = targetCell.start + posInCell - 1;

        // Check if clearing the first position of current cell
        if (posInCell === 1) {
          // Check if entire cell is empty (all format chars)
          let cellIsEmpty = true;
          for (let i = targetCell.start; i < targetCell.end; i++) {
            if (/\d/.test(internalValue[i])) {
              cellIsEmpty = false;
              break;
            }
          }

          if (cellIsEmpty && targetCellIndex > 0) {
            // Jump to previous cell's last position
            const prevCell = maskFormat.maskCells[targetCellIndex - 1];
            let lastDigitPos = prevCell.end - 1;

            // Find last digit in previous cell
            while (lastDigitPos >= prevCell.start) {
              if (/\d/.test(internalValue[lastDigitPos])) {
                break;
              }
              lastDigitPos--;
            }

            if (lastDigitPos >= prevCell.start) {
              const newValue = internalValue.split('');
              newValue[lastDigitPos] = templateValue[lastDigitPos];
              triggerChange(newValue.join(''), lastDigitPos);
              return;
            }
          }
        }

        // Normal clear
        const newValue = internalValue.split('');
        newValue[clearPos] = templateValue[clearPos];
        triggerChange(newValue.join(''), clearPos);
        return;
      }

      // Number input
      if (/^\d$/.test(key)) {
        e.preventDefault();

        const cursorPos = (e.target as HTMLInputElement).selectionStart || 0;

        // Check if cursor is on a separator
        let isSeparatorPos = true;
        let nextEditablePos = cursorPos;

        for (const cell of maskFormat.maskCells) {
          if (cursorPos >= cell.start && cursorPos < cell.end) {
            isSeparatorPos = false;
            break;
          }
        }

        if (isSeparatorPos) {
          // Find next editable position
          for (const cell of maskFormat.maskCells) {
            if (cell.start >= cursorPos) {
              nextEditablePos = cell.start;
              break;
            }
          }
        }

        // Find which cell the cursor is in
        let targetCellIndex = -1;

        for (let i = 0; i < maskFormat.maskCells.length; i++) {
          const cell = maskFormat.maskCells[i];
          if (nextEditablePos >= cell.start && nextEditablePos < cell.end) {
            targetCellIndex = i;
            break;
          }
        }

        if (targetCellIndex === -1) {
          // Not in a valid cell, block input
          return;
        }

        const targetCell = maskFormat.maskCells[targetCellIndex];
        const [minVal, maxVal] = getMaskRange(targetCell.mask || '');

        // Get current cell value
        const currentCellValue = internalValue.slice(
          targetCell.start,
          targetCell.end,
        );

        // Build the new cell value with the input at cursor position
        const newCellValue = currentCellValue.split('');
        const posInCell = nextEditablePos - targetCell.start;
        newCellValue[posInCell] = key;

        // Validate the new cell value
        const newCellStr = newCellValue.join('');

        // Check if all positions are filled
        if (!/^\d+$/.test(newCellStr)) {
          // Not all filled, allow input
          const newValue = internalValue.split('');
          newValue[nextEditablePos] = key;

          // Check if we need to jump to next cell
          let nextPos = nextEditablePos + 1;
          if (
            nextPos >= targetCell.end &&
            targetCellIndex < maskFormat.maskCells.length - 1
          ) {
            // Jump to next cell
            nextPos = maskFormat.maskCells[targetCellIndex + 1].start;
          }

          triggerChange(newValue.join(''), nextPos);
          return;
        }

        // All filled, validate range
        const cellNum = parseInt(newCellStr, 10);

        if (cellNum < minVal || cellNum > maxVal) {
          // Invalid, block input
          return;
        }

        // Valid, update
        const newValue = internalValue.split('');
        newValue[nextEditablePos] = key;

        // Jump to next cell after filling current cell
        let nextPos = nextEditablePos + 1;
        if (
          nextPos >= targetCell.end &&
          targetCellIndex < maskFormat.maskCells.length - 1
        ) {
          // Jump to next cell
          nextPos = maskFormat.maskCells[targetCellIndex + 1].start;
        }

        triggerChange(newValue.join(''), nextPos);

        return;
      }

      // Block other keys (separators, letters, etc.)
      if (key.length === 1 && !/[\dBackspace]/.test(key)) {
        if (!(e.ctrlKey || e.metaKey || e.altKey)) {
          e.preventDefault();
        }
      }
    },
    [format, internalValue, maskFormat, triggerChange],
  );

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.preventDefault();

      const pasteData = e.clipboardData.getData('Text');

      console.log(pasteData);

      if (isValid(pasteData)) {
        // If pasted data is a valid ISO date, format it accordingly
        const parsedDate = formatToString(valueLocale, pasteData, format);

        if (parsedDate) {
          triggerChange(parsedDate);
          return;
        }
      }

      const newValue = internalValue.split('');

      let pasteIndex = 0;

      for (const cell of maskFormat.maskCells) {
        for (let i = cell.start; i < cell.end; i++) {
          if (pasteIndex >= pasteData.length) {
            break;
          }
          const char = pasteData[pasteIndex];
          if (/\d/.test(char)) {
            newValue[i] = char;
            pasteIndex++;
          } else {
            // Skip non-digit characters in paste data
            pasteIndex++;
            i--; // Stay on the same position
          }
        }
        if (pasteIndex >= pasteData.length) {
          break;
        }
      }

      triggerChange(newValue.join(''));
    },
    [
      internalValue,
      maskFormat,
      triggerChange,
      isValid,
      format,
      formatToString,
      valueLocale,
    ],
  );

  return {
    value: internalValue,
    focused,
    handleKeyDown,
    handleFocus,
    handleBlur,
    handlePaste,
  };
}
