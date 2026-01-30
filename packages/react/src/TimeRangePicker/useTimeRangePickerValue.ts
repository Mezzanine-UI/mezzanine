'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import { useCallback, useState } from 'react';
import { useCalendarContext } from '../Calendar';

export type TimeRangePickerValue = [DateType | undefined, DateType | undefined];

export interface UseTimeRangePickerValueProps {
  /**
   * The format pattern for the inputs (e.g., "HH:mm:ss")
   */
  format: string;
  /**
   * Change handler called when value changes
   */
  onChange?: (value?: TimeRangePickerValue) => void;
  /**
   * Controlled value
   */
  value?: TimeRangePickerValue;
}

export function useTimeRangePickerValue({
  format,
  onChange: onChangeProp,
  value: valueProp,
}: UseTimeRangePickerValueProps) {
  const { formatToString, locale } = useCalendarContext();

  const [internalFrom, setInternalFrom] = useState<DateType | undefined>(
    valueProp?.[0],
  );
  const [internalTo, setInternalTo] = useState<DateType | undefined>(
    valueProp?.[1],
  );

  // Track which input is focused: 'from' | 'to' | null
  const [focusedInput, setFocusedInput] = useState<'from' | 'to' | null>(null);

  const from = valueProp?.[0] ?? internalFrom;
  const to = valueProp?.[1] ?? internalTo;
  const value: TimeRangePickerValue = [from, to];

  const formatTime = useCallback(
    (time: DateType | undefined): string => {
      if (!time) return '';
      return formatToString(locale, time, format);
    },
    [formatToString, locale, format],
  );

  const inputFromValue = formatTime(from);
  const inputToValue = formatTime(to);

  const onInputFromChange = useCallback(
    (formattedValue: string | undefined) => {
      if (formattedValue) {
        setInternalFrom(formattedValue);
        onChangeProp?.([formattedValue, to]);
      } else {
        setInternalFrom(undefined);
        onChangeProp?.([undefined, to]);
      }
    },
    [to, onChangeProp],
  );

  const onInputToChange = useCallback(
    (formattedValue: string | undefined) => {
      if (formattedValue) {
        setInternalTo(formattedValue);
        onChangeProp?.([from, formattedValue]);
      } else {
        setInternalTo(undefined);
        onChangeProp?.([from, undefined]);
      }
    },
    [from, onChangeProp],
  );

  const onPanelChange = useCallback(
    (newTime: DateType | undefined) => {
      if (focusedInput === 'from') {
        setInternalFrom(newTime);
        onChangeProp?.([newTime, to]);
      } else if (focusedInput === 'to') {
        setInternalTo(newTime);
        onChangeProp?.([from, newTime]);
      }
    },
    [focusedInput, from, to, onChangeProp],
  );

  const onChange = useCallback(
    (target?: TimeRangePickerValue): TimeRangePickerValue | undefined => {
      if (!target) {
        setInternalFrom(undefined);
        setInternalTo(undefined);
        return undefined;
      }

      const [newFrom, newTo] = target;

      setInternalFrom(newFrom);
      setInternalTo(newTo);
      return target;
    },
    [],
  );

  const onClear = useCallback(() => {
    setInternalFrom(undefined);
    setInternalTo(undefined);
    onChangeProp?.(undefined);
  }, [onChangeProp]);

  const onFromFocus = useCallback(() => {
    setFocusedInput('from');
  }, []);

  const onToFocus = useCallback(() => {
    setFocusedInput('to');
  }, []);

  // Get the currently focused value for the panel
  const panelValue =
    focusedInput === 'from' ? from : focusedInput === 'to' ? to : undefined;

  return {
    focusedInput,
    inputFromValue,
    inputToValue,
    onChange,
    onClear,
    onFromFocus,
    onInputFromChange,
    onInputToChange,
    onPanelChange,
    onToFocus,
    panelValue,
    value,
  };
}
