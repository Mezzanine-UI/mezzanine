import { CssVarInterpolations, toCssVar } from '@mezzanine-ui/system/css';
import {
  GradualMainColor,
  MainColor,
  palettePrefix,
  TextColor,
} from '@mezzanine-ui/system/palette';
import { typographyPrefix, TypographyVariant } from '@mezzanine-ui/system/typography';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export type TypographyColor =
  | 'inherit'
  | MainColor
  | GradualMainColor
  | TextColor;

type TypographyDisplayBase = 'block' | 'flex';
export type TypographyDisplay = TypographyDisplayBase | `inline-${TypographyDisplayBase}`;

export interface TypographyCssVars {
  align?: TypographyAlign;
  color?: TypographyColor;
  display?: TypographyDisplay;
}

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

