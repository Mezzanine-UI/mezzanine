import { useRef } from 'react';

export function useLastValue<T>(value: T): { readonly current: T } {
  const ref = useRef(value);

  ref.current = value;

  return ref;
}
