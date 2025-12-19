'use client';

import { createContext, useContext } from 'react';
import type {
  HighlightMode,
  TableV2Column,
  TableV2DataSource,
  TableV2Expandable,
  TableV2RowSelection,
  TableV2Scroll,
} from '@mezzanine-ui/core/tableV2';
import type { EmptyProps } from '../Empty';
import type { PaginationProps } from '../Pagination';
import type { UseTableV2FixedOffsetsReturn } from './hooks/useTableV2FixedOffsets';

/** Sorting context state */
export interface TableV2SortingState {
  onSort: (key: string) => void;
}

/** Selection context state */
export interface TableV2SelectionState<
  T extends TableV2DataSource = TableV2DataSource,
> {
  config: TableV2RowSelection<T>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  isRowDisabled: (record: T) => boolean;
  isRowSelected: (key: string | number) => boolean;
  selectedRowKeys: (string | number)[];
  toggleAll: () => void;
  toggleRow: (key: string | number, record: T) => void;
}

/** Expansion context state */
export interface TableV2ExpansionState<
  T extends TableV2DataSource = TableV2DataSource,
> {
  config: TableV2Expandable<T>;
  expansionLeftPadding: number;
  expandedRowKeys: (string | number)[];
  isRowExpanded: (key: string | number) => boolean;
  toggleExpand: (key: string | number, record: T) => void;
}

/** Column state with computed widths */
export interface TableV2ColumnState {
  resizedColumnWidths: Map<string, number>;
  columns: TableV2Column[];
  fixedEndColumns: TableV2Column[];
  fixedStartColumns: TableV2Column[];
  getResizedColumnWidth: (key: string) => number | undefined;
  scrollableColumns: TableV2Column[];
  setResizedColumnWidth: (key: string, width: number) => void;
  totalFixedEndWidth: number;
  totalFixedStartWidth: number;
}

/** Draggable state */
export interface TableV2DraggableState {
  draggingId: string | null;
  enabled: boolean;
  fixed?: boolean | 'start';
}

/** Highlight state for hover effects */
export interface TableV2HighlightState {
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
export interface TableV2ContextValue<
  T extends TableV2DataSource = TableV2DataSource,
> {
  // Feature states
  columnState?: TableV2ColumnState;
  // Data
  columns: TableV2Column<T>[];
  /** Container width for scroll calculations */
  dataSource: T[];
  draggable?: TableV2DraggableState;
  // Config
  emptyProps?: EmptyProps;
  expansion?: TableV2ExpansionState<T>;
  /** Fixed column offset calculations */
  fixedOffsets?: UseTableV2FixedOffsetsReturn;
  /** Highlight state for hover effects */
  highlight?: TableV2HighlightState;
  // Scroll state
  isScrollingHorizontally?: boolean;
  loading?: boolean;
  pagination?: PaginationProps;
  scroll?: TableV2Scroll;
  /** Ref to the scroll container div for virtualization */
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  selection?: TableV2SelectionState<T>;
  sorting?: TableV2SortingState;
  /** Whether virtual scrolling is enabled */
  virtualScrollEnabled?: boolean;
  /** Whether the table is inside an expanded content area */
  isInsideExpandedContentArea?: boolean;
}

export const TableV2Context = createContext<TableV2ContextValue | null>(null);

export function useTableV2Context<
  T extends TableV2DataSource = TableV2DataSource,
>() {
  const context = useContext(TableV2Context) as TableV2ContextValue<T> | null;

  if (!context) {
    throw new Error(
      'useTableV2Context must be used within a TableV2 component',
    );
  }

  return context;
}

/** Data context for performance optimization */
export interface TableV2DataContextValue<
  T extends TableV2DataSource = TableV2DataSource,
> {
  columns: TableV2Column<T>[];
  dataSource: T[];
}

export const TableV2DataContext = createContext<TableV2DataContextValue | null>(
  null,
);

export function useTableV2DataContext<
  T extends TableV2DataSource = TableV2DataSource,
>() {
  const context = useContext(
    TableV2DataContext,
  ) as TableV2DataContextValue<T> | null;

  if (!context) {
    throw new Error(
      'useTableV2DataContext must be used within a TableV2 component',
    );
  }

  return context;
}

export interface TableV2SuperContextValue {
  containerWidth?: number;
  scrollLeft?: number;
  expansionLeftPadding?: number;
}

export const TableV2SuperContext =
  createContext<TableV2SuperContextValue | null>(null);

export function useTableV2SuperContext() {
  const context = useContext(TableV2SuperContext) || {};

  return context;
}
