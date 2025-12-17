import { JSXElementConstructor } from 'react';
import {
  ButtonIcon,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';

export type ButtonComponent = 'button' | 'a' | JSXElementConstructor<any>;

export interface ButtonPropsBase {
  /**
   * The variant of button.
   * @default 'base-primary'
   */
  variant?: ButtonVariant;
  /**
   * The size of button.
   * @default 'main'
   */
  size?: ButtonSize;
  /**
   * If true, button will be disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, show loading state with spinner icon.
   * @default false
   */
  loading?: boolean;
  /**
   * Icon configuration with position and icon source.
   */
  icon?: ButtonIcon;
}
