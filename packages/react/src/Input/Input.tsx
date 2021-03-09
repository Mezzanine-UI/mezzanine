import {
  forwardRef,
  ChangeEventHandler,
  Ref,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { cx } from '../utils/cx';
import TextField, { TextFieldProps } from '../TextField';
import { useInputControl } from './useInputControl';
import { useInputFormControl } from './useInputFormControl';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface InputProps extends Omit<TextFieldProps, 'active' | 'children' | 'onClear'> {
  /**
   * The default value of input.
   */
  defaultValue?: string;
  /**
   * The react ref passed to input element.
   */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * The other native props for input element.
   */
  inputProps?: Omit<
  NativeElementPropsWithoutKeyAndRef<'input'>,
  | Exclude<keyof InputProps, 'className'>
  | `aria-${'disabled' | 'multiline' | 'readonly' | 'required'}`
  >;
  /**
   * The change event handler of input element.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The placeholder of input.
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
   * The size of input.
   * @default 'medium'
   */
  size?: InputSize;
  /**
   * The value of input.
   */
  value?: string;
}

/**
 * The react component for `mezzanine` input.
 */
const Input = forwardRef<HTMLDivElement, InputProps>(function Input(props, ref) {
  const {
    className,
    clearable = false,
    defaultValue,
    disabled: disabledProp = false,
    error: errorProp = false,
    fullWidth: fullWidthProp = false,
    inputRef: inputRefProp,
    inputProps,
    onChange: onChangeProp,
    placeholder,
    prefix,
    readOnly = false,
    required: requiredProp = false,
    size = 'medium',
    suffix,
    value: valueProp,
  } = props;
  const {
    active,
    composedRef,
    onClear,
    onChange,
    value,
  } = useInputControl({
    ref: inputRefProp,
    defaultValue,
    onChange: onChangeProp,
    value: valueProp,
  });
  const {
    disabled,
    error,
    fullWidth,
    required,
  } = useInputFormControl({
    disabled: disabledProp,
    error: errorProp,
    fullWidth: fullWidthProp,
    required: requiredProp,
  });

  return (
    <TextField
      ref={ref}
      active={active}
      className={cx(
        classes.host,
        className,
      )}
      clearable={clearable}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      onClear={onClear}
      prefix={prefix}
      size={size}
      suffix={suffix}
    >
      <input
        {...inputProps}
        ref={composedRef}
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
});

export default Input;
