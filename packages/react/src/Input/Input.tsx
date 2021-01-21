import {
  InputHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { TimesIcon } from '@mezzanine-ui/icons';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { cx } from '../utils/cx';
import Icon from '../Icon';

export interface InputProps extends
  DetailedHTMLProps <Omit <InputHTMLAttributes<HTMLInputElement>, 'size'>, HTMLInputElement> {
  /**
   * The size of input.
   * @default 'medium'
   */
  size?: InputSize;
  /**
   * The icon placed on the start of input.
   */
  inputPrefix?: ReactNode;
  /**
   * The icon or text placed on the end of input.
   */
  inputSuffix?: ReactNode;
  /**
   * The error of input.
   * @default 'false';
   */
  error?: boolean;
  /**
   * The button for clear input.
   * @default 'false';
   */
  clearable?: boolean;
}

/**
 * The react component for `mezzanine` input.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref:any) {
  const {
    className,
    value,
    onChange,
    defaultValue,
    clearable = false,
    error = false,
    children,
    disabled = false,
    size = 'medium',
    placeholder = '',
    inputPrefix: inputPrefixProp,
    inputSuffix: inputSuffixProp,
    ...rest
  } = props;

  const inputPrefix: ReactNode = inputPrefixProp;
  const inputSuffix: ReactNode = inputSuffixProp;

  const [inputs, setInputs] = useState(defaultValue || '');

  const handleChange = useCallback((e) => {
    if (onChange) {
      onChange(e);
    }
    setInputs(e.target.value);
  }, [onChange]);

  useEffect(() => {
    if (value && value !== defaultValue) {
      setInputs(value);
    }
  }, [defaultValue, ref, value]);

  return (
    <div className={cx(
      classes.host,
      classes.size(size),
      {
        [classes.disabled]: disabled,
        [classes.error]: error,
        [classes.icon('start')]: inputPrefix,
        [classes.icon('end')]: inputSuffix || clearable,
      },
      className,
    )}
    >
      {inputPrefix ? (
        <div className={cx(
          classes.decoratorHost,
          {
            [classes.icon('start')]: inputPrefix,
          },
        )}
        >
          {inputPrefix}
        </div>
      ) : null}
      <input
        type="text"
        ref={ref}
        value={inputs}
        onChange={handleChange}
        className={cx(
          {
            [classes.error]: error,
          },
          classes.tag,
          classes.size(size),
        )}
        {...rest}
        placeholder={placeholder}
        disabled={disabled}
        aria-disabled={disabled}
      />
      {inputSuffix ? (
        <div className={cx(
          classes.decoratorHost,
          {
            [classes.error]: error,
            [classes.icon('end')]: inputSuffix,
          },
        )}
        >
          {inputSuffix}
        </div>
      ) : null}
      {clearable && inputs ? (
        <button
          onClick={() => setInputs('')}
          className={cx(
            classes.decoratorHost,
            {
              [classes.error]: error,
              [classes.icon('end')]: clearable,
              [classes.clearButton]: clearable,
            },
          )}
          type="button"
        >
          <Icon icon={TimesIcon} />
        </button>
      ) : null}
    </div>
  );
});

export default Input;
