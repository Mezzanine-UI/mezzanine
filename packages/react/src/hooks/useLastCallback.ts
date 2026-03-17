import { useCallback } from 'react';
import { useLastValue } from './useLastValue';

/**
 * 回傳一個引用永遠穩定但呼叫時使用最新版本 callback 的 Hook。
 *
 * 內部以 ref 儲存最新的 callback，對外回傳一個依賴陣列為空的 `useCallback` wrapper，
 * 可安全地傳遞給子元件或事件處理器而不觸發不必要的 re-render。
 *
 * @example
 * ```tsx
 * import { useLastCallback } from '@mezzanine-ui/react';
 *
 * const stableOnChange = useLastCallback((value: string) => {
 *   doSomethingWith(value);
 * });
 * ```
 */
export function useLastCallback<F extends (...args: any[]) => any>(
  callback: F,
): (...args: Parameters<F>) => ReturnType<F> {
  const lastCallback = useLastValue(callback);

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (...args) => lastCallback.current!(...args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
}
