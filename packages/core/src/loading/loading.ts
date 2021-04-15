export const loadingPrefix = 'mzn-loading';

export const iconClasses = {
  host: loadingPrefix,
  stretch: `${loadingPrefix}--stretch`,
  spin: `${loadingPrefix}__spin`,
  icon: `${loadingPrefix}__spin__icon`,
  tip: `${loadingPrefix}__spin__tip`,
} as const;
