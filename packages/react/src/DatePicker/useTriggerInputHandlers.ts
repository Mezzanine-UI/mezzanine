import { DateType } from '@mezzanine-ui/core/calendar';
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  RefObject,
} from 'react';
import { useCalendarContext } from '../Calendar/CalendarContext';

export type UseTriggerInputHandlersProps = {
  formats: string[];
  inputRef?: RefObject<HTMLInputElement>;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (val?: DateType) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  setOpen: (open: boolean) => void;
};

export function useTriggerInputHandlers({
  formats,
  inputRef,
  onBlur: onBlurProp,
  onChange,
  onFocus: onFocusProp,
  onInputChange,
  onKeyDown: onKeyDownProp,
  setOpen,
  readOnly,
}: UseTriggerInputHandlersProps) {
  const {
    parse,
    valueLocale,
  } = useCalendarContext();

  const onFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (onFocusProp) {
      onFocusProp(event);
    }

    if (!readOnly) {
      setOpen(true);
    }
  };

  const onBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (onBlurProp) {
      onBlurProp(event);
    }

    onInputChange(event);

    if (onChange) {
      onChange(parse(valueLocale, event.target.value, formats) || undefined);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDownProp) {
      onKeyDownProp(event);
    }

    if (event.key === 'Enter') {
      inputRef?.current?.blur();

      setOpen(false);
    }
  };

  return {
    onBlur,
    onFocus,
    onKeyDown,
  };
}
