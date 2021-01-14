import { ButtonColor, ButtonSize, ButtonVariant } from './typings';
import { buttonPrefix } from './constants';

export const buttonClasses = {
  host: buttonPrefix,
  label: `${buttonPrefix}__label`,
  variant: (variant: ButtonVariant) => (variant === 'text' ? '' : `${buttonPrefix}--${variant}`),
  color: (color: ButtonColor) => `${buttonPrefix}--${color}`,
  size: (size: ButtonSize) => `${buttonPrefix}--${size}`,
  error: `${buttonPrefix}--error`,
  icon: `${buttonPrefix}--icon`,
  loading: `${buttonPrefix}--loading`,
};
