import { menuPrefix } from './menu';

export const menuItemGroupPrefix = `${menuPrefix}-item-group` as const;

export const menuItemGroupClasses = {
  host: menuItemGroupPrefix,
  label: `${menuItemGroupPrefix}__label`,
  items: `${menuItemGroupPrefix}__items`,
} as const;
