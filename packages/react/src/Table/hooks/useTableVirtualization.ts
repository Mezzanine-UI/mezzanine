'use client';
'use no memo';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { getRowKey, type TableDataSource } from '@mezzanine-ui/core/table';
import { useTableContext } from '../TableContext';

export interface UseTableVirtualizationOptions<T extends TableDataSource> {
  dataSource: T[];
  enabled?: boolean;
  isRowExpanded?: (key: string | number) => boolean;
  overscan?: number;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
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

export function useTableVirtualization<T extends TableDataSource>({
  dataSource,
  enabled = true,
  isRowExpanded,
  overscan = 5,
  scrollContainerRef,
}: UseTableVirtualizationOptions<T>): UseTableVirtualizationReturn | null {
  const { rowHeight } = useTableContext();
  const [isContainerReady, setIsContainerReady] = useState(false);
  const expandedRowHeightsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (scrollContainerRef.current && enabled) {
      setIsContainerReady(true);
    }
  }, [scrollContainerRef, enabled]);

  // Estimate size callback that accounts for expanded rows
  const estimateSize = useCallback(
    (index: number) => {
      const record = dataSource[index];
      const key = getRowKey(record);

      const measuredHeight = expandedRowHeightsRef.current.get(key);

      if (measuredHeight !== undefined) {
        return measuredHeight;
      }

      return rowHeight;
    },
    [dataSource, rowHeight],
  );

  const getItemKey = useCallback(
    (index: number) => {
      const record = dataSource[index];

      return getRowKey(record);
    },
    [dataSource],
  );

  /* eslint-disable-next-line react-hooks/incompatible-library */
  const virtualizer = useVirtualizer({
    count: enabled && isContainerReady ? dataSource.length : 0,
    enabled: enabled && isContainerReady,
    estimateSize,
    getItemKey,
    getScrollElement: () => scrollContainerRef.current,
    overscan,
  });

  // Force re-measure when container becomes ready
  useEffect(() => {
    if (isContainerReady && enabled) {
      virtualizer.measure();
    }
  }, [isContainerReady, enabled, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  // Custom measure function that measures both the main row and its expanded row
  const measureElement = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;

      const index = node.dataset.index;

      if (index === undefined) return;

      const rowIndex = parseInt(index, 10);
      const record = dataSource[rowIndex];

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
      expandedRowHeightsRef.current.set(key, totalHeight);

      // Use the virtualizer's measure with the combined height
      virtualizer.measureElement(node);
    },
    [dataSource, isRowExpanded, virtualizer],
  );

  const scrollToIndex = useCallback(
    (index: number, options?: { align?: 'start' | 'center' | 'end' }) => {
      virtualizer.scrollToIndex(index, options);
    },
    [virtualizer],
  );

  // Re-measure when expansion state changes
  useEffect(() => {
    if (!enabled || !isContainerReady) return;

    expandedRowHeightsRef.current.clear();
    virtualizer.measure();
  }, [isRowExpanded, enabled, isContainerReady, virtualizer]);

  const paddingTop =
    virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? totalSize - (virtualItems[virtualItems.length - 1]?.end ?? totalSize)
      : 0;

  const result = useMemo<UseTableVirtualizationReturn | null>(() => {
    if (!enabled) {
      return null;
    }

    return {
      measureElement,
      paddingBottom,
      paddingTop,
      scrollToIndex,
      totalSize,
      virtualItems,
    };
  }, [
    enabled,
    measureElement,
    paddingBottom,
    paddingTop,
    scrollToIndex,
    totalSize,
    virtualItems,
  ]);

  return result;
}
