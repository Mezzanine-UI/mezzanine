import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import {
  ChangeEventHandler,
  forwardRef,
  RefObject,
} from 'react';
import TextField, { TextFieldProps } from '../TextField';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';

export interface PickerTriggerProps
  extends
  Omit<TextFieldProps,
  | 'active'
  | 'children'
  | 'suffix'
  | 'defualtChecked'
  > {
  /**
   * React ref for the input element.
   */
  inputRef?: RefObject<HTMLInputElement>;
  /**
   * Change handler for the input element.
   */
  onChange?: ChangeEventHandler;
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
      clearable,
      disabled,
      inputProps,
      inputRef,
      onChange,
      placeholder,
      readOnly,
      required,
      value,
      ...restTextFieldProps
    } = props;

    return (
      <TextField
        {...restTextFieldProps}
        ref={ref}
        active={!!value}
        className={cx(
          classes.host,
          className,
        )}
        clearable={!readOnly && clearable}
        disabled={disabled}
      >
        <input
          {...inputProps}
          ref={inputRef}
          aria-disabled={disabled}
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
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
