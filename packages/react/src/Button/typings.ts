import { JSXElementConstructor, ReactNode } from 'react';
import {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';

export type ButtonComponent = 'button' | 'a' | JSXElementConstructor<any>;

export interface ButtonPropsBase {
  /**
   * The color name provided by palette.
   * @default 'primary'
   */
  color?: ButtonColor;
  /**
   * If true, will use error color instead of color from props.
   * @default false
   */
  danger?: boolean;
  /**
   * If true, button will be disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, replace the original icon.
   * Replace suffix if only suffix provided, or prefix.
   * @default false
   */
  loading?: boolean;
  /**
   * The element placed on the start of button.
   */
  prefix?: ReactNode;
  /**
   * The size of button.
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * The element placed on the end of button.
   */
  suffix?: ReactNode;
  /**
   * The variant of button.
   * @default 'text'
   */
  variant?: ButtonVariant;
}
