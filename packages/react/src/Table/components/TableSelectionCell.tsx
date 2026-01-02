'use client';

import { forwardRef, memo } from 'react';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import { cx } from '../../utils/cx';
import Checkbox from '../../Checkbox';
import Skeleton from '../../Skeleton';
import { useTableContext } from '../TableContext';

export interface TableSelectionCellProps {
  className?: string;
  disabled?: boolean;
  fixed?: boolean;
  fixedOffset?: number;
  hidden?: boolean;
  indeterminate?: boolean;
  isHeader?: boolean;
  onChange: () => void;
  selected: boolean;
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}

const TableSelectionCellInner = forwardRef<
  HTMLTableCellElement,
  TableSelectionCellProps
>(function TableSelectionCell(props, ref) {
  const { loading } = useTableContext();
  const {
    className,
    disabled = false,
    fixed = false,
    fixedOffset = 0,
    hidden = false,
    indeterminate = false,
    isHeader = false,
    onChange,
    selected,
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
    if (hidden) return null;

    if (loading) {
      return <Skeleton width="100%" variant="body-highlight" />;
    }

    return (
      <Checkbox
        checked={selected}
        disabled={disabled}
        indeterminate={indeterminate}
        onChange={onChange}
      />
    );
  };

  return (
    <CellComponent
      className={cx(
        isHeader ? classes.headerCell : classes.cell,
        classes.selectionCell,
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
      <div className={classes.selectionCheckbox}>{renderChild()}</div>
    </CellComponent>
  );
});

export const TableSelectionCell = memo(TableSelectionCellInner);
