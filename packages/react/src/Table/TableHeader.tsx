import {
  forwardRef,
  useContext,
} from 'react';
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

const TableHeader = forwardRef<HTMLDivElement, NativeElementPropsWithoutKeyAndRef<'div'>>(
  function TableHeader(props, ref) {
    const {
      className,
      ...rest
    } = props;

    const {
      rowSelection,
      expanding,
    } = useContext(TableContext) || {};

    const {
      columns,
    } = useContext(TableDataContext) || {};

    return (
      <div
        ref={ref}
        {...rest}
        className={cx(classes.header, className)}
        role="rowgroup"
      >
        {rowSelection ? (
          <TableRowSelection
            rowKey={SELECTED_ALL_KEY}
            showDropdownIcon
          />
        ) : null}
        {/** only display expanding placeholder when rowSelection not enabled */}
        {expanding && !rowSelection ? (
          <TableExpandable showIcon={false} />
        ) : null}
        {(columns ?? []).map((column: TableColumn<TableRecord<unknown>>) => (
          <div
            key={`${column.dataIndex}-${column.title}`}
            className={cx(
              classes.headerCellWrapper,
              column.headerClassName,
            )}
            style={getColumnStyle(column)}
          >
            <TableCell
              ellipsis={false}
              role="columnheader"
              style={getCellStyle(column)}
            >
              {column.renderTitle?.(classes) || column.title}
              {typeof column.sorter === 'function' || typeof column.onSorted === 'function' ? (
                <TableSortingIcon
                  column={column}
                />
              ) : null}
            </TableCell>
          </div>
        ))}
      </div>
    );
  },
);

export default TableHeader;
