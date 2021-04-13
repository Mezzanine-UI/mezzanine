import { DateType } from '@mezzanine-ui/core/calendar';
import {
  ChangeEvent, RefObject, useEffect, useState,
} from 'react';
import { useCalendarContext } from '../Calendar';
import { useInputWithClearControlValue } from '../Form/useInputWithClearControlValue';

export type UseTriggerInputValueProps = {
  format: string,
  inputDefaultValue?: string,
  inputRef: RefObject<HTMLInputElement>,
  onChange?: (target?: DateType) => void,
  value?: DateType,
};

export function useSyncTriggerInputValue({
  format,
  inputDefaultValue,
  inputRef,
  onChange,
  value,
}: UseTriggerInputValueProps) {
  const {
    formatToString,
    valueLocale,
  } = useCalendarContext();

  const valueString = value ? formatToString(valueLocale, value, format) : '';
  const [intrnalValue, setInternalValue] = useState<string>(valueString);

  useEffect(() => {
    setInternalValue(
      valueString,
    );
  }, [valueString]);

  const internalInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value);
  };

  const [
    inputValue,
    onInputChange,
    onInputClear,
  ] = useInputWithClearControlValue({
    defaultValue: inputDefaultValue,
    onChange: internalInputChangeHandler,
    ref: inputRef,
    value: intrnalValue,
  });

  const resolvedChangeHandler = (val?: DateType) => {
    const resolvedVal = val ? formatToString(valueLocale, val, format) : '';

    setInternalValue(resolvedVal);

    if (onChange) {
      onChange(val);
    }
  };

  return {
    inputValue,
    onChange: resolvedChangeHandler,
    onInputChange,
    onInputClear,
  };
}
