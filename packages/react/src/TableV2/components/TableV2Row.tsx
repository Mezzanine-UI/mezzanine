'use client';

import { forwardRef, memo, useCallback, useMemo } from 'react';
import {
  DRAG_HANDLE_KEY,
  EXPANSION_KEY,
  getRowKey,
  SELECTION_KEY,
  tableV2Classes,
  type FixedType,
  type TableV2DataSource,
} from '@mezzanine-ui/core/tableV2';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { cx } from '../../utils/cx';
import { useTableV2Context, useTableV2SuperContext } from '../TableV2Context';
import { TableV2Cell } from './TableV2Cell';
import { TableV2DragHandleCell } from './TableV2DragHandleCell';
import { TableV2ExpandCell } from './TableV2ExpandCell';
import { TableV2SelectionCell } from './TableV2SelectionCell';
import { composeRefs } from '../../utils/composeRefs';

export interface TableV2RowProps<
  T extends TableV2DataSource = TableV2DataSource,
> {
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

const TableV2RowInner = forwardRef<HTMLTableRowElement, TableV2RowProps>(
  function TableV2Row(props, ref) {
    const { className, draggableProvided, record, rowIndex, style } = props;

    const {
      columns,
      draggable,
      expansion,
      fixedOffsets,
      highlight,
      selection,
    } = useTableV2Context();

    const { containerWidth, scrollLeft } = useTableV2SuperContext();

    const rowKey = useMemo(() => getRowKey(record), [record]);
    const isSelected = selection?.isRowSelected(rowKey) ?? false;
    const isExpanded = expansion?.isRowExpanded(rowKey) ?? false;

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

    const handleRowClick = useCallback(() => {
      // Future: support row click to expand or select
    }, []);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleRowClick();
        }
      },
      [handleRowClick],
    );

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
        <TableV2DragHandleCell
          dragHandleProps={
            draggableProvided?.dragHandleProps as
              | Record<string, unknown>
              | undefined
          }
          fixed={isFixed}
          fixedOffset={offsetInfo?.offset ?? 0}
          showShadow={showShadow ?? false}
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
        <TableV2SelectionCell
          disabled={isDisabled}
          fixed={isFixed}
          fixedOffset={offsetInfo?.offset ?? 0}
          indeterminate={false}
          onChange={() => selection.toggleRow(rowKey, record)}
          selected={isSelected}
          showShadow={showShadow ?? false}
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
        <TableV2ExpandCell
          canExpand={canExpand}
          expanded={isExpanded}
          fixed={isFixed}
          fixedOffset={offsetInfo?.offset ?? 0}
          onClick={() => expansion.toggleExpand(rowKey, record)}
          showShadow={showShadow ?? false}
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
          <TableV2Cell
            column={column}
            columnIndex={columnIndex}
            fixed={fixedPos ?? undefined}
            fixedOffset={offset}
            key={column.key}
            record={record}
            rowIndex={rowIndex}
            showShadow={showShadow ?? false}
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
          tableV2Classes.row,
          {
            [tableV2Classes.bodyRowHighlight]: isRowHighlighted,
            [tableV2Classes.rowExpanded]: isExpanded,
            [tableV2Classes.rowSelected]: isSelected,
          },
          className,
        )}
        data-index={rowIndex}
        data-row-key={rowKey}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        onMouseLeave={handleMouseLeave}
        ref={rowRef}
        style={style}
        tabIndex={0}
        {...draggableProvided?.draggableProps}
      >
        {renderDragHandleCell()}
        {renderExpandCell()}
        {renderSelectionCell()}
        {renderCells()}
      </tr>
    );
  },
);

export const TableV2Row = memo(TableV2RowInner) as typeof TableV2RowInner;
