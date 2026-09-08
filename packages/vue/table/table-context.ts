import { inject, provide } from 'vue';
import type { ComputedRef, InjectionKey, ShallowRef } from 'vue';
import type {
  HighlightMode,
  TableDataSource,
  TableDraggable,
  TablePinnable,
  TableRowSelection,
  TableRowState,
  TableScroll,
  TableSelectionMode,
  TableSize,
} from '@mezzanine-ui/core/table';
import type { EmptyProps } from '../empty/empty.types';
import type { UseTableFixedOffsetsReturn } from './use-table-fixed-offsets';
import type { TablePaginationProps } from './table-pagination.types';
import type {
  TableActionsBase,
  TableCollectable,
  TableExpandable,
  TableToggleable,
  TableTransitionState,
} from './table.types';

/** Sorting context state */
export interface TableSortingState {
  /** Advances the given column through ascend → descend → unsorted. */
  onSort: (key: string) => void;
}

/** Selection context state */
export interface TableSelectionState<
  T extends TableDataSource = TableDataSource,
> {
  /** The `rowSelection` prop the table was given. */
  config: TableRowSelection<T>;
  /** Whether every selectable row is selected. */
  isAllSelected: boolean;
  /** Whether some but not all selectable rows are selected. */
  isIndeterminate: boolean;
  /** Whether a row refuses selection. */
  isRowDisabled: (record: T) => boolean;
  /** Whether a row is currently selected. */
  isRowSelected: (key: string) => boolean;
  /** Whether rows are picked with checkboxes or a radio. */
  mode: TableSelectionMode;
  /** The keys currently selected. */
  selectedRowKeys: string[];
  /** Selects or clears every selectable row. */
  toggleAll: () => void;
  /** Selects or clears one row. */
  toggleRow: (key: string, record: T) => void;
}

/** Expansion context state */
export interface TableExpansionState<
  T extends TableDataSource = TableDataSource,
> {
  /** The `expandable` prop the table was given. */
  config: TableExpandable<T>;
  /** How far an expanded row's content is indented. */
  expansionLeftPadding: number;
  /** The keys currently expanded. */
  expandedRowKeys: string[];
  /** Whether a row is currently expanded. */
  isRowExpanded: (key: string) => boolean;
  /** Expands or collapses one row. */
  toggleExpand: (key: string, record: T) => void;
}

/** Column state with computed widths */
export interface TableResizedColumnState {
  /** The width the user dragged this column to, if any. */
  getResizedColumnWidth: (key: string) => number | undefined;
  /** Records the width the user dragged this column to. */
  setResizedColumnWidth: (key: string, width: number) => void;
}

/** Highlight state for hover effects */
export interface TableHighlightState {
  /** The column the pointer is over. */
  columnIndex: number | null;
  /** What a hover highlights: the cell, its column, its row, or both. */
  mode: HighlightMode;
  /** The row the pointer is over. */
  rowIndex: number | null;
  /** Reports where the pointer is, or `null, null` when it leaves. */
  setHoveredCell: (rowIndex: number | null, columnIndex: number | null) => void;
}

/** Main table context */
export interface TableContextValue<
  T extends TableDataSource = TableDataSource,
> {
  actions?: TableActionsBase<T>;
  collectable?: TableCollectable<T>;
  columnState?: TableResizedColumnState;
  dataSource: T[];
  draggable?: Omit<TableDraggable<T>, 'onDragEnd'>;
  emptyProps?: EmptyProps & { height?: number | string };
  expansion?: TableExpansionState<T>;
  fixedOffsets?: UseTableFixedOffsetsReturn;
  highlight?: TableHighlightState;
  isContainerReady?: boolean;
  isInsideExpandedContentArea?: boolean;
  isScrollingHorizontally?: boolean;
  loading?: boolean;
  /**
   * How many skeleton rows the body renders while `loading` is true.
   * Skeleton rows carry no record, so no consumer callback is invoked for them.
   */
  loadingRowsCount?: number;
  pagination?: TablePaginationProps;
  pinnable?: TablePinnable;
  resizable?: boolean;
  rowState?:
    | TableRowState
    | ((rowData: TableDataSource) => TableRowState | undefined);
  rowHeight: number | undefined;
  scroll?: TableScroll;
  scrollContainerRef?: ShallowRef<HTMLDivElement | null>;
  selection?: TableSelectionState<T>;
  separatorAtRowIndexes?: number[];
  size?: TableSize;
  sorting?: TableSortingState;
  toggleable?: TableToggleable<T>;
  transitionState?: TableTransitionState;
  virtualScrollEnabled?: boolean;
  zebraStriping?: boolean;
}

/**
 * Provided by MznTable, injected by every part of it.
 *
 * Carries a `ComputedRef` rather than a plain object so the parts re-render as
 * the selection, expansion or scroll position moves; React gets that from
 * re-rendering the provider.
 */
export const TABLE_CONTEXT: InjectionKey<
  ComputedRef<TableContextValue<never>>
> = Symbol('MznTableContext');

export function provideTableContext<T extends TableDataSource>(
  value: ComputedRef<TableContextValue<T>>,
): void {
  provide(
    TABLE_CONTEXT,
    value as unknown as ComputedRef<TableContextValue<never>>,
  );
}

/**
 * 讀取 MznTable 提供的表格狀態。
 *
 * 只能在 MznTable 底下呼叫；沒有 provider 時直接拋錯，與 React 端一致 —— 少了
 * context 的子元件會安靜地渲染成空白，比拋錯難查得多。
 *
 * @example
 * ```ts
 * const table = useTableContext<DataType>();
 *
 * const isLoading = computed(() => table.value.loading ?? false);
 * ```
 *
 * @see MznTable 提供這份 context 的元件
 */
export function useTableContext<
  T extends TableDataSource = TableDataSource,
>(): ComputedRef<TableContextValue<T>> {
  const context = inject(TABLE_CONTEXT, undefined);

  if (!context) {
    throw new Error('useTableContext must be used within a Table component');
  }

  return context as unknown as ComputedRef<TableContextValue<T>>;
}
