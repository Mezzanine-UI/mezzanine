import { DependencyList } from 'react';
import { useDocumentEvents } from './useDocumentEvents';

export type DocumentTabKeyDownHandlerFactory = () =>
  | ((event: KeyboardEvent) => void)
  | undefined;

/**
 * 在 document 上監聽 Tab 鍵按下事件的 Hook。
 *
 * 當鍵盤觸發 `keydown` 且 `event.key === 'Tab'` 時，呼叫 `factory` 回傳的處理器；
 * 若 `factory` 回傳 `undefined` 則不掛載任何監聽器。
 *
 * @example
 * ```tsx
 * import { useDocumentTabKeyDown } from '@mezzanine-ui/react';
 *
 * useDocumentTabKeyDown(() => {
 *   if (open) return (e) => trapFocus(e);
 * }, [open]);
 * ```
 */
export function useDocumentTabKeyDown(
  factory: DocumentTabKeyDownHandlerFactory,
  deps?: DependencyList,
) {
  useDocumentEvents(() => {
    const handler = factory();

    if (!handler) {
      return;
    }

    return {
      keydown(event) {
        if (event.key === 'Tab') {
          handler(event);
        }
      },
    };
  }, deps);
}
