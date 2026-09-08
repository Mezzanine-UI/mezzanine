import type { TableSelectionMode } from '@mezzanine-ui/core/table';

export interface TableSelectionCellProps {
  /** Whether the row refuses selection. */
  disabled?: boolean;
  /** Whether the cell is pinned to the start edge. */
  fixed?: boolean;
  /** How far from that edge it sits. */
  fixedOffset?: number;
  /** Whether the control is withheld entirely (radio header, hideSelectAll). */
  hidden?: boolean;
  /** Whether the checkbox shows the partial state. */
  indeterminate?: boolean;
  /** Whether this is the header cell rather than a body cell. */
  isHeader?: boolean;
  /** Selection mode */
  mode?: TableSelectionMode;
  /** Whether the row is selected. */
  selected: boolean;
  /** Whether the pinned cell casts its shadow. */
  showShadow?: boolean;
  /** Explicit width for dragging state */
  width?: number;
}
