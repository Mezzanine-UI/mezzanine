import {
  forwardRef,
  ReactNode,
  useState,
  useEffect,
  Ref,
} from 'react';
import { TimesIcon } from '@mezzanine-ui/icons';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { cx } from '../../utils/cx';
import Icon from '../../Icon';

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
  inputRef?: Ref<HTMLInputElement>;
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
    className,
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
    inputRef,
  } = props;

  const [inputs, setInputs] = useState(defaultValue || '');

  useEffect(() => {
    if (value && value !== defaultValue) {
      setInputs(value);
    }
  }, [defaultValue, ref, value]);

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        classes.size(size),
        {
          [classes.disabled]: disabled,
          [classes.error]: error,
          [classes.icon('start')]: prefix,
          [classes.icon('end')]: suffix || clearable,
        },
        className,
      )}
    >
      {prefix ? (
        <div className={cx(
          classes.decoratorHost,
          {
            [classes.icon('start')]: prefix,
          },
        )}
        >
          {prefix}
        </div>
      ) : null}
      <input
        ref={inputRef}
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
      {suffix ? (
        <div className={cx(
          classes.decoratorHost,
          {
            [classes.error]: error,
            [classes.icon('end')]: suffix,
          },
        )}
        >
          {suffix}
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
