'use client';

import { forwardRef, memo } from 'react';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import { DotDragVerticalIcon } from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Icon from '../../Icon';
import Skeleton from '../../Skeleton';
import { useTableContext } from '../TableContext';

export interface TableDragHandleCellProps {
  className?: string;
  dragHandleProps?: Record<string, unknown>;
  fixed?: boolean;
  fixedOffset?: number;
  isHeader?: boolean;
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}

const TableDragHandleCellInner = forwardRef<
  HTMLTableCellElement,
  TableDragHandleCellProps
>(function TableDragHandleCell(props, ref) {
  const { loading } = useTableContext();
  const {
    className,
    dragHandleProps,
    fixed = false,
    fixedOffset = 0,
    isHeader = false,
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

  const renderChild = () => {
    if (!isHeader) {
      if (loading) {
        return <Skeleton width="100%" variant="body-highlight" />;
      }

      return (
        <span className={classes.dragHandle} {...dragHandleProps}>
          <Icon color="neutral" icon={DotDragVerticalIcon} />
        </span>
      );
    }

    return null;
  };

  return (
    <CellComponent
      className={cx(
        isHeader ? classes.headerCell : classes.cell,
        classes.dragHandleCell,
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

export const TableDragHandleCell = memo(TableDragHandleCellInner);
