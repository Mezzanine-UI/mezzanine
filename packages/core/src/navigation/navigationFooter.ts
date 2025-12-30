import { navigationPrefix } from './navigation';

export const navigationFooterPrefix = `${navigationPrefix}-footer` as const;

export const navigationFooterClasses = {
  host: navigationFooterPrefix,
  icons: `${navigationFooterPrefix}__icons`,
} as const;
