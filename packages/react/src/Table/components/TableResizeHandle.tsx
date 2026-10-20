'use client';

import { memo, useCallback, useEffect, useRef } from 'react';
import {
  tableClasses as classes,
  type TableColumn,
} from '@mezzanine-ui/core/table';
import { useTableContext, useTableDataContext } from '../TableContext';

export interface TableResizeHandleProps {
  /** The column this resize handle belongs to */
  column: TableColumn;
  /** Index of the column in the columns array */
  columnIndex: number;
}

/**
 * TableResizeHandle provides column resizing functionality.
 * It adjusts the width of the current column and the next column together,
 * maintaining the total width of both columns.
 */
export const TableResizeHandle = memo(function TableResizeHandle({
  column,
  columnIndex,
}: TableResizeHandleProps) {
  const {
    columnState,
    draggable,
    expansion,
    pinnable,
    scrollContainerRef,
    selection,
  } = useTableContext();
  const { columns } = useTableDataContext();
  const {
    commitResizedColumnWidths,
    discardResizedColumnWidths,
    setResizedColumnWidth,
  } = columnState || {};

  const startWidthRef = useRef(0);
  const nextStartWidthRef = useRef(0);
  const startXRef = useRef(0);
  // Detaches the document listeners of an in-progress drag (null when idle)
  const stopDraggingRef = useRef<(() => void) | null>(null);

  // A drag still in progress when the handle unmounts must not report later
  useEffect(
    () => () => {
      if (!stopDraggingRef.current) return;

      stopDraggingRef.current();
      stopDraggingRef.current = null;
      discardResizedColumnWidths?.();
    },
    [discardResizedColumnWidths],
  );

  // Calculate action columns offset. Must mirror the leading <col>s rendered
  // by TableColGroup: drag and pin share a single handle column.
  const actionColumnsOffset = (() => {
    let offset = 0;

    if (draggable?.enabled || pinnable?.enabled) offset += 1;
    if (expansion) offset += 1;
    if (selection) offset += 1;

    return offset;
  })();

  // Get the actual rendered width of a column from the DOM
  const getColumnActualWidth = useCallback(
    (colIndex: number): number => {
      const container = scrollContainerRef?.current;

      if (!container) return 0;

      const table = container.querySelector('table');

      if (!table) return 0;

      const colGroup = table.querySelector('colgroup');

      if (!colGroup) return 0;

      const colElements = colGroup.querySelectorAll('col');
      const targetCol = colElements[actionColumnsOffset + colIndex];

      if (!targetCol) return 0;

      return targetCol.getBoundingClientRect().width;
    },
    [actionColumnsOffset, scrollContainerRef],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // Get next column (the one to the right)
      const nextColumn = columns[columnIndex + 1];

      if (!nextColumn) {
        // If there's no next column, we can't do adjacent resize
        return;
      }

      const lastColumnIndex = columns.length - 1;
      const lastColumn = columns[lastColumnIndex];
      // When resizing the second-to-last column, nextColumn === lastColumn.
      // We collapse to the legacy adjacent-compensation path to avoid
      // double-writing the same key.
      const isAdjacentToLast = columnIndex + 1 === lastColumnIndex;

      // Get the actual rendered widths from the DOM
      const currentWidth = getColumnActualWidth(columnIndex);
      const nextWidth = getColumnActualWidth(columnIndex + 1);
      const lastWidth = isAdjacentToLast
        ? nextWidth
        : getColumnActualWidth(lastColumnIndex);

      if (currentWidth === 0 || nextWidth === 0 || lastWidth === 0) {
        return;
      }

      startXRef.current = event.clientX;
      startWidthRef.current = currentWidth;
      nextStartWidthRef.current = nextWidth;

      const minWidth = column.minWidth;
      const maxWidth = column.maxWidth;
      const nextMinWidth = nextColumn.minWidth;
      const nextMaxWidth = nextColumn.maxWidth;
      const lastMinWidth = lastColumn.minWidth;
      const lastMaxWidth = lastColumn.maxWidth;

      // Slack the last column can absorb (signed against `diff`):
      // - positive `diff` shrinks last → capped by lastShrinkBudget
      // - negative `diff` grows last → capped by lastGrowBudget
      const lastShrinkBudget = lastWidth - (lastMinWidth ?? 0);
      const lastGrowBudget =
        lastMaxWidth !== undefined ? lastMaxWidth - lastWidth : Infinity;

      // Net drag distance last written to the widths; 0 means no visible change
      let appliedDiff = 0;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startXRef.current;
        const newWidth = startWidthRef.current + diff;

        // Current column constraint checks
        if (minWidth !== undefined && newWidth < minWidth) return;
        if (maxWidth !== undefined && newWidth > maxWidth) return;
        if (newWidth < 0) return;

        if (isAdjacentToLast) {
          // Legacy adjacent compensation: donor === N+1 === last
          const newNextWidth = nextStartWidthRef.current - diff;

          if (nextMinWidth !== undefined && newNextWidth < nextMinWidth) return;
          if (nextMaxWidth !== undefined && newNextWidth > nextMaxWidth) return;
          if (newNextWidth < 0) return;

          setResizedColumnWidth?.(column.key, newWidth);
          setResizedColumnWidth?.(nextColumn.key, newNextWidth);
          appliedDiff = diff;

          return;
        }

        // Last-column donor strategy:
        // Project `diff` onto the last column first (clamped to its budget).
        // Any overflow falls back to the adjacent column (N+1).
        let toLast: number;

        if (diff >= 0) {
          toLast = Math.min(diff, lastShrinkBudget);
        } else {
          toLast = Math.max(diff, -lastGrowBudget);
        }

        const overflow = diff - toLast;
        const newLastWidth = lastWidth - toLast;
        // Always write N+1 too — when overflow returns to 0 on the return
        // drag, this restores N+1 to its start width (LIFO donor restoration).
        const newNextWidth = nextStartWidthRef.current - overflow;

        if (nextMinWidth !== undefined && newNextWidth < nextMinWidth) return;
        if (nextMaxWidth !== undefined && newNextWidth > nextMaxWidth) return;
        if (newNextWidth < 0) return;

        setResizedColumnWidth?.(column.key, newWidth);
        setResizedColumnWidth?.(lastColumn.key, newLastWidth);
        setResizedColumnWidth?.(nextColumn.key, newNextWidth);
        appliedDiff = diff;
      };

      const stopDragging = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        stopDraggingRef.current = null;
      };

      const handleMouseUp = () => {
        stopDragging();

        // A drag that ends where it started only re-wrote measured start
        // widths; dropping them avoids reporting (and pinning) a no-op.
        if (appliedDiff === 0) {
          discardResizedColumnWidths?.();
        } else {
          commitResizedColumnWidths?.();
        }
      };

      stopDraggingRef.current = stopDragging;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [
      column,
      columnIndex,
      columns,
      commitResizedColumnWidths,
      discardResizedColumnWidths,
      getColumnActualWidth,
      setResizedColumnWidth,
    ],
  );

  // Don't show resize handle for the last column (no adjacent column to resize)
  if (columnIndex >= columns.length - 1) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={classes.resizeHandle}
      onMouseDown={handleMouseDown}
      role="presentation"
    />
  );
});
