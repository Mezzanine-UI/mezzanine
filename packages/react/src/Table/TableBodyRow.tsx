import {
  forwardRef,
  useContext,
  useState,
  useMemo,
  Fragment,
  useRef,
  Dispatch,
  SetStateAction,
  CSSProperties,
} from 'react';
import { useDrag, useDrop } from 'react-dnd';
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
import { useComposeRefs } from '../hooks/useComposeRefs';
import { arrayMove } from '../utils/array-move';

export interface TableBodyRowProps extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onDragEnd'> {
  /**
   * table body row dataSource
   */
  rowData: TableDataSource;
  rowIndex: number;
  draggingData?: TableDataSource[];
  setDraggingData?: Dispatch<SetStateAction<TableDataSource[]>>;
  onDragEnd?: VoidFunction;
  onResetDragging?: VoidFunction;
}

export const MZN_TABLE_DRAGGABLE_KEY = 'mzn-table-draggable-row';

const TableBodyRow = forwardRef<HTMLTableRowElement, TableBodyRowProps>(
  function TableBodyRow(props, ref) {
    const {
      className,
      rowData,
      rowIndex,
      draggingData,
      setDraggingData,
      onDragEnd,
      onResetDragging,
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

    const rowRef = useRef<HTMLTableRowElement>(null);

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

    /** Feature dragging */
    const selfVirtualRowIndex = useMemo(() => (
      draggingData?.length
        ? draggingData.findIndex((d) => (d.id || d.key) === (rowData.id || rowData.key))
        : -1
    ), [draggingData, rowData]);

    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: MZN_TABLE_DRAGGABLE_KEY,
        item: {
          ...rowData,
          rowIndex: selfVirtualRowIndex,
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
        canDrag: () => (draggable?.enabled ?? false),
        end: (_, monitor) => {
          const didDrop = monitor.didDrop();

          if (!didDrop) {
            /** 拖曳到外面去，視同取消 */
            onResetDragging?.();
          } else if (onDragEnd) {
            onDragEnd();
          } else {
            onResetDragging?.();
          }
        },
      }),
      [rowData, selfVirtualRowIndex, draggingData, onResetDragging, draggable?.enabled],
    );

    const [, drop] = useDrop(
      () => ({
        accept: MZN_TABLE_DRAGGABLE_KEY,
        canDrop: () => (draggable?.enabled ?? false),
        hover: ({
          key: originDraggingItemKey,
          id: originDraggingItemId,
        }: any) => {
          const originKey = originDraggingItemKey || originDraggingItemId;
          const hoveringItemKey = rowData.key || rowData.id;
          const draggingRowIndex = draggingData?.length
            ? draggingData.findIndex((d) => (d.id || d.key) === originKey)
            : -1;

          if (~draggingRowIndex) {
            if (draggingRowIndex === rowIndex && originKey !== hoveringItemKey) {
              setDraggingData?.((prevDraggingData) => (
                arrayMove(prevDraggingData, draggingRowIndex, selfVirtualRowIndex)
              ));
            } else if (
              draggingRowIndex !== rowIndex
              && draggingRowIndex !== selfVirtualRowIndex
            ) {
              setDraggingData?.((prevDraggingData) => (
                arrayMove(prevDraggingData, draggingRowIndex, selfVirtualRowIndex)
              ));
            }
          }
        },
      }),
      [selfVirtualRowIndex, draggingData, rowIndex, rowData, isDragging, draggable?.enabled],
    );

    const rowStyle = useMemo(() => {
      const { current: rowEle } = rowRef;

      let style: CSSProperties = {
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      };

      if (rowEle) {
        if (draggable?.enabled) {
          style = {
            ...style,
            cursor: 'grab',
          };
        }

        if (isDragging) {
          style = {
            ...style,
            position: 'relative',
            opacity: 0,
            zIndex: '-1',
          };
        } else {
          const eleHeight = rowEle.getBoundingClientRect().height;

          if (selfVirtualRowIndex < rowIndex) {
            style = {
              ...style,
              transform: `translate3d(0, ${eleHeight * -1}px, 0)`,
            };
          }

          if (selfVirtualRowIndex > rowIndex) {
            style = {
              ...style,
              transform: `translate3d(0, ${eleHeight}px, 0)`,
            };
          }
        }
      }

      return style;
    }, [isDragging, rowIndex, selfVirtualRowIndex, draggable?.enabled]);

    const composedRef = useComposeRefs([ref, (drag(drop(rowRef)) as any)]);

    return (
      <Fragment>
        <tr
          {...rest}
          ref={composedRef}
          className={cx(
            classes.bodyRow,
            {
              [classes.bodyRowHighlight]: selected || expanded,
            },
            className,
          )}
          style={rowStyle}
        >
          {rowSelection ? (
            <td
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
