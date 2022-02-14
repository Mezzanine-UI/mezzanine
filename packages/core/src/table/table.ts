export const tablePrefix = 'mzn-table';
export const tableHeaderPrefix = `${tablePrefix}__header`;
export const tableBodyPrefix = `${tablePrefix}__body`;
export const tableCellPrefix = `${tablePrefix}__cell`;

export const tableClasses = {
  host: tablePrefix,
  header: tableHeaderPrefix,
  headerCellWrapper: `${tableHeaderPrefix}__cellWrapper`,
  body: tableBodyPrefix,
  bodyEmpty: `${tableBodyPrefix}__empty`,
  bodyFetchMore: `${tableBodyPrefix}__fetchMore`,
  bodyRow: `${tableBodyPrefix}__row`,
  bodyRowHighlight: `${tableBodyPrefix}__row--highlight`,
  bodyRowCellWrapper: `${tableBodyPrefix}__row__cellWrapper`,
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
  render?(column: TableColumn<SourceType>, source: SourceType, index: number): any;
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

/** === Feature Expandable */
export interface TableExpandable<SourceType> {
  className?: string;
  expandedRowRender(record: SourceType): any;
  rowExpandable?(record: SourceType): boolean;
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
    pageSize?: number;
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
