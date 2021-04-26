import {
  forwardRef,
  Ref,
  useContext,
  ChangeEventHandler,
  useRef,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useInputWithClearControlValue } from '../Form/useInputWithClearControlValue';
import { FormControlContext } from '../Form';
import TextField, { TextFieldProps } from '../TextField';

export interface InputProps extends Omit<TextFieldProps, 'active' | 'children' | 'onClear' | 'onKeyDown'> {
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
  | 'defaultValue'
  | 'disabled'
  | 'onChange'
  | 'placeholder'
  | 'readOnly'
  | 'required'
  | 'value'
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
    disabled: disabledFromFormControl,
    fullWidth: fullWidthFromFormControl,
    required: requiredFromFormControl,
    severity,
  } = useContext(FormControlContext) || {};
  const {
    className,
    clearable = false,
    defaultValue,
    disabled = disabledFromFormControl || false,
    error = severity === 'error' || false,
    fullWidth = fullWidthFromFormControl || false,
    inputRef: inputRefProp,
    inputProps,
    onChange: onChangeProp,
    placeholder,
    prefix,
    readOnly = false,
    required = requiredFromFormControl || false,
    size = 'medium',
    suffix,
    value: valueProp,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [
    value,
    onChange,
    onClear,
  ] = useInputWithClearControlValue({
    defaultValue,
    onChange: onChangeProp,
    ref: inputRef,
    value: valueProp,
  });
  const composedInputRef = useComposeRefs([inputRefProp, inputRef]);
  const active = !!value;

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
        ref={composedInputRef}
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
