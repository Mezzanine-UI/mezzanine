import type { TableDataSource } from '@mezzanine-ui/core/table';

export interface TableToggleableCellProps<
  T extends TableDataSource = TableDataSource,
> {
  /** Whether the cell is pinned to the end edge. */
  fixed?: boolean;
  /** How far from that edge it sits. */
  fixedOffset?: number;
  /** Row record — absent on a loading skeleton row. */
  record?: T;
  /** Whether the pinned cell casts its shadow. */
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}
