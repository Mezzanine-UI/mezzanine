import type { TransitionImplementationProps } from './transition.types';

export interface ScaleProps extends TransitionImplementationProps {
  /**
   * The transform origin for child element.
   * @default 'center'
   */
  transformOrigin?: string;
}
