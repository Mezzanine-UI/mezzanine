export const tabsPrefix = 'mzn-tabs';

export const tabsClasses = {
  host: tabsPrefix,
  tabBar: `${tabsPrefix}__tab-bar`,
  tab: `${tabsPrefix}__tab`,
  tabActive: `${tabsPrefix}__tab--active`,
  pane: `${tabsPrefix}__pane`,
} as const;
