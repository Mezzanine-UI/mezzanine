import {
  ChangeEvent,
  MouseEvent,
  RefObject,
} from 'react';
import { useInputControlValue, UseInputControlValueProps } from './useInputControlValue';

export interface UseInputWithClearControlValueProps<E extends HTMLInputElement | HTMLTextAreaElement>
  extends UseInputControlValueProps<E> {
  ref: RefObject<E>;
}

export function useInputWithClearControlValue<E extends HTMLInputElement | HTMLTextAreaElement>(
  props: UseInputWithClearControlValueProps<E>,
) {
  const {
    defaultValue,
    onChange: onChangeProp,
    ref,
    value: valueProp,
  } = props;
  const [value, onChange] = useInputControlValue({
    defaultValue,
    onChange: onChangeProp,
    value: valueProp,
  });
  const onClear = (event: MouseEvent) => {
    const target = ref.current;

    if (target) {
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
  };

  return [
    value,
    onChange,
    onClear,
  ] as const;
}
