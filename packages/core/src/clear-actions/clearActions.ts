export type ClearActionsType = 'embedded' | 'standard' | 'clearable';

export type ClearActionsEmbeddedVariant = 'contrast' | 'emphasis';

export type ClearActionsStandardVariant = 'base' | 'inverse';

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
};
