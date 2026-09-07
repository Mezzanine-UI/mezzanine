import { onBeforeUnmount, ref, watch } from 'vue';
import type { Ref } from 'vue';

export interface UseVisibleItemsReturn {
  /** Attach to the scrolling content box; its height is what gets measured. */
  contentRef: Ref<HTMLDivElement | null>;
  /** How many level-1 options fit, or `null` while expanded. */
  visibleCount: Ref<number | null>;
}

/**
 * 收合狀態下，量出側邊欄還放得下幾個第一層選項。
 *
 * 量的是內容區高度除以單一選項的高度，再扣掉一個位置留給「更多」按鈕。展開時
 * 不需要量，`visibleCount` 會是 `null`。容器尺寸變化時以 100ms 去抖動重算。
 *
 * @example
 * ```ts
 * const { contentRef, visibleCount } = useVisibleItems(
 *   () => items.value,
 *   () => collapsed.value,
 * );
 * ```
 */
export function useVisibleItems(
  items: () => unknown[],
  collapsed: () => boolean,
): UseVisibleItemsReturn {
  const contentRef = ref<HTMLDivElement | null>(null);
  const visibleCount = ref<number | null>(null);

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let resizeObserver: ResizeObserver | null = null;

  function clearPending(): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function disconnect(): void {
    clearPending();
    resizeObserver?.disconnect();
    resizeObserver = null;
  }

  function calculateVisibleItems(contentEl: HTMLDivElement): void {
    if (!collapsed()) {
      visibleCount.value = null;

      return;
    }

    const contentHeight = contentEl.clientHeight;
    const ul = contentEl.querySelector('ul');
    const option = contentEl.querySelector('.mzn-navigation-option--level-1');

    const optionHeight = option?.clientHeight || 0;
    const optionsGapTightFixed = 4;

    if (optionHeight === 0) {
      visibleCount.value = 0;

      return;
    }

    if (!ul) return;

    visibleCount.value =
      Math.floor(
        (contentHeight + optionsGapTightFixed) /
          (optionHeight + optionsGapTightFixed),
      ) - 1;
  }

  watch(
    [contentRef, collapsed, items],
    () => {
      disconnect();

      const contentEl = contentRef.value;

      if (!contentEl) return;

      const debouncedCalculate = (): void => {
        clearPending();
        timeoutId = setTimeout(() => calculateVisibleItems(contentEl), 100);
      };

      resizeObserver = new ResizeObserver(debouncedCalculate);
      resizeObserver.observe(contentEl);
      calculateVisibleItems(contentEl);
    },
    { flush: 'post', immediate: true },
  );

  onBeforeUnmount(disconnect);

  return { contentRef, visibleCount };
}
