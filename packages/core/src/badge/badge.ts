export const badgePrefix = 'mzn-badge';

/**
 * Badge 的所有視覺變體，涵蓋文字、點狀與數字三種類型。
 */
export type BadgeVariant =
  | BadgeDotVariant
  | BadgeCountVariant
  | BadgeTextVariant;

/**
 * 文字型 Badge 的語意色彩變體。
 * - `'text-success'` — 成功／正常
 * - `'text-error'` — 錯誤／失敗
 * - `'text-warning'` — 警告
 * - `'text-info'` — 資訊
 * - `'text-inactive'` — 停用／非活躍
 */
export type BadgeTextVariant =
  | 'text-success'
  | 'text-error'
  | 'text-warning'
  | 'text-info'
  | 'text-inactive';

/**
 * 點狀 Badge 的語意色彩變體。
 * - `'dot-success'` — 成功／正常
 * - `'dot-error'` — 錯誤／失敗
 * - `'dot-warning'` — 警告
 * - `'dot-info'` — 資訊
 * - `'dot-inactive'` — 停用／非活躍
 */
export type BadgeDotVariant =
  | 'dot-success'
  | 'dot-error'
  | 'dot-warning'
  | 'dot-info'
  | 'dot-inactive';

/**
 * 數字型 Badge 的視覺色彩變體。
 * - `'count-alert'` — 警示紅色，用於通知計數
 * - `'count-inactive'` — 停用灰色
 * - `'count-inverse'` — 反色（白底深字）
 * - `'count-brand'` — 品牌主色
 * - `'count-info'` — 資訊藍色
 */
export type BadgeCountVariant =
  | 'count-alert'
  | 'count-inactive'
  | 'count-inverse'
  | 'count-brand'
  | 'count-info';

/**
 * 文字型 Badge 的字型尺寸。
 * - `'main'` — 主要尺寸
 * - `'sub'` — 較小的輔助尺寸
 */
export type BadgeTextSize = 'main' | 'sub';

export const badgeClasses = {
  host: badgePrefix,
  variant: (variant: BadgeDotVariant | BadgeCountVariant | BadgeTextVariant) =>
    `${badgePrefix}--${variant}`,
  size: (size: BadgeTextSize) => `${badgePrefix}--${size}`,
  container: (hasChildren: boolean) =>
    hasChildren
      ? `${badgePrefix}__container--has-children`
      : `${badgePrefix}__container`,
  hide: `${badgePrefix}--hide`,
} as const;
