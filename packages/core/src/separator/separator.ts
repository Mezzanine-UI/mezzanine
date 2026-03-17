export const separatorPrefix = 'mzn-separator';

/**
 * 分隔線的方向。
 * - `'horizontal'` — 水平方向
 * - `'vertical'` — 垂直方向
 */
export type SeparatorOrientation = 'horizontal' | 'vertical';

export const separatorClasses = {
  host: separatorPrefix,
  horizontal: `${separatorPrefix}--horizontal`,
  vertical: `${separatorPrefix}--vertical`,
} as const;
