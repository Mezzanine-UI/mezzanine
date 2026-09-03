import type {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
} from '@mezzanine-ui/core/typography';
import type { TypographySemanticType } from '@mezzanine-ui/system/typography';

import type { Component } from 'vue';

/**
 * What a Typography may be rendered as. React's list, with Vue's `Component`
 * standing in for `JSXElementConstructor`.
 */
export type TypographyComponent =
  | `h${1 | 2 | 3 | 4 | 5 | 6}`
  | 'p'
  | 'span'
  | 'label'
  | 'div'
  | 'caption'
  | 'a'
  | Component;

export interface TypographyProps {
  /**
   * The css variable for `text-align`.
   */
  align?: TypographyAlign;
  /**
   * The text semantic color from the palette.
   */
  color?: TypographyColor;
  /**
   * Override the component used to render. Defaults to the tag the `variant`
   * implies.
   */
  component?: TypographyComponent;
  /**
   * The css variable for `display`.
   */
  display?: TypographyDisplay;
  /**
   * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   *
   * Note that text overflow can only happen with `block` or `inline-block` level elements
   * @default false
   */
  ellipsis?: boolean;
  /**
   * If `true`, the text will not wrap.
   * @default false
   */
  noWrap?: boolean;
  /**
   * Applies the typography semantic type.
   * @default 'body'
   */
  variant?: TypographySemanticType;
}
