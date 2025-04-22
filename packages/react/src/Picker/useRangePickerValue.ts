import { DateType } from '@mezzanine-ui/core/calendar';
import {
  RangePickerPickingValue,
  RangePickerValue,
} from '@mezzanine-ui/core/picker';
import { ChangeEventHandler, KeyboardEventHandler, RefObject } from 'react';
import { useCalendarContext } from '../Calendar';
import { usePickerValue, UsePickerValueProps } from './usePickerValue';

export interface UseRangePickerValueProps
  extends Pick<UsePickerValueProps, 'format' | 'formats'> {
  inputFromRef: RefObject<HTMLInputElement | null>;
  inputToRef: RefObject<HTMLInputElement | null>;
  value?: RangePickerValue;
}

export function useRangePickerValue({
  format,
  formats,
  inputFromRef,
  inputToRef,
  value: valueProp,
}: UseRangePickerValueProps) {
  const {
    parse: parseFromConfig,
    valueLocale,
    isBefore,
  } = useCalendarContext();

  function parse(val: string) {
    return parseFromConfig(valueLocale, val, formats);
  }

  function sortValues(valueToSort: [DateType, DateType]): [DateType, DateType] {
    const [v1, v2] = valueToSort;

    return isBefore(v1, v2) ? [v1, v2] : [v2, v1];
  }

  const {
    inputValue: inputFromValue,
    onBlur: onFromBlur,
    onChange: onFromChange,
    onInputChange: onInputFromChange,
    onKeyDown: onFromKeyDown,
    value: from,
  } = usePickerValue({
    format,
    formats,
    value: valueProp?.[0],
    inputRef: inputFromRef,
  });

  const {
    inputValue: inputToValue,
    onBlur: onToBlur,
    onChange: onToChange,
    onInputChange: onInputToChange,
    onKeyDown: onToKeyDown,
    value: to,
  } = usePickerValue({
    format,
    formats,
    value: valueProp?.[1],
    inputRef: inputToRef,
  });

  const value = [from, to] as RangePickerPickingValue;

  const onChange = (
    target?: RangePickerPickingValue,
    callback = {
      from: (date?: string) => date,
      to: (date?: string) => date,
    },
  ): RangePickerPickingValue | undefined => {
    const [newFrom, newTo] = target || [];

    if (newFrom && newTo) {
      const sortedVal = sortValues([newFrom, newTo]);
      const resolvedFrom = callback.from(sortedVal[0])!;
      const resolvedTo = callback.to(sortedVal[1])!;

      onFromChange(resolvedFrom);
      onToChange(resolvedTo);

      return [resolvedFrom, resolvedTo];
    }

    onFromChange(callback.from(target?.[0]));
    onToChange(callback.to(target?.[1]));

    return target;
  };

  const onOrderGuardedInputFromChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    onInputFromChange(event);

    const currentVal = parse(event.target.value);

    if (currentVal && to) {
      if (isBefore(to, currentVal)) {
        onToChange(undefined);
      }
    }
  };

  const onOrderGuardedInputToChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    onInputToChange(event);

    const currentVal = parse(event.target.value);

    if (currentVal && from) {
      if (isBefore(currentVal, from)) {
        onFromChange(undefined);
      }
    }
  };

  const guardValidValueOnFromKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    onFromKeyDown(event);

    if (event.key === 'Enter') {
      if (from && !to) {
        inputToRef.current?.focus();
      } else if (to && !from) {
        inputFromRef.current?.focus();
      }
    }
  };

  const guardValidValueOnToKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    onToKeyDown(event);

    if (event.key === 'Enter') {
      if (from && !to) {
        inputToRef.current?.focus();
      } else if (to && !from) {
        inputFromRef.current?.focus();
      }
    }
  };

  return {
    inputFromValue,
    inputToValue,
    onChange,
    onFromBlur,
    onFromKeyDown: guardValidValueOnFromKeyDown,
    onInputFromChange: onOrderGuardedInputFromChange,
    onInputToChange: onOrderGuardedInputToChange,
    onToBlur,
    onToKeyDown: guardValidValueOnToKeyDown,
    value,
  };
}
