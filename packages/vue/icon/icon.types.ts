import type { IconColor } from '@mezzanine-ui/core/icon';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface IconProps {
  /**
   * Color name provided by palette.
   */
  color?: IconColor;
  /**
   * The icon provided by `@mezzanine-ui/icons` package.
   */
  icon: IconDefinition;
  /**
   * Icon size in px
   */
  size?: number;
  /**
   * Whether to spin the icon or not.
   * @default false
   */
  spin?: boolean;
  /**
   * Icon accessible title
   */
  title?: string;
}
