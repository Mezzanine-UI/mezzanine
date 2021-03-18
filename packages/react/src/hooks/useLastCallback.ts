import { useCallback } from 'react';
import { useLastValue } from './useLastValue';

export function useLastCallback<
  F extends (...args: any[]) => any,
>(callback: F): (...args: Parameters<F>) => ReturnType<F> {
  const lastCallback = useLastValue(callback);

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (...args) => lastCallback.current!(...args),
    [],
  );
}
