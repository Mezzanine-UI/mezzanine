import { DependencyList } from 'react';
import { useDocumentEvents } from './useDocumentEvents';

export type DocumentEscapeKeyDownHandlerFactory = () =>
  | ((event: KeyboardEvent) => void)
  | undefined;

/**
 * 在 document 上監聽 Escape 鍵按下事件的 Hook。
 *
 * 當鍵盤觸發 `keydown` 且 `event.key === 'Escape'` 時，呼叫 `factory` 回傳的處理器並阻止預設行為；
 * 若 `factory` 回傳 `undefined` 則不掛載任何監聽器。
 *
 * @example
 * ```tsx
 * import { useDocumentEscapeKeyDown } from '@mezzanine-ui/react';
 *
 * useDocumentEscapeKeyDown(() => {
 *   if (open) return () => setOpen(false);
 * }, [open]);
 * ```
 */
export function useDocumentEscapeKeyDown(
  factory: DocumentEscapeKeyDownHandlerFactory,
  deps?: DependencyList,
) {
  useDocumentEvents(() => {
    const handler = factory();

    if (!handler) {
      return;
    }

    return {
      keydown(event) {
        if (event.key === 'Escape') {
          event.preventDefault();
          handler(event);
        }
      },
    };
  }, deps);
}
