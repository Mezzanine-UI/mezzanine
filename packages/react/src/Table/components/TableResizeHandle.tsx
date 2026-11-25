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

type SetColumnWidth = (key: string, width: number) => void;

/**
 * Applies the drag distance `diff` (px, relative to mousedown) to the widths.
 * Returns false when the move violates a constraint and was ignored.
 */
type ResizeMoveHandler = (diff: number) => boolean;

/** Whether `width` is within `[minWidth, maxWidth]` and non-negative. */
function isWithinBounds(
  width: number,
  minWidth?: number,
  maxWidth?: number,
): boolean {
  if (width < 0) return false;
  if (minWidth !== undefined && width < minWidth) return false;
  if (maxWidth !== undefined && width > maxWidth) return false;

  return true;
}

interface GrowTableMoveOptions {
  column: TableColumn;
  setWidth: SetColumnWidth;
  startWidth: number;
}

/**
 * `'grow-table'`: only the dragged column changes, so the table widens or
 * narrows by the drag distance (spreadsheet-style resizing).
 */
function createGrowTableMove({
  column,
  setWidth,
  startWidth,
}: GrowTableMoveOptions): ResizeMoveHandler {
  return (diff) => {
    const newWidth = startWidth + diff;

    if (!isWithinBounds(newWidth, column.minWidth, column.maxWidth)) {
      return false;
    }

    setWidth(column.key, newWidth);

    return true;
  };
}

interface PreserveTableWidthMoveOptions {
  column: TableColumn;
  lastColumn: TableColumn;
  lastStartWidth: number;
  nextColumn: TableColumn;
  nextStartWidth: number;
  setWidth: SetColumnWidth;
  startWidth: number;
}

/**
 * `'preserve-table-width'`: the table keeps its total width. The width the
 * dragged column gains or loses is taken from (or given to) the last column
 * first, within its min/max, and the overflow from the adjacent column.
 */
function createPreserveTableWidthMove({
  column,
  lastColumn,
  lastStartWidth,
  nextColumn,
  nextStartWidth,
  setWidth,
  startWidth,
}: PreserveTableWidthMoveOptions): ResizeMoveHandler {
  // When resizing the second-to-last column, nextColumn === lastColumn:
  // collapse to plain adjacent compensation to avoid double-writing a key.
  const isAdjacentToLast = nextColumn.key === lastColumn.key;
  // Slack the last column can absorb (signed against `diff`):
  // - positive `diff` shrinks last → capped by lastShrinkBudget
  // - negative `diff` grows last → capped by lastGrowBudget
  const lastShrinkBudget = lastStartWidth - (lastColumn.minWidth ?? 0);
  const lastGrowBudget =
    lastColumn.maxWidth !== undefined
      ? lastColumn.maxWidth - lastStartWidth
      : Infinity;

  return (diff) => {
    const newWidth = startWidth + diff;

    if (!isWithinBounds(newWidth, column.minWidth, column.maxWidth)) {
      return false;
    }

    const toLast = isAdjacentToLast
      ? 0
      : diff >= 0
        ? Math.min(diff, lastShrinkBudget)
        : Math.max(diff, -lastGrowBudget);
    // Always write N+1 too — when the overflow returns to 0 on the return
    // drag, this restores N+1 to its start width (LIFO donor restoration).
    const newNextWidth = nextStartWidth - (diff - toLast);

    if (
      !isWithinBounds(newNextWidth, nextColumn.minWidth, nextColumn.maxWidth)
    ) {
      return false;
    }

    setWidth(column.key, newWidth);

    if (!isAdjacentToLast) {
      setWidth(lastColumn.key, lastStartWidth - toLast);
    }

    setWidth(nextColumn.key, newNextWidth);

    return true;
  };
}

/**
 * TableResizeHandle provides column resizing functionality.
 * With `resizeStrategy='preserve-table-width'` (default) the table keeps its
 * total width by borrowing from the last column, then the adjacent column;
 * with `'grow-table'` only the dragged column changes and the table widens.
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
    resizeStrategy = 'preserve-table-width',
    scrollContainerRef,
    selection,
  } = useTableContext();
  const { columns } = useTableDataContext();
  const {
    commitResizedColumnWidths,
    discardResizedColumnWidths,
    setResizedColumnWidth,
  } = columnState || {};
  const isGrowTable = resizeStrategy === 'grow-table';

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
      const colElements = scrollContainerRef?.current?.querySelectorAll(
        'table > colgroup > col',
      );
      const targetCol = colElements?.[actionColumnsOffset + colIndex];

      return targetCol ? targetCol.getBoundingClientRect().width : 0;
    },
    [actionColumnsOffset, scrollContainerRef],
  );

  // Builds the move handler of the active strategy (null = cannot resize)
  const createMoveHandler = useCallback((): ResizeMoveHandler | null => {
    const setWidth: SetColumnWidth = (key, width) =>
      setResizedColumnWidth?.(key, width);
    const startWidth = getColumnActualWidth(columnIndex);

    if (startWidth === 0) return null;

    if (isGrowTable) {
      return createGrowTableMove({ column, setWidth, startWidth });
    }

    const nextColumn = columns[columnIndex + 1];
    const lastColumnIndex = columns.length - 1;

    if (!nextColumn) return null;

    const nextStartWidth = getColumnActualWidth(columnIndex + 1);
    const lastStartWidth =
      columnIndex + 1 === lastColumnIndex
        ? nextStartWidth
        : getColumnActualWidth(lastColumnIndex);

    if (nextStartWidth === 0 || lastStartWidth === 0) return null;

    return createPreserveTableWidthMove({
      column,
      lastColumn: columns[lastColumnIndex],
      lastStartWidth,
      nextColumn,
      nextStartWidth,
      setWidth,
      startWidth,
    });
  }, [
    column,
    columnIndex,
    columns,
    getColumnActualWidth,
    isGrowTable,
    setResizedColumnWidth,
  ]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const applyMove = createMoveHandler();

      if (!applyMove) return;

      const startX = event.clientX;
      // Net drag distance last written to the widths; 0 means no visible change
      let appliedDiff = 0;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startX;

        if (applyMove(diff)) appliedDiff = diff;
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
    [commitResizedColumnWidths, createMoveHandler, discardResizedColumnWidths],
  );

  // Preserving the table width needs a column to the right to borrow from;
  // growing the table does not, so the last column keeps its handle.
  if (!isGrowTable && columnIndex >= columns.length - 1) {
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
