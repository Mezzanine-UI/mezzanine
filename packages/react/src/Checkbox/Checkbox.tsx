'use client';

import { ChangeEventHandler, forwardRef, useContext } from 'react';
import {
  checkboxClasses as classes,
  CheckboxSize,
} from '@mezzanine-ui/core/checkbox';
import { cx } from '../utils/cx';
import InputCheck, { InputCheckProps } from '../_internal/InputCheck';
import { useCheckboxControlValue } from '../Form/useCheckboxControlValue';
import { FormControlContext } from '../Form';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { MezzanineConfig } from '../Provider/context';

export interface CheckboxProps
  extends Omit<InputCheckProps, 'control' | 'htmlFor'> {
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
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   *  If you need direct control to the input element, use this prop to provide to it.
   *
   * Noticed that if you pass in an id within this prop,
   *  the rendered label element will have `htmlFor` sync with passed in id.
   */
  inputProps?: Omit<
    NativeElementPropsWithoutKeyAndRef<'input'>,
    | 'checked'
    | 'defaultChecked'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'readOnly'
    | 'required'
    | 'type'
    | 'value'
    | `aria-${'disabled' | 'checked'}`
  >;
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
const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const { size: globalSize } = useContext(MezzanineConfig);
    const { disabled: disabledFromFormControl, severity } =
      useContext(FormControlContext) || {};
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
      indeterminate: indeterminateProp = false,
      onChange: onChangeProp,
      size = sizeFromGroup || globalSize,
      value,
      inputProps,
      ...rest
    } = props;
    const {
      id: inputId,
      name = nameFromGroup,
      ...restInputProps
    } = inputProps || {};
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
        control={
          <span
            className={cx(classes.host, {
              [classes.checked]: checked,
              [classes.indeterminate]: indeterminate,
            })}
          >
            <input
              {...restInputProps}
              aria-checked={indeterminate ? 'mixed' : checked}
              aria-disabled={disabled}
              checked={checked}
              disabled={disabled}
              id={inputId}
              onChange={onChange}
              name={name}
              type="checkbox"
              value={value}
            />
          </span>
        }
        disabled={disabled}
        error={error}
        htmlFor={inputId}
        size={size}
      >
        {children}
      </InputCheck>
    );
  },
);

export default Checkbox;
