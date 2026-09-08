import type { TableDataSource } from '@mezzanine-ui/core/table';

export interface TableDragOrPinHandleCellProps<
  T extends TableDataSource = TableDataSource,
> {
  /**
   * Whatever the drag implementation wants spread onto the handle.
   * Mirrors `@hello-pangea/dnd`'s `dragHandleProps`, which React spreads here
   * verbatim.
   */
  dragHandleProps?: Record<string, unknown>;
  /** Whether the cell is pinned to the start edge. */
  fixed?: boolean;
  /** How far from that edge it sits. */
  fixedOffset?: number;
  /** Whether this is the header cell rather than a body cell. */
  isHeader?: boolean;
  /** The mode of this cell: 'drag' for drag handle, 'pin' for pin handle */
  mode: 'drag' | 'pin';
  /** Row record - required when mode is 'pin' and isHeader is false */
  record?: T;
  /** Whether the pinned cell casts its shadow. */
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}
