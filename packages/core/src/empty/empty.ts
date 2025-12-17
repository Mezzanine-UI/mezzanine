export const emptyPrefix = 'mzn-empty';

export const emptySizes = ['main', 'sub', 'minor'] as const;

export type EmptySize = (typeof emptySizes)[number];

export const emptyClasses = {
  actions: `${emptyPrefix}__actions`,
  container: `${emptyPrefix}__container`,
  description: `${emptyPrefix}__description`,
  host: emptyPrefix,
  icon: `${emptyPrefix}__icon`,
  size: (size: EmptySize) => `${emptyPrefix}--${size}`,
  title: `${emptyPrefix}__title`,
} as const;
