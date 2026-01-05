import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { Placement } from '@floating-ui/react-dom';

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
  bodyCellContent: `${tableBodyPrefix}__cell-content`,
  bodyCellFixed: `${tableBodyPrefix}__cell--fixed`,
  bodyCellFixedEnd: `${tableBodyPrefix}__cell--fixed-end`,
  bodyCellFixedShadow: `${tableBodyPrefix}__cell--fixed-shadow`,
  bodyCellFixedStart: `${tableBodyPrefix}__cell--fixed-start`,
  bodyEmpty: `${tableBodyPrefix}__empty`,
  bodyRow: `${tableBodyPrefix}__row`,
  bodyRowAdding: `${tableBodyPrefix}__row--adding`,
  bodyRowDeleting: `${tableBodyPrefix}__row--deleting`,
  bodyRowDragging: `${tableBodyPrefix}__row--dragging`,
  bodyRowFadingOut: `${tableBodyPrefix}__row--fading-out`,
  bodyRowHighlight: `${tableBodyPrefix}__row--highlight`,
  bodyRowSelected: `${tableBodyPrefix}__row--selected`,
  bodyVirtualContainer: `${tableBodyPrefix}__virtual-container`,
  bordered: `${tablePrefix}--bordered`,
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
  host: tablePrefix,
  resizeHandle: tableResizeHandlePrefix,
  resizeHandleActive: `${tableResizeHandlePrefix}--active`,
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
  // Highlight mode classes
  highlightCell: `${tablePrefix}--highlight-cell`,
  highlightColumn: `${tablePrefix}--highlight-column`,
  highlightCross: `${tablePrefix}--highlight-cross`,
  highlightRow: `${tablePrefix}--highlight-row`,
} as const;

/** Generic record type for table data */
export type TableRecord<T = unknown> = Record<string, T>;

/** Data source must have a unique key or id */
export interface TableDataSourceWithKey extends TableRecord {
  key: string | number;
}

export interface TableDataSourceWithId extends TableRecord {
  id: string | number;
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
  /** Maximum column width (for resizable columns) */
  maxWidth?: number;
  /** Minimum column width (for resizable columns) */
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

export type TableColumn<T extends TableDataSource = TableDataSource> =
  TableColumnBase<T>;

/** Selection mode for row selection */
export type TableSelectionMode = 'checkbox' | 'radio';

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
    selectedRowKeys: (string | number)[],
    selectedRow: T | null,
    selectedRows: T[],
  ) => void;
  /** Array of selected row keys */
  selectedRowKeys: (string | number)[];
}

/** Radio mode row selection configuration */
export interface TableRowSelectionRadio<
  T extends TableDataSource = TableDataSource,
> extends TableRowSelectionBase<T> {
  /** Selection mode */
  mode: 'radio';
  /** Callback when selection changes */
  onChange: (selectedRowKey: string | number, selectedRow: T | null) => void;
  /** Array of selected row keys */
  selectedRowKey: string | number | null | undefined;
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
  /** Horizontal scroll width */
  x?: number | string;
  /** Vertical scroll height (required when virtualized is true) */
  y?: number | string;
}

/** Draggable configuration */
export interface TableDraggable<T extends TableDataSource = TableDataSource> {
  /** Enable drag and drop */
  enabled: boolean;
  /** Fixed position of drag handle column */
  fixed?: boolean;
  /** Indent size for nested rows */
  indentSize?: number;
  /** Callback when drag ends */
  onDragEnd?: (newDataSource: T[]) => void;
}

/** Expandable configuration */
export interface TableExpandable<T extends TableDataSource = TableDataSource> {
  /** Render function for expanded row content */
  expandedRowRender: (record: T) => React.ReactNode;
  /** Controlled expanded row keys */
  expandedRowKeys?: (string | number)[];
  /** Fixed position of expand icon column */
  fixed?: boolean;
  /** Callback when single row expand state changes */
  onExpand?: (expanded: boolean, record: T) => void;
  /** Callback when expanded rows change */
  onExpandedRowsChange?: (expandedRowKeys: (string | number)[]) => void;
  /** Determine if a row is expandable */
  rowExpandable?: (record: T) => boolean;
}

/** Column style helpers */
export function getColumnStyle(
  column: TableColumn,
  computedWidth?: number,
): React.CSSProperties {
  const style: React.CSSProperties = {};

  const width = computedWidth ?? column.width;

  if (width) {
    style.width = width;
    style.minWidth = width;
    style.maxWidth = width;
    style.flex = '0 0 auto';
  } else {
    style.flex = '1 1 0';
    style.minWidth = 0;
  }

  return style;
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
export const DRAG_HANDLE_COLUMN_WIDTH = 40;
export const SELECTION_COLUMN_WIDTH = 40;
export const EXPANSION_COLUMN_WIDTH = 40;
