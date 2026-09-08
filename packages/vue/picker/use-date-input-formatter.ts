import { computed, ref, toValue, watch } from 'vue';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { useCalendarContext } from '../calendar/calendar-context';
import { message } from '../message/message';
import { getTemplateWithoutBrackets } from './format-utils';
import MaskFormat, { getMaskRange } from './mask-format';

export interface UseDateInputFormatterProps {
  /**
   * error messages for different validation scenarios
   * @default { enabled: true, invalidInput: 'Input value is not valid.', invalidPaste: 'Pasted content is not valid.' }
   */
  errorMessages?: MaybeRefOrGetter<
    | {
        enabled?: boolean;
        invalidInput?: string;
        invalidPaste?: string;
      }
    | undefined
  >;
  /**
   * Format pattern (e.g., "YYYY-MM-DD", "HH:mm:ss")
   */
  format: MaybeRefOrGetter<string>;
  /**
   * Input ref for controlling selection
   */
  inputRef?: Ref<HTMLInputElement | null>;
  /**
   * Blur event handler
   */
  onBlur?: (event: FocusEvent) => void;
  /**
   * Change handler receiving formatted value and raw digits
   */
  onChange?: (formattedValue: string, rawDigits: string) => void;
  /**
   * Focus event handler
   */
  onFocus?: (event: FocusEvent) => void;
  /**
   * Callback when a valid ISO date is pasted.
   * This allows parent components to handle cross-field updates
   * (e.g., updating time field when date+time is pasted into date field).
   */
  onPasteIsoValue?: (isoValue: string) => void;
  /**
   * Custom validation function. Return true if valid, false to clear the value.
   * Called after format validation passes.
   */
  validate?: (isoDate: string) => boolean;
  /**
   * Current value
   */
  value?: MaybeRefOrGetter<string | undefined>;
}

export interface UseDateInputFormatterResult {
  /** Whether the input is focused. */
  focused: Ref<boolean>;
  /** Blurs, clearing or validating whatever was typed. */
  handleBlur: (event: FocusEvent) => void;
  /** Focuses, filling the input with the format template when it is empty. */
  handleFocus: (event: FocusEvent) => void;
  /** Drives the mask: digits, Backspace, and nothing else. */
  handleKeyDown: (event: KeyboardEvent) => void;
  /** Accepts an ISO value or fills the mask digit by digit. */
  handlePaste: (event: ClipboardEvent) => void;
  /** Whether every mask position is filled. */
  isComplete: ComputedRef<boolean>;
  /** The masked text the input shows. */
  value: Ref<string>;
}

const defaultErrorMessages = {
  enabled: true,
  invalidInput: 'Input value is not valid.',
  invalidPaste: 'Pasted content is not valid.',
};

/**
 * 以遮罩格式驅動日期／時間輸入框。
 *
 * 只接受數字與 Backspace，游標會在欄位之間自動跳動，超出範圍的數字直接擋掉；
 * 填滿且能解析成合法日期時才送出 `onChange`，否則跳出錯誤訊息。
 * 失焦時未填完或不合法的值會被清空。
 *
 * @example
 * ```ts
 * const { value, focused, handleKeyDown } = useDateInputFormatter({
 *   format: 'YYYY-MM-DD',
 *   onChange: (iso) => emit('change', iso),
 * });
 * ```
 *
 * @see MznFormattedInput 使用這個 composable 的輸入框
 */
export function useDateInputFormatter(
  props: UseDateInputFormatterProps,
): UseDateInputFormatterResult {
  const {
    errorMessages,
    format,
    inputRef,
    onBlur: onBlurProp,
    onChange,
    onFocus: onFocusProp,
    onPasteIsoValue,
    validate,
    value: externalValue,
  } = props;

  const calendar = useCalendarContext();

  const resolvedErrorMessages = (): typeof defaultErrorMessages => ({
    ...defaultErrorMessages,
    ...(toValue(errorMessages) ?? {}),
  });

  const currentFormat = (): string => toValue(format);
  const currentExternalValue = (): string => toValue(externalValue) ?? '';

  /**
   * Built once, exactly as React builds it in a ref: a later `format` change
   * leaves the mask alone.
   */
  const maskFormat = new MaskFormat(currentFormat());
  const internalValue = ref<string>(
    currentExternalValue() || getTemplateWithoutBrackets(currentFormat()),
  );

  // Track focus state
  const focused = ref(false);

  /**
   * Check if value is completely filled and valid
   */
  const isValueComplete = (val: string): boolean => maskFormat.match(val);

  // Sync external value - only update internal when external explicitly changes
  let prevExternalValue = currentExternalValue();

  watch([() => currentExternalValue(), () => currentFormat()], () => {
    const next = currentExternalValue();

    // Only sync when external value actually changes (not caused by our own onChange)
    if (next !== prevExternalValue) {
      prevExternalValue = next;

      if (next) {
        internalValue.value = next;
      } else {
        // External cleared - reset to template
        internalValue.value = getTemplateWithoutBrackets(currentFormat());
      }
    }
  });

  /**
   * Trigger value change
   */
  function triggerChange(newValue: string, cursorPosition?: number): void {
    internalValue.value = newValue;

    // Only trigger onChange if value is complete and valid
    if (onChange && isValueComplete(newValue)) {
      // Try to parse and validate the formatted value
      const isoDate = calendar.value.parseFormattedValue(
        newValue,
        currentFormat(),
        calendar.value.locale,
      );

      // Validate format and custom validation (e.g., time step)
      if (isoDate && (!validate || validate(isoDate))) {
        const rawDigits = newValue.replace(/[^0-9]/g, '');

        onChange(isoDate, rawDigits);
      } else if (resolvedErrorMessages().enabled) {
        message.error(resolvedErrorMessages().invalidInput);
      }
    }

    // Restore cursor position after Vue re-renders
    if (cursorPosition !== undefined && inputRef?.value) {
      requestAnimationFrame(() => {
        inputRef.value?.setSelectionRange(cursorPosition, cursorPosition);
      });
    }
  }

  /**
   * Handle focus event
   */
  function handleFocus(event: FocusEvent): void {
    focused.value = true;
    onFocusProp?.(event);

    // If value doesn't match format, fill with format template
    if (!maskFormat.match(internalValue.value)) {
      triggerChange(getTemplateWithoutBrackets(currentFormat()));
    }
  }

  /**
   * Handle blur event - clear incomplete values
   */
  function handleBlur(event: FocusEvent): void {
    focused.value = false;
    onBlurProp?.(event);

    const templateValue = getTemplateWithoutBrackets(currentFormat());

    // If value is incomplete, clear it and notify parent
    if (!isValueComplete(internalValue.value)) {
      internalValue.value = templateValue;

      // Notify parent that value is cleared
      if (onChange) {
        onChange('', '');
      }

      return;
    }

    // Value is complete, validate it
    const isoDate = calendar.value.parseFormattedValue(
      internalValue.value,
      currentFormat(),
      calendar.value.locale,
    );

    if (!isoDate) {
      // Invalid date/time format, clear it
      internalValue.value = templateValue;

      if (onChange) {
        onChange('', '');
      }
    } else if (validate && !validate(isoDate)) {
      // Custom validation failed (e.g., time step validation), clear it
      internalValue.value = templateValue;

      if (onChange) {
        onChange('', '');
      }
    }
  }

  /**
   * Handle key down for mask input
   */
  function handleKeyDown(event: KeyboardEvent): void {
    const { key } = event;
    const templateValue = getTemplateWithoutBrackets(currentFormat());

    if (key === 'Tab') {
      event.stopPropagation();

      return;
    }

    // Backspace
    if (key === 'Backspace') {
      event.preventDefault();

      const cursorPos = (event.target as HTMLInputElement).selectionStart || 0;

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
              if (/\d/.test(internalValue.value[prevPos])) {
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
        const newValue = internalValue.value.split('');

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
          if (/\d/.test(internalValue.value[i])) {
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
            if (/\d/.test(internalValue.value[lastDigitPos])) {
              break;
            }

            lastDigitPos--;
          }

          if (lastDigitPos >= prevCell.start) {
            const newValue = internalValue.value.split('');

            newValue[lastDigitPos] = templateValue[lastDigitPos];
            triggerChange(newValue.join(''), lastDigitPos);

            return;
          }
        }
      }

      // Normal clear
      const newValue = internalValue.value.split('');

      newValue[clearPos] = templateValue[clearPos];
      triggerChange(newValue.join(''), clearPos);

      return;
    }

    // Number input
    if (/^\d$/.test(key)) {
      event.preventDefault();

      const cursorPos = (event.target as HTMLInputElement).selectionStart || 0;

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
      const currentCellValue = internalValue.value.slice(
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
        const newValue = internalValue.value.split('');

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
      const newValue = internalValue.value.split('');

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
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        event.preventDefault();
      }
    }
  }

  function handlePaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pasteData = event.clipboardData?.getData('Text') ?? '';
    const { formatToString, isValid, locale } = calendar.value;

    if (isValid(pasteData)) {
      // If pasted data is a valid ISO date, format it accordingly
      const parsedDate = formatToString(locale, pasteData, currentFormat());

      if (parsedDate) {
        // Notify parent about the full ISO value for cross-field sync
        onPasteIsoValue?.(pasteData);
        triggerChange(parsedDate);

        return;
      }
    }

    const newValueArray = internalValue.value.split('');

    let pasteIndex = 0;

    for (const cell of maskFormat.maskCells) {
      for (let i = cell.start; i < cell.end; i++) {
        if (pasteIndex >= pasteData.length) {
          break;
        }

        const char = pasteData[pasteIndex];

        if (/\d/.test(char)) {
          newValueArray[i] = char;
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

    const newValue = newValueArray.join('');

    if (newValue === getTemplateWithoutBrackets(currentFormat())) {
      // No valid input from paste
      if (resolvedErrorMessages().enabled) {
        message.error(resolvedErrorMessages().invalidPaste);
      }
    }

    triggerChange(newValue);
  }

  return {
    value: internalValue,
    focused,
    isComplete: computed((): boolean => isValueComplete(internalValue.value)),
    handleKeyDown,
    handleFocus,
    handleBlur,
    handlePaste,
  };
}
