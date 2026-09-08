import { watchEffect } from 'vue';
import type { Ref } from 'vue';
import { useDocumentTabKeyDown } from './use-document-tab-key-down';

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
 *
 * 這份判斷與 Picker 的 `getFocusableElements` 不同 —— React 兩邊各有一份，
 * 選擇器與過濾條件都不一樣，因此這裡也各留一份。
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
   * 要困住焦點的容器。容器本身建議設 `tabindex="-1"`，
   * 這樣在裡面沒有任何可聚焦元素時仍能承接焦點。
   */
  containerRef: Ref<HTMLElement | null>;
  /**
   * 是否啟用。通常綁浮層的 `open`。
   */
  enabled: () => boolean;
  /**
   * 是否為目前最頂層的浮層。巢狀時只有最上層該困住 Tab，
   * 可直接傳 `useTopStack(...)` 的回傳值。
   */
  isTopStack?: () => boolean;
}

export interface UseFocusTrapResult {
  /**
   * 把焦點移到容器內第一個可聚焦元素（沒有的話移到容器本身）。
   *
   * 浮層通常經由 portal 掛載並帶進場動畫，節點可能在掛載後才被搬到最終位置；
   * 節點一被搬離 DOM，瀏覽器就會把焦點退回 `body`。因此除了啟用時會自動呼叫
   * 一次，進場動畫結束時（例如轉場的 `entered`）也應該再呼叫一次。
   */
  focusFirst: () => void;
}

/**
 * 將鍵盤焦點困在容器內的 composable，實作 dialog 的焦點模型。
 *
 * 啟用時記住當下的 `document.activeElement`、把焦點移進容器，Tab / Shift+Tab
 * 在容器內環繞，停用時把焦點還原給原本的元素。巢狀浮層透過 `isTopStack`
 * 讓只有最頂層生效。
 *
 * @example
 * ```ts
 * const containerRef = ref<HTMLElement | null>(null);
 * const isTopStack = useTopStack(() => props.open);
 *
 * const { focusFirst } = useFocusTrap({
 *   containerRef,
 *   enabled: () => props.open,
 *   isTopStack,
 * });
 * ```
 *
 * @see useTopStack 提供巢狀堆疊的最頂層判斷
 */
export function useFocusTrap(options: UseFocusTrapOptions): UseFocusTrapResult {
  const { containerRef, enabled, isTopStack } = options;

  /** 啟用前持有焦點的元素，停用時要還原給它。 */
  let previouslyFocused: HTMLElement | null = null;

  const focusFirst = (): void => {
    const container = containerRef.value;

    if (!container) {
      return;
    }

    const [firstFocusable] = getFocusableElements(container);

    // 沒有可聚焦內容時退回容器本身，焦點才不會留在浮層外面。
    (firstFocusable ?? container).focus();
  };

  watchEffect((onCleanup) => {
    if (!enabled()) {
      return;
    }

    const activeElement = document.activeElement;

    previouslyFocused =
      activeElement instanceof HTMLElement ? activeElement : null;

    focusFirst();

    /**
     * The overlay is usually portalled, and the portal container can be
     * attached after this effect runs — detaching the node just focused, which
     * sends focus back to `body`. Re-assert it on a microtask, once that churn
     * has settled.
     */
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const container = containerRef.value;

      if (container && !container.contains(document.activeElement)) {
        focusFirst();
      }
    });

    onCleanup(() => {
      cancelled = true;

      const previous = previouslyFocused;

      previouslyFocused = null;

      if (previous && document.contains(previous)) {
        previous.focus();
      }
    });
  });

  useDocumentTabKeyDown(() => {
    if (!enabled()) {
      return undefined;
    }

    return (event) => {
      if (isTopStack && !isTopStack()) return;

      const container = containerRef.value;

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
  });

  return { focusFirst };
}
