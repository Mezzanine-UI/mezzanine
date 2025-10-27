'use client';

import { forwardRef, MouseEvent, ReactNode, useContext } from 'react';
import { SpinnerIcon } from '@mezzanine-ui/icons';
import { buttonClasses as classes } from '@mezzanine-ui/core/button';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import Icon from '../Icon';
import { ButtonComponent, ButtonPropsBase } from './typings';
import { MezzanineConfig } from '../Provider/context';

export type ButtonProps<C extends ButtonComponent = 'button'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    ButtonComponent,
    C,
    ButtonPropsBase
  >;

/**
 * The react component for `mezzanine` button.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { size: globalSize } = useContext(MezzanineConfig);
    const {
      children,
      className,
      color = 'primary',
      component: Component = 'button',
      danger = false,
      disabled = false,
      loading = false,
      onClick,
      prefix: prefixProp,
      size = globalSize,
      suffix: suffixProp,
      variant = 'text',
      ...rest
    } = props;

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
        {...rest}
        ref={ref}
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
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          if (!disabled && !loading && onClick) {
            onClick(event);
          }
        }}
      >
        {prefix}
        {children && <span className={classes.label}>{children}</span>}
        {suffix}
      </Component>
    );
  },
);

export default Button;
