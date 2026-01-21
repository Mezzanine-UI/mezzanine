'use client';

import { forwardRef, memo, useCallback } from 'react';
import {
  getRowKey,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import {
  DotDragVerticalIcon,
  PinFilledIcon,
  PinIcon,
} from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Icon from '../../Icon';
import Skeleton from '../../Skeleton';
import { useTableContext } from '../TableContext';

export interface TableDragOrPinHandleCellProps<
  T extends TableDataSource = TableDataSource,
> {
  className?: string;
  dragHandleProps?: Record<string, unknown>;
  fixed?: boolean;
  fixedOffset?: number;
  isHeader?: boolean;
  /** The mode of this cell: 'drag' for drag handle, 'pin' for pin handle */
  mode: 'drag' | 'pin';
  /** Row record - required when mode is 'pin' and isHeader is false */
  record?: T;
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}

function TableDragOrPinHandleCellInner<
  T extends TableDataSource = TableDataSource,
>(
  props: TableDragOrPinHandleCellProps<T>,
  ref: React.ForwardedRef<HTMLTableCellElement>,
) {
  const { loading, pinnable } = useTableContext();
  const {
    className,
    dragHandleProps,
    fixed = false,
    fixedOffset = 0,
    isHeader = false,
    mode,
    record,
    showShadow = false,
    width,
  } = props;

  const CellComponent = isHeader ? 'th' : 'td';

  const cellStyle: React.CSSProperties = {};

  // Apply explicit width for dragging state
  if (width !== undefined) {
    cellStyle.width = width;
    cellStyle.minWidth = width;
    cellStyle.maxWidth = width;
    cellStyle.flexShrink = 0;
  }

  if (fixed) {
    (cellStyle as Record<string, string>)['--fixed-start-offset'] =
      `${fixedOffset}px`;
  }

  const rowKey = record ? getRowKey(record) : '';
  const isPinned = pinnable?.pinnedRowKeys.includes(rowKey) ?? false;

  const handlePinClick = useCallback(() => {
    if (!pinnable || !record) return;

    pinnable.onPinChange(record, !isPinned);
  }, [isPinned, pinnable, record]);

  const renderChild = () => {
    if (isHeader) {
      // Header cell is always empty
      return null;
    }

    if (loading) {
      return <Skeleton variant="body-highlight" width="100%" />;
    }

    if (mode === 'drag') {
      return (
        <span className={classes.dragOrPinHandle} {...dragHandleProps}>
          <Icon color="neutral" icon={DotDragVerticalIcon} />
        </span>
      );
    }

    // Pin mode
    return (
      <button
        aria-label={isPinned ? 'Unpin row' : 'Pin row'}
        aria-pressed={isPinned}
        className={cx(classes.dragOrPinHandle, classes.pinHandleIcon)}
        onClick={handlePinClick}
        type="button"
      >
        <Icon
          color={isPinned ? 'brand' : 'neutral'}
          icon={isPinned ? PinFilledIcon : PinIcon}
        />
      </button>
    );
  };

  return (
    <CellComponent
      className={cx(
        isHeader ? classes.headerCell : classes.cell,
        classes.dragOrPinHandleCell,
        {
          [classes.cellFixed]: fixed,
          [classes.cellFixedStart]: fixed,
          [classes.cellFixedShadow]: showShadow,
        },
        className,
      )}
      ref={ref}
      scope={isHeader ? 'col' : undefined}
      style={cellStyle}
    >
      {renderChild()}
    </CellComponent>
  );
}

const ForwardedTableDragOrPinHandleCell = forwardRef(
  TableDragOrPinHandleCellInner,
) as <T extends TableDataSource = TableDataSource>(
  props: TableDragOrPinHandleCellProps<T> & {
    ref?: React.ForwardedRef<HTMLTableCellElement>;
  },
) => React.ReactElement;

export const TableDragOrPinHandleCell = memo(
  ForwardedTableDragOrPinHandleCell,
) as typeof ForwardedTableDragOrPinHandleCell;
