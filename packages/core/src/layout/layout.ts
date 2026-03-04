export const layoutPrefix = 'mzn-layout';

export const layoutClasses = {
  divider: `${layoutPrefix}__divider`,
  dividerDragging: `${layoutPrefix}__divider--dragging`,
  host: layoutPrefix,
  navigation: `${layoutPrefix}__navigation`,
  contentWrapper: `${layoutPrefix}__content-wrapper`,
  main: `${layoutPrefix}__main`,
  mainContent: `${layoutPrefix}__main__content`,
  sidePanel: `${layoutPrefix}__side-panel`,
  sidePanelContent: `${layoutPrefix}__side-panel-content`,
  sidePanelLeft: `${layoutPrefix}__side-panel--left`,
  sidePanelRight: `${layoutPrefix}__side-panel--right`,
} as const;
