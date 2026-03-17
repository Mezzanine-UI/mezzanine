export const progressPrefix = 'mzn-progress';

export const progressClasses = {
  host: progressPrefix,
  lineVariant: `${progressPrefix}--line`,
  lineBg: `${progressPrefix}__line-bg`,
  info: `${progressPrefix}__info`,
  infoPercent: `${progressPrefix}__info-percent`,
  infoIcon: `${progressPrefix}__info-icon`,
  error: `${progressPrefix}--error`,
  success: `${progressPrefix}--success`,
  tick: `${progressPrefix}__tick`,
  type: (type: ProgressType) => `${progressPrefix}--${type}`,
} as const;

/**
 * 進度條的狀態。
 * - `'enabled'` — 進行中狀態
 * - `'success'` — 成功狀態
 * - `'error'` — 錯誤狀態
 */
export type ProgressStatus = 'enabled' | 'success' | 'error';

export enum ProgressStatuses {
  enabled = 'enabled',
  success = 'success',
  error = 'error',
}

export enum ProgressTypes {
  progress = 'progress',
  percent = 'percent',
  icon = 'icon',
}

/**
 * 進度條的顯示類型。
 * - `'progress'` — 長條進度列樣式
 * - `'percent'` — 顯示百分比數值
 * - `'icon'` — 以圖示顯示完成狀態
 */
export type ProgressType = 'progress' | 'percent' | 'icon';
