import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEventHandler,
  RefObject,
  useState,
} from 'react';

export interface UseInputValueControlProps<E extends HTMLInputElement | HTMLTextAreaElement> {
  defaultValue?: string;
  onChange?: ChangeEventHandler<E>;
  ref: RefObject<E>;
  value?: string;
}

export interface InputValueControl<E extends HTMLInputElement | HTMLTextAreaElement> {
  onChange: ChangeEventHandler<E>;
  onClear: MouseEventHandler;
  value: string;
}

export function useInputValueControl<E extends HTMLInputElement | HTMLTextAreaElement>(
  props: UseInputValueControlProps<E>,
): InputValueControl<E> {
  const {
    ref,
    defaultValue,
    onChange,
    value: valueConfig,
  } = props;
  const [value, setValue] = useState(() => (valueConfig ?? defaultValue) || '');

  if (typeof valueConfig !== 'undefined' && valueConfig !== value) {
    setValue(valueConfig);
  }

  return {
    value,
    onClear: (event) => {
      const target = ref.current;

      if (onChange && target) {
        const changeEvent: ChangeEvent<E> = Object.create(event);
        const originalValue = target.value;

        changeEvent.target = target;
        changeEvent.currentTarget = target;

        /**
         * Change target ref value cause e.target.value should be '' when clear input
         * And then reset ref value
         */
        target.value = '';
        onChange(changeEvent);
        target.value = originalValue;
      }

      setValue('');
    },
    onChange: (event) => {
      setValue(event.target.value);

      if (onChange) {
        onChange(event);
      }
    },
  };
}
