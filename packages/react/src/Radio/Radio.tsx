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
import Input, { BaseInputProps } from '../Input';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

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
   * @default 'main'
   */
  size?: RadioSize;
  /**
   * The value of input in radio.
   */
  value?: string;
  /**
   * When `withInputConfig` is provided, an `Input` component is rendered alongside the
   * radio using the passed props. By default, this input has a width of 120px unless you
   * override it via the `width` property below.
   */
  withInputConfig?: Pick<
    BaseInputProps,
    'aria-disabled' | 'disabled' | 'onChange' | 'placeholder' | 'value'
  > & {
    width?: number;
  };
}

/**
 * The react component for `mezzanine` radio.
 */
const Radio = forwardRef<HTMLDivElement, RadioProps>(
  function Radio(props, ref) {
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
      className,
      children,
      defaultChecked,
      disabled = (disabledFromGroup ?? disabledFromFormControl) || false,
      error = severity === 'error' || false,
      hint,
      inputProps,
      onChange: onChangeProp,
      size = sizeFromGroup || 'main',
      value,
      withInputConfig,
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
      <div ref={ref} className={cx(classes.wrapper, className)}>
        <InputCheck
          {...rest}
          control={
            <span
              className={cx(classes.host, {
                [classes.checked]: checked,
                [classes.focused]: focused,
                [classes.error]: error,
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
          hint={hint}
          htmlFor={inputId}
          size={size}
        >
          {children}
        </InputCheck>
        {withInputConfig && (
          <div style={{ width: withInputConfig.width ?? 120 }}>
            <Input
              {...withInputConfig}
              variant="base"
              placeholder={withInputConfig.placeholder ?? 'Placeholder'}
            />
          </div>
        )}
      </div>
    );
  },
);

export default Radio;
