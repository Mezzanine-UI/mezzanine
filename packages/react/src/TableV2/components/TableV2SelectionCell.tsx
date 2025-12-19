'use client';

import { forwardRef, memo } from 'react';
import { tableV2Classes } from '@mezzanine-ui/core/tableV2';
import { cx } from '../../utils/cx';
import Checkbox from '../../Checkbox';

export interface TableV2SelectionCellProps {
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
}

const TableV2SelectionCellInner = forwardRef<
  HTMLTableCellElement,
  TableV2SelectionCellProps
>(function TableV2SelectionCell(props, ref) {
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
        tableV2Classes.selectionCell,
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
      <div className={tableV2Classes.selectionCheckbox}>
        {hidden ? null : (
          <Checkbox
            checked={selected}
            disabled={disabled}
            indeterminate={indeterminate}
            onChange={onChange}
          />
        )}
      </div>
    </CellComponent>
  );
});

export const TableV2SelectionCell = memo(TableV2SelectionCellInner);
