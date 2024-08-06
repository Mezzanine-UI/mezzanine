import { useState } from 'react';

export interface UseControlValueStateProps<V> {
  defaultValue: V;
  equalityFn?: (a: V, b: V) => boolean;
  value?: V;
}

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
