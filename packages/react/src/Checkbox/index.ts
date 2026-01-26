import type { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import type { CheckboxProps } from './Checkbox';

export type {
  CheckboxGroupLayout,
  CheckboxGroupOption,
} from '@mezzanine-ui/core/checkbox';
export { default as CheckAll } from './CheckAll';
export type { CheckAllProps } from './CheckAll';
export { default as CheckboxGroup } from './CheckboxGroup';
export type {
  CheckboxGroupChangeEvent,
  CheckboxGroupChangeEventTarget,
  CheckboxGroupLevelConfig,
  CheckboxGroupProps,
} from './CheckboxGroup';

export type { CheckboxProps } from './Checkbox';
export type { CheckboxComponent, CheckboxPropsBase } from './typings';

/**
 * @remark
 * Add type alias here for parsable to react docgen typescript.
 */
export type GenericCheckbox = (
  props: PropsWithoutRef<CheckboxProps> & RefAttributes<HTMLLabelElement>,
) => ReactElement<any>;

// Direct re-export to avoid webpack initialization order issues
export { default } from './Checkbox';
