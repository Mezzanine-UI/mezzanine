import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import MaskFormat, { getMaskRange } from './MaskFormat';

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
}

/**
 * Hook for formatting date/time input with mask format
 * Based on Ant Design's implementation approach
 */
export function useDateInputFormatter(props: UseDateInputFormatterProps) {
  const { format, value: externalValue = '', onChange, inputRef } = props;

  // State
  const [internalValue, setInternalValue] = useState(externalValue);

  // Mask format parser
  const maskFormat = useRef(new MaskFormat(format)).current;

  // Sync external value
  useEffect(() => {
    if (externalValue !== internalValue) {
      setInternalValue(externalValue);
    }
  }, [externalValue, internalValue]);

  /**
   * Trigger value change
   */
  const triggerChange = useCallback(
    (newValue: string, cursorPosition?: number) => {
      setInternalValue(newValue);

      if (onChange) {
        const rawDigits = newValue.replace(/[^0-9]/g, '');
        onChange(newValue, rawDigits);
      }

      // Restore cursor position after React re-renders
      if (cursorPosition !== undefined && inputRef?.current) {
        requestAnimationFrame(() => {
          inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
        });
      }
    },
    [onChange, inputRef],
  );

  /**
   * Handle focus event
   */
  const handleFocus = useCallback(() => {
    // If value doesn't match format, fill with format template
    if (!maskFormat.match(internalValue)) {
      triggerChange(format);
    }
  }, [format, internalValue, maskFormat, triggerChange]);

  /**
   * Handle blur event
   */
  const handleBlur = useCallback(() => {
    // No-op for now
  }, []);

  /**
   * Handle change event (for non-mask input, blocked in mask mode)
   */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // In mask mode, we handle input through keydown
      // This is just a fallback
      const newValue = e.target.value;
      if (newValue.length <= format.length) {
        triggerChange(newValue);
      }
    },
    [format.length, triggerChange],
  );

  /**
   * Handle key down for mask input
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;

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
          newValue[prevPos] = format[prevPos];
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
              newValue[lastDigitPos] = format[lastDigitPos];
              triggerChange(newValue.join(''), lastDigitPos);
              return;
            }
          }
        }

        // Normal clear
        const newValue = internalValue.split('');
        newValue[clearPos] = format[clearPos];
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
        const cellFormat = format.slice(targetCell.start, targetCell.end);
        const [minVal, maxVal] = getMaskRange(cellFormat);

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
      if (key.length === 1) {
        e.preventDefault();
      }
    },
    [format, internalValue, maskFormat, triggerChange],
  );

  return {
    value: internalValue,
    handleChange,
    handleKeyDown,
    handleFocus,
    handleBlur,
  };
}
