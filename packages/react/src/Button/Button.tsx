'use client';

import { type RefAttributes, MouseEvent, useCallback, useRef } from 'react';
import { buttonClasses as classes } from '@mezzanine-ui/core/button';
import { useComposeRefs } from '../hooks/useComposeRefs';
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
 * Whether the button is the trigger of a popup (`aria-haspopup`) that is
 * currently open (`aria-expanded`). ARIA allows both as booleans or strings.
 */
function isExpandedPopupTrigger(
  ariaExpanded: unknown,
  ariaHasPopup: unknown,
): boolean {
  const isExpanded = ariaExpanded === true || ariaExpanded === 'true';
  const hasPopup =
    ariaHasPopup !== undefined &&
    ariaHasPopup !== null &&
    ariaHasPopup !== false &&
    ariaHasPopup !== 'false';

  return isExpanded && hasPopup;
}

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
function Button({
  ref,
  ...props
}: ButtonProps & RefAttributes<HTMLButtonElement>) {
  const {
    'aria-describedby': ariaDescribedBy,
    children,
    className,
    component: Component = 'button',
    disabled = false,
    disabledTooltip = false,
    icon,
    iconType,
    loading = false,
    onBlur,
    onClick,
    onFocus,
    size = 'main',
    tooltipPosition = 'bottom',
    variant = 'base-primary',
    ...rest
  } = props;

  const isIconOnly = iconType === 'icon-only';
  const showTooltip = isIconOnly && !disabledTooltip && Boolean(children);
  /**
   * A Dropdown marks its trigger with `aria-haspopup` and `aria-expanded`.
   * Hovering back onto the trigger would mount the tooltip after the open menu
   * in the portal layer, on top of it, so the tooltip stays hidden while the
   * popup is expanded. A disclosure (`aria-expanded` alone) opens nothing that
   * floats, so its tooltip is kept. Only the title is dropped: unmounting the
   * Tooltip branch would remount the button and lose its focus and the anchor
   * ref.
   */
  const isPopupExpanded = isExpandedPopupTrigger(
    rest['aria-expanded'],
    rest['aria-haspopup'],
  );

  /**
   * Tooltip 分支會提供自己的 ref，必須與呼叫端的 ref 合成而非取代，
   * 否則像 Dropdown 這種以 anchorRef 定位的消費端會拿不到 DOM 節點。
   * 這裡用 holder + 穩定的 callback ref，避免每次 render 產生新的
   * ref 函式導致 Tooltip 的 target state 反覆 detach/attach。
   */
  const tooltipTargetRef = useRef<React.RefCallback<HTMLElement> | null>(null);
  const attachTooltipTarget = useCallback(
    (element: HTMLButtonElement | null) => {
      tooltipTargetRef.current?.(element);
    },
    [],
  );
  const composedRef = useComposeRefs<HTMLButtonElement>([
    ref,
    attachTooltipTarget,
  ]);

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
    'aria-describedby': string | undefined;
    onBlur: React.FocusEventHandler;
    onFocus: React.FocusEventHandler;
    onMouseEnter: React.MouseEventHandler;
    onMouseLeave: React.MouseEventHandler;
    ref: React.RefCallback<HTMLElement>;
  }) => {
    tooltipTargetRef.current = tooltipProps?.ref ?? null;

    return (
      <Component
        {...rest}
        ref={composedRef}
        aria-describedby={
          [ariaDescribedBy, tooltipProps?.['aria-describedby']]
            .filter(Boolean)
            .join(' ') || undefined
        }
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
        onBlur={(event: React.FocusEvent<HTMLButtonElement>) => {
          onBlur?.(event);
          tooltipProps?.onBlur(event);
        }}
        onFocus={(event: React.FocusEvent<HTMLButtonElement>) => {
          onFocus?.(event);
          tooltipProps?.onFocus(event);
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
  };

  if (showTooltip) {
    return (
      // Portaled so an ancestor stacking context (e.g. a pinned Table cell)
      // cannot paint its siblings over the tooltip.
      <Tooltip
        disablePortal={false}
        options={{ placement: tooltipPosition }}
        title={isPopupExpanded ? undefined : children}
      >
        {(tooltipProps) => buttonElement(tooltipProps)}
      </Tooltip>
    );
  }

  return buttonElement();
}

export default Button;
