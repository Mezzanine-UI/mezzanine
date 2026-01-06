'use client';

import { forwardRef, memo, useCallback, useMemo, useRef } from 'react';
import {
  getCellAlignClass,
  tableClasses as classes,
  type TableColumn,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import Skeleton from '../../Skeleton';
import { cx } from '../../utils/cx';
import { useTableContext } from '../TableContext';
import Tooltip from '../../Tooltip';

export interface TableCellProps<T extends TableDataSource = TableDataSource> {
  className?: string;
  colSpan?: number;
  column: TableColumn<T>;
  columnIndex: number;
  fixed?: 'end' | 'start';
  fixedOffset?: number;
  record: T;
  rowIndex: number;
  /** Whether to show shadow on this cell (only for edge fixed columns) */
  showShadow?: boolean;
  style?: React.CSSProperties;
  /** Explicit width for dragging state (when position: fixed breaks colgroup) */
  width?: number;
}

const TableCellInner = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(props, ref) {
    const { loading } = useTableContext();
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
      width,
    } = props;

    const { highlight } = useTableContext();

    const cellValue = useMemo(() => {
      const dataIndex = column.dataIndex ?? column.key;

      if (column.render) {
        return column.render(record, rowIndex);
      }

      return record[dataIndex];
    }, [column, record, rowIndex]);

    // Width is managed by colgroup, set fixed position offset via CSS variable
    // When width is provided (dragging state), apply it directly
    const cellStyle = useMemo<React.CSSProperties>(() => {
      const baseStyle: React.CSSProperties = { ...style };

      // Apply explicit width for dragging state
      if (width !== undefined) {
        baseStyle.width = width;
        baseStyle.minWidth = width;
        baseStyle.maxWidth = width;
        baseStyle.flexShrink = 0;
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
    }, [style, fixed, fixedOffset, width]);

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
          return hoveredRow === rowIndex && hoveredColumn === columnIndex;
        case 'column':
          return hoveredColumn === columnIndex;
        case 'cross':
          return hoveredColumn === columnIndex;
        case 'row':
        default:
          return false;
      }
    }, [highlight, rowIndex, columnIndex]);

    const handleMouseEnter = useCallback(() => {
      highlight?.setHoveredCell(rowIndex, columnIndex);
    }, [highlight, rowIndex, columnIndex]);

    /** Feature: Ellipsis */
    const ellipsisRef = useRef<HTMLDivElement>(null);
    // default to true if undefined
    const isColumnEllipsis = column.ellipsis ?? true;

    const renderChild = () => {
      if (loading) {
        return <Skeleton width="100%" variant="body-highlight" />;
      }

      if (isColumnEllipsis) {
        return (
          <Tooltip
            anchor={ellipsisRef}
            title={cellValue as React.ReactNode}
            options={{
              placement: 'top-start',
            }}
          >
            {({ onMouseEnter, onMouseLeave }) => (
              <div
                ref={ellipsisRef}
                className={cx(classes.cellContent, {
                  [classes.cellEllipsis]: isColumnEllipsis,
                })}
                onMouseEnter={(e) => {
                  if (ellipsisRef.current) {
                    const { current: el } = ellipsisRef;

                    const isOverflow = el.scrollWidth > el.offsetWidth;

                    if (isOverflow) onMouseEnter(e);
                  }
                }}
                onMouseLeave={onMouseLeave}
              >
                {cellValue as React.ReactNode}
              </div>
            )}
          </Tooltip>
        );
      }

      return (
        <div className={classes.cellContent}>
          {cellValue as React.ReactNode}
        </div>
      );
    };

    return (
      <td
        className={cx(
          classes.cell,
          alignClass,
          {
            [classes.cellFixed]: !!fixed,
            [classes.cellFixedEnd]: fixed === 'end',
            [classes.cellFixedShadow]: showShadow,
            [classes.cellFixedStart]: fixed === 'start',
            [classes.cellHighlight]: isCellHighlighted,
          },
          className,
        )}
        colSpan={colSpan > 1 ? colSpan : undefined}
        onMouseEnter={handleMouseEnter}
        ref={ref}
        style={cellStyle}
      >
        {renderChild()}
      </td>
    );
  },
);

export const TableCell = memo(TableCellInner) as typeof TableCellInner;
