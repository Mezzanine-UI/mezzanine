import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { ChangeEventHandler, forwardRef, ReactNode, RefObject } from 'react';
import TextField, { TextFieldProps } from '../TextField';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import FormattedInput, { FormattedInputProps } from './FormattedInput';

export interface PickerTriggerProps
  extends Omit<
      TextFieldProps,
      | 'active'
      | 'children'
      | 'defaultChecked'
      | 'disabled'
      | 'readonly'
      | 'typing'
    >,
    Pick<FormattedInputProps, 'errorMessages' | 'validate' | 'format'> {
  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * React ref for the input element.
   */
  inputRef?: RefObject<HTMLInputElement | null>;
  /**
   * Change handler for the input element.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * Placeholder for the input element.
   */
  placeholder?: string;
  /**
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /**
   * Custom suffix element. If not provided, defaults to CalendarIcon.
   */
  suffix?: ReactNode;
  /**
   * The value of the input element.
   */
  value?: string;
  /**
   * Other input props you may provide to input element.
   */
  inputProps?: Omit<
    NativeElementPropsWithoutKeyAndRef<'input'>,
    | 'defaultValue'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'readOnly'
    | 'required'
    | 'value'
    | `aria-${'disabled' | 'multiline' | 'readonly' | 'required'}`
  >;
}

/**
 * The react component for `mezzanine` picker trigger.
 */
const PickerTrigger = forwardRef<HTMLDivElement, PickerTriggerProps>(
  function PickerTrigger(props, ref) {
    const {
      className,
      clearable = true,
      disabled,
      errorMessages,
      format,
      inputProps,
      inputRef,
      onChange,
      placeholder,
      readOnly,
      required,
      suffix,
      validate,
      value,
      ...restTextFieldProps
    } = props;

    // TextField requires disabled and readonly to be mutually exclusive
    let defaultTextFieldProps = {};

    if (disabled) {
      defaultTextFieldProps = { disabled: true as const };
    } else if (readOnly) {
      defaultTextFieldProps = { readonly: true as const };
    }

    return (
      <TextField
        {...restTextFieldProps}
        {...defaultTextFieldProps}
        ref={ref}
        className={cx(classes.host, className)}
        clearable={!readOnly && clearable}
        suffix={suffix}
      >
        <FormattedInput
          {...inputProps}
          ref={inputRef}
          aria-disabled={disabled}
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
          disabled={disabled}
          errorMessages={errorMessages}
          format={format}
          onChange={(formatted, _rawDigits) => {
            if (onChange) {
              onChange({
                target: { value: formatted },
              } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          validate={validate}
          value={value}
        />
      </TextField>
    );
  },
);

export default PickerTrigger;
