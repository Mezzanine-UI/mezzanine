import { GeneralSize } from '@mezzanine-ui/system/size';

export const loadingPrefix = 'mzn-loading';

export const iconClasses = {
  host: loadingPrefix,
  stretch: `${loadingPrefix}--stretch`,
  spin: `${loadingPrefix}__spin`,
  size: (size: GeneralSize) => `${loadingPrefix}__spin--${size}`,
  icon: `${loadingPrefix}__spin__icon`,
  description: `${loadingPrefix}__spin__description`,
} as const;
