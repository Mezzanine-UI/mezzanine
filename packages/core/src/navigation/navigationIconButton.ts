import { navigationPrefix } from './navigation';

export const navigationIconButtonPrefix =
  `${navigationPrefix}-icon-button` as const;

export const navigationIconButtonClasses = {
  host: navigationIconButtonPrefix,
} as const;
