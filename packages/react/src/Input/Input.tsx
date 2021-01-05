import {
  ComponentType,
  InputHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
} from 'react';
import {
  inputClasses as classes,
  InputTextColor,
  InputBoarderColor,
  InputSize,
} from '@mezzanine-ui/core/input';
import { cx } from '../utils/cx';

export type InputComponent = 'input' | ComponentType<InputProps>;

export interface InputProps extends DetailedHTMLProps <InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  /**
   * The input color name provided by palette.
   * @default 'text-secondary'
   */
  color?: InputTextColor;
  /**
   * The border color provided by palette.
   * @default 'border'
   */
  border?: InputBoarderColor;
  /**
   * Override the component used to render.
   * @default 'input'
   */
  component?: InputComponent;
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
}

/**
 * The react component for `mezzanine` input.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const {
    children,
    className,
    disabled = false,
    color = 'text-secondary',
    component = 'input',
    inputSize = 'medium',
    placeholder = '',
    ...rest
  } = props;

  const Component = component as 'input';

  return (
    <Component
      ref={ref as any}
      {...rest}
      aria-disabled={disabled}
      className={cx(
        classes.host,
        // classes.variant(variant),
        classes.color(color),
        classes.inputSize(inputSize),
        // {
        //   [classes.icon]: asIconBtn,
        // },
        className,
      )}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
});

export default Input;
