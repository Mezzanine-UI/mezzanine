'use client';

import { forwardRef, MouseEvent } from 'react';
import { SpinnerIcon } from '@mezzanine-ui/icons';
import { buttonClasses as classes } from '@mezzanine-ui/core/button';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
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
      disabledTooltip = false,
      icon,
      iconType,
      loading = false,
      onClick,
      size = 'main',
      tooltipPosition = 'bottom',
      variant = 'base-primary',
      ...rest
    } = props;

    const isIconOnly = iconType === 'icon-only';
    const showTooltip = isIconOnly && !disabledTooltip && Boolean(children);

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

    const buttonElement = (tooltipProps?: {
      onMouseEnter: React.MouseEventHandler;
      onMouseLeave: React.MouseEventHandler;
      ref: React.RefCallback<HTMLElement>;
    }) => (
      <Component
        {...rest}
        ref={tooltipProps?.ref || ref}
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
            [classes.iconOnly]: isIconOnly,
          },
          className,
        )}
        disabled={disabled}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          if (!disabled && !loading && onClick) {
            onClick(event);
          }
        }}
        onMouseEnter={tooltipProps?.onMouseEnter}
        onMouseLeave={tooltipProps?.onMouseLeave}
      >
        {loading ? (
          renderIcon()
        ) : (
          <>
            {(iconType === 'leading' || isIconOnly) && renderIcon()}
            {!isIconOnly && children}
            {iconType === 'trailing' && renderIcon()}
          </>
        )}
      </Component>
    );

    if (showTooltip) {
      return (
        <Tooltip options={{ placement: tooltipPosition }} title={children}>
          {(tooltipProps) => buttonElement(tooltipProps)}
        </Tooltip>
      );
    }

    return buttonElement();
  },
);

export default Button;
