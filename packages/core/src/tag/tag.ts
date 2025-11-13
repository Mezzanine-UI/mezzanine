import { GeneralSize } from '@mezzanine-ui/system/size';

export const tagPrefix = 'mzn-tag';

export type TagType =
  | 'static'
  | 'counter'
  | 'overflow-counter'
  | 'dismissable'
  | 'addable';

export type TagSize = Exclude<GeneralSize, 'minor'>;

export const tagClasses = {
  host: tagPrefix,
  type: (type: TagType) => `${tagPrefix}--${type}`,
  size: (size: TagSize) => `${tagPrefix}--${size}`,
  label: `${tagPrefix}__label`,
  icon: `${tagPrefix}__icon`,
  active: `${tagPrefix}--active`,
  readOnly: `${tagPrefix}--read-only`,
  disabled: `${tagPrefix}--disabled`,
} as const;
