import { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import BaseCard, { BaseCardComponentProps } from './BaseCard';
import QuickActionCard, {
  QuickActionCardComponentProps,
} from './QuickActionCard';
import SingleThumbnailCard, {
  SingleThumbnailCardComponentProps,
} from './SingleThumbnailCard';
import {
  BaseCardComponent,
  QuickActionCardComponent,
  SingleThumbnailCardComponent,
} from './typings';

export { default as CardGroup } from './CardGroup';
export type { CardGroupProps } from './CardGroup';

export { default as ThumbnailCardInfo } from './ThumbnailCardInfo';
export type { ThumbnailCardInfoProps } from './ThumbnailCardInfo';

export type {
  BaseCardComponentProps,
  QuickActionCardComponentProps,
  SingleThumbnailCardComponentProps,
};

export type {
  BaseCardComponent,
  BaseCardActionVariant,
  BaseCardType,
  BaseCardProps,
  BaseCardPropsCommon,
  BaseCardDefaultProps,
  BaseCardActionProps,
  BaseCardOverflowProps,
  BaseCardToggleProps,
  QuickActionCardComponent,
  QuickActionCardMode,
  QuickActionCardProps,
  QuickActionCardPropsCommon,
  QuickActionCardWithIconProps,
  QuickActionCardWithTitleProps,
  SingleThumbnailCardComponent,
  SingleThumbnailCardType,
  SingleThumbnailCardProps,
  SingleThumbnailCardPropsCommon,
  SingleThumbnailCardDefaultProps,
  SingleThumbnailCardActionProps,
  SingleThumbnailCardOverflowProps,
} from './typings';

/**
 * Type alias for proper generic inference when using component prop
 */
type GenericBaseCard = <C extends BaseCardComponent = 'div'>(
  props: PropsWithoutRef<BaseCardComponentProps<C>> &
    RefAttributes<HTMLElement>,
) => ReactElement<any>;

type GenericQuickActionCard = <C extends QuickActionCardComponent = 'button'>(
  props: PropsWithoutRef<QuickActionCardComponentProps<C>> &
    RefAttributes<HTMLElement>,
) => ReactElement<any>;

type GenericSingleThumbnailCard = <
  C extends SingleThumbnailCardComponent = 'div',
>(
  props: PropsWithoutRef<SingleThumbnailCardComponentProps<C>> &
    RefAttributes<HTMLElement> & {
      children: ReactElement;
    },
) => ReactElement<any>;

export { BaseCard, QuickActionCard, SingleThumbnailCard };

export const BaseCardGeneric = BaseCard as GenericBaseCard;
export const QuickActionCardGeneric = QuickActionCard as GenericQuickActionCard;
export const SingleThumbnailCardGeneric =
  SingleThumbnailCard as GenericSingleThumbnailCard;
