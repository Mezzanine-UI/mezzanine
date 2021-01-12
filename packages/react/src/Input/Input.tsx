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
  /**
   * The text placed on the start of input.
   */
  textStart?: ReactNode;
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
  /**
   * Only for number.
   * @default 'false';
   */
  numberOnly?: boolean;
  /**
   * Only for alphabet.
   * @default 'false';
   */
  alphabetOnly?: boolean;
  /**
   * Only for alphabet and number.
   * @default 'false';
   */
  alphabetNumberOnly?: boolean;
  /**
   * Maximum length of the input .
   * @default 'false';
   */
  maxLength?: number;
}

/**
 * The react component for `mezzanine` input.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref:any) {
  const {
    numberOnly,
    alphabetOnly,
    alphabetNumberOnly,
    maxLength,
    value,
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
    textStart: textStartProp,
    textEnd: textEndProp,
    ...rest
  } = props;

  const iconStart: ReactNode = iconStartProp;
  const iconEnd: ReactNode = iconEndProp;
  const textStart: ReactNode = textStartProp;
  const textEnd: ReactNode = textEndProp;

  const [inputs, setInputs] = useState(defaultValue || '');

  const handleChange = useCallback(({
    target,
  }) => {
    let testedValue = target.value;

    if (numberOnly) {
      testedValue = testedValue?.replace(/[^0-9]/g, '');
    }

    if (alphabetOnly) {
      testedValue = testedValue?.replace(/[^a-z]/gi, '');
    }

    if (alphabetNumberOnly) {
      testedValue = testedValue?.replace(/[^a-z^A-Z^0-9]/g, '');
    }

    if (maxLength) {
      testedValue = testedValue?.substr(0, maxLength);
    }

    setInputs(testedValue);
  }, [
    numberOnly,
    alphabetOnly,
    alphabetNumberOnly,
    maxLength,
  ]);

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
      {textStart ? (
        <span className={cx(
          classes.decoratorHost,
          {
            [classes.text('start')]: textStart,
          },
        )}
        >
          {textStart}
        </span>
      ) : null}
      <input
        type="text"
        ref={ref}
        value={inputs}
        onChange={handleChange}
        className={classes.host}
        {...rest}
        placeholder={placeholder}
        disabled={disabled}
      />
      {iconEnd ? (
        <div className={cx(classes.decoratorHost,
          {
            [classes.icon('end')]: iconEnd,
          })}
        >
          {iconEnd}
        </div>
      ) : null}
      {textEnd ? (
        <span className={cx(
          classes.decoratorHost,
          {
            [classes.text('end')]: textEnd,
          },
        )}
        >
          {textEnd}
        </span>
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
