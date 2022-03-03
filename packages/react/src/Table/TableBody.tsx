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
import { useComposeRefs } from '../hooks/useComposeRefs';
import useTableScroll from './useTableScroll';
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

const TableBody = forwardRef<HTMLDivElement, TableBodyProps>(function TableBody(props, ref) {
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
    scrollBarSize,
    pagination,
  } = useContext(TableContext) || {};

  const [tableBody, scrollElement] = useTableScroll();
  const composedRefs = useComposeRefs([ref, tableBody.ref]);

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
    <div
      {...rest}
      ref={composedRefs}
      className={cx(
        classes.body,
        className,
      )}
      onScroll={tableBody.onScroll}
      role="rowgroup"
    >
      {currentDataSource.length ? currentDataSource.map((rowData: TableDataSource, index: number) => (
        <TableBodyRow
          key={(rowData.key || rowData.id) as string}
          className={rowClassName}
          rowData={rowData}
          rowIndex={index}
        />
      )) : (
        <Empty
          {...restEmptyProps}
          className={cx(classes.bodyEmpty, emptyComponentClassName)}
          fullHeight={emptyComponentFullHeight}
        >
          {emptyComponentChildren}
        </Empty>
      )}
      {fetchMore?.isFetching ? (
        <div className={classes.bodyFetchMore}>
          <Loading loading />
        </div>
      ) : null}
      <div
        ref={scrollElement.ref}
        onMouseDown={scrollElement.onMouseDown}
        onMouseUp={scrollElement.onMouseUp}
        onMouseEnter={scrollElement.onMouseEnter}
        onMouseLeave={scrollElement.onMouseLeave}
        role="button"
        style={scrollElement.style}
        tabIndex={-1}
      >
        <div
          style={{
            width: `${scrollBarSize}px`,
            height: '100%',
            borderRadius: '10px',
            backgroundColor: '#7d7d7d',
            transition: '0.1s',
          }}
        />
      </div>
    </div>
  );
});

export default TableBody;
