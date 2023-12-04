import {
  forwardRef,
  useContext,
} from 'react';
import {
  tableClasses as classes,
  TableDataSource,
} from '@mezzanine-ui/core/table';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { TableContext, TableDataContext } from './TableContext';
import TableBodyRow from './TableBodyRow';
import Empty from '../Empty';
import Loading from '../Loading/Loading';

export interface TableBodyProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * customize row className
   */
  rowClassName?: string;
}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(props, ref) {
  const {
    className,
    rowClassName,
    ...rest
  } = props;

  const {
    dataSource = [],
  } = useContext(TableDataContext) || {};

  const {
    emptyProps,
    fetchMore,
    pagination,
  } = useContext(TableContext) || {};

  /** customizing empty */
  const {
    className: emptyComponentClassName = '',
    children: emptyComponentChildren = '查無資料',
    fullHeight: emptyComponentFullHeight = true,
    ...restEmptyProps
  } = emptyProps || {};

  /** pagination feature */
  const {
    current: currentPage,
    disableAutoSlicing,
    total,
    options: paginationOptions,
  } = pagination || {};

  const currentStartCount: number = paginationOptions?.pageSize && currentPage ? (
    (paginationOptions.pageSize) * (currentPage - 1)
  ) : 0;

  const currentEndCount: number = paginationOptions?.pageSize && currentPage && total ? (
    Math.min(((paginationOptions.pageSize) * currentPage), total)
  ) : 0;

  const currentDataSource = pagination && !disableAutoSlicing ? (
    dataSource.slice(currentStartCount, currentEndCount)
  ) : dataSource;

  return (
    <tbody
      {...rest}
      ref={ref}
      className={cx(
        classes.body,
        className,
      )}
    >
      {currentDataSource.length ? currentDataSource.map((rowData: TableDataSource, index: number) => (
        <TableBodyRow
          key={(rowData.key || rowData.id) as string}
          className={rowClassName}
          rowData={rowData}
          rowIndex={index}
        />
      )) : (
        <tr>
          <td>
            <Empty
              {...restEmptyProps}
              className={cx(classes.bodyEmpty, emptyComponentClassName)}
              fullHeight={emptyComponentFullHeight}
            >
              {emptyComponentChildren}
            </Empty>
          </td>
        </tr>
      )}
      {fetchMore?.isFetching ? (
        <tr className={classes.bodyFetchMore}>
          <td aria-label="Loading">
            <Loading loading />
          </td>
        </tr>
      ) : null}
    </tbody>
  );
});

export default TableBody;
