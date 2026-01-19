'use client';

import { forwardRef, MouseEvent } from 'react';
import { SpinnerIcon } from '@mezzanine-ui/icons';
import { buttonClasses as classes } from '@mezzanine-ui/core/button';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import Icon from '../Icon';
import { ButtonComponent, ButtonPropsBase } from './typings';

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
    const {
      children,
      className,
      component: Component = 'button',
      disabled = false,
      icon,
      iconType,
      loading = false,
      onClick,
      size = 'main',
      variant = 'base-primary',
      ...rest
    } = props;

    // Loading 狀態下的 icon
    const loadingIcon = <Icon icon={SpinnerIcon} spin size={16} />;

    // 渲染 icon 內容
    const renderIcon = () => {
      if (loading) {
        return loadingIcon;
      }
      if (icon) {
        return <Icon icon={icon} size={16} />;
      }
      return null;
    };

    return (
      <Component
        {...rest}
        ref={ref}
        aria-disabled={disabled}
        className={cx(
          classes.host,
          classes.variant(variant),
          classes.size(size),
          {
            [classes.disabled]: disabled,
            [classes.loading]: loading,
            [classes.iconLeading]: iconType === 'leading',
            [classes.iconTrailing]: iconType === 'trailing',
            [classes.iconOnly]: iconType === 'icon-only',
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
        {loading ? (
          renderIcon()
        ) : (
          <>
            {(iconType === 'leading' || iconType === 'icon-only') &&
              renderIcon()}
            {iconType !== 'icon-only' && children}
            {iconType === 'trailing' && renderIcon()}
          </>
        )}
      </Component>
    );
  },
);

export default Button;
