import type { TransitionImplementationProps } from './transition.types';

/**
 * @deprecated 設計師未定義，暫時標記為 deprecated。
 */
export interface CollapseProps extends TransitionImplementationProps {
  /**
   * The height of the container while collapsed.
   * @default 0
   */
  collapsedHeight?: number | string;
}
