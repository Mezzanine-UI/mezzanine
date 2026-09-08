import type { TypographySemanticType } from '@mezzanine-ui/system/typography';

export interface SkeletonProps {
  /**
   * Whether the skeleton should be circular.
   */
  circle?: boolean;
  /**
   * Height of the skeleton.
   * @default 100%
   */
  height?: number | string;
  /**
   * Typography variant for strip skeleton height calculation.
   * Only effective when circle and height are not set.
   */
  variant?: TypographySemanticType;
  /**
   * Width of the skeleton.
   * @default 100%
   */
  width?: number | string;
}
