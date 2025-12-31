import { navigationPrefix } from './navigation';

export const navigationOptionPrefix = `${navigationPrefix}-option` as const;

export const navigationOptionClasses = {
  host: navigationOptionPrefix,
  group: `${navigationOptionPrefix}__group`,
  basic: `${navigationOptionPrefix}--basic`,
  level: (level: number) =>
    `${navigationOptionPrefix}--level-${level}` as const,
  content: `${navigationOptionPrefix}__content`,
  title: `${navigationOptionPrefix}__title`,
  toggleIcon: `${navigationOptionPrefix}__toggle-icon`,
  icon: `${navigationOptionPrefix}__icon`,
  active: `${navigationOptionPrefix}--active`,
  open: `${navigationOptionPrefix}--open`,
} as const;
