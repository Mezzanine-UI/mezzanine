import { watchEffect } from 'vue';

export type DocumentEventHandlers = {
  [Event in keyof DocumentEventMap]?: (event: DocumentEventMap[Event]) => void;
};

export type DocumentEventHandlersFactory = () =>
  | DocumentEventHandlers
  | undefined;

/**
 * 在 document 上批次註冊／移除事件監聽器的 composable。
 *
 * `factory` 回傳一個事件名稱到處理器的映射物件；回傳 `undefined` 時不掛載任何
 * 監聽器。React 版以依賴列表決定何時重掛，這裡改由 `watchEffect` 追蹤 `factory`
 * 讀到的響應式來源，效果相同而且不必把依賴列表搬過來。
 *
 * @example
 * ```ts
 * useDocumentEvents(() =>
 *   dragging.value
 *     ? { mousemove: onDrag, mouseup: onDragEnd }
 *     : undefined,
 * );
 * ```
 */
export function useDocumentEvents(factory: DocumentEventHandlersFactory): void {
  watchEffect((onCleanup) => {
    const handlers = factory();

    if (!handlers || typeof document === 'undefined') return;

    const entries = Object.entries(handlers) as [string, EventListener][];

    entries.forEach(([event, handler]) => {
      document.addEventListener(event, handler);
    });

    onCleanup(() => {
      entries.forEach(([event, handler]) => {
        document.removeEventListener(event, handler);
      });
    });
  });
}
