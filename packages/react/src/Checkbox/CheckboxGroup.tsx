import { CheckboxGroupOption, CheckboxSize } from '@mezzanine-ui/core/checkbox';
import {
  ChangeEvent, forwardRef, ReactNode, useMemo,
} from 'react';
import { InputCheckGroup, InputCheckGroupProps } from '../_internal/InputCheck';
import { useControlValueState } from '../Form/useControlValueState';
import {
  CheckboxGroupContext,
  CheckboxGroupContextValue,
} from './CheckboxGroupContext';
import Checkbox from './Checkbox';

export interface CheckboxGroupProps extends Omit<InputCheckGroupProps, 'defaultValue' | 'onChange'> {
  /**
   * The checkboxes in radio group.
   */
  children?: ReactNode;
  /**
   * The default value of checkbox group.
   */
  defaultValue?: string[] ;
  /**
   * Whether the checkbox group is disabled.
   * Control the disabled of checkboxes in group if disabled not passed to checkbox.
   */
  disabled?: boolean;
  /**
   * The name of checkbox group.
   * Control the name of checkboxes in group if name not passed to checkbox.
   */
  name?: string;
  /**
   * The onChange of checkbox group.
   * Will be passed to each checkboxes but composing both instead of overriding.
   */
  onChange?: (value: string[], event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * The options of checkbox group.
   * Will be ignored if children passed.
   */
  options?: CheckboxGroupOption[];
  /**
   * The size of checkbox group.
   * Control the size of checkboxes in group if size not passed to checkbox.
   */
  size?: CheckboxSize;
  /**
   * The value of checkbox group.
   */
  value?: string[];
}

const renderOption = ({
  label: children,
  ...option
}: CheckboxGroupOption) => (
  <Checkbox
    {...option}
    key={option.value}
  >
    {children}
  </Checkbox>
);

/**
 * The react component for `mezzanine` checkbox group.
 */
const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(props, ref) {
  const {
    children: childrenProp,
    defaultValue = [],
    disabled,
    name,
    options = [],
    onChange,
    size,
    value: valueProp,
    ...rest
  } = props;
  const [value, setValue] = useControlValueState({
    defaultValue,
    value: valueProp,
  });
  const context: CheckboxGroupContextValue = useMemo(() => ({
    disabled,
    name,
    onChange(event) {
      const { checked, value: targetValue } = event.target;
      const newValue = checked ? [...value, targetValue] : value.filter((v) => v !== targetValue);

      setValue(newValue);

      if (onChange) {
        onChange(newValue, event);
      }
    },
    size,
    value,
  }), [disabled, name, value, size, onChange, setValue]);
  const children = childrenProp || options.map(renderOption);

  return (
    <CheckboxGroupContext.Provider value={context}>
      <InputCheckGroup
        {...rest}
        ref={ref}
      >
        {children}
      </InputCheckGroup>
    </CheckboxGroupContext.Provider>
  );
});

export default CheckboxGroup;
