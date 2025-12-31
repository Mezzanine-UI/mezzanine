import { navigationPrefix } from './navigation';

export const navigationHeaderPrefix = `${navigationPrefix}-header` as const;

export const navigationHeaderClasses = {
  host: navigationHeaderPrefix,
  content: `${navigationHeaderPrefix}__content`,
} as const;
