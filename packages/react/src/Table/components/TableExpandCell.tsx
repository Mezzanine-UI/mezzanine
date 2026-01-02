'use client';

import { forwardRef, memo, useCallback } from 'react';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Icon from '../../Icon';
import Skeleton from '../../Skeleton';
import { useTableContext } from '../TableContext';

export interface TableExpandCellProps {
  canExpand?: boolean;
  className?: string;
  expanded: boolean;
  fixed?: boolean;
  fixedOffset?: number;
  isHeader?: boolean;
  onClick?: VoidFunction;
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}

const TableExpandCellInner = forwardRef<
  HTMLTableCellElement,
  TableExpandCellProps
>(function TableExpandCell(props, ref) {
  const { loading } = useTableContext();
  const {
    canExpand = true,
    className,
    expanded,
    fixed = false,
    fixedOffset = 0,
    isHeader = false,
    onClick,
    showShadow = false,
    width,
  } = props;

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      if (canExpand && onClick) {
        onClick();
      }
    },
    [canExpand, onClick],
  );

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

  const renderChild = () => {
    if (isHeader) return null;

    if (loading) {
      return <Skeleton width="100%" variant="body-highlight" />;
    }

    return canExpand ? (
      <button
        className={cx(classes.expandIcon, {
          [classes.expandIconExpanded]: expanded,
        })}
        onClick={handleClick}
        type="button"
      >
        <Icon icon={ChevronRightIcon} color="inherit" />
      </button>
    ) : null;
  };

  return (
    <CellComponent
      className={cx(
        isHeader ? classes.headerCell : classes.cell,
        classes.expandCell,
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
});

export const TableExpandCell = memo(TableExpandCellInner);
