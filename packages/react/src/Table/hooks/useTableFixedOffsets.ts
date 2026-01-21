'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DRAG_OR_PIN_HANDLE_COLUMN_WIDTH,
  DRAG_OR_PIN_HANDLE_KEY,
  EXPANSION_COLUMN_WIDTH,
  EXPANSION_KEY,
  SELECTION_COLUMN_WIDTH,
  SELECTION_KEY,
  type FixedType,
  type TableColumn,
} from '@mezzanine-ui/core/table';
import type { ActionColumnConfig } from './typings';
import { useTableSuperContext } from '../TableContext';

export interface FixedOffsetInfo {
  /** CSS offset value for the column */
  offset: number;
  /** Fixed side: 'start' or 'end' */
  side: 'start' | 'end';
}

export interface UseTableFixedOffsetsReturn {
  /** Get offset info for a specific column by key */
  getColumnOffset: (key: string) => FixedOffsetInfo | null;
  /** Get offset info for drag or pin handle column */
  getDragOrPinHandleOffset: () => FixedOffsetInfo | null;
  /** Get offset info for selection column */
  getSelectionOffset: () => FixedOffsetInfo | null;
  /** Get offset info for expansion column */
  getExpansionOffset: () => FixedOffsetInfo | null;
  /** Check if a column should show shadow based on scroll position */
  shouldShowShadow: (
    key: string,
    scrollLeft: number,
    containerWidth: number,
  ) => boolean;
}

export interface UseTableFixedOffsetsOptions {
  /** Column definitions */
  columns: TableColumn[];
  /** Action column configuration */
  actionConfig: ActionColumnConfig;
  /** Get computed width for a column (from columnState) */
  getResizedColumnWidth?: (key: string) => number | undefined;
}

const parseFixed = (fixed: FixedType | undefined): 'end' | 'start' | null => {
  if (fixed === true || fixed === 'start') return 'start';
  if (fixed === 'end') return 'end';

  return null;
};

export function useTableFixedOffsets(
  props: UseTableFixedOffsetsOptions,
): UseTableFixedOffsetsReturn {
  const {
    expansionLeftPadding = 0,
    hasDragOrPinHandleFixed: parentHasDragOrPinHandleFixed,
  } = useTableSuperContext();
  const { actionConfig, columns, getResizedColumnWidth } = props;

  // Store measured widths
  const [measuredWidths, setMeasuredWidths] = useState<Map<string, number>>(
    new Map(),
  );

  const {
    hasDragOrPinHandle,
    hasExpansion,
    hasSelection,
    dragOrPinHandleFixed,
    expansionFixed,
    selectionFixed,
  } = actionConfig;

  useEffect(() => {
    const innerMap = new Map<string, number>();

    if (hasDragOrPinHandle || parentHasDragOrPinHandleFixed) {
      innerMap.set(DRAG_OR_PIN_HANDLE_KEY, DRAG_OR_PIN_HANDLE_COLUMN_WIDTH);
    }

    if (hasExpansion) {
      innerMap.set(EXPANSION_KEY, EXPANSION_COLUMN_WIDTH);
    }

    if (hasSelection) {
      innerMap.set(SELECTION_KEY, SELECTION_COLUMN_WIDTH);
    }

    setMeasuredWidths(innerMap);
  }, [
    hasDragOrPinHandle,
    hasExpansion,
    hasSelection,
    parentHasDragOrPinHandleFixed,
  ]);

  // Get width for a column (prioritize measured, then computed, then defined, then fallback)
  const getWidth = useCallback(
    (key: string, fallback = 0): number => {
      // Get static widths first
      const measured = measuredWidths.get(key);

      if (measured !== undefined && measured > 0) {
        return measured;
      }

      // get resized column width
      const computed = getResizedColumnWidth?.(key);

      if (computed !== undefined) {
        return computed;
      }

      // Then try to find column definition width
      const column = columns.find((col) => col.key === key);

      if (column?.width !== undefined) {
        return column.width;
      }

      return fallback;
    },
    [columns, getResizedColumnWidth, measuredWidths],
  );

  // Build ordered list of all fixed columns
  const { fixedEndKeys, fixedStartKeys } = useMemo(() => {
    const startKeys: string[] = [];
    const endKeys: string[] = [];

    if (hasExpansion && expansionFixed) {
      startKeys.push(EXPANSION_KEY);
    }

    if (
      (hasDragOrPinHandle && dragOrPinHandleFixed) ||
      parentHasDragOrPinHandleFixed
    ) {
      startKeys.push(DRAG_OR_PIN_HANDLE_KEY);
    }

    if (hasSelection && selectionFixed) {
      startKeys.push(SELECTION_KEY);
    }

    columns.forEach((column) => {
      const side = parseFixed(column.fixed);

      if (side === 'start') {
        startKeys.push(column.key);
      } else if (side === 'end') {
        endKeys.push(column.key);
      }
    });

    return { fixedEndKeys: endKeys, fixedStartKeys: startKeys };
  }, [
    hasDragOrPinHandle,
    dragOrPinHandleFixed,
    hasExpansion,
    expansionFixed,
    hasSelection,
    selectionFixed,
    columns,
    parentHasDragOrPinHandleFixed,
  ]);

  // Calculate all fixed offsets
  const fixedOffsets = useMemo(() => {
    const startOffsets = new Map<string, FixedOffsetInfo>();
    const endOffsets = new Map<string, FixedOffsetInfo>();

    let currentStartOffset = 0;

    fixedStartKeys.forEach((key) => {
      startOffsets.set(key, {
        offset: currentStartOffset,
        side: 'start',
      });
      currentStartOffset += getWidth(key);
    });

    let currentEndOffset = 0;

    for (let i = fixedEndKeys.length - 1; i >= 0; i--) {
      const key = fixedEndKeys[i];

      endOffsets.set(key, {
        offset: currentEndOffset,
        side: 'end',
      });
      currentEndOffset += getWidth(key);
    }

    return { endOffsets, startOffsets };
  }, [fixedEndKeys, fixedStartKeys, getWidth]);

  const allColumnKeys = useMemo(() => {
    const keys: string[] = [];

    if (hasExpansion) {
      keys.push(EXPANSION_KEY);
    }

    if (hasDragOrPinHandle) {
      keys.push(DRAG_OR_PIN_HANDLE_KEY);
    }

    if (hasSelection) {
      keys.push(SELECTION_KEY);
    }

    columns.forEach((column) => {
      keys.push(column.key);
    });

    return keys;
  }, [hasDragOrPinHandle, hasSelection, hasExpansion, columns]);

  const originalPositions = useMemo(() => {
    const positions = new Map<string, number>();
    let currentPosition = 0;

    allColumnKeys.forEach((key) => {
      positions.set(key, currentPosition);
      currentPosition += getWidth(key);
    });

    return positions;
  }, [allColumnKeys, getWidth]);

  const shouldShowShadow = useCallback(
    (key: string, scrollLeft: number, containerWidth: number): boolean => {
      const offsetInfo =
        fixedOffsets.startOffsets.get(key) ?? fixedOffsets.endOffsets.get(key);

      if (!offsetInfo) return false;

      if (offsetInfo.side === 'start') {
        // For start-fixed columns
        const keyIndex = fixedStartKeys.indexOf(key);

        if (keyIndex === -1) return false;

        const originalPos = originalPositions.get(key) ?? 0;

        const isSticky =
          scrollLeft - expansionLeftPadding > originalPos - offsetInfo.offset;

        if (!isSticky) return false;

        // Now check if there's a gap to the right (shadow should show)
        // Find the next fixed-start column
        const nextIndex = keyIndex + 1;

        if (nextIndex < fixedStartKeys.length) {
          const nextKey = fixedStartKeys[nextIndex];
          const nextOriginalPos = originalPositions.get(nextKey) ?? 0;
          const nextOffset =
            fixedOffsets.startOffsets.get(nextKey)?.offset ?? 0;

          // Gap closes when scroll reaches the point where next column becomes sticky
          const isNextSticky =
            scrollLeft - expansionLeftPadding >= nextOriginalPos - nextOffset;

          return !isNextSticky;
        }

        return true;
      } else {
        // For end-fixed columns
        const keyIndex = fixedEndKeys.indexOf(key);

        if (keyIndex === -1) return false;

        // Get this column's original position from left
        const originalPos = originalPositions.get(key) ?? 0;
        const columnWidth = getWidth(key);
        const isSticky =
          scrollLeft + containerWidth <
          originalPos + columnWidth + offsetInfo.offset + expansionLeftPadding;

        if (!isSticky) return false;

        // Check if there's a gap to the left (shadow should show)
        const prevIndex = keyIndex - 1;

        if (~prevIndex) {
          const prevKey = fixedEndKeys[prevIndex];
          const prevOriginalPos = originalPositions.get(prevKey) ?? 0;
          const prevOffset = fixedOffsets.endOffsets.get(prevKey)?.offset ?? 0;
          const prevColumnWidth = getWidth(prevKey);

          const isPrevSticky =
            scrollLeft + containerWidth <
            prevOriginalPos +
              prevColumnWidth +
              prevOffset +
              expansionLeftPadding;

          // If both are sticky, the gap is closed if this column's
          // left visual edge touches the prev column's right visual edge
          return !isPrevSticky;
        }

        // This is the leftmost fixed-end column
        return true;
      }
    },
    [
      fixedEndKeys,
      fixedOffsets,
      fixedStartKeys,
      getWidth,
      originalPositions,
      expansionLeftPadding,
    ],
  );

  const getColumnOffset = useCallback(
    (key: string): FixedOffsetInfo | null => {
      return (
        fixedOffsets.startOffsets.get(key) ??
        fixedOffsets.endOffsets.get(key) ??
        null
      );
    },
    [fixedOffsets],
  );

  const getDragOrPinHandleOffset = useCallback((): FixedOffsetInfo | null => {
    if (
      !actionConfig.hasDragOrPinHandle ||
      !actionConfig.dragOrPinHandleFixed
    ) {
      return null;
    }

    return fixedOffsets.startOffsets.get(DRAG_OR_PIN_HANDLE_KEY) ?? null;
  }, [actionConfig, fixedOffsets]);

  const getSelectionOffset = useCallback((): FixedOffsetInfo | null => {
    if (!actionConfig.hasSelection || !actionConfig.selectionFixed) {
      return null;
    }

    return fixedOffsets.startOffsets.get(SELECTION_KEY) ?? null;
  }, [actionConfig, fixedOffsets]);

  const getExpansionOffset = useCallback((): FixedOffsetInfo | null => {
    if (!actionConfig.hasExpansion || !actionConfig.expansionFixed) {
      return null;
    }

    return fixedOffsets.startOffsets.get(EXPANSION_KEY) ?? null;
  }, [actionConfig, fixedOffsets]);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      getColumnOffset,
      getDragOrPinHandleOffset,
      getExpansionOffset,
      getSelectionOffset,
      shouldShowShadow,
    }),
    [
      getColumnOffset,
      getDragOrPinHandleOffset,
      getExpansionOffset,
      getSelectionOffset,
      shouldShowShadow,
    ],
  );
}
