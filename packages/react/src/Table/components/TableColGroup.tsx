'use client';

import { memo, useMemo } from 'react';
import {
  DRAG_HANDLE_COLUMN_WIDTH,
  DRAG_HANDLE_KEY,
  EXPANSION_COLUMN_WIDTH,
  EXPANSION_KEY,
  SELECTION_COLUMN_WIDTH,
  SELECTION_KEY,
  tableClasses as classes,
  type TableColumn,
} from '@mezzanine-ui/core/table';
import { useTableContext, useTableSuperContext } from '../TableContext';

/**
 * Check if width calculation should be applied.
 * Only calculate explicit widths for root tables (not nested).
 * Nested tables should let columns use natural CSS behavior.
 */
function shouldCalculateWidths(
  isNestedTable: boolean,
  containerWidth: number | undefined,
): boolean {
  // Don't calculate widths for nested tables - they inherit parent's context
  // and should use natural CSS column sizing
  if (isNestedTable) {
    return false;
  }

  // Don't calculate if container width is not available
  if (!containerWidth || containerWidth <= 0) {
    return false;
  }

  return true;
}

export interface TableColGroupProps {
  className?: string;
}

/**
 * Calculate the resolved width for each column.
 * - Columns with explicit width use that value
 * - Columns without width share the remaining space equally (simulating flex: 1)
 * - All widths are clamped to minWidth/maxWidth if specified
 */
function calculateColumnWidths(
  columns: TableColumn[],
  containerWidth: number,
  actionColumnsWidth: number,
  getResizedColumnWidth?: (key: string) => number | undefined,
): Map<string, number> {
  const widthMap = new Map<string, number>();

  // If container width is not available yet, return empty map
  if (containerWidth <= 0) {
    return widthMap;
  }

  // Available width for data columns
  const availableWidth = containerWidth - actionColumnsWidth;

  if (availableWidth <= 0) {
    return widthMap;
  }

  // First pass: identify columns with explicit width and calculate total fixed width
  let totalFixedWidth = 0;
  const flexColumns: TableColumn[] = [];

  columns.forEach((column) => {
    const resizedWidth = getResizedColumnWidth?.(column.key);

    if (resizedWidth !== undefined) {
      // Column has been resized, use that width
      widthMap.set(column.key, resizedWidth);
      totalFixedWidth += resizedWidth;
    } else if (column.width !== undefined) {
      // Column has explicit width
      const width = clampWidth(column.width, column.minWidth, column.maxWidth);

      widthMap.set(column.key, width);
      totalFixedWidth += width;
    } else {
      // Column needs flex width calculation
      flexColumns.push(column);
    }
  });

  // Second pass: distribute remaining width to flex columns
  if (flexColumns.length > 0) {
    const remainingWidth = availableWidth - totalFixedWidth;

    // Calculate flex widths while respecting min/max constraints
    // This may require multiple iterations if constraints cause redistribution
    let iterationCount = 0;
    const maxIterations = flexColumns.length + 1;
    let unallocatedWidth = remainingWidth;
    const pendingColumns = [...flexColumns];
    const allocatedColumns: TableColumn[] = [];

    while (pendingColumns.length > 0 && iterationCount < maxIterations) {
      iterationCount += 1;
      const flexWidth = unallocatedWidth / pendingColumns.length;
      const stillPending: TableColumn[] = [];

      pendingColumns.forEach((column) => {
        const clampedWidth = clampWidth(
          flexWidth,
          column.minWidth,
          column.maxWidth,
        );

        if (clampedWidth !== flexWidth) {
          // Width was clamped, allocate this column and redistribute
          widthMap.set(column.key, clampedWidth);
          unallocatedWidth -= clampedWidth;
          allocatedColumns.push(column);
        } else {
          stillPending.push(column);
        }
      });

      // If no columns were allocated in this iteration, allocate all remaining
      if (stillPending.length === pendingColumns.length) {
        stillPending.forEach((column) => {
          const finalWidth = Math.max(
            0,
            unallocatedWidth / stillPending.length,
          );

          widthMap.set(column.key, finalWidth);
        });
        break;
      }

      pendingColumns.length = 0;
      pendingColumns.push(...stillPending);
    }
  }

  return widthMap;
}

/**
 * Clamp a width value between min and max bounds
 */
function clampWidth(
  width: number,
  minWidth?: number,
  maxWidth?: number,
): number {
  let result = width;

  if (minWidth !== undefined && result < minWidth) {
    result = minWidth;
  }

  if (maxWidth !== undefined && result > maxWidth) {
    result = maxWidth;
  }

  return result;
}

const TableColGroupInner = memo(function TableColGroup(
  props: TableColGroupProps,
) {
  const { className } = props;

  const {
    columnState,
    columns,
    draggable,
    expansion,
    isInsideExpandedContentArea,
    selection,
  } = useTableContext();
  const { containerWidth, getResizedColumnWidth: getParentResizedColumnWidth } =
    useTableSuperContext();

  // For nested tables, use parent's resized widths; for root tables, use own
  const getResizedColumnWidth = isInsideExpandedContentArea
    ? getParentResizedColumnWidth
    : columnState?.getResizedColumnWidth;

  // Check if we should calculate explicit widths
  const enableWidthCalculation = shouldCalculateWidths(
    !!isInsideExpandedContentArea,
    containerWidth,
  );

  // Calculate action columns total width
  const actionColumnsWidth = useMemo(() => {
    let width = 0;

    if (draggable?.enabled) width += DRAG_HANDLE_COLUMN_WIDTH;
    if (selection) width += SELECTION_COLUMN_WIDTH;
    if (expansion) width += EXPANSION_COLUMN_WIDTH;

    return width;
  }, [draggable?.enabled, expansion, selection]);

  // Calculate resolved widths for all columns (only for root tables)
  const resolvedWidths = useMemo(() => {
    if (!enableWidthCalculation) {
      return new Map<string, number>();
    }

    return calculateColumnWidths(
      columns,
      containerWidth ?? 0,
      actionColumnsWidth,
      getResizedColumnWidth,
    );
  }, [
    enableWidthCalculation,
    columns,
    containerWidth,
    actionColumnsWidth,
    getResizedColumnWidth,
  ]);

  const renderCols = () => {
    const cols: React.ReactNode[] = [];

    // Drag handle column (must be first)
    if (draggable?.enabled) {
      cols.push(
        <col
          className={classes.dragHandleCell}
          key={DRAG_HANDLE_KEY}
          style={{
            maxWidth: DRAG_HANDLE_COLUMN_WIDTH,
            minWidth: DRAG_HANDLE_COLUMN_WIDTH,
            width: DRAG_HANDLE_COLUMN_WIDTH,
          }}
        />,
      );
    }

    // Expand column
    if (expansion) {
      cols.push(
        <col
          className={classes.expandCell}
          key={EXPANSION_KEY}
          style={{
            maxWidth: EXPANSION_COLUMN_WIDTH,
            minWidth: EXPANSION_COLUMN_WIDTH,
            width: EXPANSION_COLUMN_WIDTH,
          }}
        />,
      );
    }

    // Selection column
    if (selection) {
      cols.push(
        <col
          className={classes.selectionColumn}
          key={SELECTION_KEY}
          style={{
            maxWidth: SELECTION_COLUMN_WIDTH,
            minWidth: SELECTION_COLUMN_WIDTH,
            width: SELECTION_COLUMN_WIDTH,
          }}
        />,
      );
    }

    // Data columns
    columns.forEach((column) => {
      const style: React.CSSProperties = {};

      // For root tables with width calculation enabled, use resolved widths
      // For nested tables, sync with parent's resized widths
      if (enableWidthCalculation) {
        const resolvedWidth = resolvedWidths.get(column.key);

        if (resolvedWidth !== undefined) {
          style.width = resolvedWidth;
        }
      } else {
        // Nested table: check if parent has resized this column
        const parentResizedWidth =
          getResizedColumnWidth?.(column.key) ?? column.width;

        if (parentResizedWidth !== undefined) {
          style.width = parentResizedWidth;
        }
      }

      if (column.minWidth !== undefined) {
        style.minWidth = column.minWidth;
      }

      if (column.maxWidth !== undefined) {
        style.maxWidth = column.maxWidth;
      }

      cols.push(<col key={column.key} style={style} />);
    });

    return cols;
  };

  return <colgroup className={className}>{renderCols()}</colgroup>;
});

export const TableColGroup = TableColGroupInner;
