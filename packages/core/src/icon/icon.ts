import { CssVarInterpolations, toCssVar } from '@mezzanine-ui/system/css';
import {
  IconTone,
  SemanticContext,
  colorSemanticPrefix,
} from '@mezzanine-ui/system/palette';

export type IconColor = 'inherit' | IconTone;

export interface IconCssVars {
  color?: IconColor;
  size?: number;
}

export const iconPrefix = 'mzn-icon';

export const iconClasses = {
  host: iconPrefix,
  color: `${iconPrefix}--color`,
  spin: `${iconPrefix}--spin`,
  size: `${iconPrefix}--size`,
} as const;

export function toIconCssVars(variables: IconCssVars): CssVarInterpolations {
  const { color, size } = variables;

  let result = {};

  /** color mapping */
  if (color) {
    let colorValue: string;

    if (color === 'inherit') {
      colorValue = color;
    } else {
      const colorName: `${SemanticContext}-${IconTone}` = `icon-${color}`;

      colorValue = toCssVar(`${colorSemanticPrefix}-${colorName}`);
    }

    result = {
      ...result,
      [`--${iconPrefix}-color`]: colorValue,
    };
  }

  /** size mapping */
  if (typeof size !== 'undefined') {
    result = {
      ...result,
      [`--${iconPrefix}-size`]: `${size}px`,
    };
  }

  return result;
}
