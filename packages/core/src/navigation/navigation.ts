import { Orientation } from '@mezzanine-ui/system/orientation';

export const navigationPrefix = 'mzn-navigation';

export type NavigationOrientation = Orientation;

export const navigationClasses = {
  host: navigationPrefix,
  expand: `${navigationPrefix}--expand`,
  collapsed: `${navigationPrefix}--collapsed`,
  content: `${navigationPrefix}__content`,
  searchInput: `${navigationPrefix}__search-input`,
} as const;
