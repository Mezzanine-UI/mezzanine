import { forwardRef } from 'react';
import {
  BadgeCountVariant,
  BadgeVariant,
  badgeClasses as classes,
} from '@mezzanine-ui/core/badge';
import { cx } from '../utils/cx';
import { BadgeProps } from './typings';

const isCountVariant = (variant: BadgeVariant): variant is BadgeCountVariant =>
  [
    'count-alert',
    'count-inactive',
    'count-inverse',
    'count-brand',
    'count-info',
  ].includes(variant);

/**
 * 徽章元件，用於顯示數字計數、狀態圓點或文字標籤。
 *
 * 支援四種 variant 類型：count（數字計數）、dot（狀態圓點）、dot 含文字以及 text（純文字標籤）。
 * 計數型徽章可設定 `overflowCount` 限制最大顯示數值；當 `count` 為 0 時徽章自動隱藏。
 * 使用 `children` 時（僅限 dot 型），徽章會以覆疊方式出現在子元素右上角。
 *
 * @example
 * ```tsx
 * import Badge from '@mezzanine-ui/react/Badge';
 *
 * // 數字計數徽章
 * <Badge variant="count-alert" count={5} />
 *
 * // 超出上限顯示 99+
 * <Badge variant="count-brand" count={120} overflowCount={99} />
 *
 * // 狀態圓點（附著於圖示右上角）
 * <Badge variant="dot-alert">
 *   <BellIcon />
 * </Badge>
 *
 * // 文字徽章
 * <Badge variant="text-brand" text="NEW" />
 * ```
 *
 * @see {@link BadgeContainer} 搭配容器元件使用絕對定位覆疊效果
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(props, ref) {
    const {
      children,
      count,
      className,
      overflowCount,
      size,
      text,
      variant,
      ...rest
    } = props;

    return (
      <div className={classes.container(!!children)}>
        {children}

        <span
          {...rest}
          ref={ref}
          className={cx(
            classes.host,
            classes.variant(variant),
            { [classes.hide]: isCountVariant(variant) && count === 0 },
            size && classes.size(size),
            className,
          )}
        >
          {isCountVariant(variant)
            ? overflowCount && count > overflowCount
              ? `${overflowCount}+`
              : count
            : text}
        </span>
      </div>
    );
  },
);

export default Badge;
