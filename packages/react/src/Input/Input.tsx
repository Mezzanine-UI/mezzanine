import {
  forwardRef,
  ChangeEventHandler,
  Ref,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { cx } from '../utils/cx';
import TextField, { TextFieldProps } from '../TextField';
import { useInputControl } from './useInputControl';

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
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  | Exclude<keyof InputProps, 'className'>
  | `aria-${'disabled' | 'multiline' | 'readonly'}`
  | 'ref'
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
   */
  readOnly?: boolean;
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
    disabled = false,
    error = false,
    fullWidth = false,
    inputRef: inputRefProp,
    inputProps,
    onChange: onChangeProp,
    placeholder,
    prefix,
    readOnly = false,
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
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        value={value}
      />
    </TextField>
  );
});

export default Input;
