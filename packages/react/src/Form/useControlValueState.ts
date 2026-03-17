import { useState } from 'react';

export interface UseControlValueStateProps<V> {
  defaultValue: V;
  equalityFn?: (a: V, b: V) => boolean;
  value?: V;
}

/**
 * 受控／非受控狀態的底層管理 Hook。
 *
 * 接受 `value`（受控）與 `defaultValue`（非受控）兩種模式，
 * 並在 `value` 從外部更新時自動同步內部 state。
 *
 * @example
 * ```tsx
 * import { useControlValueState } from '@mezzanine-ui/react';
 *
 * const [value, setValue, equalityFn] = useControlValueState({
 *   defaultValue: '',
 *   value: controlledValue,
 * });
 * ```
 */
export function useControlValueState<V>(props: UseControlValueStateProps<V>) {
  const {
    defaultValue,
    equalityFn = (a, b) => a === b,
    value: valueProp,
  } = props;
  const [value, setValue] = useState(() =>
    typeof valueProp !== 'undefined' ? valueProp : defaultValue,
  );

  /**
   * To sync value while changed from uncontrolled to controlled.
   */
  if (typeof valueProp !== 'undefined' && !equalityFn(valueProp, value)) {
    setValue(valueProp);
  }

  return [value, setValue, equalityFn] as const;
}
