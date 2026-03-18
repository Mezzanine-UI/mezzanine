'use client';

import { forwardRef, MouseEvent } from 'react';
import { buttonClasses as classes } from '@mezzanine-ui/core/button';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import Icon from '../Icon';
import Spin from '../Spin';
import Tooltip from '../Tooltip';
import { ButtonComponent, ButtonPropsBase } from './typings';

export type ButtonProps<C extends ButtonComponent = 'button'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    ButtonComponent,
    C,
    ButtonPropsBase
  >;

/**
 * 通用按鈕元件，支援多種外觀變體與尺寸。
 *
 * 可透過 `variant` 控制外觀（如 `base-primary`、`outlined-primary`、`text-primary` 等），
 * 透過 `iconType` 決定圖示的位置（`leading`、`trailing` 或 `icon-only`）。
 * 當 `iconType` 為 `icon-only` 時，`children` 會作為 Tooltip 的提示文字顯示。
 * 支援 `loading` 狀態，以及透過 `component` prop 將根元素替換為任意元件（例如 `<a>`）。
 *
 * @example
 * ```tsx
 * import Button from '@mezzanine-ui/react/Button';
 * import { PlusIcon, ArrowRightIcon } from '@mezzanine-ui/icons';
 *
 * // 基本用法
 * <Button variant="base-primary">送出</Button>
 *
 * // 帶有前置圖示
 * <Button icon={PlusIcon} iconType="leading" variant="outlined-primary">新增項目</Button>
 *
 * // 僅圖示（hover 時顯示 Tooltip）
 * <Button icon={PlusIcon} iconType="icon-only">新增</Button>
 *
 * // 以 <a> 標籤渲染（多型態用法）
 * <Button component="a" href="/dashboard" icon={ArrowRightIcon} iconType="trailing">前往儀表板</Button>
 * ```
 *
 * @see {@link ButtonGroup} 用於將多個 Button 水平排列為群組
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
    const loadingIcon = <Spin loading size="minor" />;

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
        {...(tooltipProps && {
          onMouseEnter: tooltipProps.onMouseEnter,
          onMouseLeave: tooltipProps.onMouseLeave,
        })}
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
