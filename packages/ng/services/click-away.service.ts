import { DestroyRef, Injectable } from '@angular/core';

export type ClickAwayEvent = MouseEvent | TouchEvent | PointerEvent;
export type ClickAwayHandler = (event: ClickAwayEvent) => void;

/**
 * Detects clicks occurring outside a specified container element.
 *
 * Listens for `click` and `touchend` events on the document. When the event target
 * is not contained within the provided container, the handler is called.
 */
@Injectable({ providedIn: 'root' })
export class ClickAwayService {
  /**
   * Registers click-away listeners for the given container.
   * Automatically cleans up when the caller's `DestroyRef` fires.
   *
   * @returns A cleanup function to manually stop listening.
   */
  listen(
    container: HTMLElement,
    handler: ClickAwayHandler,
    destroyRef?: DestroyRef,
  ): () => void {
    const listener: ClickAwayHandler = (event) => {
      const target = event.target as HTMLElement | null;

      if (!(container.contains(target) || !document.contains(target!))) {
        handler(event);
      }
    };

    let disposed = false;

    const cleanup = (): void => {
      disposed = true;
      document.removeEventListener('click', listener as EventListener);
      document.removeEventListener('touchend', listener as EventListener);
    };

    // Defer listener registration to the next frame so the current click
    // event (which may have triggered the open state) finishes bubbling
    // before we start listening.  Without this, the click-away handler
    // would fire for the same click that opened the dropdown and
    // immediately close it.
    requestAnimationFrame(() => {
      if (!disposed) {
        document.addEventListener('click', listener as EventListener);
        document.addEventListener('touchend', listener as EventListener);
      }
    });

    destroyRef?.onDestroy(cleanup);

    return cleanup;
  }
}
