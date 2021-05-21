import {
  forwardRef,
  useMemo,
  useRef,
} from 'react';
import {
  tableClasses as classes,
  TableColumn,
  TableComponents,
  TableDataSource,
  TableRowSelection,
  TableExpandable,
  TableFetchMore,
  TablePagination as TablePaginationType,
  TableRefresh as TableRefreshType,
} from '@mezzanine-ui/core/table';
import { TableContext, TableDataContext, TableComponentContext } from './TableContext';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TablePagination from './pagination/TablePagination';
import TableRefresh from './refresh/TableRefresh';
import Loading from '../Loading';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useTableRowSelection } from './rowSelection/useTableRowSelection';
import { useTableSorting } from './sorting/useTableSorting';
import { useTableLoading } from './useTableLoading';
import { useTableFetchMore } from './useTableFetchMore';

export interface TableProps<T>
  extends
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'role'> {
  /**
   * customized body className
   */
  bodyClassName?: string;
  /**
   * Columns of table <br />
   * `column.render` allowed customizing the column body cell rendering. <br />
   * `column.renderTitle` allowed customizing the column header cell rendering. <br />
   * `column.sorter` is the sorting method that you want to apply to your column. <br />
   * `column.onSorted` is the callback triggered whenever sort icon clicked.
   */
  columns: TableColumn<T>[];
  /**
   * Custom table components <br />
   */
  components?: TableComponents;
  /**
   * Data record array to be displayed. <br />
   * Notice that each source should contain `key` or `id` prop as data primary key.
   */
  dataSource: TableDataSource[];
  /**
   * When `expandable.rowExpandable` is given, it will control whether row data is expandable or not
   * `expandable.expandedRowRender` is a callback to helps you decides what data should be rendered.
   */
  expandable?: TableExpandable<T>;
  /**
   * If `fetchMore.callback` is given, table will automatically trigger it when scrolling position reach end. <br />
   * If `fetchMore.isReachEnd` is true, table will stop triggering callback. <br />
   * If `fetchMore.isFetching` is true, a loading spinner will display at the end of table and stop triggering callback.
   * <br />
   * Notice that when `fetchMore.isFetching` is `undefined`, table will take control of it when source length changed.
   */
  fetchMore?: TableFetchMore;
  /**
   * customized header className
   */
  headerClassName?: string;
  /**
   * Whether table is loading or not
   */
  loading?: boolean;
  /**
   * `pagination.show` controls pagination display. <br />
   * `pagination.current` is the current page number. <br />
   * `pagination.onChange` is the callback when page number changed. <br />
   * `pagination.total` is the total amount of your data. <br />
   * `pagination.options` is the <Pagination /> component props. <br />
   * Notice that if `pagination` object is given, table will disable fetchMore and use pagination instead.
   */
  pagination?: TablePaginationType;
  /**
   * `refresh.show` is true, refresh button will display at the top-start of table. <br />
   * `refresh.onClick` is the callback of the refresh button.
   */
  refresh?: TableRefreshType;
  /**
   * Enable row selection feature <br />
   * `rowSelection.selectedRowKey` is the dataSource keys that are currently selected. <br />
   * `rowSelection.onChange` is the callback when selection changed. <br />
   * `rowSelection.actions` are the actions that you want to do for selected data.
   */
  rowSelection?: TableRowSelection;
}

const Table = forwardRef<HTMLDivElement, TableProps<Record<string, unknown>>>(function Table(props, ref) {
  const {
    bodyClassName,
    className,
    columns,
    components,
    dataSource: dataSourceProp,
    expandable: expandableProp,
    fetchMore: fetchMoreProp,
    headerClassName,
    loading: loadingProp,
    pagination: paginationProp,
    refresh: refreshProp,
    rowSelection: rowSelectionProp,
    ...rest
  } = props;

  const bodyRef = useRef<HTMLDivElement>(null);

  /** Feature rowSelection */
  const [selectedRowKeys, setSelectedRowKey] = useTableRowSelection({
    selectedRowKey: rowSelectionProp?.selectedRowKey,
    onChange: rowSelectionProp?.onChange,
    dataSource: dataSourceProp,
  });

  const rowSelection = useMemo(() => (rowSelectionProp ? {
    selectedRowKeys,
    onChange: setSelectedRowKey,
    actions: rowSelectionProp.actions,
  } : undefined), [
    rowSelectionProp,
    selectedRowKeys,
    setSelectedRowKey,
  ]);

  /** Feature sorting */
  const [dataSource, onSort, { sortedOn, sortedType, onResetAll }] = useTableSorting({
    dataSource: dataSourceProp,
  });

  /** Feature loading */
  const [loading, setLoading] = useTableLoading({
    loading: loadingProp,
  });

  /** Feature fetchMore */
  const {
    fetchMore: onFetchMore,
    isFetching,
    isReachEnd,
  } = useTableFetchMore({
    callback: fetchMoreProp?.callback,
    dataSource,
    /** when pagination is given, fetchMore feature should be disabled */
    disabled: !!paginationProp,
    isReachEnd: fetchMoreProp?.isReachEnd,
    isFetching: fetchMoreProp?.isFetching,
  });

  /** Feature refresh */
  const isRefreshShow: boolean = useMemo(() => (
    /** @default false */
    refreshProp?.show ?? false
  ), [refreshProp?.show]);

  /** context */
  const tableContextValue = useMemo(() => ({
    scrollBarSize: 4,
    rowSelection,
    sorting: {
      onSort,
      onResetAll,
      sortedOn,
      sortedType,
    },
    loading,
    setLoading,
    expanding: expandableProp,
    fetchMore: onFetchMore ? {
      onFetchMore,
      isFetching,
      isReachEnd,
    } : undefined,
    pagination: paginationProp,
  }), [
    expandableProp,
    rowSelection,
    onSort,
    onResetAll,
    sortedOn,
    sortedType,
    loading,
    setLoading,
    onFetchMore,
    isFetching,
    isReachEnd,
    paginationProp,
  ]);

  const tableDataContextValue = {
    columns,
    dataSource,
  };

  const tableComponentContextValue = {
    bodyCell: components?.body?.cell,
  };

  return (
    <Loading
      loading={loading}
      stretch
      tip="資料載入中..."
    >
      <div
        ref={ref}
        {...rest}
        className={cx(classes.host, className)}
        role="grid"
      >
        <TableContext.Provider value={tableContextValue}>
          <TableDataContext.Provider value={tableDataContextValue}>
            <TableComponentContext.Provider value={tableComponentContextValue}>
              {isRefreshShow ? (
                <TableRefresh onClick={(refreshProp as TableRefreshType).onClick} />
              ) : null}
              <TableHeader className={headerClassName} />
              <TableBody ref={bodyRef} className={bodyClassName} />
              {paginationProp?.show ? (
                <TablePagination bodyRef={bodyRef} />
              ) : null}
            </TableComponentContext.Provider>
          </TableDataContext.Provider>
        </TableContext.Provider>
      </div>
    </Loading>
  );
});

export default Table;
