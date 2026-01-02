'use client';

import { forwardRef, memo, useCallback, useMemo } from 'react';
import {
  DRAG_HANDLE_COLUMN_WIDTH,
  DRAG_HANDLE_KEY,
  EXPANSION_COLUMN_WIDTH,
  EXPANSION_KEY,
  getRowKey,
  SELECTION_COLUMN_WIDTH,
  SELECTION_KEY,
  tableClasses as classes,
  type FixedType,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import { calculateColumnWidths } from '../utils/calculateColumnWidths';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { cx } from '../../utils/cx';
import { useTableContext, useTableSuperContext } from '../TableContext';
import { TableCell } from './TableCell';
import { TableDragHandleCell } from './TableDragHandleCell';
import { TableExpandCell } from './TableExpandCell';
import { TableSelectionCell } from './TableSelectionCell';
import { composeRefs } from '../../utils/composeRefs';

export interface TableRowProps<T extends TableDataSource = TableDataSource> {
  className?: string;
  draggableProvided?: DraggableProvided;
  record: T;
  rowIndex: number;
  style?: React.CSSProperties;
}

const parseFixed = (fixed: FixedType | undefined): 'end' | 'start' | null => {
  if (fixed === true || fixed === 'start') return 'start';
  if (fixed === 'end') return 'end';

  return null;
};

const TableRowInner = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(props, ref) {
    const { className, draggableProvided, record, rowIndex, style } = props;

    const {
      columns,
      draggable,
      expansion,
      fixedOffsets,
      rowHeight,
      highlight,
      selection,
      transitionState,
    } = useTableContext();

    const isDragging = useMemo(
      () =>
        (draggableProvided?.draggableProps.style as React.CSSProperties)
          ?.position === 'fixed',
      [draggableProvided?.draggableProps.style],
    );

    const resolvedStyle = useMemo(
      () => ({
        ...style,
        ...draggableProvided?.draggableProps.style,
        height: rowHeight,
      }),
      [style, rowHeight, draggableProvided?.draggableProps.style],
    );

    const { containerWidth, getResizedColumnWidth, scrollLeft } =
      useTableSuperContext();

    const rowKey = useMemo(() => getRowKey(record), [record]);
    const isSelected =
      selection?.config?.getCheckboxProps?.(record)?.selected ??
      selection?.isRowSelected(rowKey) ??
      false;
    const isIndeterminate =
      selection?.config?.getCheckboxProps?.(record)?.indeterminate ?? false;
    const isExpanded = expansion?.isRowExpanded(rowKey) ?? false;

    // Check transition states
    const isAdding = transitionState?.addingKeys.has(rowKey) ?? false;
    const isDeleting = transitionState?.deletingKeys.has(rowKey) ?? false;
    const isFadingOut = transitionState?.fadingOutKeys.has(rowKey) ?? false;

    // Calculate column widths when dragging (since position: fixed breaks colgroup)
    const draggingColumnWidths = useMemo(() => {
      if (!isDragging || !containerWidth) return null;

      // Calculate action columns total width
      let actionColumnsWidth = 0;

      if (draggable?.enabled) actionColumnsWidth += DRAG_HANDLE_COLUMN_WIDTH;
      if (selection) actionColumnsWidth += SELECTION_COLUMN_WIDTH;
      if (expansion) actionColumnsWidth += EXPANSION_COLUMN_WIDTH;

      return calculateColumnWidths({
        actionColumnsWidth,
        columns,
        containerWidth,
        getResizedColumnWidth,
      });
    }, [
      isDragging,
      containerWidth,
      columns,
      draggable?.enabled,
      expansion,
      getResizedColumnWidth,
      selection,
    ]);

    // Check if this row should be highlighted based on highlight mode
    const isRowHighlighted = useMemo(() => {
      if (!highlight) return false;

      const { mode, rowIndex: hoveredRow } = highlight;

      if (hoveredRow === null) return false;

      // Row highlight: when hovering any cell in this row
      if (mode === 'row' && hoveredRow === rowIndex) return true;

      // Cross highlight: this row matches the hovered row
      if (mode === 'cross' && hoveredRow === rowIndex) return true;

      return false;
    }, [highlight, rowIndex]);

    const handleMouseLeave = useCallback(() => {
      highlight?.setHoveredCell(null, null);
    }, [highlight]);

    const renderDragHandleCell = () => {
      if (!draggable?.enabled) return null;

      const offsetInfo = fixedOffsets?.getDragHandleOffset();
      const isFixed = !!draggable.fixed;
      const showShadow =
        isFixed &&
        fixedOffsets?.shouldShowShadow(
          DRAG_HANDLE_KEY,
          scrollLeft ?? 0,
          containerWidth ?? 0,
        );

      return (
        <TableDragHandleCell
          dragHandleProps={
            draggableProvided?.dragHandleProps as
              | Record<string, unknown>
              | undefined
          }
          fixed={isFixed}
          fixedOffset={offsetInfo?.offset ?? 0}
          showShadow={showShadow ?? false}
          width={isDragging ? DRAG_HANDLE_COLUMN_WIDTH : undefined}
        />
      );
    };

    const renderSelectionCell = () => {
      if (!selection) return null;

      const isDisabled = selection.isRowDisabled(record);
      const offsetInfo = fixedOffsets?.getSelectionOffset();
      const isFixed = !!selection.config?.fixed;
      const showShadow =
        isFixed &&
        fixedOffsets?.shouldShowShadow(
          SELECTION_KEY,
          scrollLeft ?? 0,
          containerWidth ?? 0,
        );

      return (
        <TableSelectionCell
          disabled={isDisabled}
          fixed={isFixed}
          fixedOffset={offsetInfo?.offset ?? 0}
          indeterminate={isIndeterminate}
          onChange={() => selection.toggleRow(rowKey, record)}
          selected={isSelected}
          showShadow={showShadow ?? false}
          width={isDragging ? SELECTION_COLUMN_WIDTH : undefined}
        />
      );
    };

    const renderExpandCell = () => {
      if (!expansion) return null;

      const { config } = expansion;
      const canExpand = config.rowExpandable
        ? config.rowExpandable(record)
        : true;
      const offsetInfo = fixedOffsets?.getExpansionOffset();
      const isFixed = !!config.fixed;
      const showShadow =
        isFixed &&
        fixedOffsets?.shouldShowShadow(
          EXPANSION_KEY,
          scrollLeft ?? 0,
          containerWidth ?? 0,
        );

      return (
        <TableExpandCell
          canExpand={canExpand}
          expanded={isExpanded}
          fixed={isFixed}
          fixedOffset={offsetInfo?.offset ?? 0}
          onClick={() => expansion.toggleExpand(rowKey, record)}
          showShadow={showShadow ?? false}
          width={isDragging ? EXPANSION_COLUMN_WIDTH : undefined}
        />
      );
    };

    const renderCells = () => {
      return columns.map((column, columnIndex) => {
        const fixedPos = parseFixed(column.fixed);
        const offsetInfo = fixedOffsets?.getColumnOffset(column.key);
        const offset = offsetInfo?.offset ?? 0;
        // Show shadow based on scroll position and sticky state
        const showShadow =
          !!fixedPos &&
          fixedOffsets?.shouldShowShadow(
            column.key,
            scrollLeft ?? 0,
            containerWidth ?? 0,
          );

        return (
          <TableCell
            column={column}
            columnIndex={columnIndex}
            fixed={fixedPos ?? undefined}
            fixedOffset={offset}
            key={column.key}
            record={record}
            rowIndex={rowIndex}
            showShadow={showShadow ?? false}
            width={draggingColumnWidths?.get(column.key)}
          />
        );
      });
    };

    // Combine refs if draggable is provided
    const rowRef = draggableProvided
      ? composeRefs([ref, draggableProvided.innerRef])
      : ref;

    return (
      <tr
        aria-rowindex={rowIndex + 1}
        aria-selected={isSelected}
        className={cx(
          classes.bodyRow,
          {
            [classes.bodyRowAdding]: isAdding,
            [classes.bodyRowDeleting]: isDeleting,
            [classes.bodyRowFadingOut]: isFadingOut,
            [classes.bodyRowHighlight]: isRowHighlighted,
            [classes.bodyRowSelected]: isSelected,
            [classes.bodyRowDragging]: isDragging,
          },
          className,
        )}
        data-index={rowIndex}
        data-row-key={rowKey}
        onMouseLeave={handleMouseLeave}
        ref={rowRef}
        tabIndex={0}
        {...draggableProvided?.draggableProps}
        style={resolvedStyle}
      >
        {renderDragHandleCell()}
        {renderExpandCell()}
        {renderSelectionCell()}
        {renderCells()}
      </tr>
    );
  },
);

export const TableRow = memo(TableRowInner) as typeof TableRowInner;
