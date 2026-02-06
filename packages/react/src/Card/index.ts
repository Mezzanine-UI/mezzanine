import { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import BaseCard, { BaseCardComponentProps } from './BaseCard';
import { BaseCardComponent } from './typings';

export { default as CardGroup } from './CardGroup';
export type { CardGroupProps } from './CardGroup';

export type { BaseCardComponentProps };

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
} from './typings';

/**
 * Type alias for proper generic inference when using component prop
 */
type GenericBaseCard = <C extends BaseCardComponent = 'div'>(
  props: PropsWithoutRef<BaseCardComponentProps<C>> &
    RefAttributes<HTMLElement>,
) => ReactElement<any>;

export { BaseCard };
export default BaseCard as GenericBaseCard;
