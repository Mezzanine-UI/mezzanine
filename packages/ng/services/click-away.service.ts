import { DestroyRef, Injectable } from '@angular/core';

export type ClickAwayEvent = MouseEvent | TouchEvent | PointerEvent;
export type ClickAwayHandler = (event: ClickAwayEvent) => void;

/**
 * Detects clicks occurring outside a specified container element.
 *
 * Listens for `click` and `touchend` events at the document **capture phase**,
 * so inner elements that call `event.stopPropagation()` (for example, a
 * notification card's dot-icon click that opens its own menu while preventing
 * the outer button handler) cannot suppress the click-away detection. This
 * mirrors React's `useDocumentEvents`, which effectively also fires before any
 * bubble-phase handler runs, enabling mutual-exclusion between multiple
 * simultaneously-mounted dropdown / popper UIs: opening B's trigger fires
 * click-away on A (because A's listener runs at capture on document).
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
    containers: HTMLElement | readonly (HTMLElement | null | undefined)[],
    handler: ClickAwayHandler,
    destroyRef?: DestroyRef,
  ): () => void {
    const containerList = Array.isArray(containers) ? containers : [containers];
    const listener: ClickAwayHandler = (event) => {
      const target = event.target as HTMLElement | null;

      // 已經從 DOM 移除的 target（React 的等效行為）略過，避免誤觸關閉。
      if (!document.contains(target!)) return;

      // 只要 target 落在任一 container 內就視為「inside」，不觸發 handler。
      // 典型多 container 用法：主元件 host + 被 portal 出去的 popper element，
      // 讓點擊 popped-out 選項時不被當成 click-away。
      for (const container of containerList) {
        if (container && container.contains(target)) {
          return;
        }
      }

      handler(event);
    };

    let disposed = false;

    const cleanup = (): void => {
      disposed = true;
      // capture-phase listeners must be removed with the same capture flag.
      document.removeEventListener('click', listener as EventListener, true);
      document.removeEventListener('touchend', listener as EventListener, true);
    };

    // Defer listener registration to the next frame so the current click
    // event (which may have triggered the open state) finishes bubbling
    // before we start listening.  Without this, the click-away handler
    // would fire for the same click that opened the dropdown and
    // immediately close it.
    requestAnimationFrame(() => {
      if (!disposed) {
        // capture=true: receive events at document on the way DOWN (before
        // any target / ancestor `stopPropagation()` in bubble phase can
        // suppress them). This is what makes mutual exclusion work across
        // open popper / dropdown UIs even when an inner trigger stops
        // propagation to avoid side-effects on its ancestor handlers.
        document.addEventListener('click', listener as EventListener, true);
        document.addEventListener('touchend', listener as EventListener, true);
      }
    });

    destroyRef?.onDestroy(cleanup);

    return cleanup;
  }
}
