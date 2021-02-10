import { badgePrefix } from './constants';

export const badgeClasses = {
  host: badgePrefix,
  container: `${badgePrefix}__container`,
  dot: `${badgePrefix}--dot`,
  hide: `${badgePrefix}--hide`,
} as const;
