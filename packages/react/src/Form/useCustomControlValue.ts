import { useLastCallback } from '../hooks/useLastCallback';
import {
  useControlValueState,
  UseControlValueStateProps,
} from './useControlValueState';

export interface UseCustomControlValueProps<V>
  extends UseControlValueStateProps<V> {
  onChange?: (value: V) => void;
}

/**
 * 通用型別受控值管理 Hook。
 *
 * 支援任意型別的受控（`value`）與非受控（`defaultValue`）狀態，
 * 並透過 `equalityFn` 避免不必要的 re-render 與 `onChange` 呼叫。
 *
 * @example
 * ```tsx
 * import { useCustomControlValue } from '@mezzanine-ui/react';
 *
 * const [value, onChange] = useCustomControlValue<number>({
 *   defaultValue: 0,
 *   value: controlledNumber,
 *   onChange: (v) => console.log(v),
 * });
 * ```
 */
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
