export const drawerPrefix = 'mzn-drawer';

export type DrawerPlacement = 'top' | 'right' | 'bottom'| 'left';

export const drawerClasses = {
  host: drawerPrefix,
  overlay: `${drawerPrefix}__overlay`,
  top: `${drawerPrefix}--top`,
  right: `${drawerPrefix}--right`,
  bottom: `${drawerPrefix}--bottom`,
  left: `${drawerPrefix}--left`,
};
