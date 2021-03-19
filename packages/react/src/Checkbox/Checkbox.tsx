import { ChangeEventHandler, forwardRef, useContext } from 'react';
import { checkboxClasses as classes, CheckboxSize } from '@mezzanine-ui/core/checkbox';
import { cx } from '../utils/cx';
import InputCheck, { InputCheckProps } from '../_internal/InputCheck';
import { useCheckboxControlValue } from '../Form/useCheckboxControlValue';
import { FormControlContext } from '../Form';
import { CheckboxGroupContext } from './CheckboxGroupContext';

export interface CheckboxProps extends Omit<InputCheckProps, 'control'> {
  /**
   * Whether the checkbox is checked.
   */
  checked?: boolean;
  /**
   * Whether the checkbox is checked by default.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * If true, it means its children checkboxes have at least one unchecked.
   * @default false
   */
  indeterminate?: boolean;
  /**
   * The name of input in checkbox.
   */
  name?: string;
  /**
   * The change event handler of input in checkbox.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The size of checkbox.
   * @default 'medium'
   */
  size?: CheckboxSize;
  /**
   * The value of input in checkbox.
   */
  value?: string;
}

/**
 * The react component for `mezzanine` checkbox.
 */
const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox(props, ref) {
  const {
    disabled: disabledFromFormControl,
    severity,
  } = useContext(FormControlContext) || {};
  const checkboxGroup = useContext(CheckboxGroupContext);
  const {
    disabled: disabledFromGroup,
    name: nameFromGroup,
    size: sizeFromGroup,
  } = checkboxGroup || {};
  const {
    checked: checkedProp,
    children,
    defaultChecked,
    disabled = (disabledFromGroup ?? disabledFromFormControl) || false,
    error = severity === 'error' || false,
    htmlFor,
    indeterminate: indeterminateProp = false,
    name = nameFromGroup,
    onChange: onChangeProp,
    size = sizeFromGroup || 'medium',
    value,
    ...rest
  } = props;
  const [checked, onChange] = useCheckboxControlValue({
    checkboxGroup,
    checked: checkedProp,
    defaultChecked,
    onChange: onChangeProp,
    value,
  });
  const indeterminate = !checked && indeterminateProp;

  return (
    <InputCheck
      {...rest}
      ref={ref}
      control={(
        <span
          className={cx(
            classes.host,
            {
              [classes.checked]: checked,
              [classes.indeterminate]: indeterminate,
            },
          )}
        >
          <input
            aria-checked={indeterminate ? 'mixed' : checked}
            aria-disabled={disabled}
            checked={checked}
            disabled={disabled}
            id={htmlFor}
            onChange={onChange}
            name={name}
            type="checkbox"
            value={value}
          />
        </span>
      )}
      disabled={disabled}
      error={error}
      htmlFor={htmlFor}
      size={size}
    >
      {children}
    </InputCheck>
  );
});

export default Checkbox;
