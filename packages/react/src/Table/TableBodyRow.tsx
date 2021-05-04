import {
  forwardRef,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  tableClasses as classes,
  TableDataSource,
  TableColumn,
  TableRecord,
} from '@mezzanine-ui/core/table';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { TableContext, TableDataContext } from './TableContext';
import TableCell from './TableCell';
import TableRowSelection from './rowSelection/TableRowSelection';
import TableExpandable from './expandable/TableExpandable';
import AccordionDetails from '../Accordion/AccordionDetails';

export interface TableBodyRowProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * table body row dataSource
   */
  rowData: TableDataSource
}

const TableBodyRow = forwardRef<HTMLDivElement, TableBodyRowProps>(function TableBodyRow(props, ref) {
  const {
    rowData,
    ...rest
  } = props;

  const {
    rowSelection,
    expanding,
  } = useContext(TableContext) || {};

  const {
    columns,
  } = useContext(TableDataContext) || {};

  /** Feature rowSelection */
  const [selected, setSelected] = useState<boolean>(false);

  /** Feature expandable */
  const [expanded, setExpanded] = useState<boolean>(false);

  const isExpandable = useMemo(() => (
    expanding?.rowExpandable?.(rowData) ?? false
  ), [expanding, rowData]);

  const renderedExpandedContent = useMemo(() => (
    expanding?.expandedRowRender?.(rowData) ?? null
  ), [expanding, rowData]);

  /** styling */
  const getColumnStyle = useCallback((column: TableColumn) => {
    let style = {};

    if (column?.width) {
      style = {
        ...style,
        width: column.width,
        maxWidth: column.width,
      };
    }

    return style;
  }, []);

  const getCellStyle = useCallback((column: TableColumn) => {
    let style = {};

    if (column?.align) {
      style = {
        ...style,
        justifyContent: column.align === 'center' ? column.align : `flex-${column.align}`,
      };
    }

    return style;
  }, []);

  return (
    <>
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.bodyRow,
          {
            [classes.bodyRowHighlight]: selected || expanded,
          },
        )}
        role="row"
      >
        {rowSelection ? (
          <TableRowSelection
            role="gridcell"
            rowKey={rowData.key}
            setChecked={(status) => setSelected(status)}
            showDropdownIcon={false}
          />
        ) : null}
        {expanding ? (
          <TableExpandable
            expandable={isExpandable}
            expanded={expanded}
            role="gridcell"
            setExpanded={setExpanded}
          />
        ) : null}
        {columns.map((column: TableColumn, index: number) => (
          <div
            key={`${column.dataIndex}-${column?.title}`}
            className={cx(
              classes.bodyRowCellWrapper,
              column?.bodyClassName,
            )}
            style={getColumnStyle(column)}
          >
            <TableCell
              ellipsis={!!(rowData?.[column?.dataIndex]) && (column?.ellipsis ?? true)}
              style={getCellStyle(column)}
              tooltipTitle={(rowData?.[column?.dataIndex]) as (string | number)}
            >
              {column?.render?.(
                column?.title as string,
                rowData?.[column?.dataIndex] as TableRecord,
                index,
              ) || rowData?.[column?.dataIndex]}
            </TableCell>
          </div>
        ))}
      </div>
      {renderedExpandedContent ? (
        <AccordionDetails
          className={expanding?.className}
          expanded={expanded}
        >
          {renderedExpandedContent}
        </AccordionDetails>
      ) : null}
    </>
  );
});

export default TableBodyRow;
