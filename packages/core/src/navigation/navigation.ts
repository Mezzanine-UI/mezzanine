export const navigationPrefix = 'mzn-navigation';

export const navigationClasses = {
  host: navigationPrefix,
  expand: `${navigationPrefix}--expand`,
  collapsed: `${navigationPrefix}--collapsed`,
  content: `${navigationPrefix}__content`,
  searchInput: `${navigationPrefix}__search-input`,
} as const;

export const navigationHeaderPrefix = `${navigationPrefix}-header` as const;

export const navigationHeaderClasses = {
  host: navigationHeaderPrefix,
  content: `${navigationHeaderPrefix}__content`,
  title: `${navigationHeaderPrefix}__title`,
  collapsed: `${navigationHeaderPrefix}--collapsed`,
} as const;

export const navigationFooterPrefix = `${navigationPrefix}-footer` as const;

export const navigationFooterClasses = {
  host: navigationFooterPrefix,
  collapsed: `${navigationFooterPrefix}--collapsed`,
  icons: `${navigationFooterPrefix}__icons`,
} as const;

export const navigationOverflowMenuPrefix =
  `${navigationPrefix}-overflow-menu` as const;

export const navigationOverflowMenuClasses = {
  host: navigationOverflowMenuPrefix,
  content: `${navigationOverflowMenuPrefix}__content`,
  subMenu: `${navigationOverflowMenuPrefix}__sub-menu`,
  option: `${navigationOverflowMenuPrefix}__option`,
} as const;

export const navigationOverflowMenuOptionPrefix =
  `${navigationPrefix}-overflow-menu-option` as const;

export const navigationOverflowMenuOptionClasses = {
  host: navigationOverflowMenuOptionPrefix,
  basic: `${navigationOverflowMenuOptionPrefix}--basic`,
  content: `${navigationOverflowMenuOptionPrefix}__content`,
  title: `${navigationOverflowMenuOptionPrefix}__title`,
  toggleIcon: `${navigationOverflowMenuOptionPrefix}__toggle-icon`,
  icon: `${navigationOverflowMenuOptionPrefix}__icon`,
  active: `${navigationOverflowMenuOptionPrefix}--active`,
  open: `${navigationOverflowMenuOptionPrefix}--open`,
  childrenWrapper: `${navigationOverflowMenuOptionPrefix}__children-wrapper`,
} as const;

export const navigationOptionPrefix = `${navigationPrefix}-option` as const;

export const navigationOptionClasses = {
  host: navigationOptionPrefix,
  hidden: `${navigationOptionPrefix}--hidden`,
  group: `${navigationOptionPrefix}__group`,
  basic: `${navigationOptionPrefix}--basic`,
  level: (level: number) =>
    `${navigationOptionPrefix}--level-${level}` as const,
  content: `${navigationOptionPrefix}__content`,
  trigger: `${navigationOptionPrefix}__content--trigger`,
  title: `${navigationOptionPrefix}__title`,
  toggleIcon: `${navigationOptionPrefix}__toggle-icon`,
  icon: `${navigationOptionPrefix}__icon`,
  active: `${navigationOptionPrefix}--active`,
  open: `${navigationOptionPrefix}--open`,
  collapsed: `${navigationOptionPrefix}--collapsed`,
  childrenWrapper: `${navigationOptionPrefix}__children-wrapper`,
} as const;

export const navigationOptionCategoryPrefix =
  `${navigationPrefix}-option-category` as const;

export const navigationOptionCategoryClasses = {
  host: navigationOptionCategoryPrefix,
  title: `${navigationOptionCategoryPrefix}__title`,
} as const;

export const navigationUserMenuPrefix =
  `${navigationPrefix}-user-menu` as const;

export const navigationUserMenuClasses = {
  host: navigationUserMenuPrefix,
  content: `${navigationUserMenuPrefix}__content`,
  open: `${navigationUserMenuPrefix}--open`,
  avatar: `${navigationUserMenuPrefix}__avatar`,
  userName: `${navigationUserMenuPrefix}__user-name`,
  icon: `${navigationUserMenuPrefix}__icon`,
} as const;

export const navigationIconButtonPrefix =
  `${navigationPrefix}-icon-button` as const;

export const navigationIconButtonClasses = {
  host: navigationIconButtonPrefix,
} as const;
