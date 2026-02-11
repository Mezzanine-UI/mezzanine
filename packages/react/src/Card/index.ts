import { PropsWithoutRef, ReactElement, ReactNode, RefAttributes } from 'react';
import BaseCard, { BaseCardComponentProps } from './BaseCard';
import FourThumbnailCard, {
  FourThumbnailCardComponentProps,
} from './FourThumbnailCard';
import QuickActionCard, {
  QuickActionCardComponentProps,
} from './QuickActionCard';
import SingleThumbnailCard, {
  SingleThumbnailCardComponentProps,
} from './SingleThumbnailCard';
import Thumbnail, { ThumbnailComponentProps } from './Thumbnail';
import {
  BaseCardComponent,
  FourThumbnailCardComponent,
  QuickActionCardComponent,
  SingleThumbnailCardComponent,
  ThumbnailComponent,
} from './typings';

export { default as CardGroup } from './CardGroup';
export type { CardGroupProps } from './CardGroup';

export { default as ThumbnailCardInfo } from './ThumbnailCardInfo';
export type { ThumbnailCardInfoProps } from './ThumbnailCardInfo';

export type {
  BaseCardComponentProps,
  FourThumbnailCardComponentProps,
  QuickActionCardComponentProps,
  SingleThumbnailCardComponentProps,
  ThumbnailComponentProps,
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
  FourThumbnailCardComponent,
  FourThumbnailCardType,
  FourThumbnailCardProps,
  FourThumbnailCardPropsCommon,
  FourThumbnailCardDefaultProps,
  FourThumbnailCardActionProps,
  FourThumbnailCardOverflowProps,
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
  ThumbnailComponent,
  ThumbnailPropsBase,
} from './typings';

/**
 * Type alias for proper generic inference when using component prop
 */
type GenericBaseCard = <C extends BaseCardComponent = 'div'>(
  props: PropsWithoutRef<BaseCardComponentProps<C>> &
    RefAttributes<HTMLElement>,
) => ReactElement<any>;

type GenericFourThumbnailCard = <C extends FourThumbnailCardComponent = 'div'>(
  props: PropsWithoutRef<FourThumbnailCardComponentProps<C>> &
    RefAttributes<HTMLElement> & {
      children: ReactNode;
      title: string;
    },
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
      title: string;
    },
) => ReactElement<any>;

type GenericThumbnail = <C extends ThumbnailComponent = 'div'>(
  props: PropsWithoutRef<ThumbnailComponentProps<C>> &
    RefAttributes<HTMLElement> & {
      children: ReactNode;
    },
) => ReactElement<any>;

export const BaseCardGeneric = BaseCard as GenericBaseCard;
export const FourThumbnailCardGeneric =
  FourThumbnailCard as GenericFourThumbnailCard;
export const QuickActionCardGeneric = QuickActionCard as GenericQuickActionCard;
export const SingleThumbnailCardGeneric =
  SingleThumbnailCard as GenericSingleThumbnailCard;
export const ThumbnailGeneric = Thumbnail as GenericThumbnail;
