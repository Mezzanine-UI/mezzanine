import { GeneralSize } from '@mezzanine-ui/system/size';

export const spinPrefix = 'mzn-spin';

export const iconClasses = {
  host: spinPrefix,
  stretch: `${spinPrefix}--stretch`,
  spin: `${spinPrefix}__spin`,
  size: (size: GeneralSize) => `${spinPrefix}__spin--${size}`,
  icon: `${spinPrefix}__spin__icon`,
  description: `${spinPrefix}__spin__description`,
} as const;
