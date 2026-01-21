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
}
