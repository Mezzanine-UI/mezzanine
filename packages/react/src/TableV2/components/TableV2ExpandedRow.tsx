'use client';

import { forwardRef, memo, useMemo } from 'react';
import {
  getRowKey,
  tableV2Classes,
  type TableV2DataSource,
} from '@mezzanine-ui/core/tableV2';
import { cx } from '../../utils/cx';
import { useTableV2Context } from '../TableV2Context';

export interface TableV2ExpandedRowProps<
  T extends TableV2DataSource = TableV2DataSource,
> {
  className?: string;
  record: T;
  style?: React.CSSProperties;
}

const TableV2ExpandedRowInner = forwardRef<
  HTMLTableRowElement,
  TableV2ExpandedRowProps
>(function TableV2ExpandedRow(props, ref) {
  const { className, record, style } = props;

  const { columns, expansion, draggable, selection } = useTableV2Context();

  // Calculate total column span
  const totalColSpan = useMemo(() => {
    let colSpan = columns.length;

    // Add 1 for expand column itself
    if (expansion) colSpan += 1;
    if (draggable?.enabled) colSpan += 1;
    if (selection) colSpan += 1;

    return colSpan;
  }, [columns.length, expansion, draggable?.enabled, selection]);

  const rowKey = getRowKey(record);
  const isExpanded = expansion?.isRowExpanded(rowKey);

  const { config } = expansion || {};
  const { expandedRowRender } = config || {};

  const childNeededProps = useMemo(
    () => ({
      table: {
        nested: true,
        showHeader: false,
      },
    }),
    [],
  );

  if (!expandedRowRender || !isExpanded) return null;

  return (
    <tr
      className={cx(tableV2Classes.expandedRow, className)}
      data-row-key={`${rowKey}-expanded`}
      ref={ref}
      style={style}
    >
      <td
        className={tableV2Classes.expandedRowCell}
        colSpan={totalColSpan}
        style={{ paddingLeft: expansion?.expansionLeftPadding }}
      >
        <div className={tableV2Classes.expandedContent}>
          {expandedRowRender(record, childNeededProps)}
        </div>
      </td>
    </tr>
  );
});

export const TableV2ExpandedRow = memo(
  TableV2ExpandedRowInner,
) as typeof TableV2ExpandedRowInner;
