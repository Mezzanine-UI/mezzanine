import { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import SelectionCard, { SelectionCardProps, SelectionCardPropsBase } from './SelectionCard';

export type {
  SelectionCardDirection,
  SelectionCardType,
} from '@mezzanine-ui/core/selection-card';
export type { SelectionCardProps, SelectionCardPropsBase };

/**
 * @remark
 * Add type alias here for parsable to react docgen typescript.
 */
type GenericSelectionCard = (
  props: PropsWithoutRef<SelectionCardProps> & RefAttributes<HTMLLabelElement>,
) => ReactElement<any>;

export { SelectionCard };
export default SelectionCard as GenericSelectionCard;
