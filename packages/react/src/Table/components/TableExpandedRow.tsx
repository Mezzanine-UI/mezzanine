'use client';

import { cloneElement, forwardRef, memo, useMemo } from 'react';
import {
  getRowKey,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import { cx } from '../../utils/cx';
import { useTableContext, useTableDataContext } from '../TableContext';
import { Table } from '../Table';

export interface TableExpandedRowProps<
  T extends TableDataSource = TableDataSource,
> {
  className?: string;
  record: T;
  style?: React.CSSProperties;
}

const TableExpandedRowInner = forwardRef<
  HTMLTableRowElement,
  TableExpandedRowProps
>(function TableExpandedRow(props, ref) {
  const { className, record, style } = props;

  const { expansion, draggable, selection, transitionState } =
    useTableContext();
  const { columns } = useTableDataContext();

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

  // Check transition states for the parent row
  const isAdding = transitionState?.addingKeys.has(rowKey) ?? false;
  const isDeleting = transitionState?.deletingKeys.has(rowKey) ?? false;
  const isFadingOut = transitionState?.fadingOutKeys.has(rowKey) ?? false;

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

  const children = expandedRowRender(record);
  const clonedChild = cloneElement(children as React.ReactElement);

  return (
    <tr
      className={cx(
        classes.expandedRow,
        {
          [classes.expandedRowAdding]: isAdding,
          [classes.expandedRowDeleting]: isDeleting,
          [classes.expandedRowFadingOut]: isFadingOut,
        },
        className,
      )}
      data-row-key={`${rowKey}-expanded`}
      ref={ref}
      style={style}
    >
      <td
        className={classes.expandedRowCell}
        colSpan={totalColSpan}
        style={{ paddingLeft: expansion?.expansionLeftPadding }}
      >
        <div className={classes.expandedContent}>
          {clonedChild.type === Table
            ? cloneElement(clonedChild, {
                ...childNeededProps.table,
              })
            : clonedChild}
        </div>
      </td>
    </tr>
  );
});

export const TableExpandedRow = memo(
  TableExpandedRowInner,
) as typeof TableExpandedRowInner;
