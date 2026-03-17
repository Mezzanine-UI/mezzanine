import { DependencyList } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type DocumentEventHandlersFactory = () =>
  | {
      [event in keyof DocumentEventMap]?: (
        event: DocumentEventMap[event],
      ) => void;
    }
  | undefined;

/**
 * 在 document 上批次註冊／移除事件監聽器的 Hook。
 *
 * `factory` 回傳一個事件名稱到處理器的映射物件；依賴項變化時舊監聽器會先被移除，
 * 再重新掛載新的；若 `factory` 回傳 `undefined` 則不掛載任何監聽器。
 *
 * @example
 * ```tsx
 * import { useDocumentEvents } from '@mezzanine-ui/react';
 *
 * useDocumentEvents(() => ({
 *   click: handleClick,
 *   keydown: handleKeyDown,
 * }), [handleClick, handleKeyDown]);
 * ```
 */
export function useDocumentEvents(
  factory: DocumentEventHandlersFactory,
  deps?: DependencyList,
) {
  useIsomorphicLayoutEffect(() => {
    const handlers = factory();

    if (!handlers) {
      return;
    }

    const entries = Object.entries(handlers);

    entries.forEach(([event, handler]) => {
      document.addEventListener(event, handler as any);
    });

    return () => {
      entries.forEach(([event, handler]) => {
        document.removeEventListener(event, handler as any);
      });
    };
  }, deps);
}
