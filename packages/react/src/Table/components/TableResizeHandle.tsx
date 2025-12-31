'use client';

import { memo, useCallback, useRef } from 'react';
import {
  tableClasses as classes,
  type TableColumn,
} from '@mezzanine-ui/core/table';
import { useTableContext } from '../TableContext';

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
    columns,
    draggable,
    expansion,
    scrollContainerRef,
    selection,
  } = useTableContext();
  const { setResizedColumnWidth } = columnState || {};

  const startWidthRef = useRef(0);
  const nextStartWidthRef = useRef(0);
  const startXRef = useRef(0);

  // Calculate action columns offset
  const actionColumnsOffset = (() => {
    let offset = 0;

    if (draggable?.enabled) offset += 1;
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

      // Get the actual rendered widths from the DOM
      const currentWidth = getColumnActualWidth(columnIndex);
      const nextWidth = getColumnActualWidth(columnIndex + 1);

      if (currentWidth === 0 || nextWidth === 0) {
        return;
      }

      startXRef.current = event.clientX;
      startWidthRef.current = currentWidth;
      nextStartWidthRef.current = nextWidth;

      // Get min/max constraints (undefined means no constraint)
      const minWidth = column.minWidth;
      const maxWidth = column.maxWidth;
      const nextMinWidth = nextColumn.minWidth;
      const nextMaxWidth = nextColumn.maxWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startXRef.current;

        // Calculate desired new widths
        const newWidth = startWidthRef.current + diff;
        const newNextWidth = nextStartWidthRef.current - diff;

        // Check if either column would hit its constraint
        let isConstrained = false;

        // Check current column constraints
        if (minWidth !== undefined && newWidth < minWidth) {
          isConstrained = true;
        }

        if (maxWidth !== undefined && newWidth > maxWidth) {
          isConstrained = true;
        }

        // Check next column constraints
        if (nextMinWidth !== undefined && newNextWidth < nextMinWidth) {
          isConstrained = true;
        }

        if (nextMaxWidth !== undefined && newNextWidth > nextMaxWidth) {
          isConstrained = true;
        }

        // If either column is constrained, stop both from changing
        if (isConstrained) {
          return;
        }

        // Final validation: ensure we don't go below 0
        if (newWidth < 0 || newNextWidth < 0) {
          return;
        }

        setResizedColumnWidth?.(column.key, newWidth);
        setResizedColumnWidth?.(nextColumn.key, newNextWidth);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [column, columnIndex, columns, getColumnActualWidth, setResizedColumnWidth],
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
