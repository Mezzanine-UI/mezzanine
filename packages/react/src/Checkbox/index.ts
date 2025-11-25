import { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import Checkbox, { CheckboxProps } from './Checkbox';

export type {
  CheckboxGroupOption,
  CheckboxGroupOrientation,
} from '@mezzanine-ui/core/checkbox';
export { default as CheckAll } from './CheckAll';
export type { CheckAllProps } from './CheckAll';
export { default as CheckboxGroup } from './CheckboxGroup';
export type {
  CheckboxGroupLevelConfig,
  CheckboxGroupChangeEvent,
  CheckboxGroupChangeEventTarget,
  CheckboxGroupProps,
} from './CheckboxGroup';

export type {
  CheckboxComponent,
  CheckboxProps,
  CheckboxPropsBase,
} from './typings';

/**
 * @remark
 * Add type alias here for parsable to react docgen typescript.
 */
type GenericCheckbox = (
  props: PropsWithoutRef<CheckboxProps> & RefAttributes<HTMLLabelElement>,
) => ReactElement<any>;

export default Checkbox as GenericCheckbox;
