import type {
  ButtonGroupOrientation,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';

export interface ButtonGroupProps {
  /**
   * If the `disabled` of a button inside group not provided, the `disabled` of group will override it.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, set width: 100%.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * The orientation of button group.
   * @default 'horizontal'
   */
  orientation?: ButtonGroupOrientation;
  /**
   * If the `size` of a button inside group not provided, the `size` of group will override it.
   * @default 'main'
   */
  size?: ButtonSize;
  /**
   * If the `variant` of a button inside group not provided, the `variant` of group will override it.
   * @default 'base-primary'
   */
  variant?: ButtonVariant;
}
