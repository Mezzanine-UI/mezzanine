import type { ButtonProps } from '../button/button.types';

export interface FloatingButtonProps
  extends Omit<ButtonProps, 'size' | 'tooltipPosition' | 'variant'> {
  /**
   * Auto hide floating button when `open` is true.
   * @default false
   */
  autoHideWhenOpen?: boolean;
  /**
   * Whether the floating button is in open state.
   */
  open?: boolean;
}
