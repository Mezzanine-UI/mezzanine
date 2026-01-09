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
} from '@mezzanine-ui/core/table';
import {
  useTableContext,
  useTableDataContext,
  useTableSuperContext,
} from '../TableContext';
import {
  shouldCalculateWidths,
  calculateColumnWidths,
} from '../utils/calculateColumnWidths';

export interface TableColGroupProps {
  className?: string;
}

const TableColGroupInner = memo(function TableColGroup(
  props: TableColGroupProps,
) {
  const { className } = props;

  const {
    columnState,
    draggable,
    expansion,
    isInsideExpandedContentArea,
    selection,
  } = useTableContext();
  const { columns } = useTableDataContext();
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

    return calculateColumnWidths({
      actionColumnsWidth,
      columns,
      containerWidth: containerWidth ?? 0,
      getResizedColumnWidth,
    });
  }, [
    enableWidthCalculation,
    columns,
    containerWidth,
    actionColumnsWidth,
    getResizedColumnWidth,
  ]);

  const renderCols = () => {
    const cols: React.ReactNode[] = [];

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
