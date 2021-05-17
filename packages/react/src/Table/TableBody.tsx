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

const TableBody = forwardRef<HTMLDivElement, NativeElementPropsWithoutKeyAndRef<'div'>>(function TableBody(props, ref) {
  const {
    className,
    ...rest
  } = props;

  const {
    dataSource = [],
  } = useContext(TableDataContext) || {};

  const {
    scrollBarSize,
    fetchMore,
  } = useContext(TableContext) || {};

  const [tableBody, scrollElement] = useTableScroll();
  const composedRefs = useComposeRefs([ref, tableBody.ref]);

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
      {dataSource.length ? dataSource.map((rowData: TableDataSource) => (
        <TableBodyRow
          key={(rowData.key || rowData.id) as string}
          rowData={rowData}
        />
      )) : (
        <Empty
          className={classes.bodyEmpty}
          fullHeight
        >
          查無資料
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
