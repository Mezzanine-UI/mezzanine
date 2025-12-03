import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { ChangeEventHandler, forwardRef, ReactNode, RefObject } from 'react';
import TextField, { TextFieldProps } from '../TextField';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import FormattedInput from './FormattedInput';

export interface PickerTriggerProps
  extends Omit<
    TextFieldProps,
    | 'active'
    | 'children'
    | 'defaultChecked'
    | 'disabled'
    | 'readonly'
    | 'typing'
  > {
  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Enable formatted input with mask format behavior.
   * @default false
   */
  enableFormatted?: boolean;
  /**
   * Format pattern for formatted input (e.g., "YYYY-MM-DD", "HH:mm:ss").
   * Required when enableFormatted is true.
   */
  format?: string;
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
      enableFormatted = false,
      format,
      inputProps,
      inputRef,
      onChange,
      placeholder,
      readOnly,
      required,
      suffix,
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

    // Formatted input mode
    if (enableFormatted && format) {
      return (
        <TextField
          {...restTextFieldProps}
          {...defaultTextFieldProps}
          ref={ref}
          active={!!value}
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
            format={format}
            onChange={(formatted, _rawDigits) => {
              if (onChange) {
                onChange({
                  target: { value: formatted },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            placeholder={placeholder || format}
            readOnly={readOnly}
            required={required}
            value={value}
          />
        </TextField>
      );
    }

    // Standard input mode
    return (
      <TextField
        {...restTextFieldProps}
        {...defaultTextFieldProps}
        ref={ref}
        active={!!value}
        className={cx(classes.host, className)}
        clearable={!readOnly && clearable}
        suffix={suffix}
      >
        <input
          {...inputProps}
          ref={inputRef}
          aria-disabled={disabled}
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
          className={cx(classes.inputMono, inputProps?.className)}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          value={value}
        />
      </TextField>
    );
  },
);

export default PickerTrigger;
