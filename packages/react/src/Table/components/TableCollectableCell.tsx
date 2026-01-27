'use client';

import { forwardRef, memo, useCallback } from 'react';
import {
  getRowKey,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Icon from '../../Icon';
import Skeleton from '../../Skeleton';
import { useTableContext } from '../TableContext';

export interface TableCollectableCellProps<
  T extends TableDataSource = TableDataSource,
> {
  className?: string;
  fixed?: boolean;
  fixedOffset?: number;
  isHeader?: boolean;
  /** Row record - required when isHeader is false */
  record?: T;
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}

function TableCollectableCellInner<T extends TableDataSource = TableDataSource>(
  props: TableCollectableCellProps<T>,
  ref: React.ForwardedRef<HTMLTableCellElement>,
) {
  const { collectable, loading } = useTableContext();
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
  const isCollected = collectable?.collectedRowKeys.includes(rowKey) ?? false;
  const isDisabled = record
    ? (collectable?.isRowDisabled?.(record as T) ?? false)
    : false;

  const handleCollectClick = useCallback(() => {
    if (!collectable || !record || isDisabled) return;

    collectable.onCollectChange(record as T, !isCollected);
  }, [collectable, isCollected, isDisabled, record]);

  const renderChild = () => {
    if (loading) {
      return <Skeleton variant="body-highlight" width="100%" />;
    }

    return (
      <button
        aria-disabled={isDisabled}
        aria-label={
          isCollected ? 'Remove from collection' : 'Add to collection'
        }
        aria-pressed={isCollected}
        className={cx(classes.collectHandleIcon, {
          [`${classes.collectHandleIcon}--disabled`]: isDisabled,
        })}
        disabled={isDisabled}
        onClick={handleCollectClick}
        type="button"
      >
        <Icon
          color={isCollected ? 'brand' : 'neutral'}
          icon={isCollected ? StarFilledIcon : StarOutlineIcon}
        />
      </button>
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

const ForwardedTableCollectableCell = forwardRef(TableCollectableCellInner) as <
  T extends TableDataSource = TableDataSource,
>(
  props: TableCollectableCellProps<T> & {
    ref?: React.ForwardedRef<HTMLTableCellElement>;
  },
) => React.ReactElement;

export const TableCollectableCell = memo(
  ForwardedTableCollectableCell,
) as typeof ForwardedTableCollectableCell;
