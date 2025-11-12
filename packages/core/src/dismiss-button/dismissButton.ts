export type DismissButtonType = 'embedded' | 'standard';

export type DismissButtonEmbeddedVariant = 'contrast' | 'emphasis';

export type DismissButtonStandardVariant = 'base' | 'inverse';

export type DismissButtonVariant =
  | DismissButtonEmbeddedVariant
  | DismissButtonStandardVariant;

export const dismissButtonPrefix = 'mzn-dismiss-button';

export const dismissButtonClasses = {
  host: dismissButtonPrefix,
  icon: `${dismissButtonPrefix}__icon`,
  type: (type: DismissButtonType) => `${dismissButtonPrefix}--type-${type}`,
  variant: (variant: DismissButtonVariant) =>
    `${dismissButtonPrefix}--variant-${variant}`,
} as const;
