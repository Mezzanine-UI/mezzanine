'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import { MultipleDatePickerValue } from '@mezzanine-ui/core/multiple-date-picker';
import { useCallback, useEffect, useState } from 'react';
import { useCalendarContext } from '../Calendar';

export interface UseMultipleDatePickerValueProps {
  /**
   * The format pattern for displaying dates (e.g., "YYYY-MM-DD")
   */
  format: string;
  /**
   * Maximum number of dates that can be selected
   */
  maxSelections?: number;
  /**
   * Controlled value
   */
  value?: MultipleDatePickerValue;
}

export interface UseMultipleDatePickerValueReturn {
  /**
   * The internal value (pending changes)
   */
  internalValue: MultipleDatePickerValue;
  /**
   * Toggle a date in/out of selection
   */
  toggleDate: (date: DateType) => void;
  /**
   * Remove a specific date from selection
   */
  removeDate: (date: DateType) => void;
  /**
   * Clear all selected dates
   */
  clearAll: () => void;
  /**
   * Check if a date is currently selected
   */
  isDateSelected: (date: DateType) => boolean;
  /**
   * Check if selection has reached max limit
   */
  isMaxReached: boolean;
  /**
   * Confirm the current selection (returns the value to be passed to onChange)
   */
  getConfirmValue: () => MultipleDatePickerValue;
  /**
   * Cancel and revert to original value
   */
  revertToValue: () => void;
  /**
   * Format a date to display string
   */
  formatDate: (date: DateType) => string;
}

export function useMultipleDatePickerValue({
  format,
  maxSelections,
  value = [],
}: UseMultipleDatePickerValueProps): UseMultipleDatePickerValueReturn {
  const { formatToString, isBefore, isSameDate, locale } = useCalendarContext();

  // Sort dates in chronological order
  const sortDates = useCallback(
    (dates: MultipleDatePickerValue): MultipleDatePickerValue => {
      return [...dates].sort((a, b) => {
        if (isSameDate(a, b)) return 0;

        return isBefore(a, b) ? -1 : 1;
      });
    },
    [isBefore, isSameDate],
  );

  // Internal state for pending changes
  const [internalValue, setInternalValue] = useState<MultipleDatePickerValue>(
    () => sortDates(value),
  );

  // Sync internal value when controlled value changes
  useEffect(() => {
    setInternalValue(sortDates(value));
  }, [sortDates, value]);

  const formatDate = useCallback(
    (date: DateType): string => {
      return formatToString(locale, date, format);
    },
    [formatToString, locale, format],
  );

  const isDateSelected = useCallback(
    (date: DateType): boolean => {
      return internalValue.some((d) => isSameDate(d, date));
    },
    [internalValue, isSameDate],
  );

  const isMaxReached =
    typeof maxSelections === 'number' && internalValue.length >= maxSelections;

  const toggleDate = useCallback(
    (date: DateType) => {
      setInternalValue((prev) => {
        const existingIndex = prev.findIndex((d) => isSameDate(d, date));

        if (existingIndex >= 0) {
          // Remove the date
          return prev.filter((_, index) => index !== existingIndex);
        }

        // Check max limit before adding
        if (typeof maxSelections === 'number' && prev.length >= maxSelections) {
          return prev;
        }

        // Add the date and sort
        return sortDates([...prev, date]);
      });
    },
    [isSameDate, maxSelections, sortDates],
  );

  const removeDate = useCallback(
    (date: DateType) => {
      setInternalValue((prev) => prev.filter((d) => !isSameDate(d, date)));
    },
    [isSameDate],
  );

  const clearAll = useCallback(() => {
    setInternalValue([]);
  }, []);

  const getConfirmValue = useCallback((): MultipleDatePickerValue => {
    return internalValue;
  }, [internalValue]);

  const revertToValue = useCallback(() => {
    setInternalValue(sortDates(value));
  }, [sortDates, value]);

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
