/**
 * Which of the table's own columns — the ones it adds rather than the consumer
 * declaring them — are present, how wide they are, and whether they are pinned
 * to an edge. Assembled by MznTable and read by `useTableFixedOffsets`.
 */
export interface ActionColumnConfig {
  /** Whether drag or pin handle column exists */
  hasDragOrPinHandle: boolean;
  /** Whether drag or pin handle is fixed */
  dragOrPinHandleFixed: boolean;
  /** The type of drag or pin handle: 'drag' or 'pin' */
  dragOrPinHandleType?: 'drag' | 'pin';
  /** Whether selection column exists */
  hasSelection: boolean;
  /** Whether selection is fixed */
  selectionFixed: boolean;
  /** Whether expansion column exists */
  hasExpansion: boolean;
  /** Whether expansion is fixed */
  expansionFixed: boolean;
  /** Whether toggleable column exists */
  hasToggleable: boolean;
  /** The minimum width of the toggleable column */
  toggleableMinWidth: number;
  /** Whether toggleable is fixed */
  toggleableFixed: boolean;
  /** Whether collectable column exists */
  hasCollectable: boolean;
  /** The minimum width of the collectable column */
  collectableMinWidth: number;
  /** Whether collectable is fixed */
  collectableFixed: boolean;
}
