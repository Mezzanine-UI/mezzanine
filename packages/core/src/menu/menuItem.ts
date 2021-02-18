import { menuPrefix } from './menu';

export const menuItemPrefix = `${menuPrefix}-item` as const;

export const menuItemClasses = {
  host: menuItemPrefix,
  label: `${menuItemPrefix}__label`,
  activeIcon: `${menuItemPrefix}__active-icon`,
  active: `${menuItemPrefix}--active`,
  disabled: `${menuItemPrefix}--disabled`,
} as const;
