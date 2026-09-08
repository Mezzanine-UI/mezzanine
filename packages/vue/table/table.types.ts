import type { VNodeChild } from 'vue';
import type {
  ColumnAlign,
  FixedType,
  SortOrder,
  TableActionItem,
  TableColumnTitleMenu,
  TableDataSource,
} from '@mezzanine-ui/core/table';
import type { ButtonVariant } from '@mezzanine-ui/core/button';

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
