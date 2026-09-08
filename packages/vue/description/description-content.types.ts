import type {
  DescriptionContentVariant,
  DescriptionSize,
} from '@mezzanine-ui/core/description';
import type { IconDefinition } from '@mezzanine-ui/icons';

/**
 * React splits the clickable-icon variant into its own union member so that
 * `icon` is only accepted with `variant="with-icon"`; flattened here into one
 * interface, as the port's other unions are.
 */
export interface DescriptionContentProps {
  /**
   * Content text
   */
  children: string;
  /**
   * Custom icon rendered after the content text
   */
  icon?: IconDefinition;
  /**
   * Controls the text size of the content. When provided, overrides the size
   * inherited from a parent description.
   * @default context value or 'main'
   */
  size?: DescriptionSize;
  /**
   * Define the style and behavior of the content
   * @default 'normal'
   */
  variant?: Extract<
    DescriptionContentVariant,
    'normal' | 'statistic' | 'trend-up' | 'trend-down' | 'with-icon'
  >;
}
