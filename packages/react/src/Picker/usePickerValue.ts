import { DateType } from '@mezzanine-ui/core/calendar';
import {
  FocusEventHandler,
  KeyboardEventHandler,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { useCalendarContext } from '../Calendar/CalendarContext';
import { usePickerInputValue } from './usePickerInputValue';

export type UsePickerValueProps = {
  defaultValue?: DateType;
  format: string;
  formats: string[];
  inputRef: RefObject<HTMLInputElement | null>;
  value?: DateType;
};

/**
 * This hook keep tracks of an internal value.
 */
export function usePickerValue({
  defaultValue,
  format,
  formats,
  inputRef,
  value: valueProp,
}: UsePickerValueProps) {
  const { formatToString, parse, valueLocale } = useCalendarContext();
  const inputDefaultValue = defaultValue
    ? formatToString(valueLocale, defaultValue, format)
    : '';

  const [value, setValue] = useState<DateType | undefined>(valueProp);

  const onChange = (val?: DateType) => {
    setValue(val);
  };

  const onInputChange = (val: string) => {
    const valDateType = parse(valueLocale, val, formats);

    onChange(valDateType);
  };

  const {
    inputChangeHandler,
    inputValue,
    onChange: setInputValue,
  } = usePickerInputValue({
    defaultValue: inputDefaultValue,
    onChange: onInputChange,
  });

  useEffect(() => {
    const valString = valueProp
      ? formatToString(valueLocale, valueProp, format)
      : '';

    setInputValue(valString);
    onChange(valueProp);
  }, [valueProp]);

  const onSyncInputAndStateChange = (val?: DateType) => {
    const valueString = val ? formatToString(valueLocale, val, format) : '';

    setInputValue(valueString);
    setValue(val);
  };

  const guardValidDateTypeOnEvents = () => {
    if (!value) {
      onSyncInputAndStateChange(valueProp);
    }
  };

  const guardValidDateTypeOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      inputRef.current?.blur();

      guardValidDateTypeOnEvents();
    }
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    guardValidDateTypeOnEvents();
  };

  return {
    inputValue,
    onBlur,
    onChange: onSyncInputAndStateChange,
    onInputChange: inputChangeHandler,
    onKeyDown: guardValidDateTypeOnKeyDown,
    value,
  };
}
