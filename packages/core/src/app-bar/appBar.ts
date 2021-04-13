import { Orientation } from '@mezzanine-ui/system/orientation';

export const appBarPrefix = 'mzn-app-bar';

export type AppBarOrientation = Orientation;

export const appBarClasses = {
  host: appBarPrefix,
  horizontal: `${appBarPrefix}--horizontal`,
  vertical: `${appBarPrefix}--vertical`,
} as const;
