export const breadcrumbPrefix = 'mzn-breadcrumb';

export const breadcrumbClasses = {
  host: breadcrumbPrefix,
  iconButton: `${breadcrumbPrefix}__icon-button`,
  menu: `${breadcrumbPrefix}__menu`,
  menuContent: `${breadcrumbPrefix}__menu__content`,
  menuItem: `${breadcrumbPrefix}__menu-item`,
} as const;

export const breadcrumbItemClasses = {
  host: `${breadcrumbPrefix}__item`,
  trigger: `${breadcrumbPrefix}__item__trigger`,
  current: `${breadcrumbPrefix}__item--current`,
  expanded: `${breadcrumbPrefix}__item--expanded`,
  icon: `${breadcrumbPrefix}__item__icon`,
} as const;

export const breadcrumbOverflowMenuItemClasses = {
  host: `${breadcrumbPrefix}__overflow-menu-item`,
  trigger: `${breadcrumbPrefix}__overflow-menu-item__trigger`,
  expanded: `${breadcrumbPrefix}__overflow-menu-item--expanded`,
  icon: `${breadcrumbPrefix}__overflow-menu-item__icon`,
} as const;
