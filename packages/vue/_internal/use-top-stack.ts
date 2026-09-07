import { watchEffect } from 'vue';

let seedStack: number[] = [];

let seed = 1;

/**
 * 管理多個浮層堆疊順序的 composable。
 *
 * 每個元件呼叫時取得一個唯一的 seed；`open` 為 `true` 期間該 seed 會被推入
 * 全域堆疊，回傳的函式可用來查詢自己是不是最頂層的那一個。
 *
 * 回傳的是**函式**而不是 computed：堆疊是模組層級的普通陣列，不具響應性，
 * 答案必須在需要的當下才問。
 *
 * @example
 * ```ts
 * const isTopStack = useTopStack(() => props.open);
 *
 * useDocumentEscapeKeyDown(() => {
 *   if (!props.open) return undefined;
 *
 *   return () => {
 *     if (isTopStack()) emit('close');
 *   };
 * });
 * ```
 *
 * @see useFocusTrap 巢狀浮層只有最頂層該困住 Tab
 */
export function useTopStack(open: () => boolean | undefined): () => boolean {
  seed += 1;

  const modalSeed = seed;

  watchEffect((onCleanup) => {
    if (!open()) return;

    seedStack = [...seedStack, modalSeed];

    onCleanup(() => {
      seedStack = seedStack.filter((s) => s !== modalSeed);
    });
  });

  return (): boolean => seedStack[seedStack.length - 1] === modalSeed;
}
