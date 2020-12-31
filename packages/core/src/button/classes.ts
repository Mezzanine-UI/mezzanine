import { ButtonColor, ButtonSize, ButtonVariant } from './typings';
import { prefix } from './constants';

export const classes = {
  host: prefix,
  label: `${prefix}__label`,
  variant: (variant: ButtonVariant) => (variant === 'text' ? '' : `${prefix}--${variant}`),
  color: (color: ButtonColor) => `${prefix}--${color}`,
  size: (size: ButtonSize) => `${prefix}--${size}`,
  icon: `${prefix}--icon`,
  loading: `${prefix}--loading`,
};
