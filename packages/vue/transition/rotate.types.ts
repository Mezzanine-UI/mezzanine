export interface RotateProps {
  /**
   * The rotation degrees when `in` is true.
   * Common use case: arrow indicators in Select, Accordion, etc.
   * @default 180
   */
  degrees?: number;
  /**
   * The duration of the rotation transition in milliseconds.
   * @default MOTION_DURATION.fast (150ms)
   */
  duration?: number;
  /**
   * The easing function for the rotation transition.
   * @default MOTION_EASING.standard
   */
  easing?: string;
  /**
   * Whether the element should be in the rotated state.
   * @default false
   */
  in?: boolean;
  /**
   * The transform origin for child element.
   * @default 'center'
   */
  transformOrigin?: string;
}
