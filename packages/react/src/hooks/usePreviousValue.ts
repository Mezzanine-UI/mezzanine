import { useRef, useEffect } from 'react';

export function usePreviousValue<T>(value: T): T {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
