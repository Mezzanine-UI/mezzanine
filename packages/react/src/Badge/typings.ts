import { BadgeCountVariant, BadgeDotVariant } from '@mezzanine-ui/core/badge';
import { ReactNode } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from 'react/src/utils/jsx-types';

export type BadgeProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'span'>,
  'children'
> &
  BadgeVariantProps;

type BadgeVariantProps =
  | BadgeCountProps
  | BadgeDotWithTextProps
  | BadgeDotProps;

type BadgeCountProps = {
  /** Badge renders internally, so children is disabled for count badges. */
  children?: never;
  /** Base number rendered inside the badge when using the count variant. */
  count: number;
  /**
   * If the children is number and greater than overflowCount, it will show overflowCount suffixed with a "+".
   * Only available on count badge.
   */
  overflowCount?: number;
  /** Additional label is not supported for count badges. */
  text?: never;
  /** Controls the visual style (dot vs count variants) and enables the related overflow/hide rules. */
  variant: BadgeCountVariant;
};

type BadgeDotWithTextProps = {
  /** Dot badges with text do not render children content. */
  children?: never;
  /** Count is disabled when rendering dot badges. */
  count?: never;
  /** Overflow handling is only meaningful in count mode. */
  overflowCount?: never;
  /** Optional string displayed next to the dot badge. */
  text?: string;
  variant: BadgeDotVariant;
};

type BadgeDotProps = {
  /** Content rendered next to the dot badge, commonly an anchor or icon. */
  children?: ReactNode;
  /** Count is disabled when rendering dot badges. */
  count?: never;
  /** Overflow handling is only meaningful in count mode. */
  overflowCount?: never;
  text?: never;
  variant: BadgeDotVariant;
};
