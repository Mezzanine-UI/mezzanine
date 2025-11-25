export type ClearActionsType = 'embedded' | 'standard' | 'clearable';

export type ClearActionsEmbeddedVariant = 'contrast' | 'emphasis';

export type ClearActionsStandardVariant = 'base' | 'inverse';

export enum ClearActionsTypeEnum {
  Embedded = 'embedded',
  Standard = 'standard',
  Clearable = 'clearable',
}

export enum ClearActionsEmbeddedVariantEnum {
  Contrast = 'contrast',
  Emphasis = 'emphasis',
}

export enum ClearActionsStandardVariantEnum {
  Base = 'base',
  Inverse = 'inverse',
}

export type ClearActionsVariant =
  | ClearActionsEmbeddedVariant
  | ClearActionsStandardVariant
  | 'default';

export const clearActionsPrefix = 'mzn-clear-actions';

export const clearActionsClasses = {
  host: clearActionsPrefix,
  icon: `${clearActionsPrefix}__icon`,
  type: (type: ClearActionsType) => `${clearActionsPrefix}--type-${type}`,
  variant: (variant: ClearActionsVariant) =>
    `${clearActionsPrefix}--variant-${variant}`,
} as const;
