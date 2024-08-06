import { forwardRef, useContext, useMemo } from 'react';
import {
  tableClasses as classes,
  TableColumn,
  TableRecord,
  getColumnStyle,
  getCellStyle,
} from '@mezzanine-ui/core/table';
import { TableContext, TableDataContext } from './TableContext';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { SELECTED_ALL_KEY } from './rowSelection/useTableRowSelection';
import TableCell from './TableCell';
import TableRowSelection from './rowSelection/TableRowSelection';
import TableSortingIcon from './sorting/TableSortingIcon';
import TableExpandable from './expandable/TableExpandable';

const TableHeader = forwardRef<
  HTMLTableRowElement,
  NativeElementPropsWithoutKeyAndRef<'div'>
>(function TableHeader(props, ref) {
  const { className, ...rest } = props;

  const { rowSelection, isHorizontalScrolling, scroll, expanding } =
    useContext(TableContext) || {};

  const { columns } = useContext(TableDataContext) || {};

  const isFirstColumnShouldSticky = useMemo(() => {
    /** 前面有 action 時不可 sticky */
    if (rowSelection || expanding) return false;

    return scroll?.fixedFirstColumn ?? false;
  }, [rowSelection, expanding, scroll?.fixedFirstColumn]);

  return (
    <thead className={classes.headerFixed}>
      <tr ref={ref} {...rest} className={cx(classes.header, className)}>
        {rowSelection ? (
          <th aria-label="Row Selection" style={{ display: 'flex' }}>
            <TableRowSelection rowKey={SELECTED_ALL_KEY} showDropdownIcon />
          </th>
        ) : null}
        {/** only display expanding placeholder when rowSelection not enabled */}
        {expanding && !rowSelection ? (
          <th aria-label="Row Expansion" style={{ display: 'flex' }}>
            <TableExpandable showIcon={false} />
          </th>
        ) : null}
        {(columns ?? []).map(
          (column: TableColumn<TableRecord<unknown>>, idx) => (
            <th
              key={`${idx + 1}`}
              className={cx(
                classes.headerCellWrapper,
                isFirstColumnShouldSticky &&
                  idx === 0 &&
                  classes.headerCellWrapperFixed,
                isFirstColumnShouldSticky &&
                  idx === 0 &&
                  isHorizontalScrolling &&
                  classes.headerCellWrapperFixedStuck,
                column.headerClassName,
              )}
              style={getColumnStyle(column)}
            >
              <TableCell ellipsis={false} style={getCellStyle(column)}>
                {column.renderTitle?.(classes) || column.title}
                {typeof column.sorter === 'function' ||
                typeof column.onSorted === 'function' ? (
                  <TableSortingIcon column={column} />
                ) : null}
              </TableCell>
            </th>
          ),
        )}
      </tr>
    </thead>
  );
});

export default TableHeader;
