import {
  forwardRef,
  useContext,
  useCallback,
} from 'react';
import {
  tableClasses as classes,
  TableColumn,
  TableRecord,
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

    /** styling */
    const getColumnStyle = useCallback((column: TableColumn<TableRecord<unknown>>) => {
      let style = {};

      if (column.width) {
        style = {
          ...style,
          width: column.width,
          maxWidth: column.width,
        };
      }

      return style;
    }, []);

    const getCellStyle = useCallback((column: TableColumn<TableRecord<unknown>>) => {
      let style = {};

      if (column.align) {
        style = {
          ...style,
          justifyContent: column.align === 'center' ? column.align : `flex-${column.align}`,
        };
      }

      return style;
    }, []);

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
