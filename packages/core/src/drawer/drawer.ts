export const drawerPrefix = 'mzn-drawer';

/**
 * @deprecated Drawer is currently hardcoded to `right` placement. This type is kept
 * for backward compatibility and should not be used for new code.
 */
export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left';

/**
 * Drawer 的寬度尺寸。
 * - `'narrow'` — 最窄尺寸
 * - `'medium'` — 中等尺寸
 * - `'wide'` — 寬尺寸
 */
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
  filterArea: `${drawerPrefix}__filter-area`,
  filterAreaButtonOnly: `${drawerPrefix}__filter-area--button-only`,
} as const;
