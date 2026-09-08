import type { InputSize } from '@mezzanine-ui/core/input';

export interface SpinnerButtonProps {
  /**
   * Whether the spinner button is disabled.
   */
  disabled?: boolean;
  /**
   * The size of spinner button.
   * @default 'main'
   */
  size?: InputSize;
  /**
   * The type of spinner button.
   */
  type: 'up' | 'down';
}
