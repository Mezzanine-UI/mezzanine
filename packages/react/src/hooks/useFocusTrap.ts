import { RefObject, useCallback, useEffect, useRef } from 'react';
import { useDocumentTabKeyDown } from './useDocumentTabKeyDown';

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

/**
 * 取得容器內目前實際可聚焦的元素，依 DOM 順序排列。
 *
 * 排除 disabled、`tabindex="-1"`、`aria-hidden` 子樹，以及被
 * `display: none` / `visibility: hidden` 隱藏的節點。
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => {
    if (element.hasAttribute('disabled')) return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;
    if (element.tabIndex < 0) return false;
    if (element.closest('[aria-hidden="true"]')) return false;

    // Deliberately a computed-style check rather than a layout one: jsdom
    // reports no boxes at all, so `offsetParent`/`getClientRects` would filter
    // out every element and the trap would never find anywhere to send focus.
    const style = getComputedStyle(element);

    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

export interface UseFocusTrapOptions {
  /**
   * 要困住焦點的容器。容器本身建議設 `tabIndex={-1}`，
   * 這樣在裡面沒有任何可聚焦元素時仍能承接焦點。
   */
  containerRef: RefObject<HTMLElement | null>;
  /**
   * 是否啟用。通常綁浮層的 `open`。
   */
  enabled: boolean;
  /**
   * 是否為目前最頂層的浮層。巢狀時只有最上層該困住 Tab，
   * 可直接傳 `useTopStack(open)` 的回傳值。
   */
  isTopStack?: () => boolean;
}

/**
 * 將鍵盤焦點困在容器內的 Hook，實作 dialog 的焦點模型。
 *
 * 啟用時記住當下的 `document.activeElement`、把焦點移進容器，Tab / Shift+Tab
 * 在容器內環繞，停用時把焦點還原給原本的元素。巢狀浮層透過 `isTopStack`
 * 讓只有最頂層生效。
 *
 * @example
 * ```tsx
 * import { useFocusTrap } from '@mezzanine-ui/react';
 *
 * const containerRef = useRef<HTMLDivElement>(null);
 * const isTopStack = useTopStack(open);
 *
 * useFocusTrap({ containerRef, enabled: open, isTopStack });
 *
 * return <div ref={containerRef} role="dialog" tabIndex={-1}>…</div>;
 * ```
 *
 * @see {@link useTopStack} 提供巢狀堆疊的最頂層判斷
 */
export interface UseFocusTrapResult {
  /**
   * 把焦點移到容器內第一個可聚焦元素（沒有的話移到容器本身）。
   *
   * 浮層通常經由 portal 掛載並帶進場動畫，節點可能在掛載後才被搬到最終位置；
   * 節點一被搬離 DOM，瀏覽器就會把焦點退回 `<body>`。因此除了啟用時會自動呼叫
   * 一次，進場動畫結束時（例如 transition 的 `onEntered`）也應該再呼叫一次。
   */
  focusFirst: () => void;
}

export function useFocusTrap(options: UseFocusTrapOptions): UseFocusTrapResult {
  const { containerRef, enabled, isTopStack } = options;

  /** 啟用前持有焦點的元素，停用時要還原給它。 */
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const focusFirst = useCallback((): void => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const [firstFocusable] = getFocusableElements(container);

    // 沒有可聚焦內容時退回容器本身，焦點才不會留在浮層外面。
    (firstFocusable ?? container).focus();
  }, [containerRef]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const activeElement = document.activeElement;

    previouslyFocusedRef.current =
      activeElement instanceof HTMLElement ? activeElement : null;

    focusFirst();

    /**
     * The overlay is usually portalled, and the portal container can be
     * attached after this effect runs — detaching the node we just focused,
     * which sends focus back to `<body>`. Re-assert it on a microtask, once
     * that churn has settled.
     */
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const container = containerRef.current;

      if (container && !container.contains(document.activeElement)) {
        focusFirst();
      }
    });

    return () => {
      cancelled = true;

      const previous = previouslyFocusedRef.current;

      previouslyFocusedRef.current = null;

      if (previous && document.contains(previous)) {
        previous.focus();
      }
    };
  }, [containerRef, enabled, focusFirst]);

  useDocumentTabKeyDown(() => {
    if (!enabled) {
      return;
    }

    return (event) => {
      if (isTopStack && !isTopStack()) return;

      const container = containerRef.current;

      if (!container) return;

      const focusable = getFocusableElements(container);

      if (!focusable.length) {
        // 容器內無處可去，就把焦點釘在容器上而不是逸出到頁面。
        event.preventDefault();
        container.focus();

        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }

        return;
      }

      if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
  }, [containerRef, enabled, isTopStack]);

  return { focusFirst };
}

export default useFocusTrap;
