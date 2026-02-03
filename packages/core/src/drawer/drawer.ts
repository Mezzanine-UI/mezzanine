export const drawerPrefix = 'mzn-drawer';

/**
 * @deprecated Drawer is currently hardcoded to `right` placement. This type is kept
 * for backward compatibility and should not be used for new code.
 */
export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left';

export type DrawerSize = 'narrow' | 'medium' | 'wide';

export const drawerClasses = {
  host: drawerPrefix,
  overlay: `${drawerPrefix}__overlay`,
  right: `${drawerPrefix}--right`,
  header: `${drawerPrefix}__header`,
  bottom: `${drawerPrefix}__bottom`,
  bottom__actions: `${drawerPrefix}__bottom__actions`,
  size: (size: DrawerSize) => `${drawerPrefix}--${size}`,
  content: `${drawerPrefix}__content`,
  controlBar: `${drawerPrefix}__control-bar`,
  controlBarButtonOnly: `${drawerPrefix}__control-bar--button-only`,
} as const;
