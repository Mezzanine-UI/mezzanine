'use client';

import { forwardRef, memo, useCallback } from 'react';
import {
  getRowKey,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import { cx } from '../../utils/cx';
import Toggle from '../../Toggle';
import Skeleton from '../../Skeleton';
import { useTableContext } from '../TableContext';

export interface TableToggleableCellProps<
  T extends TableDataSource = TableDataSource,
> {
  className?: string;
  fixed?: boolean;
  fixedOffset?: number;
  /** Row record - required when isHeader is false */
  record?: T;
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}

function TableToggleableCellInner<T extends TableDataSource = TableDataSource>(
  props: TableToggleableCellProps<T>,
  ref: React.ForwardedRef<HTMLTableCellElement>,
) {
  const { loading, toggleable } = useTableContext();
  const {
    className,
    fixed = false,
    fixedOffset = 0,
    record,
    showShadow = false,
    width,
  } = props;

  const cellStyle: React.CSSProperties = {};

  // Apply explicit width for dragging state
  if (width !== undefined) {
    cellStyle.width = width;
    cellStyle.minWidth = width;
    cellStyle.maxWidth = width;
    cellStyle.flexShrink = 0;
  }

  if (fixed) {
    (cellStyle as Record<string, string>)['--fixed-end-offset'] =
      `${fixedOffset}px`;
  }

  const rowKey = record ? getRowKey(record) : '';
  const isToggled = toggleable?.toggledRowKeys.includes(rowKey) ?? false;
  const isDisabled = record
    ? (toggleable?.isRowDisabled?.(record as T) ?? false)
    : false;

  const handleToggleChange = useCallback(() => {
    if (!toggleable || !record || isDisabled) return;

    toggleable.onToggleChange(record as T, !isToggled);
  }, [isDisabled, isToggled, record, toggleable]);

  const renderChild = () => {
    if (loading) {
      return <Skeleton variant="body-highlight" width="100%" />;
    }

    return (
      <Toggle
        checked={isToggled}
        disabled={isDisabled}
        onChange={handleToggleChange}
        size="sub"
      />
    );
  };

  return (
    <td
      className={cx(
        classes.cell,
        {
          [classes.cellFixed]: fixed,
          [classes.cellFixedEnd]: fixed,
          [classes.cellFixedShadow]: showShadow,
        },
        className,
      )}
      ref={ref}
      style={cellStyle}
    >
      {renderChild()}
    </td>
  );
}

const ForwardedTableToggleableCell = forwardRef(TableToggleableCellInner) as <
  T extends TableDataSource = TableDataSource,
>(
  props: TableToggleableCellProps<T> & {
    ref?: React.ForwardedRef<HTMLTableCellElement>;
  },
) => React.ReactElement;

export const TableToggleableCell = memo(
  ForwardedTableToggleableCell,
) as typeof ForwardedTableToggleableCell;
