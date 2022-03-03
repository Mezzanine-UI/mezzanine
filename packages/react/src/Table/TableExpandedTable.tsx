import {
  useContext,
  forwardRef,
} from 'react';
import {
  tableClasses as classes,
  TableDataSource,
  TableColumn,
  ExpandedTableColumn,
  TableRecord,
  getColumnStyle,
  getCellStyle,
} from '@mezzanine-ui/core/table';
import get from 'lodash/get';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { TableDataContext } from './TableContext';
import TableCell from './TableCell';
import TableExpandable from './expandable/TableExpandable';

export interface TableExpandedTableProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  renderedExpandedContent: {
    dataSource: TableDataSource[];
    columns?: ExpandedTableColumn[];
  }
}

const TableExpandedTable = forwardRef<HTMLDivElement, TableExpandedTableProps>(function TableExpandedTable(props, ref) {
  const {
    renderedExpandedContent,
  } = props;

  const {
    columns,
  } = useContext(TableDataContext) || {};

  return (
    <div className={classes.bodyRowExpandedTable}>
      {renderedExpandedContent.dataSource.map((source: TableDataSource, sourceIndex: number) => (
        <div
          ref={ref}
          key={(source.key || source.id) as (string | number)}
          className={cx(
            classes.bodyRow,
            classes.bodyRowExpandedTableRow,
          )}
          role="row"
        >
          <TableExpandable showIcon={false} />
          {((renderedExpandedContent.columns || columns) ?? [])
            .map((column: TableColumn<TableRecord<unknown>>, index: number) => {
              const ellipsis = !!(get(source, column.dataIndex)) && (column.ellipsis ?? true);
              const tooltipTitle = (
                column.renderTooltipTitle?.(source) ?? get(source, column.dataIndex)
              ) as (string | number);

              return (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${column.dataIndex}-${index}`}
                  className={cx(
                    classes.bodyRowCellWrapper,
                    column.bodyClassName,
                  )}
                  style={getColumnStyle((columns ?? [])[index])}
                >
                  <TableCell
                    ellipsis={ellipsis}
                    forceShownTooltipWhenHovered={column.forceShownTooltipWhenHovered}
                    style={getCellStyle((columns ?? [])[index])}
                    tooltipTitle={tooltipTitle || ''}
                  >
                    {column.render?.(
                      column,
                      source,
                      sourceIndex,
                    ) || get(source, column.dataIndex)}
                  </TableCell>
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
});

export default TableExpandedTable;
