import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode,
} from 'react';
import { SpinnerIcon } from '@mezzanine-ui/icons';
import {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  classes,
} from '@mezzanine-ui/core/button';
import { cx } from '../utils/cx';
import Icon from '../Icon';

export type ButtonComponent = 'button' | 'label' | 'a';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  /**
   * The color name provided by palette.
   * @default 'primary'
   */
  color?: ButtonColor;
  /**
   * Override the componoent used to render.
   * @default 'button'
   */
  component?: ButtonComponent;
  /**
   * The icon placed on the end of button.
   */
  iconEnd?: ReactNode;
  /**
   * The icon placed on the start of button.
   */
  iconStart?: ReactNode;
  /**
   * If true, replace the original icon.
   * Replace iconEnd if only iconEnd provided, or iconStart.
   * @default false
   */
  loading?: boolean;
  /**
   * The size of button.
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * The variant of button.
   * @default 'basic'
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
    disabled = false,
    loading = false,
    iconEnd: iconEndProp,
    iconStart: iconStartProp,
    size = 'medium',
    type = 'button',
    variant = 'text',
    ...rest
  } = props;
  const Component = component as 'button';

  let iconStart: ReactNode = iconStartProp;
  let iconEnd: ReactNode = iconEndProp;

  if (loading) {
    const loadingIcon = <Icon icon={SpinnerIcon} spin />;

    if (iconEnd && !iconStart) {
      iconEnd = loadingIcon;
    } else {
      iconStart = loadingIcon;
    }
  }

  const asIconBtn = children == null && !!(iconStart || iconEnd);

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
          [classes.icon]: asIconBtn,
          [classes.loading]: loading,
        },
        className,
      )}
      disabled={disabled}
      type={type}
    >
      {iconStart}
      {children && <span className={classes.label}>{children}</span>}
      {iconEnd}
    </Component>
  );
});

export default Button;
