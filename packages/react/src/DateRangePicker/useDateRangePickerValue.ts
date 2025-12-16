'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import {
  RangePickerPickingValue,
  RangePickerValue,
} from '@mezzanine-ui/core/picker';
import { useMemo, useState, useCallback, RefObject } from 'react';
import { DateRangePickerCalendarProps } from './DateRangePickerCalendar';
import { useCalendarContext } from '../Calendar';

export interface UseDateRangePickerValueProps {
  /**
   * The format pattern for the inputs (e.g., "YYYY-MM-DD")
   */
  format: string;
  /**
   * Function to check if there are disabled dates in the range
   */
  hasDisabledDateInRange?: (start: DateType, end: DateType) => boolean;
  /**
   * Ref for the 'from' input element
   */
  inputFromRef: RefObject<HTMLInputElement | null>;
  /**
   * Ref for the 'to' input element
   */
  inputToRef: RefObject<HTMLInputElement | null>;
  /**
   * Calendar mode
   */
  mode?: DateRangePickerCalendarProps['mode'];
  /**
   * Change handler called when range is complete
   */
  onChange?: (value?: RangePickerValue) => void;
  /**
   * Controlled value
   */
  value?: RangePickerValue;
}

export function useDateRangePickerValue({
  format,
  hasDisabledDateInRange,
  inputFromRef: _inputFromRef,
  inputToRef,
  mode,
  onChange: onChangeProp,
  value: valueProp,
}: UseDateRangePickerValueProps) {
  const { addDay, formatToString, isBefore, locale } = useCalendarContext();

  const [internalFrom, setInternalFrom] = useState<DateType | undefined>(
    valueProp?.[0],
  );
  const [internalTo, setInternalTo] = useState<DateType | undefined>(
    valueProp?.[1],
  );

  // Track if user is currently selecting a new range
  // When selecting, we use internal state; otherwise, we prefer valueProp
  const [isSelecting, setIsSelecting] = useState(false);

  const from = isSelecting ? internalFrom : (valueProp?.[0] ?? internalFrom);
  const to = isSelecting ? internalTo : (valueProp?.[1] ?? internalTo);
  const value = [from, to] as RangePickerPickingValue;

  const formatDate = useCallback(
    (date: DateType | undefined): string => {
      if (!date) return '';
      return formatToString(locale, date, format);
    },
    [formatToString, locale, format],
  );

  const sortValues = useCallback(
    (v1: DateType, v2: DateType): [DateType, DateType] => {
      return isBefore(v1, v2) ? [v1, v2] : [v2, v1];
    },
    [isBefore],
  );

  const inputFromValue = formatDate(from);
  const inputToValue = formatDate(to);

  const [hoverValue, setHoverValue] = useState<DateType | undefined>(undefined);

  const onInputFromChange = useCallback(
    (formattedValue: string) => {
      if (formattedValue) {
        if (to && isBefore(to, formattedValue)) {
          setInternalFrom(to);
          setInternalTo(formattedValue);

          // Range is complete, trigger onChange
          onChangeProp?.([to, formattedValue]);
        } else {
          setInternalFrom(formattedValue);

          // If to is also set, range is complete
          if (to) {
            onChangeProp?.([formattedValue, to]);
          }
        }
      } else {
        setInternalFrom(undefined);
      }

      setHoverValue(undefined);
    },
    [to, isBefore, onChangeProp],
  );

  const onInputToChange = useCallback(
    (formattedValue: string) => {
      if (formattedValue) {
        if (from && isBefore(formattedValue, from)) {
          setInternalTo(from);
          setInternalFrom(formattedValue);

          // Range is complete, trigger onChange
          onChangeProp?.([formattedValue, from]);
        } else {
          setInternalTo(formattedValue);

          // If from is also set, range is complete
          if (from) {
            onChangeProp?.([from, formattedValue]);
          }
        }
      } else {
        setInternalTo(undefined);
      }

      setHoverValue(undefined);
    },
    [from, isBefore, onChangeProp],
  );

  const onCalendarChange = useCallback(
    (rangeValue: [DateType, DateType | undefined]) => {
      const [newFrom, newTo] = rangeValue;

      setInternalFrom(newFrom);

      if (newTo) {
        const adjustedTo = mode === 'week' ? addDay(newTo, 6) : newTo;
        setInternalTo(adjustedTo);

        if (newFrom && adjustedTo) {
          const [sortedFrom, sortedTo] = sortValues(newFrom, adjustedTo);
          onChangeProp?.([sortedFrom, sortedTo]);
        }
      } else {
        setInternalTo(undefined);
        setIsSelecting(true);

        // 開始新的選取，則先清除值
        if (from && to) {
          onChangeProp?.(undefined);
        }

        inputToRef.current?.focus();
      }

      setHoverValue(undefined);
    },
    [mode, addDay, sortValues, onChangeProp, inputToRef, from, to],
  );

  const onChange = useCallback(
    (target?: RangePickerPickingValue): RangePickerPickingValue | undefined => {
      // Reset selecting state when value is explicitly changed (e.g., cancel/close)
      setIsSelecting(false);

      if (!target) {
        setInternalFrom(undefined);
        setInternalTo(undefined);
        return undefined;
      }

      const [newFrom, newTo] = target;

      if (newFrom && newTo) {
        const sorted = sortValues(newFrom, newTo);
        setInternalFrom(sorted[0]);
        setInternalTo(sorted[1]);
        return sorted;
      }

      setInternalFrom(newFrom);
      setInternalTo(newTo);
      return target;
    },
    [sortValues],
  );

  const anchor1 = from || to;
  const anchor2 = from && to ? to : hoverValue;
  const calendarValue = useMemo(() => {
    if (anchor1 && anchor2) {
      return [anchor1, anchor2];
    }

    if (anchor1) {
      return [anchor1];
    }

    return undefined;
  }, [anchor1, anchor2]);

  /**
   * Check if date is in range, considering disabled dates
   * Returns a function that can be used as isDateInRange handler
   */
  const checkIsInRange = useCallback(
    (_date: DateType): boolean => {
      if (!anchor1 || !anchor2) return false;

      // Check if the range crosses any disabled dates
      if (hasDisabledDateInRange?.(anchor1, anchor2)) {
        return false;
      }

      return true;
    },
    [anchor1, anchor2, hasDisabledDateInRange],
  );

  const onCalendarHover = !(from && to) && anchor1 ? setHoverValue : undefined;

  const onClear = useCallback(() => {
    setInternalFrom(undefined);
    setInternalTo(undefined);
    setHoverValue(undefined);
    setIsSelecting(false);
    onChangeProp?.(undefined);
  }, [onChangeProp]);

  const onFromFocus = useCallback(() => {
    // Optional: add focus logic
  }, []);

  const onToFocus = useCallback(() => {
    // Optional: add focus logic
  }, []);

  const onFromBlur = useCallback(() => {
    // Optional: add blur logic
  }, []);

  const onToBlur = useCallback(() => {
    // Optional: add blur logic
  }, []);

  return {
    calendarValue,
    checkIsInRange,
    inputFromValue,
    inputToValue,
    onCalendarChange,
    onCalendarHover,
    onChange,
    onClear,
    onFromBlur,
    onFromFocus,
    onInputFromChange,
    onInputToChange,
    onToBlur,
    onToFocus,
    value,
  };
}
