import { navigationPrefix } from './navigation';

export const navigationSubMenuPrefix = `${navigationPrefix}-sub-menu` as const;

export const navigationSubMenuClasses = {
  host: navigationSubMenuPrefix,
  group: `${navigationSubMenuPrefix}__group`,
  title: `${navigationSubMenuPrefix}__title`,
  collapseIcon: `${navigationSubMenuPrefix}__collapse-icon`,
  icon: `${navigationSubMenuPrefix}__icon`,
  active: `${navigationSubMenuPrefix}--active`,
  open: `${navigationSubMenuPrefix}--open`,
} as const;
