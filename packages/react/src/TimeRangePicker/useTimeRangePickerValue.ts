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

  /**
   * Pending values: what the user is actively editing in the TimePanel.
   * Separate from internalFrom/To so they are never overridden by valueProp
   * while the panel is open.
   */
  const [pendingFrom, setPendingFrom] = useState<DateType | undefined>(
    undefined,
  );
  const [pendingTo, setPendingTo] = useState<DateType | undefined>(undefined);

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

  /**
   * Update the pending value for the focused input.
   * Uses pendingFrom/To so it is never overridden by valueProp (controlled mode).
   * Does NOT call onChangeProp — committed only when onPanelConfirm fires.
   */
  const onPanelChange = useCallback(
    (newTime: DateType | undefined) => {
      if (focusedInput === 'from') {
        setPendingFrom(newTime);
      } else if (focusedInput === 'to') {
        setPendingTo(newTime);
      }
    },
    [focusedInput],
  );

  /**
   * Commit the pending value for the focused input and notify parent.
   */
  const onPanelConfirm = useCallback(() => {
    const confirmedFrom =
      focusedInput === 'from' ? (pendingFrom ?? from) : from;
    const confirmedTo = focusedInput === 'to' ? (pendingTo ?? to) : to;

    setInternalFrom(confirmedFrom);
    setInternalTo(confirmedTo);
    setPendingFrom(undefined);
    setPendingTo(undefined);

    onChangeProp?.([confirmedFrom, confirmedTo]);
  }, [focusedInput, from, to, pendingFrom, pendingTo, onChangeProp]);

  /**
   * Revert the pending value for the focused input (cancel).
   */
  const onPanelCancel = useCallback(() => {
    setPendingFrom(undefined);
    setPendingTo(undefined);
  }, []);

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

  /**
   * Panel value: use the pending value if being edited, fall back to
   * the committed value so the panel reflects the current selection.
   */
  const panelValue =
    focusedInput === 'from'
      ? (pendingFrom ?? from)
      : focusedInput === 'to'
        ? (pendingTo ?? to)
        : undefined;

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
    onPanelCancel,
    onPanelConfirm,
    onToFocus,
    panelValue,
    value,
  };
}
