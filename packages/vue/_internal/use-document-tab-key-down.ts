import { onBeforeUnmount, onMounted } from 'vue';

export type DocumentTabKeyDownHandlerFactory = () =>
  | ((event: KeyboardEvent) => void)
  | undefined;

/**
 * 在 document 上監聽 Tab 鍵按下事件的 composable。
 *
 * 當鍵盤觸發 `keydown` 且 `event.key === 'Tab'` 時，呼叫 `factory` 回傳的處理器；
 * 若 `factory` 回傳 `undefined` 就什麼都不做。
 *
 * React 版在依賴改變時重新掛載監聽器；這裡改為在事件發生時才詢問 factory，
 * 與 useDocumentEscapeKeyDown 一致。
 *
 * @example
 * ```ts
 * useDocumentTabKeyDown(() => {
 *   if (open.value) return (event) => trapFocus(event);
 * });
 * ```
 *
 * @see useDocumentEscapeKeyDown 以 Escape 關閉的對應 composable
 */
export function useDocumentTabKeyDown(
  factory: DocumentTabKeyDownHandlerFactory,
): void {
  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const handler = factory();

    if (!handler) return;

    handler(event);
  }

  onMounted(() => document.addEventListener('keydown', onKeyDown, false));
  onBeforeUnmount(() =>
    document.removeEventListener('keydown', onKeyDown, false),
  );
}
