import { GeneralSize } from '@mezzanine-ui/system/size';

/**
 * 按鈕的視覺樣式變體。
 * - `'base-primary'` — 實心主色，用於頁面最重要的操作
 * - `'base-secondary'` — 邊框按鈕，用於次要操作
 * - `'base-tertiary'` — 淺色邊框，強調程度較低
 * - `'base-ghost'` — 透明背景，適合工具列等緊湊 UI
 * - `'base-dashed'` — 虛線邊框，用於新增/建立的佔位操作
 * - `'base-text-link'` — 文字連結樣式
 * - `'destructive-primary'` — 實心危險色，用於不可逆操作（如刪除）
 * - `'destructive-secondary'` — 邊框危險色按鈕
 * - `'destructive-ghost'` — 透明危險按鈕
 * - `'destructive-text-link'` — 危險文字連結
 * - `'inverse'` — 用於深色背景上，白色實心按鈕
 * - `'inverse-ghost'` — 用於深色背景上，透明白字按鈕
 */
export type ButtonVariant =
  | 'base-primary'
  | 'base-secondary'
  | 'base-tertiary'
  | 'base-ghost'
  | 'base-dashed'
  | 'base-text-link'
  | 'destructive-primary'
  | 'destructive-secondary'
  | 'destructive-ghost'
  | 'destructive-text-link'
  | 'inverse'
  | 'inverse-ghost';

export type ButtonSize = GeneralSize;

/**
 * 按鈕圖示的排列方式。
 * - `'leading'` — 圖示位於文字左側
 * - `'trailing'` — 圖示位於文字右側
 * - `'icon-only'` — 僅顯示圖示，children 作為 tooltip 使用
 */
export type ButtonIconType = 'leading' | 'trailing' | 'icon-only';

export const buttonPrefix = 'mzn-button';

export const buttonClasses = {
  host: buttonPrefix,
  variant: (variant: ButtonVariant) => `${buttonPrefix}--${variant}`,
  size: (size: ButtonSize) => `${buttonPrefix}--${size}`,
  disabled: `${buttonPrefix}--disabled`,
  loading: `${buttonPrefix}--loading`,
  iconLeading: `${buttonPrefix}--icon-leading`,
  iconTrailing: `${buttonPrefix}--icon-trailing`,
  iconOnly: `${buttonPrefix}--icon-only`,
};
