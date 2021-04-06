import { navigationPrefix } from './navigation';

export const navigationSubMenuPrefix = `${navigationPrefix}-sub-menu` as const;

export const navigationSubMenuClasses = {
  host: navigationSubMenuPrefix,
  group: `${navigationSubMenuPrefix}__group`,
  indent: `${navigationSubMenuPrefix}--indent`,
  title: `${navigationSubMenuPrefix}__title`,
  toggleIcon: `${navigationSubMenuPrefix}__toggle-icon`,
  icon: `${navigationSubMenuPrefix}__icon`,
  active: `${navigationSubMenuPrefix}--active`,
  open: `${navigationSubMenuPrefix}--open`,
} as const;
