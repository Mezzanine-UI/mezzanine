import {
  forwardRef,
  useContext,
  useState,
  useMemo,
  Fragment,
} from 'react';
import {
  tableClasses as classes,
  TableDataSource,
  TableColumn,
  TableRecord,
  TableExpandable as TableExpandableType,
  getColumnStyle,
  getCellStyle,
  ExpandRowBySources,
} from '@mezzanine-ui/core/table';
import get from 'lodash/get';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { TableContext, TableDataContext } from './TableContext';
import TableCell from './TableCell';
import TableExpandedTable from './TableExpandedTable';
import TableRowSelection from './rowSelection/TableRowSelection';
import TableExpandable from './expandable/TableExpandable';
import TableEditRenderWrapper from './editable/TableEditRenderWrapper';
import AccordionDetails from '../Accordion/AccordionDetails';

export interface TableBodyRowProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * table body row dataSource
   */
  rowData: TableDataSource;
  rowIndex: number;
}

const TableBodyRow = forwardRef<HTMLDivElement, TableBodyRowProps>(
  function TableBodyRow(props, ref) {
    const {
      className,
      rowData,
      rowIndex,
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

    return (
      <Fragment>
        <div
          {...rest}
          ref={ref}
          className={cx(
            classes.bodyRow,
            {
              [classes.bodyRowHighlight]: selected || expanded,
            },
            className,
          )}
          role="row"
        >
          {rowSelection ? (
            <TableRowSelection
              role="gridcell"
              rowKey={(rowData.key || rowData.id) as string}
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
              onExpand={
                (status: boolean) => expanding.onExpand?.(rowData, status)
              }
            />
          ) : null}
          {(columns ?? []).map((column: TableColumn<TableRecord<unknown>>) => {
            const ellipsis = !!(get(rowData, column.dataIndex)) && (column.ellipsis ?? true);
            const tooltipTitle = (
              column.renderTooltipTitle?.(rowData) ?? get(rowData, column.dataIndex)
            ) as (string | number);

            return (
              <div
                key={`${column.dataIndex}-${column.title}`}
                className={cx(
                  classes.bodyRowCellWrapper,
                  column.bodyClassName,
                )}
                style={getColumnStyle(column)}
              >
                <TableEditRenderWrapper
                  {...column}
                  rowData={rowData}
                >
                  <TableCell
                    ellipsis={ellipsis}
                    forceShownTooltipWhenHovered={column.forceShownTooltipWhenHovered}
                    style={getCellStyle(column)}
                    tooltipTitle={tooltipTitle}
                  >
                    {column.render?.(
                      rowData,
                      rowIndex,
                      column,
                    ) || get(rowData, column.dataIndex)}
                  </TableCell>
                </TableEditRenderWrapper>
              </div>
            );
          })}
        </div>
        {renderedExpandedContent ? (
          <AccordionDetails
            className={cx(
              (expanding as TableExpandableType<TableRecord<unknown>>).className,
              classes.bodyRowExpandedTableWrapper,
            )}
            expanded={expanded}
          >
            {(renderedExpandedContent as ExpandRowBySources)?.dataSource ? (
              <TableExpandedTable
                renderedExpandedContent={renderedExpandedContent as ExpandRowBySources}
              />
            ) : (
              renderedExpandedContent as any
            )}
          </AccordionDetails>
        ) : null}
      </Fragment>
    );
  },
);

export default TableBodyRow;
