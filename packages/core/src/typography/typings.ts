import { GradualMainColor, MainColor, TextColor } from '../palette';

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
