import {
  BadgeCountVariant,
  BadgeDotVariant,
  BadgeTextSize,
  BadgeTextVariant,
} from '@mezzanine-ui/core/badge';
import { ReactNode } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type BadgeProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'span'>,
  'children'
> &
  BadgeVariantProps;

type BadgeVariantProps =
  | BadgeCountProps
  | BadgeDotWithTextProps
  | BadgeDotProps
  | BadgeTextProps;

type BadgeCountProps = {
  /**
   * ONLY AVAILABLE FOR DOT BADGE(WITHOUT TEXT).
   * When dot badges have children (typically an icon),
   * the dot appears on the children's top-right corner.
   */
  children?: never;
  /**
   * ONLY AVAILABLE FOR COUNT BADGE.
   * Base number rendered inside the badge when using the count variant.
   */
  count: number;
  /**
   * ONLY AVAILABLE FOR COUNT BADGE.
   * If the children is number and greater than overflowCount,
   * it will show overflowCount suffixed with a "+".
   */
  overflowCount?: number;
  /**
   * ONLY AVAILABLE FOR DOT WITH TEXT BADGE.
   * Controls the size of the dot and text.
   */
  size?: never;
  /**
   * ONLY AVAILABLE FOR DOT WITH TEXT BADGE.
   * String displayed next to the dot badge.
   */
  text?: never;
  /**
   * Controls the visual style (dot vs count variants) and enables the related overflow/hide rules.
   */
  variant: BadgeCountVariant;
};

type BadgeTextProps = {
  /** 此變體下不適用。 */
  children?: never;
  /** 此變體下不適用。 */
  count?: never;
  /** 此變體下不適用。 */
  overflowCount?: never;
  /**
   * 文字徽章的尺寸。
   * @default 'main'
   */
  size?: BadgeTextSize;
  /** 徽章顯示的文字內容。 */
  text: string;
  /** 文字徽章的視覺變體。 */
  variant: BadgeTextVariant;
};

type BadgeDotWithTextProps = {
  children?: never;
  count?: never;
  overflowCount?: never;
  /**
   * Controls the size of the text.
   * @default 'main'
   */
  size?: BadgeTextSize;
  text?: string;
  variant: BadgeDotVariant;
};

type BadgeDotProps = {
  /** 徽章附著的子元素，圓點會顯示在子元素右上角。 */
  children?: ReactNode;
  /** 此變體下不適用。 */
  count?: never;
  /** 此變體下不適用。 */
  overflowCount?: never;
  /** 此變體下不適用。 */
  size?: never;
  /** 此變體下不適用。 */
  text?: never;
  /** 圓點徽章的視覺變體。 */
  variant: BadgeDotVariant;
};
