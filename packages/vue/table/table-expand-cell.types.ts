export interface TableExpandCellProps {
  /** Whether this row may be expanded at all. */
  canExpand?: boolean;
  /** Whether the row is currently expanded. */
  expanded: boolean;
  /** Whether the cell is pinned to the start edge. */
  fixed?: boolean;
  /** How far from that edge it sits. */
  fixedOffset?: number;
  /** Whether this is the header cell rather than a body cell. */
  isHeader?: boolean;
  /** Whether the pinned cell casts its shadow. */
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}
