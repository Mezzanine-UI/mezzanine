import { emptyPrefix } from './constants';

export const emptyClasses = {
  host: emptyPrefix,
  icon: `${emptyPrefix}__icon`,
  title: `${emptyPrefix}__title`,
  fullHeight: `${emptyPrefix}--fullHeight`,
} as const;
