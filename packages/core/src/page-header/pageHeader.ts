export const pageHeaderPrefix = 'mzn-page-header';

export const pageHeaderClasses = {
  host: pageHeaderPrefix,
  headerContent: `${pageHeaderPrefix}__header-content`,
  backIcon: `${pageHeaderPrefix}__back-icon`,
  pageTitleWithIcon: `${pageHeaderPrefix}__page-title-with-icon`,
  pageTitleText: `${pageHeaderPrefix}__page-title-with-icon__text`,
} as const;
