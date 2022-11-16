import {
  forwardRef,
  ReactNode,
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
  ExpandRowBySources,
} from '@mezzanine-ui/core/table';
import { EmptyProps } from '../Empty';
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

export interface TableBaseProps<T>
  extends
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'role'> {
  /**
   * customized body className
   */
  bodyClassName?: string;
  /**
    * customized body row className
    */
  bodyRowClassName?: string;
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
    * props exported from `<Empty />` component.
    */
  emptyProps?: EmptyProps;
  /**
    * When `expandable.rowExpandable` is given, it will control whether row data is expandable or not
    * `expandable.expandedRowRender` is a callback to helps you decides what data should be rendered.
    */
  expandable?: Omit<TableExpandable<T>, 'expandedRowRender'> & {
    expandedRowRender(record: T): ReactNode | ExpandRowBySources;
  };
  /**
   * customized header className
   */
  headerClassName?: string;
  /**
    * Whether table is loading or not
    */
  loading?: boolean;
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

export interface TableWithFetchMore<T> extends TableBaseProps<T> {
  /**
   * If `fetchMore.callback` is given, table will automatically trigger it when scrolling position reach end. <br />
   * If `fetchMore.isReachEnd` is true, table will stop triggering callback. <br />
   * If `fetchMore.isFetching` is true, a loading spinner will display at the end of table and stop triggering callback.
   * <br />
   * Notice that when `fetchMore.isFetching` is `undefined`, table will take control of it when source length changed.
   */
  fetchMore?: TableFetchMore;
  pagination?: undefined;
}

export interface TableWithPagination<T> extends TableBaseProps<T> {
  /**
   * `pagination.current` is the current page number. (required) <br />
   * `pagination.onChange` is the callback when page number changed. (required) <br />
   * `pagination.disableAutoSlicing` set this to true if you don't want auto data slicing. <br />
   * `pagination.total` is the total amount of your data. (default will be dataSource length) <br />
   * `pagination.options` is the <Pagination /> component props. <br />
   * Notice that if `pagination` object is given, table will disable fetchMore and use pagination instead.
   */
  pagination?: TablePaginationType;
  fetchMore?: undefined;
}

export type TableProps<T> = TableWithFetchMore<T> | TableWithPagination<T>;

const Table = forwardRef<HTMLDivElement, TableProps<Record<string, unknown>>>(function Table(props, ref) {
  const {
    bodyClassName,
    bodyRowClassName,
    className,
    columns,
    components,
    dataSource: dataSourceProp,
    emptyProps,
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
    emptyProps,
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
    pagination: paginationProp ? {
      current: paginationProp.current,
      disableAutoSlicing: paginationProp.disableAutoSlicing ?? false,
      onChange: paginationProp.onChange,
      total: paginationProp.total ?? dataSource.length,
      options: {
        ...(paginationProp.options ?? {}),
        boundaryCount: paginationProp.options?.boundaryCount ?? 1,
        pageSize: paginationProp.options?.pageSize ?? 10,
        siblingCount: paginationProp.options?.siblingCount ?? 1,
      },
    } : undefined,
  }), [
    dataSource,
    emptyProps,
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

  const tableDataContextValue = useMemo(() => ({
    columns,
    dataSource,
  }), [columns, dataSource]);

  const tableComponentContextValue = useMemo(() => ({
    bodyCell: components?.body?.cell,
  }), [components?.body?.cell]);

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
              <TableBody
                ref={bodyRef}
                className={bodyClassName}
                rowClassName={bodyRowClassName}
              />
              {paginationProp ? (
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
