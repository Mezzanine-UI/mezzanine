export const breadcrumbPrefix = 'mzn-breadcrumb';

export const breadcrumbClasses = {
  host: breadcrumbPrefix,
} as const;

export const breadcrumbItemClasses = {
  host: `${breadcrumbPrefix}__item`,
  trigger: `${breadcrumbPrefix}__item__trigger`,
  current: `${breadcrumbPrefix}__item--current`,
  expanded: `${breadcrumbPrefix}__item--expanded`,
  icon: `${breadcrumbPrefix}__item__icon`,
  menu: `${breadcrumbPrefix}__item__menu`,
  menuItem: `${breadcrumbPrefix}__item__menu-item`,
  menuItemTrigger: `${breadcrumbPrefix}__item__menu-item__trigger`,
} as const;
