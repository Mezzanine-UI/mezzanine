import { computed, shallowRef, watch } from 'vue';
import type { ComputedRef, ShallowRef } from 'vue';
import { useVirtualizer } from '@tanstack/vue-virtual';
import type { VirtualItem } from '@tanstack/vue-virtual';
import { getRowKey, type TableDataSource } from '@mezzanine-ui/core/table';
import { useTableContext } from './table-context';

export interface UseTableVirtualizationOptions<T extends TableDataSource> {
  /** The rows to virtualize. */
  dataSource: () => T[];
  /** Whether virtualization is on at all. */
  enabled?: () => boolean;
  /** Whether the scroll container has been measured. */
  isContainerReady?: () => boolean;
  /** Whether a row is expanded, so its height can be added to the estimate. */
  isRowExpanded?: (key: string) => boolean;
  /** How many rows to render beyond the viewport. */
  overscan?: number;
  /** The element that scrolls. */
  scrollContainerRef: ShallowRef<HTMLDivElement | null>;
}

export interface UseTableVirtualizationReturn {
  /** Bottom padding for the tbody to maintain scroll height */
  paddingBottom: number;
  /** Top padding for the tbody to offset visible rows */
  paddingTop: number;
  measureElement: (node: HTMLElement | null) => void;
  scrollToIndex: (
    index: number,
    options?: { align?: 'start' | 'center' | 'end' },
  ) => void;
  totalSize: number;
  virtualItems: VirtualItem[];
}

/**
 * 只渲染視窗內的資料列，讓上萬列的表格仍然順暢。
 *
 * 建在 `@tanstack/vue-virtual` 上（與 React 端共用同一版 `@tanstack/virtual-core`）。
 * 展開列的高度會併進它所屬那一列的量測值，否則捲動高度會算錯。上下各補一個
 * padding 列撐出總高度。
 *
 * @example
 * ```ts
 * const virtualization = useTableVirtualization({
 *   dataSource: () => table.value.dataSource,
 *   enabled: () => table.value.virtualScrollEnabled,
 *   scrollContainerRef: table.value.scrollContainerRef,
 * });
 * ```
 *
 * @see MznTableBody 使用它的元件
 */
export function useTableVirtualization<T extends TableDataSource>({
  dataSource,
  enabled = () => true,
  isContainerReady = () => false,
  isRowExpanded,
  overscan = 5,
  scrollContainerRef,
}: UseTableVirtualizationOptions<T>): ComputedRef<UseTableVirtualizationReturn | null> {
  const table = useTableContext();

  /** React keeps the measured heights in a ref; a plain Map is the equivalent. */
  const expandedRowHeights = new Map<string, number>();

  const isActive = computed((): boolean => enabled() && isContainerReady());

  // Estimate size callback that accounts for expanded rows
  const estimateSize = (index: number): number => {
    const record = dataSource()[index];
    const key = getRowKey(record);
    const measuredHeight = expandedRowHeights.get(key);

    if (measuredHeight !== undefined) {
      return measuredHeight;
    }

    return table.value.rowHeight ?? 0;
  };

  const getItemKey = (index: number): string => getRowKey(dataSource()[index]);

  const virtualizerOptions = computed(() => ({
    count: isActive.value ? dataSource().length : 0,
    enabled: isActive.value,
    estimateSize,
    getItemKey,
    getScrollElement: () => scrollContainerRef.value,
    overscan,
  }));

  const virtualizer = useVirtualizer(virtualizerOptions);

  // Force re-measure when container becomes ready
  watch(
    isActive,
    (active) => {
      if (active) virtualizer.value.measure();
    },
    { flush: 'post' },
  );

  // Custom measure function that measures both the main row and its expanded row
  const measureElement = (node: HTMLElement | null): void => {
    if (!node) return;

    const index = node.dataset.index;

    if (index === undefined) return;

    const rowIndex = parseInt(index, 10);
    const record = dataSource()[rowIndex];

    if (!record) return;

    const key = getRowKey(record);
    const expanded = isRowExpanded?.(key) ?? false;

    // Get the main row height
    let totalHeight = node.getBoundingClientRect().height;

    // If expanded, find and measure the expanded row (next sibling)
    if (expanded && node.nextElementSibling) {
      const expandedRow = node.nextElementSibling as HTMLElement;
      const expandedRowKey = expandedRow.dataset.rowKey;

      if (expandedRowKey === `${key}-expanded`) {
        totalHeight += expandedRow.getBoundingClientRect().height;
      }
    }

    // Store the combined height
    expandedRowHeights.set(key, totalHeight);

    // Use the virtualizer's measure with the combined height
    virtualizer.value.measureElement(node);
  };

  const scrollToIndex = (
    index: number,
    options?: { align?: 'start' | 'center' | 'end' },
  ): void => {
    virtualizer.value.scrollToIndex(index, options);
  };

  /** Vue's virtualizer publishes its items through a ref of its own. */
  const items = shallowRef<VirtualItem[]>([]);
  const total = shallowRef(0);

  watch(
    () =>
      [
        virtualizer.value.getVirtualItems(),
        virtualizer.value.getTotalSize(),
      ] as const,
    ([nextItems, nextTotal]) => {
      items.value = nextItems;
      total.value = nextTotal;
    },
    { flush: 'post', immediate: true },
  );

  return computed((): UseTableVirtualizationReturn | null => {
    if (!enabled()) {
      return null;
    }

    const virtualItems = items.value;
    const totalSize = total.value;

    return {
      measureElement,
      paddingBottom:
        virtualItems.length > 0
          ? totalSize -
            (virtualItems[virtualItems.length - 1]?.end ?? totalSize)
          : 0,
      paddingTop: virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0,
      scrollToIndex,
      totalSize,
      virtualItems,
    };
  });
}
