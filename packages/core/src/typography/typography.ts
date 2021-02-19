import { CssVarInterpolations, toCssVar } from '../css';
import {
  GradualMainColor,
  MainColor,
  palettePrefix,
  TextColor,
} from '../palette';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export type TypographyColor =
  | 'inherit'
  | MainColor
  | GradualMainColor
  | TextColor;

type TypographyDisplayBase = 'block' | 'flex';
export type TypographyDisplay = TypographyDisplayBase | `inline-${TypographyDisplayBase}`;

export type TypographyVariant =
  | `h${1 | 2 | 3 | 4 | 5 | 6}`
  | `button${1 | 2 | 3}`
  | `input${1 | 2 | 3}`
  | `body${1 | 2}`
  | 'caption';

export interface TypographyCssVars {
  align?: TypographyAlign;
  color?: TypographyColor;
  display?: TypographyDisplay;
}

export const typographyPrefix = 'mzn-typography';

export const typographyClasses = {
  variant: (variant: TypographyVariant) => `${typographyPrefix}--${variant}`,
  align: `${typographyPrefix}--align`,
  color: `${typographyPrefix}--color`,
  display: `${typographyPrefix}--display`,
  ellipsis: `${typographyPrefix}--ellipsis`,
  noWrap: `${typographyPrefix}--nowrap`,
} as const;

export function toTypographyCssVars(variables: TypographyCssVars): CssVarInterpolations {
  const {
    align,
    color,
    display,
  } = variables;

  return {
    [`--${typographyPrefix}-align`]: align,
    [`--${typographyPrefix}-color`]: !color || color === 'inherit'
      ? color
      : toCssVar(`${palettePrefix}-${color}`),
    [`--${typographyPrefix}-display`]: display,
  };
}

