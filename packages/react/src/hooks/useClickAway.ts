import { RefObject, DependencyList } from 'react';
import { useDocumentEvents } from './useDocumentEvents';

export type ClickAwayEvent = MouseEvent | TouchEvent | PointerEvent;
export type ClickAwayHandler = (event: ClickAwayEvent) => void;
export type ClickAwayHandlerFactory = () => ClickAwayHandler | undefined;

/**
 * 偵測點擊發生在指定容器外部的 Hook。
 *
 * 監聽 `click` 與 `touchend` 事件，當點擊目標不在 `containerRef` 的 DOM 節點內時，
 * 呼叫 `factory` 回傳的處理器；若 `factory` 回傳 `undefined` 則不掛載任何監聽器。
 *
 * @example
 * ```tsx
 * import { useClickAway } from '@mezzanine-ui/react';
 *
 * const containerRef = useRef<HTMLDivElement>(null);
 * useClickAway(() => {
 *   if (open) return () => setOpen(false);
 * }, containerRef, [open]);
 * ```
 */
export function useClickAway(
  factory: ClickAwayHandlerFactory,
  containerRef: RefObject<HTMLElement | null>,
  deps?: DependencyList,
) {
  useDocumentEvents(() => {
    const clickAwayHandler = factory();

    if (!clickAwayHandler) {
      return;
    }

    const handler: ClickAwayHandler = (event) => {
      const target = event.target as HTMLElement | null;
      const container = containerRef.current;

      if (!(container?.contains(target) || !document.contains(target))) {
        clickAwayHandler(event);
      }
    };

    return {
      click: handler,
      touchend: handler,
    };
  }, deps);
}
