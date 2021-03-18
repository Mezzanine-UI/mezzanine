import { ChangeEventHandler, forwardRef, useContext } from 'react';
import { radioClasses as classes, RadioSize } from '@mezzanine-ui/core/radio';
import InputCheck, { InputCheckProps } from '../_internal/InputCheck';
import { cx } from '../utils/cx';
import { useRadioControlValue } from '../Form/useRadioControlValue';
import { FormControlContext } from '../Form';
import { RadioGroupContext } from './RadioGroupContext';

export interface RadioProps extends Omit<InputCheckProps, 'control'> {
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
   * The name of input in radio.
   */
  name?: string;
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
const Radio = forwardRef<HTMLLabelElement, RadioProps>(function Radio(props, ref) {
  const {
    disabled: disabledFromFormControl,
    severity,
  } = useContext(FormControlContext) || {};
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
    htmlFor,
    name = nameFromGroup,
    onChange: onChangeProp,
    size = sizeFromGroup || 'medium',
    value,
    ...rest
  } = props;
  const [checked, onChange] = useRadioControlValue({
    checked: checkedProp,
    defaultChecked,
    onChange: onChangeProp,
    radioGroup,
    value,
  });

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
            },
          )}
        >
          <input
            aria-checked={checked}
            aria-disabled={disabled}
            checked={checked}
            disabled={disabled}
            id={htmlFor}
            onChange={onChange}
            name={name}
            type="radio"
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

export default Radio;
