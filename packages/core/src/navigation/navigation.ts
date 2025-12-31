import { Orientation } from '@mezzanine-ui/system/orientation';

export const navigationPrefix = 'mzn-navigation';

export type NavigationOrientation = Orientation;

export const navigationClasses = {
  host: navigationPrefix,
  vertical: `${navigationPrefix}--vertical`,
  content: `${navigationPrefix}__content`,
} as const;
