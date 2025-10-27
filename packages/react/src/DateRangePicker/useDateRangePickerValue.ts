'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import {
  RangePickerPickingValue,
  RangePickerValue,
} from '@mezzanine-ui/core/picker';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useMemo,
  useState,
} from 'react';
import {
  useRangePickerValue,
  UseRangePickerValueProps,
} from '../Picker/useRangePickerValue';
import { DateRangePickerCalendarProps } from './DateRangePickerCalendar';
import { useCalendarContext } from '../Calendar';

export interface UseDateRangePickerValueProps
  extends Omit<UseRangePickerValueProps, 'onChange'> {
  mode?: DateRangePickerCalendarProps['mode'];
  onChange?: (value?: RangePickerValue) => void;
}

export function useDateRangePickerValue({
  format,
  formats,
  inputFromRef,
  inputToRef,
  mode,
  onChange: onChangeProp,
  value: valueProp,
}: UseDateRangePickerValueProps) {
  const { addDay } = useCalendarContext();
  const {
    inputFromValue,
    inputToValue,
    onChange,
    onFromBlur,
    onFromKeyDown,
    onInputFromChange,
    onInputToChange,
    onToBlur,
    onToKeyDown,
    value,
  } = useRangePickerValue({
    format,
    formats,
    value: valueProp,
    inputFromRef,
    inputToRef,
  });

  const [from, to] = value;

  const [hoverValue, setHoverValue] = useState<DateType | undefined>(undefined);

  const onSyncHoverValueInputFromChange: ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    onInputFromChange(event);

    setHoverValue(undefined);
  };

  const onSyncHoverValueInputToChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    onInputToChange(event);

    setHoverValue(undefined);
  };

  const onCalendarChange = (val?: DateType) => {
    const firstVal = from || to;
    const newValue =
      (from && to) || (!from && !to)
        ? ([val, undefined] as RangePickerPickingValue)
        : ([firstVal, val] as RangePickerPickingValue);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [sortedFrom, sortedTo] = onChange(newValue, {
      from: (nextFrom) => nextFrom,
      to: (nextTo) => {
        if (!nextTo) return nextTo;

        /** week mode should use the last day of the week (default is the first day) */
        return mode === 'week' ? addDay(nextTo, 6) : nextTo;
      },
    })!;

    if (sortedFrom && sortedTo) {
      onChangeProp?.([sortedFrom, sortedTo]);
    }
  };

  /** Hover settings */
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

  const onSyncHoverValueClear = () => {
    onChange(undefined);

    setHoverValue(undefined);

    onChangeProp?.(undefined);
  };

  const onFromKeyDownWithOnChange: KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    onFromKeyDown(event);

    if (event.key === 'Enter' && from && to) {
      onChangeProp?.([from, to]);
    }

    if (event.key === 'Escape') {
      onChange(valueProp);
    }
  };

  const onToKeyDownWithOnChange: KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    onToKeyDown(event);

    if (event.key === 'Enter' && from && to) {
      onChangeProp?.([from, to]);
    }

    if (event.key === 'Escape') {
      onChange(valueProp);
    }
  };

  return {
    calendarValue,
    inputFromValue,
    inputToValue,
    onCalendarChange,
    onCalendarHover,
    onChange,
    onClear: onSyncHoverValueClear,
    onFromBlur,
    onFromKeyDown: onFromKeyDownWithOnChange,
    onInputFromChange: onSyncHoverValueInputFromChange,
    onInputToChange: onSyncHoverValueInputToChange,
    onToBlur,
    onToKeyDown: onToKeyDownWithOnChange,
    value,
  };
}
