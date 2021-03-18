import { useLastCallback } from '../hooks/useLastCallback';
import { useControlValueState, UseControlValueStateProps } from './useControlValueState';

export interface UseCustomControlValueProps<V> extends UseControlValueStateProps<V> {
  onChange?: (value: V) => void;
}

export function useCustomControlValue<V>(props: UseCustomControlValueProps<V>) {
  const { onChange: onChangeProp } = props;
  const [value, setValue, equalityFn] = useControlValueState(props);
  const onChange = useLastCallback((nextValue: V) => {
    if (!equalityFn(value, nextValue)) {
      setValue(nextValue);

      if (onChangeProp) {
        onChangeProp(nextValue);
      }
    }
  });

  return [value, onChange, equalityFn] as const;
}
