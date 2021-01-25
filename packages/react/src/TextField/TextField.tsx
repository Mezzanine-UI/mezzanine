import {
  forwardRef,
  ReactNode,
} from 'react';
import { TimesIcon } from '@mezzanine-ui/icons';
import {
  textFieldClasses as classes,
  TextFieldSize,
} from '@mezzanine-ui/core/textField';
import { cx } from '../utils/cx';
import Icon from '../Icon';

export interface TextFieldProps {
  children?: ReactNode;
  className?: string;
  /**
   * The clearable setting of input.
   * @default 'false';
   */
  clearable?: boolean;
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
  onClear?: VoidFunction;
  /**
   * The icon placed on the start of input.
   */
  prefix?: ReactNode;
  /**
   * The size of input.
   * @default 'medium'
   */
  size?: TextFieldSize;
  /**
   * The icon or text placed on the end of input.
   */
  suffix?: ReactNode;
  multiple?: boolean;
}

/**
 * The react component for `mezzanine` input.
 */
const TextField = forwardRef<HTMLDivElement, TextFieldProps>(function TextField(props, ref) {
  const {
    multiple,
    children,
    className,
    clearable = false,
    disabled = false,
    error = false,
    onClear,
    prefix,
    size = 'medium',
    suffix,
  } = props;

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        classes.size(size),
        {
          [classes.multiple]: multiple,
          [classes.disabled]: disabled,
          [classes.error]: error,
          [classes.prefix]: prefix,
          [classes.suffix]: suffix || clearable,
        },
        className,
      )}
    >
      {prefix && (
        <div className={cx(
          {
            [classes.prefix]: prefix,
          },
        )}
        >
          {prefix}
        </div>
      )}
      {children}
      {suffix && (
        <div className={cx(
          {
            [classes.error]: error,
            [classes.suffix]: suffix,
          },
        )}
        >
          {suffix}
        </div>
      )}
      {clearable && (
        <button
          onClick={() => onClear?.()}
          className={cx(
            {
              [classes.error]: error,
              [classes.suffix]: clearable,
              [classes.clearButton]: clearable,
            },
          )}
          type="button"
        >
          <Icon icon={TimesIcon} />
        </button>
      )}
    </div>
  );
});

export default TextField;
