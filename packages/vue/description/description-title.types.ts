import type { BadgeDotVariant } from '@mezzanine-ui/core/badge';
import type {
  DescriptionSize,
  DescriptionWidthType,
} from '@mezzanine-ui/core/description';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { PopperPlacement } from '../popper/popper.types';

/**
 * React splits the tooltip variants into a union so that `tooltip` implies
 * `icon`; flattened here into one interface, as the port's other unions are.
 * The compile-time pairing is lost — a `tooltip` without an `icon` shows
 * nothing rather than failing to compile.
 */
export interface DescriptionTitleProps {
  /**
   * Displays a badge dot alongside the title text
   */
  badge?: BadgeDotVariant;
  /**
   * Title text.
   *
   * React types this as a string prop rather than as free-form content,
   * because the badge form renders it as the badge's own text.
   */
  children: string;
  /**
   * An icon displayed after the title text
   */
  icon?: IconDefinition;
  /**
   * Controls the text size of the title.
   * @default 'main'
   */
  size?: DescriptionSize;
  /**
   * Text content displayed in a tooltip when hovering over the icon
   */
  tooltip?: string;
  /**
   * Defines the placement of the tooltip relative to the icon
   */
  tooltipPlacement?: PopperPlacement;
  /**
   * Controls the layout width behavior of the title
   * @default 'stretch'
   */
  widthType?: DescriptionWidthType;
}
