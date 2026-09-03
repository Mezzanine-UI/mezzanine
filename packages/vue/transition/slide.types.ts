import type { TransitionImplementationProps } from './transition.types';

/**
 * Which edge the child slides in from.
 *
 * - `'right'` — enters leftwards from fully off its own width.
 * - `'top'` — enters downwards from fully above its own height.
 */
export type SlideFrom = 'right' | 'top';

export interface SlideProps extends TransitionImplementationProps {
  /**
   * The position of child element will enter from.
   * @default 'right'
   */
  from?: SlideFrom;
}
