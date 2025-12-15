export const tabPrefix = 'mzn-tab';

export const tabClasses = {
  host: tabPrefix,
  tabBar: `${tabPrefix}__tab-bar`,
  overflow: `${tabPrefix}--overflow`,
  tab: `${tabPrefix}__tab`,
  scrollBtn: `${tabPrefix}__scroll-btn`,
  tabItem: `${tabPrefix}__item`,
  tabActive: `${tabPrefix}__item--active`,
  pane: `${tabPrefix}__pane`,
} as const;
