import { computed, ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import type { MultipleDatePickerValue } from '@mezzanine-ui/core/multiple-date-picker';
import { useCalendarContext } from '../calendar/calendar-context';

export interface UseMultipleDatePickerValueProps {
  /**
   * The format pattern for displaying dates (e.g., "YYYY-MM-DD")
   */
  format: () => string;
  /**
   * Maximum number of dates that can be selected
   */
  maxSelections?: () => number | undefined;
  /**
   * Controlled value
   */
  value?: () => MultipleDatePickerValue | undefined;
}

export interface UseMultipleDatePickerValueReturn {
  /**
   * Clear all selected dates
   */
  clearAll: () => void;
  /**
   * Format a date to display string
   */
  formatDate: (date: DateType) => string;
  /**
   * Confirm the current selection (returns the value to be passed on)
   */
  getConfirmValue: () => MultipleDatePickerValue;
  /**
   * The internal value (pending changes)
   */
  internalValue: Ref<MultipleDatePickerValue>;
  /**
   * Check if a date is currently selected
   */
  isDateSelected: (date: DateType) => boolean;
  /**
   * Check if selection has reached max limit
   */
  isMaxReached: ComputedRef<boolean>;
  /**
   * Remove a specific date from selection
   */
  removeDate: (date: DateType) => void;
  /**
   * Cancel and revert to original value
   */
  revertToValue: () => void;
  /**
   * Toggle a date in/out of selection
   */
  toggleDate: (date: DateType) => void;
}

/**
 * 管理多日期選擇器待確認選取的 composable。
 *
 * 選取先寫進內部狀態，按下確認才交出去；取消或點擊外部則還原成傳進來的值。
 * 日期一律依時間排序，`maxSelections` 到達上限後不再加入新的日期。
 *
 * @example
 * ```ts
 * const { internalValue, toggleDate, getConfirmValue } =
 *   useMultipleDatePickerValue({
 *     format: () => 'YYYY-MM-DD',
 *     value: () => props.value,
 *   });
 * ```
 *
 * @see MznMultipleDatePicker 搭配的元件
 */
export function useMultipleDatePickerValue(
  props: UseMultipleDatePickerValueProps,
): UseMultipleDatePickerValueReturn {
  const calendar = useCalendarContext();

  const value = (): MultipleDatePickerValue => props.value?.() ?? [];

  // Sort dates in chronological order
  const sortDates = (dates: MultipleDatePickerValue): MultipleDatePickerValue =>
    [...dates].sort((a, b) => {
      if (calendar.value.isSameDate(a, b)) return 0;

      return calendar.value.isBefore(a, b) ? -1 : 1;
    });

  // Internal state for pending changes
  const internalValue = ref<MultipleDatePickerValue>(sortDates(value()));

  // Sync internal value when controlled value changes
  watch(
    () => props.value?.(),
    () => {
      internalValue.value = sortDates(value());
    },
  );

  const formatDate = (date: DateType): string =>
    calendar.value.formatToString(calendar.value.locale, date, props.format());

  const isDateSelected = (date: DateType): boolean =>
    internalValue.value.some((selected) =>
      calendar.value.isSameDate(selected, date),
    );

  const isMaxReached = computed((): boolean => {
    const maxSelections = props.maxSelections?.();

    return (
      typeof maxSelections === 'number' &&
      internalValue.value.length >= maxSelections
    );
  });

  function toggleDate(date: DateType): void {
    const previous = internalValue.value;
    const existingIndex = previous.findIndex((selected) =>
      calendar.value.isSameDate(selected, date),
    );

    if (existingIndex >= 0) {
      // Remove the date
      internalValue.value = previous.filter(
        (_, index) => index !== existingIndex,
      );

      return;
    }

    const maxSelections = props.maxSelections?.();

    // Check max limit before adding
    if (typeof maxSelections === 'number' && previous.length >= maxSelections) {
      return;
    }

    // Add the date and sort
    internalValue.value = sortDates([...previous, date]);
  }

  function removeDate(date: DateType): void {
    internalValue.value = internalValue.value.filter(
      (selected) => !calendar.value.isSameDate(selected, date),
    );
  }

  function clearAll(): void {
    internalValue.value = [];
  }

  const getConfirmValue = (): MultipleDatePickerValue => internalValue.value;

  function revertToValue(): void {
    internalValue.value = sortDates(value());
  }

  return {
    clearAll,
    formatDate,
    getConfirmValue,
    internalValue,
    isDateSelected,
    isMaxReached,
    removeDate,
    revertToValue,
    toggleDate,
  };
}
