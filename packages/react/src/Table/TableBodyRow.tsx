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
import { Draggable } from 'react-beautiful-dnd';
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
import { composeRefs } from '../utils/composeRefs';

export interface TableBodyRowProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * table body row dataSource
   */
  rowData: TableDataSource;
  rowIndex: number;
}

const TableBodyRow = forwardRef<HTMLTableRowElement, TableBodyRowProps>(
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
      isHorizontalScrolling,
      scroll,
      draggable,
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

    /** Feature scrolling */
    const isFirstColumnShouldSticky = useMemo(() => {
      /** 前面有 action 時不可 sticky */
      if (rowSelection || expanding) return false;

      return (scroll?.fixedFirstColumn ?? false);
    }, [
      rowSelection,
      expanding,
      scroll?.fixedFirstColumn,
    ]);

    return (
      <Fragment>
        <Draggable
          key={(rowData.key as string) || (rowData.id as string)}
          index={rowIndex}
          draggableId={(rowData.key as string) || (rowData.id as string)}
          isDragDisabled={!draggable?.enabled}
        >
          {(draggableProvided) => (
            <tr
              {...rest}
              {...draggableProvided.draggableProps}
              {...draggableProvided.dragHandleProps}
              ref={composeRefs([ref, draggableProvided.innerRef])}
              className={cx(
                classes.bodyRow,
                {
                  [classes.bodyRowHighlight]: selected || expanded,
                  [classes.bodyRowDragging]: draggable?.draggingId
                    && draggable.draggingId === ((rowData.key as string) || (rowData.id as string)),
                },
                className,
              )}
            >
              {rowSelection ? (
                <td
                  aria-label="Selection"
                  className={classes.bodyRowCellWrapper}
                  style={{
                    flex: 'unset',
                    minWidth: 'unset',
                  }}
                >
                  <TableRowSelection
                    rowKey={(rowData.key || rowData.id) as string}
                    setChecked={(status) => setSelected(status)}
                    showDropdownIcon={false}
                  />
                </td>
              ) : null}
              {expanding ? (
                <td
                  aria-label="Expand"
                  className={classes.bodyRowCellWrapper}
                  style={{
                    flex: 'unset',
                    minWidth: 'unset',
                  }}
                >
                  <TableExpandable
                    expandable={isExpandable}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    onExpand={
                      (status: boolean) => expanding.onExpand?.(rowData, status)
                    }
                  />
                </td>
              ) : null}
              {(columns ?? []).map((column: TableColumn<TableRecord<unknown>>, idx) => {
                const ellipsis = !!(get(rowData, column.dataIndex)) && (column.ellipsis ?? true);
                const tooltipTitle = (
                  column.renderTooltipTitle?.(rowData) ?? get(rowData, column.dataIndex)
                ) as (string | number);

                return (
                  <td
                    key={`${column.dataIndex}-${column.title}`}
                    className={cx(
                      classes.bodyRowCellWrapper,
                      isFirstColumnShouldSticky && idx === 0 && classes.bodyRowCellWrapperFixed,
                      isFirstColumnShouldSticky && idx === 0 && isHorizontalScrolling && classes.bodyRowCellWrapperFixedStuck,
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
                  </td>
                );
              })}
            </tr>
          )}
        </Draggable>
        {renderedExpandedContent ? (
          <tr>
            <td style={{ padding: 0 }}>
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
            </td>
          </tr>
        ) : null}
      </Fragment>
    );
  },
);

export default TableBodyRow;
