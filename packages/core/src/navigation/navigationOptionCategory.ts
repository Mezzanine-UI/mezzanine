import { navigationPrefix } from './navigation';

export const navigationOptionCategoryPrefix =
  `${navigationPrefix}-option-category` as const;

export const navigationOptionCategoryClasses = {
  host: navigationOptionCategoryPrefix,
  title: `${navigationOptionCategoryPrefix}__title`,
} as const;
