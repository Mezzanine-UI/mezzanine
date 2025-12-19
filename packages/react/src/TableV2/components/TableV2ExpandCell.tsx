'use client';

import { forwardRef, memo, useCallback } from 'react';
import { tableV2Classes } from '@mezzanine-ui/core/tableV2';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Icon from '../../Icon';

export interface TableV2ExpandCellProps {
  canExpand?: boolean;
  className?: string;
  expanded: boolean;
  fixed?: boolean;
  fixedOffset?: number;
  isHeader?: boolean;
  onClick?: VoidFunction;
  showShadow?: boolean;
}

const TableV2ExpandCellInner = forwardRef<
  HTMLTableCellElement,
  TableV2ExpandCellProps
>(function TableV2ExpandCell(props, ref) {
  const {
    canExpand = true,
    className,
    expanded,
    fixed = false,
    fixedOffset = 0,
    isHeader = false,
    onClick,
    showShadow = false,
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

  if (fixed) {
    (cellStyle as Record<string, string>)['--fixed-start-offset'] =
      `${fixedOffset}px`;
  }

  return (
    <CellComponent
      className={cx(
        isHeader ? tableV2Classes.headerCell : tableV2Classes.cell,
        tableV2Classes.expandCell,
        {
          [tableV2Classes.cellFixed]: fixed,
          [tableV2Classes.cellFixedStart]: fixed,
          [tableV2Classes.cellFixedShadow]: showShadow,
        },
        className,
      )}
      ref={ref}
      scope={isHeader ? 'col' : undefined}
      style={cellStyle}
    >
      {!isHeader && canExpand ? (
        <button
          className={cx(tableV2Classes.expandIcon, {
            [tableV2Classes.expandIconExpanded]: expanded,
          })}
          onClick={handleClick}
          type="button"
        >
          <Icon icon={ChevronRightIcon} color="inherit" />
        </button>
      ) : null}
    </CellComponent>
  );
});

export const TableV2ExpandCell = memo(TableV2ExpandCellInner);
