import { onBeforeUnmount, onMounted } from 'vue';

export type DocumentEscapeKeyDownHandlerFactory = () =>
  | ((event: KeyboardEvent) => void)
  | undefined;

/**
 * 在 document 上監聽 Escape 鍵按下事件的 composable。
 *
 * 當鍵盤觸發 `keydown` 且 `event.key === 'Escape'` 時，呼叫 `factory` 回傳的處理器
 * 並阻止預設行為；若 `factory` 回傳 `undefined` 則不做任何事。
 *
 * React 版在依賴改變時重新掛載監聽器；這裡改為在事件發生時才詢問 factory，
 * 兩者可觀察到的行為相同，而且不需要把依賴列表搬過來。
 *
 * @example
 * ```ts
 * useDocumentEscapeKeyDown(() => {
 *   if (open.value) return () => { open.value = false; };
 * });
 * ```
 */
export function useDocumentEscapeKeyDown(
  factory: DocumentEscapeKeyDownHandlerFactory,
): void {
  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;

    const handler = factory();

    if (!handler) return;

    event.preventDefault();
    handler(event);
  }

  onMounted(() => document.addEventListener('keydown', onKeyDown, false));
  onBeforeUnmount(() =>
    document.removeEventListener('keydown', onKeyDown, false),
  );
}
