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
  iconStart?: ReactNode;
  /**
   * The icon placed on the end of input.
   */
  iconEnd?: ReactNode;
  // /**
  //  * The text placed on the start of input.
  //  */
  // textStart?: ReactNode;
  /**
   * The text placed on the end of input.
   */
  textEnd?: ReactNode;
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
    value,
    onChange,
    defaultValue,
    clearable = false,
    error = false,
    children,
    className,
    disabled = false,
    size = 'medium',
    placeholder = '',
    iconStart: iconStartProp,
    iconEnd: iconEndProp,
    textEnd: textEndProp,
    ...rest
  } = props;

  const iconStart: ReactNode = iconStartProp;
  const iconEnd: ReactNode = iconEndProp;
  // const textStart: ReactNode = textStartProp;
  const textEnd: ReactNode = textEndProp;

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
    <div className={cx(classes.wrapper,
      {
        [classes.disabled]: disabled,
        [classes.error]: error,
        [classes.icon('start')]: iconStart,
        [classes.icon('end')]: iconEnd,
      },
      classes.size(size))}
    >
      {iconStart ? (
        <div className={cx(
          classes.decoratorHost,
          {
            [classes.icon('start')]: iconStart,
          },
        )}
        >
          {iconStart}
        </div>
      ) : null}
      <input
        type="text"
        ref={ref}
        value={inputs}
        onChange={handleChange}
        className={cx(classes.host, classes.size(size))}
        {...rest}
        placeholder={placeholder}
        disabled={disabled}
      />
      {(iconEnd || textEnd) ? (
        <div className={cx(classes.decoratorHost,
          {
            [classes.icon('end')]: iconEnd,
          })}
        >
          {iconEnd || textEnd}
        </div>
      ) : null}
      {clearable ? (
        <button
          onClick={() => setInputs('')}
          className={cx(classes.decoratorHost,
            {
              [classes.icon('end')]: iconEnd,
              [classes.clearButton]: clearable,
            })}
          type="button"
        >
          <Icon icon={TimesIcon} />
        </button>
      ) : null}
    </div>
  );
});

export default Input;
