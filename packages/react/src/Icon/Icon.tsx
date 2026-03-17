import { forwardRef } from 'react';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  iconClasses as classes,
  IconColor,
  toIconCssVars,
} from '@mezzanine-ui/core/icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface IconProps extends NativeElementPropsWithoutKeyAndRef<'i'> {
  /**
   * Color name provided by palette.
   */
  color?: IconColor;
  /**
   * The icon provided by `@mezzanine-ui/icons` package.
   */
  icon: IconDefinition;
  /**
   * Icon size in px
   */
  size?: number;
  /**
   * Whether to spin the icon or not.
   * @default false
   */
  spin?: boolean;
  /**
   * Icon accessible title
   */
  title?: string;
}

/**
 * 渲染來自 `@mezzanine-ui/icons` 的 SVG 圖示元件。
 *
 * 透過 `icon` prop 傳入圖示定義物件，支援調整顏色、尺寸與旋轉動畫。
 * 當元件綁定 `onClick` 或 `onMouseOver` 事件時，游標樣式會自動切換為 pointer。
 * 可透過 `title` prop 提供無障礙標題文字。
 *
 * @example
 * ```tsx
 * import Icon from '@mezzanine-ui/react/Icon';
 * import { SearchIcon, LoadingIcon, CheckCircleFilledIcon } from '@mezzanine-ui/icons';
 *
 * // 基本用法
 * <Icon icon={SearchIcon} />
 *
 * // 自訂顏色與尺寸
 * <Icon icon={CheckCircleFilledIcon} color="success" size={24} />
 *
 * // 旋轉動畫（常用於載入狀態）
 * <Icon icon={LoadingIcon} spin />
 *
 * // 加入無障礙標題
 * <Icon icon={SearchIcon} title="搜尋" />
 * ```
 */
const Icon = forwardRef<HTMLElement, IconProps>(function Icon(props, ref) {
  const {
    className,
    color,
    icon,
    size,
    spin = false,
    style: styleProp,
    title,
    ...rest
  } = props;
  const { definition } = icon;
  const cssVars = toIconCssVars({ color, size });
  const style = {
    '--mzn-icon-cursor':
      props.onClick || props.onMouseOver ? 'pointer' : 'inherit',
    ...cssVars,
    ...styleProp,
  };

  return (
    <i
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        {
          [classes.color]: color,
          [classes.spin]: spin,
          [classes.size]: size,
        },
        className,
      )}
      data-icon-name={icon.name}
      style={style}
    >
      <svg {...definition.svg} focusable={false}>
        {title || definition.title ? (
          <title>{title || definition.title}</title>
        ) : null}
        <path {...definition.path} />
      </svg>
    </i>
  );
});

export default Icon;
