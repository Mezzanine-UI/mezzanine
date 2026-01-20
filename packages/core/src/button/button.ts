import { GeneralSize } from '@mezzanine-ui/system/size';

export type ButtonVariant =
  | 'base-primary'
  | 'base-secondary'
  | 'base-tertiary'
  | 'base-ghost'
  | 'base-dashed'
  | 'base-text-link'
  | 'destructive-primary'
  | 'destructive-secondary'
  | 'destructive-ghost'
  | 'destructive-text-link'
  | 'inverse'
  | 'inverse-ghost';

export type ButtonSize = GeneralSize;

export type ButtonIconType = 'leading' | 'trailing' | 'icon-only';

export const buttonPrefix = 'mzn-button';

export const buttonClasses = {
  host: buttonPrefix,
  variant: (variant: ButtonVariant) => `${buttonPrefix}--${variant}`,
  size: (size: ButtonSize) => `${buttonPrefix}--${size}`,
  disabled: `${buttonPrefix}--disabled`,
  loading: `${buttonPrefix}--loading`,
  iconLeading: `${buttonPrefix}--icon-leading`,
  iconTrailing: `${buttonPrefix}--icon-trailing`,
  iconOnly: `${buttonPrefix}--icon-only`,
};
