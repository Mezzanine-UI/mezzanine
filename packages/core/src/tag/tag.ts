import { Size } from '@mezzanine-ui/system/size';

export type TagSize = Size;

export const tagPrefix = 'mzn-tag';

export const tagClasses = {
  host: tagPrefix,
  label: `${tagPrefix}__label`,
  closeIcon: `${tagPrefix}__close-icon`,
  disabled: `${tagPrefix}--disabled`,
  size: (size: TagSize) => `${tagPrefix}--${size}`,
} as const;
