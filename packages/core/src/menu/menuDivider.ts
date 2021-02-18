import { menuPrefix } from './menu';

export const menuDividerPrefix = `${menuPrefix}-divider` as const;

export const menuDividerClasses = {
  host: menuDividerPrefix,
} as const;
