import type {
  BadgeCountVariant,
  BadgeDotVariant,
  BadgeTextSize,
  BadgeTextVariant,
} from '@mezzanine-ui/core/badge';

type BadgeCountProps = {
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
  /** 此變體下不適用。 */
  size?: never;
  /** 此變體下不適用。 */
  text?: never;
  /**
   * Controls the visual style (dot vs count variants) and enables the related overflow/hide rules.
   */
  variant: BadgeCountVariant;
};

type BadgeTextProps = {
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
  /** 此變體下不適用。 */
  count?: never;
  /** 此變體下不適用。 */
  overflowCount?: never;
  /**
   * Controls the size of the text.
   * @default 'main'
   */
  size?: BadgeTextSize;
  /** 圓點旁顯示的文字內容。 */
  text?: string;
  /** 圓點徽章的視覺變體。 */
  variant: BadgeDotVariant;
};

type BadgeDotProps = {
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

/**
 * React models the badge as a discriminated union on `variant`. The `children`
 * branch marker has no Vue equivalent — content arrives through the default
 * slot, which cannot be constrained by a prop union — so it is the one field
 * from the React type that is not represented here.
 */
export type BadgeProps =
  | BadgeCountProps
  | BadgeDotWithTextProps
  | BadgeDotProps
  | BadgeTextProps;
