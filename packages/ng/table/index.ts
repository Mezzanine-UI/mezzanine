// Phase 5: public API aligned to React's Table index.ts.
// React exposes TableContext + TableContextValue, so the Angular equivalents
// MZN_TABLE_CONTEXT + TableContextValue stay public as well.
export { MznTable } from './table.component';
export { MznTableCellRender } from './table-cell-render.directive';
export type { MznTableCellRenderContext } from './table-cell-render.directive';
export { MZN_TABLE_CONTEXT } from './table-context';
export type { TableContextValue } from './table-context';
export { getRowKey } from './table-types';
export type {
  ColumnAlign,
  HighlightMode,
  RowHeightPreset,
  SortOrder,
  TableActionItem,
  TableActions,
  TableCollectable,
  TableColumn,
  TableDataSource,
  TableDraggable,
  TableEmptyProps,
  TableExpandable,
  TablePagination,
  TablePinnable,
  TableRowSelection,
  TableRowSelectionBase,
  TableRowSelectionCheckbox,
  TableRowSelectionRadio,
  TableRowState,
  TableScroll,
  TableSelectionMode,
  TableSize,
  TableToggleable,
  TableTransitionState,
} from './table-types';
