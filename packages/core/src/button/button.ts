import { MainColor } from '../palette';
import { MznSize } from '../size';

export type ButtonColor = Extract<MainColor, 'primary' | 'secondary'>;
export type ButtonSize = MznSize;
export type ButtonVariant = 'contained' | 'outlined' | 'text';

export const buttonPrefix = 'mzn-button';

export const buttonClasses = {
  host: buttonPrefix,
  label: `${buttonPrefix}__label`,
  variant: (variant: ButtonVariant) => (variant === 'text' ? '' : `${buttonPrefix}--${variant}`),
  color: (color: ButtonColor) => `${buttonPrefix}--${color}`,
  size: (size: ButtonSize) => `${buttonPrefix}--${size}`,
  disabled: `${buttonPrefix}--disabled`,
  error: `${buttonPrefix}--error`,
  icon: `${buttonPrefix}--icon`,
  loading: `${buttonPrefix}--loading`,
};
