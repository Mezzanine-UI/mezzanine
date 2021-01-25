import { TagSize } from './typings';
import { tagPrefix } from './constants';

export const tagClasses = {
  host: tagPrefix,
  label: `${tagPrefix}__label`,
  closeIcon: `${tagPrefix}__close-icon`,
  disabled: `${tagPrefix}--disabled`,
  size: (size: TagSize) => `${tagPrefix}--${size}`,
} as const;
