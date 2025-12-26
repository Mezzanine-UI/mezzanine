import { Orientation } from '@mezzanine-ui/system/orientation';
import { inputCheckPrefix, InputCheckSize } from './inputCheck';

export type InputCheckGroupOrientation = Orientation;

export const inputCheckGroupPrefix = `${inputCheckPrefix}-group` as const;

export const inputCheckGroupClasses = {
  host: inputCheckGroupPrefix,
  orientation: (orientation: InputCheckGroupOrientation) =>
    `${inputCheckGroupPrefix}--${orientation}`,
  segmented: `${inputCheckGroupPrefix}--segmented`,
  size: (size: InputCheckSize) => `${inputCheckGroupPrefix}--${size}`,
} as const;
