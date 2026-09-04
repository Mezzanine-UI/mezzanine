import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export type ClickAwayEvent = MouseEvent | TouchEvent | PointerEvent;
export type ClickAwayHandler = (event: ClickAwayEvent) => void;
export type ClickAwayHandlerFactory = () => ClickAwayHandler | undefined;

/**
 * 偵測點擊發生在指定容器外部的 composable。
 *
 * 監聽 `click` 與 `touchend`，當點擊目標不在容器內時呼叫 `factory` 回傳的處理器；
 * 若 `factory` 回傳 `undefined` 就什麼都不做。已從畫面移除的目標視為外部點擊。
 *
 * React 版在依賴改變時重新掛載監聽器；這裡改為在事件發生時才詢問 factory，
 * 與 useDocumentEscapeKeyDown 一致。
 *
 * @example
 * ```ts
 * useClickAway(() => {
 *   if (open.value) return () => { open.value = false; };
 * }, container);
 * ```
 *
 * @see useDocumentEscapeKeyDown 以 Escape 關閉的對應 composable
 */
export function useClickAway(
  factory: ClickAwayHandlerFactory,
  containerRef: Ref<HTMLElement | null>,
): void {
  function onClickAway(event: ClickAwayEvent): void {
    const handler = factory();

    if (!handler) return;

    const target = event.target as HTMLElement | null;
    const container = containerRef.value;

    if (!(container?.contains(target) || !document.contains(target))) {
      handler(event);
    }
  }

  onMounted(() => {
    document.addEventListener('click', onClickAway, false);
    document.addEventListener('touchend', onClickAway, false);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', onClickAway, false);
    document.removeEventListener('touchend', onClickAway, false);
  });
}
