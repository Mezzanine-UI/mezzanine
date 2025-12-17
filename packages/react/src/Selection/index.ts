import { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import Selection, { SelectionProps, SelectionPropsBase } from './Selection';

export type {
  SelectionDirection,
  SelectionType,
} from '@mezzanine-ui/core/selection';
export type { SelectionProps, SelectionPropsBase };

/**
 * @remark
 * Add type alias here for parsable to react docgen typescript.
 */
type GenericSelection = (
  props: PropsWithoutRef<SelectionProps> & RefAttributes<HTMLLabelElement>,
) => ReactElement<any>;

export { Selection };
export default Selection as GenericSelection;
