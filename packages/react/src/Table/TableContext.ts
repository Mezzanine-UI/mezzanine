import { createContext } from 'react';
import {
  TableRowSelection,
  TableColumn,
  TableExpandable,
  TablePagination,
} from '@mezzanine-ui/core/table';

/** typeof rowSelection */
export interface RowSelectionContext extends Pick<TableRowSelection, 'actions'> {
  selectedRowKeys: string[];
  onChange(v: string): void;
}

/** typeof sorting */
export interface SortingContext {
  onSort(v: Pick<TableColumn, 'dataIndex' | 'sorter' | 'onSorted'>): void;
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
  rowSelection?: RowSelectionContext;
  sorting?: SortingContext;
  loading: boolean;
  setLoading(l: boolean): void;
  expanding?: TableExpandable;
  fetchMore?: FetchMoreContext;
  pagination?: TablePagination;
}

export const TableContext = createContext<TableContextProps | null>(null);

export interface TableDataContextProps {
  columns: any;
  dataSource: any;
}

export const TableDataContext = createContext<TableDataContextProps | null>(null);
