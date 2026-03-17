import { CssVarInterpolations, toCssVar } from '@mezzanine-ui/system/css';
import { colorSemanticPrefix, TextTone } from '@mezzanine-ui/system/palette';
import {
  typographySemanticPrefix,
  TypographySemanticType,
} from '@mezzanine-ui/system/typography';

/**
 * 文字的對齊方式。
 * - `'left'` — 靠左對齊
 * - `'center'` — 置中對齊
 * - `'right'` — 靠右對齊
 * - `'justify'` — 兩端對齊
 */
export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export type TypographyColor = 'inherit' | `text-${TextTone}`;

type TypographyDisplayBase = 'block' | 'flex';
export type TypographyDisplay =
  | TypographyDisplayBase
  | `inline-${TypographyDisplayBase}`;

export interface TypographyCssVars {
  align?: TypographyAlign;
  color?: TypographyColor;
  display?: TypographyDisplay;
}

export const typographyClasses = {
  type: (type: TypographySemanticType) =>
    `${typographySemanticPrefix}--${type}`,
  align: `${typographySemanticPrefix}--align`,
  color: `${typographySemanticPrefix}--color`,
  display: `${typographySemanticPrefix}--display`,
  ellipsis: `${typographySemanticPrefix}--ellipsis`,
  noWrap: `${typographySemanticPrefix}--nowrap`,
} as const;

export function toTypographyCssVars(
  variables: TypographyCssVars,
): CssVarInterpolations {
  const { align, color, display } = variables;

  return {
    [`--${typographySemanticPrefix}-align`]: align,
    [`--${typographySemanticPrefix}-color`]:
      !color || color === 'inherit'
        ? color
        : toCssVar(`${colorSemanticPrefix}-${color}`),
    [`--${typographySemanticPrefix}-display`]: display,
  };
}
