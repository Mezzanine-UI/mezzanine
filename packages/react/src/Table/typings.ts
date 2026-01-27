import type {
  HighlightMode,
  TableActions,
  TableActionsWithMinWidth,
  TableCollectable,
  TableColumn,
  TableColumnWithMinWidth,
  TableDataSource,
  TableDraggable,
  TableExpandable,
  TablePinnable,
  TableRowSelection,
  TableScroll,
  TableSize,
  TableToggleable,
} from '@mezzanine-ui/core/table';
import type { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import type { EmptyProps } from '../Empty';
import type { TablePaginationProps } from './components/TablePagination';
import type { TableTransitionState } from './hooks/useTableDataSource';

/**
 * Base props shared by all Table variants.
 */
export interface TableBaseProps<T extends TableDataSource = TableDataSource>
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'table'>,
    'children' | 'draggable' | 'summary' | 'onChange'
  > {
  /** Data source */
  dataSource: T[];
  /** Props for Empty component when no data */
  emptyProps?: EmptyProps & { height?: number | string };
  /** Expandable row configuration */
  expandable?: TableExpandable<T>;
  /** Collectable row configuration (star/favorite functionality) */
  collectable?: TableCollectable<T>;
  /**
   * Whether the table should stretch to fill its container width.
   * When true, the table will always be 100% width of its container.
   * Note: If the sum of all column widths is less than the table width,
   * columns will be proportionally stretched to fill the remaining space.
   * @default false
   */
  fullWidth?: boolean;
  /** Highlight mode for hover effects
   * @default 'row'
   */
  highlight?: HighlightMode;
  /** Loading state */
  loading?: boolean;
  /** Number of rows to display when loading */
  loadingRowsCount?: number;
  /** Minimum height of the table */
  minHeight?: number | string;
  /**
   * Whether the table is nested inside an expanded row content area
   */
  nested?: boolean;
  /** Pagination configuration */
  pagination?: TablePaginationProps;
  /**
   * Row height preset token.
   */
  rowHeightPreset?: 'base' | 'condensed' | 'detailed' | 'roomy';
  /** Row selection configuration */
  rowSelection?: TableRowSelection<T>;
  /** Row indexes where a separator border should be displayed */
  separatorAtRowIndexes?: number[];
  /** Show header row */
  showHeader?: boolean;
  /** Custom size variant
   * @default 'main'
   */
  size?: TableSize;
  /** Whether to enable sticky header
   *  @default true
   */
  sticky?: boolean;
  /** Toggleable row configuration */
  toggleable?: TableToggleable<T>;
  /** Transition state for row add/remove animations (from useTableDataSource hook) */
  transitionState?: TableTransitionState;
  /** Enable zebra striping for alternating row backgrounds */
  zebraStriping?: boolean;
}

/**
 * Props when resizable is enabled.
 * Requires minWidth on all columns.
 */
export interface TableResizableProps<
  T extends TableDataSource = TableDataSource,
> extends TableBaseProps<T> {
  /** Actions column configuration - minWidth required when resizable */
  actions?: TableActionsWithMinWidth<T>;
  /** Column configuration - minWidth required for each column when resizable */
  columns: TableColumnWithMinWidth<T>[];
  /**
   * Whether columns are resizable by user interaction
   */
  resizable: true;
}

/**
 * Props when resizable is disabled or not specified.
 */
export interface TableNonResizableProps<
  T extends TableDataSource = TableDataSource,
> extends TableBaseProps<T> {
  /** Actions column configuration */
  actions?: TableActions<T>;
  /** Column configuration */
  columns: TableColumn<T>[];
  /**
   * Whether columns are resizable by user interaction
   * @default false
   */
  resizable?: false;
}

/**
 * Props when draggable is enabled.
 * Pinnable is not allowed when draggable is enabled.
 */
export type TableDraggableOnlyProps<
  T extends TableDataSource = TableDataSource,
> = {
  /** Draggable row configuration */
  draggable: TableDraggable<T>;
  /** Not available when draggable is enabled */
  pinnable?: never;
};

/**
 * Props when pinnable is enabled.
 * Draggable is not allowed when pinnable is enabled.
 */
export type TablePinnableOnlyProps<
  T extends TableDataSource = TableDataSource,
> = {
  /** Not available when pinnable is enabled */
  draggable?: never;
  /** Pinnable row configuration */
  pinnable: TablePinnable<T>;
};

/**
 * Props when neither draggable nor pinnable is enabled.
 */
export type TableNoDragOrPinProps = {
  /** Draggable row configuration */
  draggable?: undefined;
  /** Pinnable row configuration */
  pinnable?: undefined;
};

/**
 * Combined drag or pin props - discriminated union.
 */
export type TableDragOrPinProps<T extends TableDataSource = TableDataSource> =
  | TableDraggableOnlyProps<T>
  | TablePinnableOnlyProps<T>
  | TableNoDragOrPinProps;

/**
 * Props when virtualized scrolling is enabled.
 * Draggable is not allowed in this mode, but pinnable is allowed.
 */
export type TableVirtualizedScrollProps = {
  /** Draggable row configuration - not available when virtualized is enabled */
  draggable?: never;
  /** Scroll configuration with virtualized enabled */
  scroll: TableScroll & { virtualized: true; y: number | string };
};

/**
 * Props when virtualized scrolling is disabled or not specified.
 * Both draggable and pinnable are allowed.
 */
export type TableNonVirtualizedScrollProps = {
  /** Scroll configuration for scrolling (virtualized defaults to false) */
  scroll?: TableScroll & { virtualized?: false };
};

/**
 * Props when virtualized scrolling is enabled.
 * Draggable is not allowed, but pinnable is allowed.
 */
export type TableVirtualizedProps<T extends TableDataSource = TableDataSource> =
  (TableResizableProps<T> | TableNonResizableProps<T>) &
    TableVirtualizedScrollProps & {
      /** Pinnable row configuration - allowed with virtualized */
      pinnable?: TablePinnable<T>;
    };

/**
 * Props when virtualized scrolling is disabled or not specified.
 * Draggable and pinnable are mutually exclusive.
 */
export type TableNonVirtualizedProps<
  T extends TableDataSource = TableDataSource,
> = (TableResizableProps<T> | TableNonResizableProps<T>) &
  TableNonVirtualizedScrollProps &
  TableDragOrPinProps<T>;

/**
 * TableProps - discriminated union to ensure:
 * 1. Draggable and virtualized scrolling are mutually exclusive
 * 2. Draggable and pinnable are mutually exclusive (they share the same column position)
 * 3. Resizable requires minWidth on all columns
 */
export type TableProps<T extends TableDataSource = TableDataSource> =
  | TableVirtualizedProps<T>
  | TableNonVirtualizedProps<T>;
