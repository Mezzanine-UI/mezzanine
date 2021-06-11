export const tabsPrefix = 'mzn-tabs';

export const tabsClasses = {
  host: tabsPrefix,
  tabBar: `${tabsPrefix}__tab-bar`,
  overflow: `${tabsPrefix}--overflow`,
  tabs: `${tabsPrefix}__tabs`,
  scrollBtn: `${tabsPrefix}__scroll-btn`,
  tab: `${tabsPrefix}__tab`,
  tabActive: `${tabsPrefix}__tab--active`,
  pane: `${tabsPrefix}__pane`,
} as const;
