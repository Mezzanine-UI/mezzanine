import { MainColor } from '@mezzanine-ui/system/palette';
import { Size } from '@mezzanine-ui/system/size';

export type ButtonColor = Extract<MainColor, 'primary' | 'secondary'>;
export type ButtonSize = Size;
export type ButtonVariant = 'contained' | 'outlined' | 'text';

export const buttonPrefix = 'mzn-button';

export const buttonClasses = {
  host: buttonPrefix,
  label: `${buttonPrefix}__label`,
  variant: (variant: ButtonVariant) => (variant === 'text' ? '' : `${buttonPrefix}--${variant}`),
  color: (color: ButtonColor) => `${buttonPrefix}--${color}`,
  size: (size: ButtonSize) => `${buttonPrefix}--${size}`,
  danger: `${buttonPrefix}--danger`,
  disabled: `${buttonPrefix}--disabled`,
  icon: `${buttonPrefix}--icon`,
  loading: `${buttonPrefix}--loading`,
};
