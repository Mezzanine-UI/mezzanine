import type { VNodeChild } from 'vue';
import type {
  ColumnAlign,
  FixedType,
  HighlightMode,
  SortOrder,
  TableActionItem,
  TableColumnTitleMenu,
  TableDataSource,
  TableDraggable,
  TablePinnable,
  TableRowSelection,
  TableRowState,
  TableScroll,
  TableSize,
} from '@mezzanine-ui/core/table';
import type { ButtonVariant } from '@mezzanine-ui/core/button';
import type { EmptyProps } from '../empty/empty.types';
import type { TablePaginationProps } from './table-pagination.types';

/**
 * `@mezzanine-ui/core` 的 table 型別有六個欄位是 `React.ReactNode`
 * （`TableColumnBase` 的 `render` / `title` / `titleHelp`、兩個 `WithRender`
 * 變體的 `render`，以及 `TableExpandable.expandedRowRender`）。
 *
 * 這個檔案只把「直接帶有、或透過 extends／Pick 繼承到」那些欄位的型別重新宣告一次，
 * 節點型別換成 Vue 的 `VNodeChild`；欄位名稱、選填性與其餘欄位一字不改。core 裡其他
 * 的型別（`TableDataSource`、`SortOrder`、`TableDraggable`、`tableClasses`、
 * `getRowKey` …）一律直接沿用，不重寫 —— Angular 端整份 copy 了一次，結果
 * `TableDraggable.fixed` 靜默漂移成 `fixedRowKeys`。
 *
 * 欄位集合由 `tools/parity/check-vue-core-redeclarations.mjs` 逐一比對，
 * 只允許型別不同，不允許增減欄位。
 */

/**
 * Column definition base interface
 */
export interface TableColumnBase<T extends TableDataSource = TableDataSource> {
  /** Column alignment */
  align?: ColumnAlign;
  /** Custom class name for both header and body cells */
  className?: string;
  /** Custom class name for body cells */
  bodyClassName?: string;
  /** Data index to access the record value */
  dataIndex?: string;
  /** Enable text ellipsis with tooltip
   * @default true
   */
  ellipsis?: boolean;
  /** Fixed column position */
  fixed?: FixedType;
  /** Custom class name for header cells */
  headerClassName?: string;
  /** Unique key for the column */
  key: string;
  /** Maximum column width */
  maxWidth?: number;
  /** Minimum column width */
  minWidth?: number;
  /** Callback when sort state changes */
  onSort?: (key: string, order: SortOrder) => void;
  /** Custom render function for cell content */
  render?: (record: T, index: number) => VNodeChild;
  /** Controlled sort order */
  sortOrder?: SortOrder;
  /** Column header title */
  title?: VNodeChild;
  /** Tooltip help text for header */
  titleHelp?: VNodeChild;
  /** Menu configuration for header dropdown */
  titleMenu?: TableColumnTitleMenu;
  /** Column width in pixels */
  width?: number;
}

export interface TableColumnBaseWithMinWidthRequired<
  T extends TableDataSource = TableDataSource,
> extends TableColumnBase<T> {
  /** Minimum column width */
  minWidth: number;
}

export interface TableColumnWithDataIndex<
  T extends TableDataSource = TableDataSource,
> extends TableColumnBase<T> {
  /** Data index to access the record value */
  dataIndex: string;
  render?: never;
}

export interface TableColumnWithDataIndexAndMinWidth<
  T extends TableDataSource = TableDataSource,
> extends TableColumnBaseWithMinWidthRequired<T> {
  /** Data index to access the record value */
  dataIndex: string;
  render?: never;
}

export interface TableColumnWithRender<
  T extends TableDataSource = TableDataSource,
> extends TableColumnBase<T> {
  dataIndex?: never;
  /** Custom render function for cell content */
  render: (record: T, index: number) => VNodeChild;
}

export interface TableColumnWithRenderAndMinWidth<
  T extends TableDataSource = TableDataSource,
> extends TableColumnBaseWithMinWidthRequired<T> {
  dataIndex?: never;
  /** Custom render function for cell content */
  render: (record: T, index: number) => VNodeChild;
}

export type TableColumn<T extends TableDataSource = TableDataSource> =
  | TableColumnWithDataIndex<T>
  | TableColumnWithRender<T>;

export type TableColumnWithMinWidth<
  T extends TableDataSource = TableDataSource,
> =
  | TableColumnWithDataIndexAndMinWidth<T>
  | TableColumnWithRenderAndMinWidth<T>;

/** Toggleable configuration */
export interface TableToggleable<T extends TableDataSource = TableDataSource>
  extends Pick<
    TableColumnBase<T>,
    'title' | 'titleHelp' | 'titleMenu' | 'minWidth' | 'align'
  > {
  /** Enable toggle functionality */
  enabled: boolean;
  /** Fixed position of toggle column */
  fixed?: boolean;
  /** Check if a specific row's toggle is disabled */
  isRowDisabled?: (record: T) => boolean;
  /** Callback when toggle state changes */
  onToggleChange: (record: T, toggled: boolean) => void;
  /** Array of toggled row keys */
  toggledRowKeys: string[];
}

/** Collectable configuration */
export interface TableCollectable<T extends TableDataSource = TableDataSource>
  extends Pick<
    TableColumnBase<T>,
    'title' | 'titleHelp' | 'titleMenu' | 'minWidth' | 'align'
  > {
  /** Enable collect functionality */
  enabled: boolean;
  /** Array of collected row keys */
  collectedRowKeys: string[];
  /** Fixed position of collect column */
  fixed?: boolean;
  /** Check if a specific row's collect is disabled */
  isRowDisabled?: (record: T) => boolean;
  /** Callback when collect state changes */
  onCollectChange: (record: T, collected: boolean) => void;
}

/** Expandable configuration */
export interface TableExpandable<T extends TableDataSource = TableDataSource> {
  /** Render function for expanded row content */
  expandedRowRender: (record: T) => VNodeChild;
  /** Controlled expanded row keys */
  expandedRowKeys?: string[];
  /** Fixed position of expand icon column */
  fixed?: boolean;
  /** Callback when single row expand state changes */
  onExpand?: (expanded: boolean, record: T) => void;
  /** Callback when expanded rows change */
  onExpandedRowsChange?: (expandedRowKeys: string[]) => void;
  /** Determine if a row is expandable */
  rowExpandable?: (record: T) => boolean;
}

/**
 * Base actions column configuration
 */
export interface TableActionsBase<T extends TableDataSource = TableDataSource>
  extends Omit<
    TableColumnBase<T>,
    | 'bodyClassName'
    | 'dataIndex'
    | 'ellipsis'
    | 'key'
    | 'onSort'
    | 'render'
    | 'sortOrder'
  > {
  /** Column alignment
   * @default 'end'
   */
  align?: ColumnAlign;
  /** Function to generate action items for each row */
  render: (record: T, index: number) => TableActionItem<T>[];
  /** Button variant for all action buttons in the group */
  variant?: ButtonVariant;
}

/**
 * Actions column configuration (when resizable is false or not specified)
 */
export type TableActions<T extends TableDataSource = TableDataSource> =
  TableActionsBase<T>;

/**
 * Actions column configuration with required minWidth (when resizable is true)
 */
export interface TableActionsWithMinWidth<
  T extends TableDataSource = TableDataSource,
> extends TableActionsBase<T> {
  /** Minimum column width - required when table is resizable */
  minWidth: number;
}

/**
 * Which rows are mid-animation, produced by `useTableDataSource`.
 *
 * React declares this next to the hook that produces it; here it sits with the
 * props because `TableProps.transitionState` refers to it and the composable
 * imports it back. Name and shape are React's.
 */
export interface TableTransitionState {
  /** Keys of rows that are currently in "adding" state (highlighted) */
  addingKeys: Set<string>;
  /** Keys of rows that are currently in "deleting" state (red highlight before fade) */
  deletingKeys: Set<string>;
  /** Keys of rows that are currently fading out */
  fadingOutKeys: Set<string>;
}

/**
 * React 以三組判別聯集描述 Table 的 props，Vue 全部攤平成單一 interface：
 *
 * 1. `resizable: true` 時每個 column 與 `actions` 都必須給 `minWidth`；
 * 2. `draggable` 與 `pinnable` 互斥（兩者共用同一個把手欄位）；
 * 3. `scroll.virtualized: true` 時不能給 `draggable`，且 `scroll.y` 必填。
 *
 * Vue 的 `defineProps` 解析這種 union 會得到無法使用的結果（與 Input、Tag、
 * Select、Modal、Slider 同樣的限制），因此每個變體的 prop 都以選用的形式列在這裡。
 * prop 名稱、型別與執行期行為都沒有變；失去的只有上面三條的編譯期保證。
 *
 * 另外，React 端的 Table 一個 callback prop 都沒有 —— 所有回呼都在 `rowSelection`、
 * `expandable`、`draggable`、`pinnable`、`collectable`、`toggleable`、`pagination`、
 * `actions`、`emptyProps` 這些設定物件裡。Vue 因此**沒有任何 emit**。
 */
export interface TableProps<T extends TableDataSource = TableDataSource> {
  /**
   * Actions column configuration.
   * `minWidth` is required on it when `resizable` is true.
   */
  actions?: TableActions<T>;
  /** Collectable row configuration (star/favorite functionality) */
  collectable?: TableCollectable<T>;
  /**
   * Column configuration.
   * `minWidth` is required on every column when `resizable` is true.
   */
  columns: TableColumn<T>[];
  /** Data source */
  dataSource: T[];
  /**
   * Draggable row configuration.
   * Not available together with `pinnable`, nor when `scroll.virtualized` is true.
   */
  draggable?: TableDraggable<T>;
  /** Props for Empty component when no data */
  emptyProps?: EmptyProps & { height?: number | string };
  /** Expandable row configuration */
  expandable?: TableExpandable<T>;
  /**
   * Whether the table should stretch to fill its container width.
   * When true, the table will always be 100% width of its container.
   * Note: If the sum of all column widths is less than the table width,
   * columns will be proportionally stretched to fill the remaining space.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Highlight mode for hover effects
   * @default 'row'
   */
  highlight?: HighlightMode;
  /**
   * Loading state. While true the body renders placeholder skeleton rows
   * instead of data rows.
   *
   * Skeleton rows carry no record, so **no callback is ever handed a
   * placeholder row**. Every row-level callback — `column.render`,
   * `actions.render`, `rowState`, `rowSelection.getCheckboxProps`,
   * `expandable.rowExpandable`, `expandable.expandedRowRender`,
   * `toggleable.isRowDisabled`, `collectable.isRowDisabled` — is not called at
   * all while loading. `rowSelection.isSelectionDisabled` still runs, because
   * it also derives the header's select-all state, but only over the real
   * `dataSource`.
   *
   * All of them may therefore dereference the record freely without guarding
   * for the loading state.
   * @default false
   */
  loading?: boolean;
  /**
   * Number of skeleton rows to display when `loading` is true.
   * @default 10
   */
  loadingRowsCount?: number;
  /** Minimum height of the table */
  minHeight?: number | string;
  /**
   * Whether the table is nested inside an expanded row content area
   * @default false
   */
  nested?: boolean;
  /** Pagination configuration */
  pagination?: TablePaginationProps;
  /**
   * Pinnable row configuration.
   * Not available together with `draggable`.
   */
  pinnable?: TablePinnable<T>;
  /**
   * Whether columns are resizable by user interaction.
   * Requires `minWidth` on every column and on `actions`.
   * @default false
   */
  resizable?: boolean;
  /**
   * Row height preset token.
   * @default 'base'
   */
  rowHeightPreset?: 'base' | 'condensed' | 'detailed' | 'roomy';
  /** Row selection configuration */
  rowSelection?: TableRowSelection<T>;
  /** Semantic state applied to each row. Accepts a state string or a function that receives the row data and returns a state string. */
  rowState?: TableRowState | ((rowData: T) => TableRowState | undefined);
  /**
   * Scroll configuration.
   * `y` is required when `virtualized` is true.
   */
  scroll?: TableScroll;
  /** Row indexes where a separator border should be displayed */
  separatorAtRowIndexes?: number[];
  /**
   * Show header row
   * @default true
   */
  showHeader?: boolean;
  /**
   * Custom size variant
   * @default 'main'
   */
  size?: TableSize;
  /**
   * Whether to enable sticky header
   * @default true
   */
  sticky?: boolean;
  /** Toggleable row configuration */
  toggleable?: TableToggleable<T>;
  /** Transition state for row add/remove animations (from `useTableDataSource`) */
  transitionState?: TableTransitionState;
  /** Enable zebra striping for alternating row backgrounds */
  zebraStriping?: boolean;
}
