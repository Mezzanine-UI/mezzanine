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

export type ProgressType = 'progress' | 'percent' | 'icon';
