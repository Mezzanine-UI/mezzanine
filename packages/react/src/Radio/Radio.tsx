'use client';

import { ChangeEventHandler, forwardRef, useContext, useState } from 'react';
import { radioClasses as classes, RadioSize } from '@mezzanine-ui/core/radio';
import InputCheck, {
  InputCheckProps,
} from '../_internal/InputCheck/InputCheck';
import { cx } from '../utils/cx';
import { useRadioControlValue } from '../Form/useRadioControlValue';
import { FormControlContext } from '../Form';
import { RadioGroupContext } from './RadioGroupContext';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { MezzanineConfig } from '../Provider/context';

export interface RadioProps
  extends Omit<InputCheckProps, 'control' | 'htmlFor'> {
  /**
   * Whether the radio is checked.
   */
  checked?: boolean;
  /**
   * Whether the radio is checked by default.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   *  If you need direct control to the input element, use this prop to provide to it.
   *
   * Noticed that if you pass an id within this prop,
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
   * The change event handler of input in radio.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The size of radio.
   * @default 'medium'
   */
  size?: RadioSize;
  /**
   * The value of input in radio.
   */
  value?: string;
}

/**
 * The react component for `mezzanine` radio.
 */
const Radio = forwardRef<HTMLLabelElement, RadioProps>(
  function Radio(props, ref) {
    const { size: globalSize } = useContext(MezzanineConfig);
    const { disabled: disabledFromFormControl, severity } =
      useContext(FormControlContext) || {};
    const radioGroup = useContext(RadioGroupContext);
    const {
      disabled: disabledFromGroup,
      name: nameFromGroup,
      size: sizeFromGroup,
    } = radioGroup || {};
    const {
      checked: checkedProp,
      children,
      defaultChecked,
      disabled = (disabledFromGroup ?? disabledFromFormControl) || false,
      error = severity === 'error' || false,
      inputProps,
      onChange: onChangeProp,
      size = sizeFromGroup || globalSize,
      value,
      ...rest
    } = props;
    const {
      id: inputId,
      name = nameFromGroup,
      ...restInputProps
    } = inputProps || {};
    const [checked, onChange] = useRadioControlValue({
      checked: checkedProp,
      defaultChecked,
      onChange: onChangeProp,
      radioGroup,
      value,
    });
    const [focused, setFocused] = useState<boolean>(false);

    return (
      <InputCheck
        {...rest}
        ref={ref}
        control={
          <span
            className={cx(classes.host, {
              [classes.checked]: checked,
            })}
          >
            <input
              {...restInputProps}
              aria-checked={checked}
              aria-disabled={disabled}
              checked={checked}
              disabled={disabled}
              id={inputId}
              onChange={onChange}
              onFocus={() => {
                setFocused(true);
              }}
              onBlur={() => {
                setFocused(false);
              }}
              name={name}
              type="radio"
              value={value}
            />
          </span>
        }
        disabled={disabled}
        error={error}
        focused={focused}
        htmlFor={inputId}
        size={size}
      >
        {children}
      </InputCheck>
    );
  },
);

export default Radio;
