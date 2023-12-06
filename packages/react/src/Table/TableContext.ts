import { createContext, ReactNode } from 'react';
import {
  TableRowSelection,
  TableColumn,
  TableExpandable,
  TablePagination,
  TableDataSource,
  TableRecord,
  ExpandRowBySources,
  TableScrolling,
  TableDraggable,
} from '@mezzanine-ui/core/table';
import { EmptyProps } from '../Empty';

/** typeof rowSelection */
export interface RowSelectionContext extends Pick<TableRowSelection, 'actions'> {
  selectedRowKeys: string[];
  onChange(v: string): void;
}

/** typeof sorting */
export interface SortingContext {
  onSort(v: Pick<TableColumn<TableRecord<unknown>>, 'key' | 'dataIndex' | 'sorter' | 'onSorted'>): void;
  onResetAll(): void;
  sortedOn: string;
  sortedType: string;
}

/** typeof loading */
export interface LoadingContext {
  setLoading(l: boolean): void;
}

/** typeof fetchMore */
export interface FetchMoreContext {
  onFetchMore(): void;
  isFetching: boolean;
  isReachEnd: boolean;
}

export interface TableContextProps {
  isHorizontalScrolling?: boolean;
  emptyProps?: EmptyProps;
  rowSelection?: RowSelectionContext;
  sorting?: SortingContext;
  loading?: boolean;
  setLoading?(l: boolean): void;
  expanding?: Omit<TableExpandable<TableRecord<unknown>>, 'expandedRowRender'> & {
    expandedRowRender(record: TableRecord<unknown>): ReactNode | ExpandRowBySources;
  };
  fetchMore?: FetchMoreContext;
  pagination?: TablePagination;
  scroll?: TableScrolling;
  draggable?: TableDraggable & { draggingId: string };
}

export const TableContext = createContext<TableContextProps | null>(null);

export interface TableDataContextProps {
  columns: TableColumn<TableRecord<unknown>>[];
  dataSource: TableDataSource[];
}

export const TableDataContext = createContext<TableDataContextProps | null>(null);

export interface TableComponentContextProps {
  bodyCell?: any;
}

export const TableComponentContext = createContext<TableComponentContextProps | null>(null);
