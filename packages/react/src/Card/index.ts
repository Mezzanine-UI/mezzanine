import { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import BaseCard, { BaseCardComponentProps } from './BaseCard';
import QuickActionCard, {
  QuickActionCardComponentProps,
} from './QuickActionCard';
import { BaseCardComponent, QuickActionCardComponent } from './typings';

export { default as CardGroup } from './CardGroup';
export type { CardGroupProps } from './CardGroup';

export type { BaseCardComponentProps, QuickActionCardComponentProps };

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

export { BaseCard, QuickActionCard };
export default BaseCard as GenericBaseCard;

export const QuickActionCardGeneric = QuickActionCard as GenericQuickActionCard;
