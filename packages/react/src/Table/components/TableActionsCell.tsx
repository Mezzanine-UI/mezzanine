'use client';

import { forwardRef, memo, useMemo } from 'react';
import {
  getCellAlignClass,
  tableClasses as classes,
  type TableActionsBase,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import { cx } from '../../utils/cx';
import { useTableContext } from '../TableContext';
import Button from '../../Button';
import ButtonGroup from '../../Button/ButtonGroup';

export interface TableActionsCellProps<
  T extends TableDataSource = TableDataSource,
> {
  /** Actions configuration */
  actions: TableActionsBase<T>;
  /** Custom class name */
  className?: string;
  /** Column index for highlight calculation */
  columnIndex: number;
  /** Fixed position */
  fixed?: 'end' | 'start';
  /** Fixed offset */
  fixedOffset?: number;
  /** Row record */
  record: T;
  /** Row index */
  rowIndex: number;
  /** Whether to show shadow */
  showShadow?: boolean;
  /** Cell style */
  style?: React.CSSProperties;
  /** Explicit width for dragging state */
  width?: number;
}

const TableActionsCellInner = forwardRef<
  HTMLTableCellElement,
  TableActionsCellProps
>(function TableActionsCell(props, ref) {
  const {
    actions,
    className,
    columnIndex,
    fixed,
    fixedOffset = 0,
    record,
    rowIndex,
    showShadow = false,
    style,
    width,
  } = props;

  const { highlight, loading } = useTableContext();

  const actionItems = useMemo(
    () => actions.render(record, rowIndex),
    [actions, record, rowIndex],
  );

  const cellStyle = useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = { ...style };

    if (width !== undefined) {
      baseStyle.width = width;
      baseStyle.minWidth = width;
      baseStyle.maxWidth = width;
      baseStyle.flexShrink = 0;
    }

    if (fixed === 'start') {
      (baseStyle as Record<string, string>)['--fixed-start-offset'] =
        `${fixedOffset}px`;
    } else if (fixed === 'end') {
      (baseStyle as Record<string, string>)['--fixed-end-offset'] =
        `${fixedOffset}px`;
    }

    return baseStyle;
  }, [style, fixed, fixedOffset, width]);

  const alignClass = getCellAlignClass(actions.align ?? 'end');

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

  const handleMouseEnter = () => {
    highlight?.setHoveredCell(rowIndex, columnIndex);
  };

  if (loading) {
    return (
      <td
        className={cx(
          classes.cell,
          {
            [classes.cellFixed]: !!fixed,
            [classes.cellFixedEnd]: fixed === 'end',
            [classes.cellFixedShadow]: showShadow,
            [classes.cellFixedStart]: fixed === 'start',
            [classes.cellHighlight]: isCellHighlighted,
          },
          className,
        )}
        onMouseEnter={handleMouseEnter}
        ref={ref}
        style={cellStyle}
      />
    );
  }

  return (
    <td
      className={cx(
        classes.cell,
        {
          [classes.cellFixed]: !!fixed,
          [classes.cellFixedEnd]: fixed === 'end',
          [classes.cellFixedShadow]: showShadow,
          [classes.cellFixedStart]: fixed === 'start',
          [classes.cellHighlight]: isCellHighlighted,
        },
        className,
      )}
      onMouseEnter={handleMouseEnter}
      ref={ref}
      style={cellStyle}
    >
      <div className={cx(classes.cellContent, alignClass)}>
        <ButtonGroup size="sub" variant={actions.variant}>
          {actionItems.map((item) => {
            const isDisabled = item.disabled?.(record) ?? false;

            return (
              <Button
                disabled={isDisabled}
                icon={item.icon}
                key={`${item.name || 'name'}-${item.icon?.src?.name || 'icon'}-${rowIndex}`}
                onClick={() => item.onClick(record, rowIndex)}
                type="button"
                variant={item.variant}
              >
                {item.name}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>
    </td>
  );
});

export const TableActionsCell = memo(
  TableActionsCellInner,
) as typeof TableActionsCellInner;
