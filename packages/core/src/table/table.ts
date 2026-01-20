import type { IconDefinition } from '@mezzanine-ui/icons';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { Placement } from '@floating-ui/react-dom';
import type { ButtonVariant, ButtonIconType } from '@mezzanine-ui/core/button';

export const tablePrefix = 'mzn-table';
export const tableScrollContainerPrefix = `${tablePrefix}-scroll-area`;
export const tableLoadingPrefix = `${tablePrefix}-loading`;
export const tableHeaderPrefix = `${tablePrefix}__header`;
export const tableBodyPrefix = `${tablePrefix}__body`;
export const tableCellPrefix = `${tablePrefix}__cell`;
export const tableResizeHandlePrefix = `${tablePrefix}__resize-handle`;

export const tableClasses = {
  body: tableBodyPrefix,
  bodyCell: `${tableBodyPrefix}__cell`,
  bodyRow: `${tableBodyPrefix}__row`,
  bodyRowAdding: `${tableBodyPrefix}__row--adding`,
  bodyRowDeleting: `${tableBodyPrefix}__row--deleting`,
  bodyRowDragging: `${tableBodyPrefix}__row--dragging`,
  bodyRowFadingOut: `${tableBodyPrefix}__row--fading-out`,
  bodyRowHighlight: `${tableBodyPrefix}__row--highlight`,
  bodyRowSelected: `${tableBodyPrefix}__row--selected`,
  bodyRowSeparator: `${tableBodyPrefix}__row--separator`,
  bodyRowZebra: `${tableBodyPrefix}__row--zebra`,
  bulkActions: `${tablePrefix}__bulk-actions`,
  bulkActionsFixed: `${tablePrefix}__bulk-actions--fixed`,
  bulkActionsSelectionSummary: `${tablePrefix}__bulk-actions__selection-summary`,
  bulkActionsActionArea: `${tablePrefix}__bulk-actions__action-area`,
  bulkActionsSeparator: `${tablePrefix}__bulk-actions__separator`,
  cell: tableCellPrefix,
  cellAlignCenter: `${tableCellPrefix}--align-center`,
  cellAlignEnd: `${tableCellPrefix}--align-end`,
  cellAlignStart: `${tableCellPrefix}--align-start`,
  cellContent: `${tableCellPrefix}__content`,
  cellEllipsis: `${tableCellPrefix}--ellipsis`,
  cellFixed: `${tableCellPrefix}--fixed`,
  cellFixedEnd: `${tableCellPrefix}--fixed-end`,
  cellFixedShadow: `${tableCellPrefix}--fixed-shadow`,
  cellFixedStart: `${tableCellPrefix}--fixed-start`,
  cellHighlight: `${tableCellPrefix}--highlight`,
  main: `${tablePrefix}--main`,
  dragHandle: `${tablePrefix}__drag-handle`,
  dragHandleCell: `${tablePrefix}__drag-handle-cell`,
  empty: `${tablePrefix}__empty`,
  emptyRow: `${tablePrefix}__empty-row`,
  expandCell: `${tablePrefix}__expand-cell`,
  expandIcon: `${tablePrefix}__expand-icon`,
  expandIconExpanded: `${tablePrefix}__expand-icon--expanded`,
  expandedContent: `${tablePrefix}__expanded-content`,
  expandedRow: `${tablePrefix}__expanded-row`,
  expandedRowCell: `${tablePrefix}__expanded-row__cell`,
  header: tableHeaderPrefix,
  headerCell: `${tableHeaderPrefix}__cell`,
  headerCellActions: `${tableHeaderPrefix}__cell-actions`,
  headerCellContent: `${tableHeaderPrefix}__cell-content`,
  headerCellFixed: `${tableHeaderPrefix}__cell--fixed`,
  headerCellTitle: `${tableHeaderPrefix}__cell-title`,
  headerCellIcon: `${tableHeaderPrefix}__cell-icon`,
  host: `${tablePrefix}-host`,
  resizeHandle: tableResizeHandlePrefix,
  root: tablePrefix,
  scrollContainer: tableScrollContainerPrefix,
  selectionCell: `${tablePrefix}__selection-cell`,
  selectionCheckbox: `${tablePrefix}__selection-checkbox`,
  selectionColumn: `${tablePrefix}__selection-column`,
  sortIcon: `${tablePrefix}__sort-icon`,
  sortIconActive: `${tablePrefix}__sort-icon--active`,
  sortIcons: `${tablePrefix}__sort-icons`,
  sticky: `${tablePrefix}--sticky`,
  sub: `${tablePrefix}--sub`,
} as const;

/** Generic record type for table data */
export type TableRecord<T = unknown> = Record<string, T>;

/** Data source must have a unique key or id */
export interface TableDataSourceWithKey extends TableRecord {
  key: string;
}

export interface TableDataSourceWithId extends TableRecord {
  id: string;
}

export type TableDataSource = TableDataSourceWithKey | TableDataSourceWithId;

/** Get row key from data source */
export function getRowKey(record: TableDataSource): string {
  if ('key' in record) {
    return String(record.key);
  }

  if ('id' in record) {
    return String(record.id);
  }

  return '';
}

/** Sort direction type */
export type SortOrder = 'ascend' | 'descend' | null;

/** Column alignment */
export type ColumnAlign = 'start' | 'center' | 'end';

/** Highlight mode for hover effects */
export type HighlightMode = 'cell' | 'column' | 'row' | 'cross';

/** Fixed column position */
export type FixedType = boolean | 'start' | 'end';

/** Table size type */
export type TableSize = 'main' | 'sub';

/**
 * Title menu configuration for table column header dropdown
 */
export interface TableColumnTitleMenu {
  /** Dropdown options */
  options: DropdownOption[];
  /** Callback when an option is selected */
  onSelect?: (option: DropdownOption) => void;
  /** Maximum height of the dropdown list */
  maxHeight?: number | string;
  /** Dropdown placement relative to trigger */
  placement?: Placement;
}

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
  render?: (record: T, index: number) => React.ReactNode;
  /** Controlled sort order */
  sortOrder?: SortOrder;
  /** Column header title */
  title?: React.ReactNode;
  /** Tooltip help text for header */
  titleHelp?: React.ReactNode;
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
  render: (record: T, index: number) => React.ReactNode;
}

export interface TableColumnWithRenderAndMinWidth<
  T extends TableDataSource = TableDataSource,
> extends TableColumnBaseWithMinWidthRequired<T> {
  dataIndex?: never;
  /** Custom render function for cell content */
  render: (record: T, index: number) => React.ReactNode;
}

export type TableColumn<T extends TableDataSource = TableDataSource> =
  | TableColumnWithDataIndex<T>
  | TableColumnWithRender<T>;

export type TableColumnWithMinWidth<
  T extends TableDataSource = TableDataSource,
> =
  | TableColumnWithDataIndexAndMinWidth<T>
  | TableColumnWithRenderAndMinWidth<T>;

/** Selection mode for row selection */
export type TableSelectionMode = 'checkbox' | 'radio';

/**
 * action configuration for bulk actions (destructive or main action)
 */
export interface TableBulkGeneralAction<
  T extends TableDataSource = TableDataSource,
> {
  /** Icon for the destructive action button */
  icon?: IconDefinition;
  /** Label for the destructive action button */
  label: string;
  /** Callback when destructive action is clicked */
  onClick: (selectedRowKeys: string[], selectedRows: T[]) => void;
}

/**
 * Overflow action configuration for bulk actions (dropdown menu)
 */
export interface TableBulkOverflowAction<
  T extends TableDataSource = TableDataSource,
> {
  /** Icon for the overflow action button */
  icon?: IconDefinition;
  /** Label for the overflow action button */
  label: string;
  /** Maximum height of the dropdown list */
  maxHeight?: number | string;
  /** Callback when a dropdown option is selected */
  onSelect: (
    option: DropdownOption,
    selectedRowKeys: string[],
    selectedRows: T[],
  ) => void;
  /** Dropdown options */
  options: DropdownOption[];
  /** Dropdown placement relative to trigger */
  placement?: Placement;
}

/**
 * Bulk actions configuration for row selection
 */
export interface TableBulkActions<T extends TableDataSource = TableDataSource> {
  /** Destructive action (optional, single action with separator) */
  destructiveAction?: TableBulkGeneralAction<T>;
  /** Main actions (required, at least one action) */
  mainActions: [TableBulkGeneralAction<T>, ...TableBulkGeneralAction<T>[]];
  /** Overflow action with dropdown menu (optional, with separator) */
  overflowAction?: TableBulkOverflowAction<T>;
  /**
   * Label for selection summary
   */
  renderSelectionSummary?: (
    count: number,
    selectedRowKeys: string[],
    selectedRows: T[],
  ) => string;
}

/** Base row selection configuration */
export interface TableRowSelectionBase<
  T extends TableDataSource = TableDataSource,
> {
  /** Fixed position of the selection column */
  fixed?: boolean;
  /** Determine if the selection control is disabled for a row */
  isSelectionDisabled?: (record: T) => boolean;
}

/** Checkbox mode row selection configuration */
export interface TableRowSelectionCheckbox<
  T extends TableDataSource = TableDataSource,
> extends TableRowSelectionBase<T> {
  /**
   * Selection mode
   */
  mode: 'checkbox';
  /** Bulk actions configuration for batch operations */
  bulkActions?: TableBulkActions<T>;
  /** Get checkbox props for each row */
  getCheckboxProps?: (record: T) => {
    indeterminate?: boolean;
    selected?: boolean;
  };
  /** Hide select all checkbox in header */
  hideSelectAll?: boolean;
  /** Callback when select all is triggered, function called after onChange */
  onSelectAll?: (type: 'all' | 'none') => void;
  /** Preserve selected row keys when toggle select All even when data changes */
  preserveSelectedRowKeys?: boolean;
  /** Callback when selection changes */
  onChange: (
    selectedRowKeys: string[],
    selectedRow: T | null,
    selectedRows: T[],
  ) => void;
  /** Array of selected row keys */
  selectedRowKeys: string[];
}

/** Radio mode row selection configuration */
export interface TableRowSelectionRadio<
  T extends TableDataSource = TableDataSource,
> extends TableRowSelectionBase<T> {
  /** Selection mode */
  mode: 'radio';
  /** Callback when selection changes */
  onChange: (selectedRowKey: string | undefined, selectedRow: T | null) => void;
  /** Selected row key */
  selectedRowKey: string | undefined;
  /** Not available in radio mode */
  getCheckboxProps?: never;
  /** Not available in radio mode */
  hideSelectAll?: never;
  /** Not available in radio mode */
  onSelectAll?: never;
  /** Not available in radio mode */
  preserveSelectedRowKeys?: never;
}

/** Row selection configuration - discriminated union */
export type TableRowSelection<T extends TableDataSource = TableDataSource> =
  | TableRowSelectionCheckbox<T>
  | TableRowSelectionRadio<T>;

/** Scroll configuration */
export interface TableScroll {
  /**
   * Enable virtualized scrolling for large datasets.
   * When enabled, only visible rows are rendered for better performance.
   * Note: Cannot be used together with draggable rows.
   * @default false
   */
  virtualized?: boolean;
  /**
   * Vertical scroll height constraint.
   * Sets max-height on scroll container. Required when virtualized is true.
   */
  y?: number | string;
}

/** Draggable configuration */
export interface TableDraggable<T extends TableDataSource = TableDataSource> {
  /** Enable drag and drop */
  enabled: boolean;
  /** Fixed position of drag handle column */
  fixed?: boolean;
  /** Callback when drag ends */
  onDragEnd?: (
    newDataSource: T[],
    options: { draggingId: string; fromIndex: number; toIndex: number },
  ) => void;
}

/** Expandable configuration */
export interface TableExpandable<T extends TableDataSource = TableDataSource> {
  /** Render function for expanded row content */
  expandedRowRender: (record: T) => React.ReactNode;
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
 * Single action item configuration for table row actions
 */
export interface TableActionItem<T extends TableDataSource = TableDataSource> {
  /** Button label text */
  name?: string;
  /** Button icon */
  icon?: IconDefinition;
  /** Button icon type */
  iconType?: ButtonIconType;
  /** Click handler - receives the row record and index */
  onClick: (record: T, index: number) => void;
  /** Dynamic disabled state based on row data */
  disabled?: (record: T) => boolean;
  /** Button custom variant */
  variant?: ButtonVariant;
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

export function getCellAlignClass(align?: ColumnAlign): string {
  switch (align) {
    case 'center':
      return tableClasses.cellAlignCenter;
    case 'end':
      return tableClasses.cellAlignEnd;
    case 'start':
    default:
      return tableClasses.cellAlignStart;
  }
}

// default values
export const DRAG_HANDLE_KEY = '__mzn-drag-handle__';
export const SELECTION_KEY = '__mzn-selection__';
export const EXPANSION_KEY = '__mzn-expansion__';
export const TABLE_ACTIONS_KEY = '__mzn-table-actions__';
export const DRAG_HANDLE_COLUMN_WIDTH = 40;
export const SELECTION_COLUMN_WIDTH = 40;
export const EXPANSION_COLUMN_WIDTH = 40;
