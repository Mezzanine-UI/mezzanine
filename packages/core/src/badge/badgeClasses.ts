import { badgePrefix } from './constants';

export const badgeClasses = {
  host: badgePrefix,
  container: `${badgePrefix}__container`,
  dot: `${badgePrefix}--dot`,
  count: `${badgePrefix}--count`,
  hide: `${badgePrefix}--hide`,
} as const;
