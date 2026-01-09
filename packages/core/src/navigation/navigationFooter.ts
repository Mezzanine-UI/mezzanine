import { navigationPrefix } from './navigation';

export const navigationFooterPrefix = `${navigationPrefix}-footer` as const;

export const navigationFooterClasses = {
  host: navigationFooterPrefix,
  collapsed: `${navigationFooterPrefix}--collapsed`,
  icons: `${navigationFooterPrefix}__icons`,
} as const;
