import { createContext } from 'react';
import {
  TableRowSelection,
  TableColumn,
  TableExpandable,
  TablePagination,
  TableDataSource,
  TableRecord,
} from '@mezzanine-ui/core/table';
import { EmptyProps } from '../Empty';

/** typeof rowSelection */
export interface RowSelectionContext extends Pick<TableRowSelection, 'actions'> {
  selectedRowKeys: string[];
  onChange(v: string): void;
}

/** typeof sorting */
export interface SortingContext {
  onSort(v: Pick<TableColumn<TableRecord<unknown>>, 'dataIndex' | 'sorter' | 'onSorted'>): void;
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
  scrollBarSize?: number;
  emptyProps?: EmptyProps;
  rowSelection?: RowSelectionContext;
  sorting?: SortingContext;
  loading?: boolean;
  setLoading?(l: boolean): void;
  expanding?: TableExpandable<TableRecord<unknown>>;
  fetchMore?: FetchMoreContext;
  pagination?: TablePagination;
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
