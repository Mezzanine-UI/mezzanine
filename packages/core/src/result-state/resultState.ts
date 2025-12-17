export const resultStatePrefix = 'mzn-result-state';

export const resultStateTypes = [
  'information',
  'success',
  'help',
  'warning',
  'error',
  'failure',
] as const;

export type ResultStateType = (typeof resultStateTypes)[number];

export const resultStateSizes = ['main', 'sub'] as const;

export type ResultStateSize = (typeof resultStateSizes)[number];

export const resultStateClasses = {
  host: resultStatePrefix,
  type: (type: ResultStateType) => `${resultStatePrefix}--${type}`,
  size: (size: ResultStateSize) => `${resultStatePrefix}--${size}`,
  container: `${resultStatePrefix}__container`,
  icon: `${resultStatePrefix}__icon`,
  title: `${resultStatePrefix}__title`,
  description: `${resultStatePrefix}__description`,
  actions: `${resultStatePrefix}__actions`,
} as const;
