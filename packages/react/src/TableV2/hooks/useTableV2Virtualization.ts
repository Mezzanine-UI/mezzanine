'use client';
'use no memo';
/* eslint-disable react-hooks/incompatible-library */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { getRowKey, type TableV2DataSource } from '@mezzanine-ui/core/tableV2';

export interface UseTableV2VirtualizationOptions<T extends TableV2DataSource> {
  dataSource: T[];
  enabled?: boolean;
  getExpandedRowHeight?: (record: T) => number;
  isRowExpanded?: (key: string | number) => boolean;
  overscan?: number;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export interface UseTableV2VirtualizationReturn {
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

export function useTableV2Virtualization<T extends TableV2DataSource>({
  dataSource,
  enabled = true,
  getExpandedRowHeight,
  isRowExpanded,
  overscan = 5,
  scrollContainerRef,
}: UseTableV2VirtualizationOptions<T>): UseTableV2VirtualizationReturn | null {
  // Track when scroll container is mounted
  const [isContainerReady, setIsContainerReady] = useState(false);

  // Check if scroll container is ready on mount and when ref changes
  useEffect(() => {
    if (scrollContainerRef.current && enabled) {
      setIsContainerReady(true);
    }
  }, [scrollContainerRef, enabled]);

  // Use undefined estimateSize to let virtualizer measure actual row heights
  const estimateSize = useCallback(
    (index: number) => {
      // Return an initial estimate; actual height will be measured by measureElement
      const record = dataSource[index];
      const key = getRowKey(record);
      const expanded = isRowExpanded?.(key) ?? false;

      // Base estimate - will be replaced by actual measurement
      const baseEstimate = 52;

      if (expanded && getExpandedRowHeight) {
        return baseEstimate + getExpandedRowHeight(record);
      }

      return baseEstimate;
    },
    [dataSource, isRowExpanded, getExpandedRowHeight],
  );

  const getItemKey = useCallback(
    (index: number) => {
      const record = dataSource[index];

      return getRowKey(record);
    },
    [dataSource],
  );

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
  const measureElement = virtualizer.measureElement;

  const scrollToIndex = useCallback(
    (index: number, options?: { align?: 'start' | 'center' | 'end' }) => {
      virtualizer.scrollToIndex(index, options);
    },
    [virtualizer],
  );

  // Calculate padding for native table virtualization
  // Top padding = offset of first visible item
  // Bottom padding = total size - (offset of last visible item + its size)
  const paddingTop =
    virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? totalSize - (virtualItems[virtualItems.length - 1]?.end ?? totalSize)
      : 0;

  const result = useMemo<UseTableV2VirtualizationReturn | null>(() => {
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
