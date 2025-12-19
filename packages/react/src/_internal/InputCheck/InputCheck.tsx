import { forwardRef, ReactNode } from 'react';
import {
  inputCheckClasses as classes,
  InputCheckSize,
} from '@mezzanine-ui/core/_internal/input-check';
import { cx } from '../../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';

export interface InputCheckProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'label'>, 'onChange'> {
  /**
   * The label of input check.
   */
  children?: ReactNode;
  /**
   * The control of input check.
   */
  control?: ReactNode;
  /**
   * Whether the input check is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the input check is error.
   * @default false
   */
  error?: boolean;
  /**
   * Whether the input check is focused.
   * @default false
   */
  focused?: boolean;
  /**
   * Support text of input check.
   */
  hint?: string;
  /**
   * The size of input check.
   * @default 'main'
   */
  size?: InputCheckSize;
}

/**
 * The react component for `mezzanine` input check.
 */
const InputCheck = forwardRef<HTMLLabelElement, InputCheckProps>(
  function InputCheck(props, ref) {
    const {
      children,
      className,
      control,
      disabled,
      error,
      focused,
      hint,
      htmlFor,
      size = 'main',
      ...rest
    } = props;

    return (
      <label
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.size(size),
          {
            [classes.disabled]: disabled,
            [classes.error]: error,
            [classes.withLabel]: !!children,
          },
          className,
        )}
        htmlFor={htmlFor}
      >
        <span
          className={cx(classes.control, {
            [classes.controlFocused]: focused,
          })}
        >
          {control}
        </span>
        {children && (
          <span className={classes.label}>
            {children}
            {hint && <span className={classes.hint}>{hint}</span>}
          </span>
        )}
      </label>
    );
  },
);

export default InputCheck;
