import type { TableDataSource } from '@mezzanine-ui/core/table';
import type { TableColumn } from './table.types';

export interface TableCellProps<T extends TableDataSource = TableDataSource> {
  /** How many columns this cell spans. */
  colSpan?: number;
  /** The column this cell belongs to. */
  column: TableColumn<T>;
  /** Where the column sits, for the highlight maths. */
  columnIndex: number;
  /** Which edge the cell is pinned to, if any. */
  fixed?: 'end' | 'start';
  /** How far from that edge it sits. */
  fixedOffset?: number;
  /**
   * Row record. Omitted for loading skeleton rows, in which case
   * `column.render` is never called and the cell renders a skeleton.
   */
  record?: T;
  /** Where the row sits, for the highlight maths. */
  rowIndex: number;
  /** Whether to show shadow on this cell (only for edge fixed columns) */
  showShadow?: boolean;
  /** Explicit width for dragging state (when position: fixed breaks colgroup) */
  width?: number;
}
