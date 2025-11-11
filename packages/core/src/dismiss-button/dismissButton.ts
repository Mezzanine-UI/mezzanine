export const dismissButtonPrefix = 'mzn-dismiss-button';

export const dismissButtonClasses = {
  host: dismissButtonPrefix,
  icon: `${dismissButtonPrefix}__icon`,
  type: (type: 'embedded' | 'standard') =>
    `${dismissButtonPrefix}--type-${type}`,
  variant: (variant: 'base' | 'contrast' | 'emphasis' | 'inverse') =>
    `${dismissButtonPrefix}--variant-${variant}`,
} as const;
