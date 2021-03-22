
import { Orientation } from '@mezzanine-ui/system/orientation';

export const navigationPrefix = 'mzn-navigation';

export type NavigationOrientation = Orientation;

export const navigationClasses = {
  host: navigationPrefix,
  horizontal: `${navigationPrefix}--horizontal`,
  vertical: `${navigationPrefix}--vertical`,
} as const;
