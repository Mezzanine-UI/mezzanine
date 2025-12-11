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
   * Array of formats to try when parsing
   */
  formats: string[];
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
  formats,
  inputFromRef: _inputFromRef,
  inputToRef,
  mode,
  onChange: onChangeProp,
  value: valueProp,
}: UseDateRangePickerValueProps) {
  const {
    addDay,
    formatToString,
    isBefore,
    parse: parseFromConfig,
    locale,
  } = useCalendarContext();

  const [internalFrom, setInternalFrom] = useState<DateType | undefined>(
    valueProp?.[0],
  );
  const [internalTo, setInternalTo] = useState<DateType | undefined>(
    valueProp?.[1],
  );

  const from = valueProp?.[0] ?? internalFrom;
  const to = valueProp?.[1] ?? internalTo;
  const value = [from, to] as RangePickerPickingValue;

  const parse = useCallback(
    (val: string): DateType | undefined => {
      if (!val) return undefined;
      return parseFromConfig(locale, val, formats);
    },
    [parseFromConfig, locale, formats],
  );

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
      const parsedValue = parse(formattedValue);

      if (parsedValue) {
        if (to && isBefore(to, parsedValue)) {
          setInternalFrom(to);
          setInternalTo(parsedValue);
        } else {
          setInternalFrom(parsedValue);
        }
      } else {
        setInternalFrom(undefined);
      }

      setHoverValue(undefined);
    },
    [parse, to, isBefore],
  );

  const onInputToChange = useCallback(
    (formattedValue: string) => {
      const parsedValue = parse(formattedValue);

      if (parsedValue) {
        if (from && isBefore(parsedValue, from)) {
          setInternalTo(from);
          setInternalFrom(parsedValue);
        } else {
          setInternalTo(parsedValue);
        }
      } else {
        setInternalTo(undefined);
      }

      setHoverValue(undefined);
    },
    [parse, from, isBefore],
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

  const onCalendarHover = !(from && to) && anchor1 ? setHoverValue : undefined;

  const onClear = useCallback(() => {
    setInternalFrom(undefined);
    setInternalTo(undefined);
    setHoverValue(undefined);
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
