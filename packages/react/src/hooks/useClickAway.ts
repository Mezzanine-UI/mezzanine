import { RefObject, DependencyList } from 'react';
import { useDocumentEvents } from './useDocumentEvents';

export type ClickAwayEvent = MouseEvent | TouchEvent | PointerEvent;
export type ClickAwayHandler = (event: ClickAwayEvent) => void;
export type ClickAwayHandlerFactory = () => ClickAwayHandler | undefined;

export function useClickAway(
  factory: ClickAwayHandlerFactory,
  containerRef: RefObject<HTMLElement>,
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
