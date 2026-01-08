'use client';

import { createContext, useContext } from 'react';
import type {
  HighlightMode,
  TableSize,
  TableColumn,
  TableDataSource,
  TableExpandable,
  TableRowSelection,
  TableScroll,
  TableSelectionMode,
} from '@mezzanine-ui/core/table';
import type { EmptyProps } from '../Empty';
import type { PaginationProps } from '../Pagination';
import type { UseTableFixedOffsetsReturn } from './hooks/useTableFixedOffsets';
import type { TableTransitionState } from './hooks/useTableDataSource';

/** Sorting context state */
export interface TableSortingState {
  onSort: (key: string) => void;
}

/** Selection context state */
export interface TableSelectionState<
  T extends TableDataSource = TableDataSource,
> {
  config: TableRowSelection<T>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  isRowDisabled: (record: T) => boolean;
  isRowSelected: (key: string) => boolean;
  mode: TableSelectionMode;
  selectedRowKeys: string[];
  toggleAll: () => void;
  toggleRow: (key: string, record: T) => void;
}

/** Expansion context state */
export interface TableExpansionState<
  T extends TableDataSource = TableDataSource,
> {
  config: TableExpandable<T>;
  expansionLeftPadding: number;
  expandedRowKeys: string[];
  isRowExpanded: (key: string) => boolean;
  toggleExpand: (key: string, record: T) => void;
}

/** Column state with computed widths */
export interface TableResizedColumnState {
  getResizedColumnWidth: (key: string) => number | undefined;
  setResizedColumnWidth: (key: string, width: number) => void;
}

/** Draggable state */
export interface TableDraggableState {
  enabled: boolean;
  fixed?: boolean | 'start';
}

/** Highlight state for hover effects */
export interface TableHighlightState {
  columnIndex: number | null;
  mode: HighlightMode;
  rowIndex: number | null;
  setHoveredCell: (rowIndex: number | null, columnIndex: number | null) => void;
}

/** Main table context */
export interface TableContextValue<
  T extends TableDataSource = TableDataSource,
> {
  columnState?: TableResizedColumnState;
  dataSource: T[];
  draggable?: TableDraggableState;
  emptyProps?: EmptyProps & { height?: number | string };
  expansion?: TableExpansionState<T>;
  fixedOffsets?: UseTableFixedOffsetsReturn;
  resizable?: boolean;
  rowHeight: number;
  highlight?: TableHighlightState;
  isScrollingHorizontally?: boolean;
  loading?: boolean;
  pagination?: PaginationProps;
  size?: TableSize;
  scroll?: TableScroll;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  selection?: TableSelectionState<T>;
  sorting?: TableSortingState;
  transitionState?: TableTransitionState;
  virtualScrollEnabled?: boolean;
  isInsideExpandedContentArea?: boolean;
}

export const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext<T extends TableDataSource = TableDataSource>() {
  const context = useContext(TableContext) as TableContextValue<T> | null;

  if (!context) {
    throw new Error('useTableContext must be used within a Table component');
  }

  return context;
}

/** Data context for performance optimization */
export interface TableDataContextValue<
  T extends TableDataSource = TableDataSource,
> {
  columns: TableColumn<T>[];
  dataSource: T[];
}

export const TableDataContext = createContext<TableDataContextValue | null>(
  null,
);

export function useTableDataContext<
  T extends TableDataSource = TableDataSource,
>() {
  const context = useContext(
    TableDataContext,
  ) as TableDataContextValue<T> | null;

  if (!context) {
    throw new Error(
      'useTableDataContext must be used within a Table component',
    );
  }

  return context;
}

export interface TableSuperContextValue {
  containerWidth?: number;
  getResizedColumnWidth?: (key: string) => number | undefined;
  scrollLeft?: number;
  expansionLeftPadding?: number;
  hasDragHandleFixed?: boolean;
}

export const TableSuperContext = createContext<TableSuperContextValue | null>(
  null,
);

export function useTableSuperContext() {
  const context = useContext(TableSuperContext) || {};

  return context;
}
