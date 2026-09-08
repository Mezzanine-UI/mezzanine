import type { TransitionImplementationProps } from './transition.types';

/**
 * Which side the child translates in from.
 *
 * - `'top'` — enters downwards from 4px above.
 * - `'bottom'` — enters upwards from 4px below.
 * - `'left'` — enters rightwards from 4px to the left.
 * - `'right'` — enters leftwards from 4px to the right.
 */
export type TranslateFrom = 'top' | 'bottom' | 'left' | 'right';

export interface TranslateProps extends TransitionImplementationProps {
  /**
   * The position of child element will enter from.
   * @default 'top'
   */
  from?: TranslateFrom;
}
