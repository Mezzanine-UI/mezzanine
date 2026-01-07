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
  /** Selection mode: 'checkbox' for multi-select, 'radio' for single-select */
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
export interface TableColumnState {
  resizedColumnWidths: Map<string, number>;
  columns: TableColumn[];
  fixedEndColumns: TableColumn[];
  fixedStartColumns: TableColumn[];
  getResizedColumnWidth: (key: string) => number | undefined;
  scrollableColumns: TableColumn[];
  setResizedColumnWidth: (key: string, width: number) => void;
  totalFixedEndWidth: number;
  totalFixedStartWidth: number;
}

/** Draggable state */
export interface TableDraggableState {
  draggingId: string | null;
  enabled: boolean;
  fixed?: boolean | 'start';
}

/** Highlight state for hover effects */
export interface TableHighlightState {
  /** Current column index being hovered */
  columnIndex: number | null;
  /** Highlight mode */
  mode: HighlightMode;
  /** Current row index being hovered */
  rowIndex: number | null;
  /** Set hovered cell */
  setHoveredCell: (rowIndex: number | null, columnIndex: number | null) => void;
}

/** Main table context */
export interface TableContextValue<
  T extends TableDataSource = TableDataSource,
> {
  // Feature states
  columnState?: TableColumnState;
  /** Container width for scroll calculations */
  dataSource: T[];
  draggable?: TableDraggableState;
  // Config
  emptyProps?: EmptyProps;
  expansion?: TableExpansionState<T>;
  /** Fixed column offset calculations */
  fixedOffsets?: UseTableFixedOffsetsReturn;
  /** Whether columns are resizable by user interaction */
  resizable?: boolean;
  /** Row height */
  rowHeight: number;
  /** Highlight state for hover effects */
  highlight?: TableHighlightState;
  // Scroll state
  isScrollingHorizontally?: boolean;
  loading?: boolean;
  pagination?: PaginationProps;
  size?: TableSize;
  scroll?: TableScroll;
  /** Ref to the scroll container div for virtualization */
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  selection?: TableSelectionState<T>;
  sorting?: TableSortingState;
  /** Transition state for row add/remove animations */
  transitionState?: TableTransitionState;
  /** Whether virtual scrolling is enabled */
  virtualScrollEnabled?: boolean;
  /** Whether the table is inside an expanded content area */
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
  /** Get resized column width from root table (for child table column sync) */
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
