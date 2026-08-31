import { DOCUMENT, Injectable, inject } from '@angular/core';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'details > summary',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]',
  '[tabindex]',
].join(',');

export interface FocusTrapOptions {
  /**
   * 要困住焦點的容器。以函式取得，因為浮層的宿主元素通常在開啟後才存在。
   * 建議在該元素上加 `tabindex="-1"`，這樣裡面沒有可聚焦元素時仍能承接焦點。
   */
  readonly container: () => HTMLElement | null | undefined;
  /**
   * 是否為目前最頂層的浮層。巢狀時只有最上層該困住 Tab，
   * 可直接接 `TopStackService` 的 `entry.isTop`。
   */
  readonly isTop?: () => boolean;
}

/**
 * 把鍵盤焦點困在容器內的服務，實作 dialog 的焦點模型。
 *
 * 對齊 React 的 `useFocusTrap`：啟用時記住當下的 `activeElement`、把焦點移進
 * 容器，Tab / Shift+Tab 在容器內環繞，清理時把焦點還原給原本的元素。
 *
 * @example
 * ```ts
 * const entry = this.topStack.register();
 * const release = this.focusTrap.trap({
 *   container: () => this.contentWrapper()?.nativeElement,
 *   isTop: entry.isTop,
 * });
 *
 * onCleanup(() => {
 *   release();
 *   entry.unregister();
 * });
 * ```
 *
 * @see TopStackService 提供巢狀堆疊的最頂層判斷
 */
@Injectable({ providedIn: 'root' })
export class FocusTrapService {
  private readonly document = inject(DOCUMENT);

  /**
   * 開始困住焦點，回傳解除用的函式（會一併還原焦點）。
   */
  trap(options: FocusTrapOptions): () => void {
    const { container, isTop } = options;
    const active = this.document.activeElement;
    const previouslyFocused = active instanceof HTMLElement ? active : null;

    const focusFirst = (): void => {
      const host = container();

      if (!host) return;

      const [first] = this.getFocusableElements(host);

      // 沒有可聚焦內容時退回容器本身，焦點才不會留在浮層外面。
      (first ?? host).focus();
    };

    focusFirst();

    /**
     * 浮層多半經由 portal 掛載並帶進場動畫，節點可能在這之後才被搬到最終位置；
     * 一旦被搬離 DOM，瀏覽器就會把焦點退回 `<body>`。等 microtask 再確認一次。
     */
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const host = container();

      if (host && !host.contains(this.document.activeElement)) {
        focusFirst();
      }
    });

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;
      if (isTop && !isTop()) return;

      const host = container();

      if (!host) return;

      const focusable = this.getFocusableElements(host);

      if (!focusable.length) {
        // 容器內無處可去，就把焦點釘在容器上而不是逸出到頁面。
        event.preventDefault();
        host.focus();

        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = this.document.activeElement;

      if (event.shiftKey) {
        if (activeElement === first || !host.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }

        return;
      }

      if (activeElement === last || !host.contains(activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    this.document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelled = true;
      this.document.removeEventListener('keydown', onKeyDown);

      if (previouslyFocused && this.document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }

  /**
   * 取得容器內目前實際可聚焦的元素，依 DOM 順序排列。
   *
   * 排除 disabled、`tabindex="-1"`、`aria-hidden` 子樹，以及被
   * `display: none` / `visibility: hidden` 隱藏的節點。刻意用 computed style
   * 而非版面盒判斷：jsdom 完全不回報版面，用後者會把所有元素都濾掉。
   */
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((element) => {
      if (element.hasAttribute('disabled')) return false;
      if (element.getAttribute('aria-hidden') === 'true') return false;
      if (element.tabIndex < 0) return false;
      if (element.closest('[aria-hidden="true"]')) return false;

      const style = getComputedStyle(element);

      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }
}
