import { navigationPrefix } from './navigation';

export const navigationHeaderPrefix = `${navigationPrefix}-header` as const;

export const navigationHeaderClasses = {
  host: navigationHeaderPrefix,
  siderIcon: `${navigationHeaderPrefix}__sider-icon`,
  logo: `${navigationHeaderPrefix}__logo`,
  content: `${navigationHeaderPrefix}__content`,
} as const;
