export const tableV2Prefix = 'mzn-table-v2';
export const tableV2ScrollContainerPrefix = `${tableV2Prefix}-scroll-area`;
export const tableV2LoadingPrefix = `${tableV2Prefix}-loading`;
export const tableV2HeaderPrefix = `${tableV2Prefix}__header`;
export const tableV2BodyPrefix = `${tableV2Prefix}__body`;
export const tableV2CellPrefix = `${tableV2Prefix}__cell`;
export const tableV2ResizeHandlePrefix = `${tableV2Prefix}__resize-handle`;

export const tableV2Classes = {
  body: tableV2BodyPrefix,
  bodyCell: `${tableV2BodyPrefix}__cell`,
  bodyCellContent: `${tableV2BodyPrefix}__cell-content`,
  bodyCellFixed: `${tableV2BodyPrefix}__cell--fixed`,
  bodyCellFixedEnd: `${tableV2BodyPrefix}__cell--fixed-end`,
  bodyCellFixedShadow: `${tableV2BodyPrefix}__cell--fixed-shadow`,
  bodyCellFixedStart: `${tableV2BodyPrefix}__cell--fixed-start`,
  bodyEmpty: `${tableV2BodyPrefix}__empty`,
  bodyRow: `${tableV2BodyPrefix}__row`,
  bodyRowDragging: `${tableV2BodyPrefix}__row--dragging`,
  bodyRowExpanded: `${tableV2BodyPrefix}__row--expanded`,
  bodyRowHighlight: `${tableV2BodyPrefix}__row--highlight`,
  bodyVirtualContainer: `${tableV2BodyPrefix}__virtual-container`,
  bordered: `${tableV2Prefix}--bordered`,
  cell: tableV2CellPrefix,
  cellAlignCenter: `${tableV2CellPrefix}--align-center`,
  cellAlignEnd: `${tableV2CellPrefix}--align-end`,
  cellAlignStart: `${tableV2CellPrefix}--align-start`,
  cellContent: `${tableV2CellPrefix}__content`,
  cellEllipsis: `${tableV2CellPrefix}--ellipsis`,
  cellFixed: `${tableV2CellPrefix}--fixed`,
  cellFixedEnd: `${tableV2CellPrefix}--fixed-end`,
  cellFixedShadow: `${tableV2CellPrefix}--fixed-shadow`,
  cellFixedStart: `${tableV2CellPrefix}--fixed-start`,
  cellHighlight: `${tableV2CellPrefix}--highlight`,
  main: `${tableV2Prefix}--main`,
  dragHandle: `${tableV2Prefix}__drag-handle`,
  dragHandleCell: `${tableV2Prefix}__drag-handle-cell`,
  empty: `${tableV2Prefix}__empty`,
  emptyRow: `${tableV2Prefix}__empty-row`,
  expandCell: `${tableV2Prefix}__expand-cell`,
  expandIcon: `${tableV2Prefix}__expand-icon`,
  expandIconExpanded: `${tableV2Prefix}__expand-icon--expanded`,
  expandedContent: `${tableV2Prefix}__expanded-content`,
  expandedRow: `${tableV2Prefix}__expanded-row`,
  expandedRowCell: `${tableV2Prefix}__expanded-row__cell`,
  header: tableV2HeaderPrefix,
  headerCell: `${tableV2HeaderPrefix}__cell`,
  headerCellActions: `${tableV2HeaderPrefix}__cell-actions`,
  headerCellContent: `${tableV2HeaderPrefix}__cell-content`,
  headerCellFixed: `${tableV2HeaderPrefix}__cell--fixed`,
  headerCellTitle: `${tableV2HeaderPrefix}__cell-title`,
  headerCellIcon: `${tableV2HeaderPrefix}__cell-icon`,
  headerRow: `${tableV2HeaderPrefix}__row`,
  host: tableV2Prefix,
  loading: tableV2LoadingPrefix,
  resizeHandle: tableV2ResizeHandlePrefix,
  resizeHandleActive: `${tableV2ResizeHandlePrefix}--active`,
  root: tableV2Prefix,
  row: `${tableV2Prefix}__row`,
  rowExpanded: `${tableV2Prefix}__row--expanded`,
  rowSelected: `${tableV2Prefix}__row--selected`,
  scrollContainer: tableV2ScrollContainerPrefix,
  selectionCell: `${tableV2Prefix}__selection-cell`,
  selectionCheckbox: `${tableV2Prefix}__selection-checkbox`,
  selectionColumn: `${tableV2Prefix}__selection-column`,
  sortIcon: `${tableV2Prefix}__sort-icon`,
  sortIconActive: `${tableV2Prefix}__sort-icon--active`,
  sortIcons: `${tableV2Prefix}__sort-icons`,
  sticky: `${tableV2Prefix}--sticky`,
  sub: `${tableV2Prefix}--sub`,
  // Highlight mode classes
  highlightCell: `${tableV2Prefix}--highlight-cell`,
  highlightColumn: `${tableV2Prefix}--highlight-column`,
  highlightCross: `${tableV2Prefix}--highlight-cross`,
  highlightRow: `${tableV2Prefix}--highlight-row`,
} as const;

/** Generic record type for table data */
export type TableV2Record<T = unknown> = Record<string, T>;

/** Data source must have a unique key or id */
export interface TableV2DataSourceWithKey extends TableV2Record {
  key: string | number;
}

export interface TableV2DataSourceWithId extends TableV2Record {
  id: string | number;
}

export type TableV2DataSource =
  | TableV2DataSourceWithKey
  | TableV2DataSourceWithId;

/** Get row key from data source */
export function getRowKey(record: TableV2DataSource): string {
  if ('key' in record) {
    return String(record.key);
  }

  if ('id' in record) {
    return String(record.id);
  }

  return '';
}

/** Sort direction type */
export type SortDirection = 'ascend' | 'descend' | null;

/** Column alignment */
export type ColumnAlign = 'start' | 'center' | 'end';

/** Highlight mode for hover effects */
export type HighlightMode = 'cell' | 'column' | 'row' | 'cross';

/** Fixed column position */
export type FixedType = boolean | 'start' | 'end';

/**
 * Column definition base interface
 */
export interface TableV2ColumnBase<
  T extends TableV2DataSource = TableV2DataSource,
> {
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
  onSort?: (key: string, order: SortDirection) => void;
  /** Custom render function for cell content */
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  /** Enable column resizing @default false */
  resizable?: boolean;
  /** Controlled sort order */
  sortOrder?: SortDirection;
  /** Column header title */
  title?: React.ReactNode;
  /** Tooltip help text for header */
  titleHelp?: React.ReactNode;
  /** Menu content for header (e.g., dropdown menu) */
  titleMenu?: React.ReactNode;
  /** Column width in pixels */
  width?: number;
}

export type TableV2Column<T extends TableV2DataSource = TableV2DataSource> =
  TableV2ColumnBase<T>;

/** Row selection configuration */
export interface TableV2RowSelection<
  T extends TableV2DataSource = TableV2DataSource,
> {
  /** Fixed position of the selection column */
  fixed?: boolean;
  /** Get checkbox/radio props for each row */
  isCheckboxDisabled?: (record: T) => boolean;
  /** Hide select all checkbox in header */
  hideSelectAll?: boolean;
  /** Callback when selection changes */
  onChange: (
    selectedRowKeys: (string | number)[],
    selectedRow: T | null,
    selectedRows: T[],
  ) => void;
  /** Callback when select all is triggered, function called after onChange */
  onSelectAll?: (type: 'all' | 'none') => void;
  /** Preserve selected row keys when toggle select All even when data changes */
  preserveSelectedRowKeys?: boolean;
  /** Array of selected row keys */
  selectedRowKeys: (string | number)[];
}

/** Scroll configuration */
export interface TableV2Scroll {
  /** Horizontal scroll width */
  x?: number | string;
  /** Vertical scroll height */
  y?: number | string;
}

/** Draggable configuration */
export interface TableV2Draggable<
  T extends TableV2DataSource = TableV2DataSource,
> {
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
export interface TableV2Expandable<
  T extends TableV2DataSource = TableV2DataSource,
> {
  /** Render function for expanded row content */
  expandedRowRender: (
    record: T,
    childNeededProps: {
      table: {
        nested: boolean;
        showHeader: boolean;
      };
    },
  ) => React.ReactNode;
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
  column: TableV2Column,
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
      return tableV2Classes.cellAlignCenter;
    case 'end':
      return tableV2Classes.cellAlignEnd;
    case 'start':
    default:
      return tableV2Classes.cellAlignStart;
  }
}

// default values
export const DRAG_HANDLE_KEY = '__mzn-drag-handle__';
export const SELECTION_KEY = '__mzn-selection__';
export const EXPANSION_KEY = '__mzn-expansion__';
export const DRAG_HANDLE_COLUMN_WIDTH = 48;
export const SELECTION_COLUMN_WIDTH = 40;
export const EXPANSION_COLUMN_WIDTH = 40;
