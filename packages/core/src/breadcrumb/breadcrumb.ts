export const breadcrumbPrefix = 'mzn-breadcrumb';

export const breadcrumbClasses = {
  host: breadcrumbPrefix,
} as const;

export const breadcrumbItemClasses = {
  host: `${breadcrumbPrefix}__item`,
  current: `${breadcrumbPrefix}__item--current`,
  expanded: `${breadcrumbPrefix}__item--expanded`,
  icon: `${breadcrumbPrefix}__item__icon`,
  menu: `${breadcrumbPrefix}__item__menu`,
} as const;
