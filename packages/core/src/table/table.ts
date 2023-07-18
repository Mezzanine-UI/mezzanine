export const tableScrollContainerPrefix = 'mzn-table-scroll-area';
export const tableLoadingPrefix = 'mzn-table-loading';
export const tablePrefix = 'mzn-table';
export const tableHeaderFixedPrefix = `${tablePrefix}__header-fixed`;
export const tableHeaderPrefix = `${tablePrefix}__header`;
export const tableBodyPrefix = `${tablePrefix}__body`;
export const tableCellPrefix = `${tablePrefix}__cell`;

export const tableClasses = {
  loading: tableLoadingPrefix,
  scrollContainer: tableScrollContainerPrefix,
  host: tablePrefix,
  headerFixed: tableHeaderFixedPrefix,
  header: tableHeaderPrefix,
  headerCellWrapper: `${tableHeaderPrefix}__cellWrapper`,
  headerCellWrapperFixed: `${tableHeaderPrefix}__cellWrapper--fixed`,
  headerCellWrapperFixedStuck: `${tableHeaderPrefix}__cellWrapper--fixed--stuck`,
  body: tableBodyPrefix,
  bodyEmpty: `${tableBodyPrefix}__empty`,
  bodyFetchMore: `${tableBodyPrefix}__fetchMore`,
  bodyRow: `${tableBodyPrefix}__row`,
  bodyRowHighlight: `${tableBodyPrefix}__row--highlight`,
  bodyRowCellWrapper: `${tableBodyPrefix}__row__cellWrapper`,
  bodyRowCellWrapperFixed: `${tableBodyPrefix}__row__cellWrapper--fixed`,
  bodyRowCellWrapperFixedStuck: `${tableBodyPrefix}__row__cellWrapper--fixed--stuck`,
  bodyRowExpandedTableWrapper: `${tableBodyPrefix}__row__expandedTableWrapper`,
  bodyRowExpandedTable: `${tableBodyPrefix}__row__expandedTable`,
  bodyRowExpandedTableRow: `${tableBodyPrefix}__row__expandedTableRow`,
  cell: tableCellPrefix,
  cellEllipsis: `${tableCellPrefix}__ellipsis`,
  selections: `${tablePrefix}__selections`,
  icon: `${tablePrefix}__icon`,
  iconClickable: `${tablePrefix}__icon--clickable`,
  collapseAction: `${tablePrefix}__collapseAction`,
  pagination: `${tablePrefix}__pagination`,
  paginationIndicator: `${tablePrefix}__pagination__indicator`,
  paginationActions: `${tablePrefix}__pagination__actions`,
  refresh: `${tablePrefix}__refresh`,
} as const;

export type TableRecord<T> = Record<string, T>;

export interface TableDataSourceWithKey extends TableRecord<unknown> {
  key: string | number;
}

export interface TableDataSourceWithID extends TableRecord<unknown> {
  id: string | number;
}

export type TableDataSource = TableDataSourceWithKey | TableDataSourceWithID;

export type TableColumn<SourceType> = {
  dataIndex: string;
  title?: string;
  render?(source: SourceType, index: number, column: TableColumn<SourceType>): any;
  renderTitle?(classes: typeof tableClasses): any;
  renderTooltipTitle?(source: SourceType): string;
  // == Custom column style ==
  align?: 'start' | 'center' | 'end';
  bodyClassName?: string;
  headerClassName?: string;
  width?: number;
  // == Feature sorting ==
  sorter?(a: any, b: any): number;
  onSorted?(dataIndex: string, sortedType: string): void;
  // == Feature editing ==
  editable?: boolean;
  setCellProps?(record: SourceType): TableRecord<unknown>;
  // == Feature ellipsis ==
  /** @default true */
  ellipsis?: boolean;
  /** force display tooltip whenever content is hovered */
  forceShownTooltipWhenHovered?: boolean;
};

export type ExpandedTableColumn = Omit<TableColumn<TableRecord<unknown>>,
'title' |
'renderTitle' |
'align' |
'headerClassName' |
'width' |
'sorter' |
'onSorted' |
'editable' |
'setCellProps'
>;

export type TableFetchMore = {
  callback?(): any;
  isReachEnd?: boolean;
  isFetching?: boolean;
};

/** === Feature MultiSelection */
export interface TableRowAction {
  key: string;
  text: string;
  onClick?(keys: string[]): void;
  className?: string;
}

export interface TableRowSelection {
  selectedRowKey?: string[];
  onChange?(keys: string[]): void;
  actions?: TableRowAction[];
}

/** === Feature draggable */
export interface TableDraggable {
  enabled: boolean;
  onDragEnd?: (nextDataSource: any[]) => void;
}

/** === Feature Expandable */
export type ExpandRowBySources = {
  dataSource: TableDataSource[];
  columns?: ExpandedTableColumn[];
  className?: string;
};
export interface TableExpandable<SourceType> {
  className?: string;
  expandedRowRender(record: SourceType): string | ExpandRowBySources;
  rowExpandable?(record: SourceType): boolean;
  onExpand?(record: SourceType, status: boolean): void;
}

/** === Feature Pagination */
export interface TablePagination {
  current: number;
  /** @NOTE set this to true, should control pageSize properly to make layout correct */
  disableAutoSlicing?: boolean;
  onChange(page: number): void;
  total?: number;
  options?: {
    boundaryCount?: number;
    className?: string;
    disabled?: boolean;
    hideNextButton?: boolean;
    hidePreviousButton?: boolean;
    jumperButtonText?: string;
    jumperHintText?: string;
    jumperInputPlaceholder?: string;
    onChangePageSize?: (pageSize: number) => void;
    pageSize?: number;
    pageSizeLabel?: string;
    pageSizeOptions?: number[];
    pageSizeUnit?: string;
    renderPageSizeOptionName?: (pageSize: number) => string;
    renderPaginationSummary?: (start: number, end: number) => string;
    showJumper?: boolean;
    showPageSizeOptions?: boolean;
    siblingCount?: number;
  };
}

/** === Feature Refresh */
export interface TableRefresh {
  show?: boolean;
  onClick?(): void;
}

/** === Feature edit */
export interface TableComponents {
  body?: {
    cell?: any;
  }
}

/** === Feature scrolling */
export interface TableScrolling {
  x?: number;
  y?: number;
  /** Only available when horizontal scrolling is enabled */
  fixedFirstColumn?: boolean;
}

/** styling */
export function getColumnStyle(column: TableColumn<TableRecord<unknown>>) {
  if (!column) return {};

  let style = {};

  if (column.width) {
    style = {
      ...style,
      width: column.width,
      maxWidth: column.width,
      flex: 'auto',
    };
  }

  return style;
}

export function getCellStyle(column: TableColumn<TableRecord<unknown>>) {
  if (!column) return {};

  let style = {};

  if (column.align) {
    style = {
      ...style,
      justifyContent: column.align === 'center' ? column.align : `flex-${column.align}`,
    };
  }

  return style;
}
