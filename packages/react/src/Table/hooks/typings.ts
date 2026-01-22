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
