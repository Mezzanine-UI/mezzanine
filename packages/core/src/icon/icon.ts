import { CssVarInterpolations, toCssVar } from '../css';
import { Color, MainColor, palettePrefix } from '../palette';

export type IconColor =
  | 'inherit'
  | MainColor
  | 'disabled';

export interface IconCssVars {
  color?: IconColor;
}

export const iconPrefix = 'mzn-icon';

export const iconClasses = {
  host: iconPrefix,
  color: `${iconPrefix}--color`,
  spin: `${iconPrefix}--spin`,
} as const;

export function toIconCssVars(variables: IconCssVars): CssVarInterpolations {
  const { color } = variables;

  if (!color) {
    return {};
  }

  let colorValue: string;

  if (color === 'inherit') {
    colorValue = color;
  } else {
    /**
     * Use `action-disabled` color of palette as `disabled` color of icon.
     */
    const colorName: Color = color === 'disabled'
      ? 'action-disabled'
      : color;

    colorValue = toCssVar(`${palettePrefix}-${colorName}`);
  }

  return {
    [`--${iconPrefix}-color`]: colorValue,
  };
}
