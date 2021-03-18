import { ChangeEventHandler } from 'react';
import { useLastCallback } from '../hooks/useLastCallback';
import { useControlValueState, UseControlValueStateProps } from './useControlValueState';

export interface UseInputControlValueProps<E extends HTMLInputElement | HTMLTextAreaElement>
  extends Omit<UseControlValueStateProps<string>, 'defaultValue' | 'equalityFn'> {
  defaultValue?: string;
  onChange?: ChangeEventHandler<E>;
}

const equalityFn = (a: string, b: string) => a === b;

export function useInputControlValue<E extends HTMLInputElement | HTMLTextAreaElement>(
  props: UseInputControlValueProps<E>,
) {
  const {
    defaultValue = '',
    onChange: onChangeProp,
    value: valueProp,
  } = props;
  const [value, setValue] = useControlValueState({
    defaultValue,
    equalityFn,
    value: valueProp,
  });
  const onChange = useLastCallback<ChangeEventHandler<E>>((event) => {
    const nextValue = event.target.value;

    if (!equalityFn(value, nextValue)) {
      setValue(nextValue);

      if (onChangeProp) {
        onChangeProp(event);
      }
    }
  });

  return [value, onChange] as const;
}
