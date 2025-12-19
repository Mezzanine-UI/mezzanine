'use client';

import { forwardRef, memo } from 'react';
import { tableV2Classes } from '@mezzanine-ui/core/tableV2';
import { DotDragVerticalIcon } from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Icon from '../../Icon';

export interface TableV2DragHandleCellProps {
  className?: string;
  dragHandleProps?: Record<string, unknown>;
  fixed?: boolean;
  fixedOffset?: number;
  isHeader?: boolean;
  showShadow?: boolean;
}

const TableV2DragHandleCellInner = forwardRef<
  HTMLTableCellElement,
  TableV2DragHandleCellProps
>(function TableV2DragHandleCell(props, ref) {
  const {
    className,
    dragHandleProps,
    fixed = false,
    fixedOffset = 0,
    isHeader = false,
    showShadow = false,
  } = props;

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
        tableV2Classes.dragHandleCell,
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
      {!isHeader && (
        <span className={tableV2Classes.dragHandle} {...dragHandleProps}>
          <Icon color="neutral" icon={DotDragVerticalIcon} />
        </span>
      )}
    </CellComponent>
  );
});

export const TableV2DragHandleCell = memo(TableV2DragHandleCellInner);
