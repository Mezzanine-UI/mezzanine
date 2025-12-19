import { GeneralSize } from '@mezzanine-ui/system/size';

export type InputCheckSize = GeneralSize;

export const inputCheckPrefix = 'mzn-input-check';

export const inputCheckClasses = {
  host: inputCheckPrefix,
  size: (size: InputCheckSize) => `${inputCheckPrefix}--${size}`,
  disabled: `${inputCheckPrefix}--disabled`,
  error: `${inputCheckPrefix}--error`,
  withLabel: `${inputCheckPrefix}--with-label`,
  control: `${inputCheckPrefix}__control`,
  controlFocused: `${inputCheckPrefix}__control--focused`,
  label: `${inputCheckPrefix}__label`,
  hint: `${inputCheckPrefix}__hint`,
} as const;
