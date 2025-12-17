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
  inputRef: RefObject<HTMLInputElement | null>;
  value?: DateType;
};

/**
 * This hook keep tracks of an internal value.
 */
export function usePickerValue({
  defaultValue,
  format,
  inputRef,
  value: valueProp,
}: UsePickerValueProps) {
  const { formatToString, locale } = useCalendarContext();
  const inputDefaultValue = defaultValue
    ? formatToString(locale, defaultValue, format)
    : '';

  const [value, setValue] = useState<DateType | undefined>(valueProp);

  const onChange = (val?: DateType) => {
    setValue(val);
  };

  const onInputChange = (val: string) => {
    onChange(val);
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
    setInputValue(valueProp || '');
    onChange(valueProp);
  }, [valueProp, format, formatToString, setInputValue, locale]);

  const onSyncInputAndStateChange = (val?: DateType) => {
    setInputValue(val || '');
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
    inputValue: inputValue ? formatToString(locale, inputValue, format) : '',
    onBlur,
    onChange: onSyncInputAndStateChange,
    onInputChange: inputChangeHandler,
    onKeyDown: guardValidDateTypeOnKeyDown,
    value,
  };
}
