export type TransitionMode = 'enter' | 'exit';

export type TransitionDuration =
  | 'auto'
  | number
  | { [mode in TransitionMode]?: number };

export type TransitionEasing = string | { [mode in TransitionMode]?: string };

export type TransitionDelay = number | { [mode in TransitionMode]?: number };

/**
 * The props every transition implementation accepts, mirroring React's
 * `TransitionImplementationProps`.
 */
export interface TransitionImplementationProps {
  /**
   * Whether to perform the enter transition if `in` is true while it first mount
   * @default true
   */
  appear?: boolean;
  /**
   * The delay of the transition, in milliseconds
   * @default 0
   */
  delay?: TransitionDelay;
  /**
   * The duration of the transition, in milliseconds
   */
  duration?: TransitionDuration;
  /**
   * The timing function of the transition
   */
  easing?: TransitionEasing;
  /**
   * The flag to trigger toggling transition between `enter` and `exit` state
   * @default false
   */
  in?: boolean;
  /**
   * Whether to keeping mounting the child if exited.
   * @default false
   */
  keepMount?: boolean;
  /**
   * Whether to mount the child at the first time entering.
   * @default true
   */
  lazyMount?: boolean;
}
