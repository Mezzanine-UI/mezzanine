import { Orientation } from '@mezzanine-ui/system/orientation';
import { buttonPrefix } from './button';

export type ButtonGroupOrientation = Orientation;

export const buttonGroupPrefix = `${buttonPrefix}-group` as const;

export const buttonGroupClasses = {
  host: buttonGroupPrefix,
  fullWidth: `${buttonGroupPrefix}--full-width`,
  orientation: (orientation: ButtonGroupOrientation) =>
    `${buttonGroupPrefix}--${orientation}`,
} as const;
