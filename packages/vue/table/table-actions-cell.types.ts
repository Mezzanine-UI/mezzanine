import type { TableDataSource } from '@mezzanine-ui/core/table';
import type { TableActionsBase } from './table.types';

export interface TableActionsCellProps<
  T extends TableDataSource = TableDataSource,
> {
  /** Actions configuration */
  actions: TableActionsBase<T>;
  /** Column index for highlight calculation */
  columnIndex: number;
  /** Fixed position */
  fixed?: 'end' | 'start';
  /** Fixed offset */
  fixedOffset?: number;
  /**
   * Row record. Omitted for loading skeleton rows, in which case
   * `actions.render` is never called.
   */
  record?: T;
  /** Row index */
  rowIndex: number;
  /** Whether to show shadow */
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}
