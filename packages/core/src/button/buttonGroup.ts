import { CssVarInterpolations } from '@mezzanine-ui/system/css';
import { Orientation } from '@mezzanine-ui/system/orientation';
import { SpacingLevel, toSpacingCssVar } from '@mezzanine-ui/system/spacing';
import { buttonPrefix, ButtonSize } from './button';

export type ButtonGroupOrientation = Orientation;
export type ButtonGroupSpacing = SpacingLevel;

export interface ButtonGroupCssVars {
  size: ButtonSize;
  spacing?: ButtonGroupSpacing;
}

export const buttonGroupPrefix = `${buttonPrefix}-group` as const;

export const buttonGroupClasses = {
  host: buttonGroupPrefix,
  fullWidth: `${buttonGroupPrefix}--full-width`,
  orientation: (orientation: ButtonGroupOrientation) => `${buttonGroupPrefix}--${orientation}`,
  attached: `${buttonGroupPrefix}--attached`,
} as const;

export function toButtonGroupCssVars(variables: ButtonGroupCssVars): CssVarInterpolations {
  const {
    size,
    spacing,
  } = variables;

  return {
    /**
     * The default is `3` for button size="small", or `4`.
     */
    [`--${buttonGroupPrefix}-spacing`]: toSpacingCssVar(spacing ?? (size === 'small' ? 3 : 4)),
  };
}
