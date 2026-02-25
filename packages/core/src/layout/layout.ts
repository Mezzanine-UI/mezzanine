export const layoutPrefix = 'mzn-layout';

export const layoutClasses = {
  divider: `${layoutPrefix}__divider`,
  dividerDragging: `${layoutPrefix}__divider--dragging`,
  host: layoutPrefix,
  main: `${layoutPrefix}__main`,
  sidePanel: `${layoutPrefix}__side-panel`,
} as const;
