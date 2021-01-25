import {
  forwardRef,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import TextField from 'react/src/TextField';
import { cx } from '../../utils/cx';

export interface InputProps {
  className?: string;
  /**
   * The clearable setting of input.
   * @default 'false';
   */
  clearable?: boolean;
  /**
   * The default value of input.
   * @default '';
   */
  defaultValue?: string;
  /**
   * The disable setting of input.
   * @default 'false';
   */
  disabled?: boolean;
  /**
   * The error of input.
   * @default 'false';
   */
  error?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * The placeholder of input.
   * @default '';
   */
  placeholder?: string;
  /**
   * The icon placed on the start of input.
   */
  prefix?: ReactNode;
  /**
   * The size of input.
   * @default 'medium'
   */
  size?: InputSize;
  /**
   * The icon or text placed on the end of input.
   */
  suffix?: ReactNode;
  /**
   * The button for clear input.
   * @default 'false';
   */
  value?: string;
  readOnly?: boolean;
}

/**
 * The react component for `mezzanine` input.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const {
    clearable = false,
    defaultValue,
    disabled = false,
    error = false,
    onChange,
    placeholder = '',
    prefix,
    size = 'medium',
    suffix,
    value,
    readOnly = false,
  } = props;

  const [inputs, setInputs] = useState(defaultValue || '');

  useEffect(() => {
    if (value && value !== defaultValue) {
      setInputs(value);
    }
  }, [defaultValue, value]);

  return (
    <TextField
      suffix={suffix}
      prefix={prefix}
      onClear={() => setInputs('')}
      disabled={disabled}
      error={error}
      size={size}
      clearable={clearable && !!inputs}
    >
      <input
        ref={ref}
        type="text"
        value={inputs}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
          setInputs(e.target.value);
        }}
        className={cx(
          {
            [classes.error]: error,
          },
          classes.size(size),
        )}
        readOnly={readOnly}
        placeholder={placeholder}
        disabled={disabled}
        aria-disabled={disabled}
      />
    </TextField>
  );
});

export default Input;
