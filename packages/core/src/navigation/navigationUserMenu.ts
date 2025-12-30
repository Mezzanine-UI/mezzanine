import { navigationPrefix } from './navigation';

export const navigationUserMenuPrefix =
  `${navigationPrefix}-user-menu` as const;

export const navigationUserMenuClasses = {
  host: navigationUserMenuPrefix,
  open: `${navigationUserMenuPrefix}--open`,
  avatar: `${navigationUserMenuPrefix}__avatar`,
  userName: `${navigationUserMenuPrefix}__user-name`,
  icon: `${navigationUserMenuPrefix}__icon`,
} as const;
