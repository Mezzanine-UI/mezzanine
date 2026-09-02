import type {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
} from '@mezzanine-ui/core/typography';
import type { TypographySemanticType } from '@mezzanine-ui/system/typography';

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
