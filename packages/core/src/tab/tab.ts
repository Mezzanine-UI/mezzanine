export const tabPrefix = 'mzn-tab';

export const tabClasses = {
  host: tabPrefix,
  tabHorizontal: `${tabPrefix}--horizontal`,
  tabVertical: `${tabPrefix}--vertical`,
  tabActiveBar: `${tabPrefix}__active-bar`,
  tabItem: `${tabPrefix}__item`,
  tabItemActive: `${tabPrefix}__item--active`,
  tabItemIcon: `${tabPrefix}__item__icon`,
  tabItemBadge: `${tabPrefix}__item__badge`,
} as const;
