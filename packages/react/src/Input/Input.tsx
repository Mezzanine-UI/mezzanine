import {
  InputHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { cx } from '../utils/cx';

export interface InputProps extends DetailedHTMLProps <InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  /**
   * The size of input.
   * @default 'medium'
   */
  inputSize?: InputSize;
  /**
   * The placeholder of input.
   * @default ''
   */
  placeholder?: string;
  /**
   * The error of input.
   * @default ''
   */
  error?: boolean;
}

/**
 * The react component for `mezzanine` input.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const {
    error,
    children,
    className,
    disabled = false,
    inputSize = 'medium',
    placeholder = '',
    ...rest
  } = props;

  return (
    <input
      ref={ref}
      {...rest}
      className={cx(
        classes.host,
        // classes.variant(variant),
        classes.inputSize(inputSize),
        {
          // [classes.icon]: asIconBtn,
          [classes.error]: error,
        },
        className,
      )}
      onChange={(e) => e.target.value}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
});

export default Input;
