export type TypographyPrimitiveFontFamily =
  | 'pingfang-tc'
  | 'noto-sans-tc'
  | 'sf-mono';

export type TypographyPrimitiveFontWeight = 'regular' | 'medium' | 'semibold';

export type TypographyPrimitiveFontSize = 24 | 18 | 16 | 14 | 12 | 10;

export type TypographyPrimitiveLineHeight =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'caption'
  | 'annotation'
  | 'functional';

export type TypographyPrimitiveLetterSpacing = 0;

export type TypographySemanticType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'body-highlight'
  | 'body-mono'
  | 'body-mono-highlight'
  | 'text-link-body'
  | 'text-link-caption'
  | 'caption'
  | 'caption-highlight'
  | 'annotation'
  | 'annotation-highlight'
  | 'button'
  | 'button-highlight'
  | 'input'
  | 'input-mono'
  | 'label-primary'
  | 'label-primary-highlight'
  | 'label-secondary';

export type TypographySemanticProp =
  | 'font-family'
  | 'font-size'
  | 'font-weight'
  | 'line-height'
  | 'letter-spacing';

export const typographyPrimitivePrefix = 'mzn-typography-primitive';
export const typographySemanticPrefix = 'mzn-typography';
