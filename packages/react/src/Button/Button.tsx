import {
  ButtonHTMLAttributes,
  ComponentType,
  DetailedHTMLProps,
  forwardRef,
  ReactNode,
} from 'react';
import { SpinnerIcon } from '@mezzanine-ui/icons';
import {
  buttonClasses as classes,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { cx } from '../utils/cx';
import Icon from '../Icon';

export type ButtonComponent = 'button' | 'a' | ComponentType<ButtonProps>;

export interface ButtonProps extends
  Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'prefix' | 'ref'> {
  /**
   * The color name provided by palette.
   * @default 'primary'
   */
  color?: ButtonColor;
  /**
   * Override the component used to render.
   * @default 'button'
   */
  component?: ButtonComponent;
  /**
   * If true, will use error color instead of color from props.
   * @default false
   */
  danger?: boolean;
  /**
   * If true, replace the original icon.
   * Replace suffix if only suffix provided, or prefix.
   * @default false
   */
  loading?: boolean;
  /**
   * The element placed on the start of button.
   */
  prefix?: ReactNode;
  /**
   * The size of button.
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * The element placed on the end of button.
   */
  suffix?: ReactNode;
  /**
   * The variant of button.
   * @default 'text'
   */
  variant?: ButtonVariant;
}

/**
 * The react component for `mezzanine` button.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    children,
    className,
    color = 'primary',
    component = 'button',
    danger = false,
    disabled = false,
    loading = false,
    onClick,
    prefix: prefixProp,
    size = 'medium',
    suffix: suffixProp,
    type = 'button',
    variant = 'text',
    ...rest
  } = props;
  const Component = component as 'button';

  let prefix: ReactNode = prefixProp;
  let suffix: ReactNode = suffixProp;

  if (loading) {
    const loadingIcon = <Icon icon={SpinnerIcon} spin />;

    if (suffix && !prefix) {
      suffix = loadingIcon;
    } else {
      prefix = loadingIcon;
    }
  }

  const asIconBtn = children == null && !!(prefix || suffix);

  return (
    <Component
      ref={ref as any}
      {...rest}
      aria-disabled={disabled}
      className={cx(
        classes.host,
        classes.variant(variant),
        classes.color(color),
        classes.size(size),
        {
          [classes.danger]: danger,
          [classes.disabled]: disabled,
          [classes.icon]: asIconBtn,
          [classes.loading]: loading,
        },
        className,
      )}
      disabled={disabled}
      onClick={(event) => {
        if (!disabled && !loading && onClick) {
          onClick(event);
        }
      }}
      type={type}
    >
      {prefix}
      {children && <span className={classes.label}>{children}</span>}
      {suffix}
    </Component>
  );
});

export default Button;
