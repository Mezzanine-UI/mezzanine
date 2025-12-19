'use client';

import { forwardRef, memo, useCallback, useMemo } from 'react';
import {
  getCellAlignClass,
  tableV2Classes,
  type TableV2Column,
  type TableV2DataSource,
} from '@mezzanine-ui/core/tableV2';
import { cx } from '../../utils/cx';
import { useTableV2Context } from '../TableV2Context';

export interface TableV2CellProps<
  T extends TableV2DataSource = TableV2DataSource,
> {
  className?: string;
  colSpan?: number;
  column: TableV2Column<T>;
  columnIndex: number;
  fixed?: 'end' | 'start';
  fixedOffset?: number;
  record: T;
  rowIndex: number;
  /** Whether to show shadow on this cell (only for edge fixed columns) */
  showShadow?: boolean;
  style?: React.CSSProperties;
}

const TableV2CellInner = forwardRef<HTMLTableCellElement, TableV2CellProps>(
  function TableV2Cell(props, ref) {
    const {
      className,
      colSpan = 1,
      column,
      columnIndex,
      fixed,
      fixedOffset = 0,
      record,
      rowIndex,
      showShadow = false,
      style,
    } = props;

    const { highlight } = useTableV2Context();

    const cellValue = useMemo(() => {
      const dataIndex = column.dataIndex ?? column.key;

      if (column.render) {
        return column.render(record[dataIndex], record, rowIndex);
      }

      return record[dataIndex];
    }, [column, record, rowIndex]);

    // Width is managed by colgroup, set fixed position offset via CSS variable
    const cellStyle = useMemo<React.CSSProperties>(() => {
      const baseStyle: React.CSSProperties = { ...style };

      if (column.ellipsis) {
        baseStyle.overflow = 'hidden';
        baseStyle.textOverflow = 'ellipsis';
        baseStyle.whiteSpace = 'nowrap';
      }

      // Set CSS variable for fixed column positioning
      if (fixed === 'start') {
        (baseStyle as Record<string, string>)['--fixed-start-offset'] =
          `${fixedOffset}px`;
      } else if (fixed === 'end') {
        (baseStyle as Record<string, string>)['--fixed-end-offset'] =
          `${fixedOffset}px`;
      }

      return baseStyle;
    }, [style, column.ellipsis, fixed, fixedOffset]);

    const alignClass = getCellAlignClass(column.align);

    // Check if this cell should be highlighted based on highlight mode
    const isCellHighlighted = useMemo(() => {
      if (!highlight) return false;

      const {
        columnIndex: hoveredColumn,
        mode,
        rowIndex: hoveredRow,
      } = highlight;

      if (hoveredRow === null || hoveredColumn === null) return false;

      switch (mode) {
        case 'cell':
          // Only highlight the exact cell being hovered
          return hoveredRow === rowIndex && hoveredColumn === columnIndex;
        case 'column':
          // Highlight all cells in the same column
          return hoveredColumn === columnIndex;
        case 'cross':
          // Highlight cells in same row OR same column (but row highlight is handled by TableV2Row)
          // Here we only handle column highlight for cross mode
          return hoveredColumn === columnIndex;
        case 'row':
        default:
          // Row highlight is handled by TableV2Row, not individual cells
          return false;
      }
    }, [highlight, rowIndex, columnIndex]);

    const handleMouseEnter = useCallback(() => {
      highlight?.setHoveredCell(rowIndex, columnIndex);
    }, [highlight, rowIndex, columnIndex]);

    return (
      <td
        className={cx(
          tableV2Classes.cell,
          alignClass,
          {
            [tableV2Classes.cellEllipsis]: column.ellipsis,
            [tableV2Classes.cellFixed]: !!fixed,
            [tableV2Classes.cellFixedEnd]: fixed === 'end',
            [tableV2Classes.cellFixedShadow]: showShadow,
            [tableV2Classes.cellFixedStart]: fixed === 'start',
            [tableV2Classes.cellHighlight]: isCellHighlighted,
          },
          column.className,
          className,
        )}
        colSpan={colSpan > 1 ? colSpan : undefined}
        onMouseEnter={handleMouseEnter}
        ref={ref}
        style={cellStyle}
      >
        <span className={tableV2Classes.cellContent}>
          {cellValue as React.ReactNode}
        </span>
      </td>
    );
  },
);

export const TableV2Cell = memo(TableV2CellInner) as typeof TableV2CellInner;
