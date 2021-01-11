import {
  InputHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { cx } from '../utils/cx';

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
   * The placeholder of input.
   * @default ''
   */
  placeholder?: string;
  /**
   * The errorMessage of input.
   * @default ''
   */
  errorMessage?: string;
}

/**
 * The react component for `mezzanine` input.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const {
    errorMessage,
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

  // const hasIcon = !!(iconStart || iconEnd);

  return (
    <div className={cx(classes.wrapper,
      {
        [classes.disabled]: disabled,
        [classes.error]: errorMessage,
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
        className={classes.host}
        ref={ref}
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
      {errorMessage ? (
        <span className={classes.errorMessage}>
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
});

export default Input;
