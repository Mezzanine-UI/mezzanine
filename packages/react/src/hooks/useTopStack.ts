import { useEffect, useMemo, useCallback } from 'react';

let seedStack: number[] = [];

let seed = 1;

/**
 * 管理多個浮層 z-index 堆疊順序的 Hook。
 *
 * 每個元件呼叫此 Hook 時會取得一個唯一的 seed 值；當 `open` 為 `true` 時，
 * 該 seed 會被推入全域堆疊，回傳的函式可用於查詢自己是否位於最頂層。
 *
 * @example
 * ```tsx
 * import useTopStack from '@mezzanine-ui/react/hooks/useTopStack';
 *
 * const isTopStack = useTopStack(open);
 * // 在 Escape 鍵處理時，只有最頂層的浮層才關閉
 * useDocumentEscapeKeyDown(() => {
 *   if (isTopStack()) return () => setOpen(false);
 * }, [isTopStack]);
 * ```
 */
export default function useTopStack(open?: boolean) {
  const modalSeed = useMemo(() => {
    // eslint-disable-next-line react-hooks/globals
    seed += 1;

    return seed;
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    seedStack = [...seedStack, modalSeed];

    return () => {
      seedStack = seedStack.filter((s) => s !== modalSeed);
    };
  }, [open, modalSeed]);

  return useCallback(
    () => seedStack[seedStack.length - 1] === modalSeed,
    [modalSeed],
  );
}
