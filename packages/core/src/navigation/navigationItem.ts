import { navigationPrefix } from './navigation';

export const navigationItemPrefix = `${navigationPrefix}-item` as const;

export const navigationItemClasses = {
  host: navigationItemPrefix,
  icon: `${navigationItemPrefix}__icon`,
  active: `${navigationItemPrefix}--active`,
  badge: `${navigationItemPrefix}__badge`,
} as const;
