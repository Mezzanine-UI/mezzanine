import { Size } from '@mezzanine-ui/system/size';

export const progressPrefix = 'mzn-progress';

export const progressClasses = {
  host: progressPrefix,
  lineVariant: `${progressPrefix}--line`,
  lineBg: `${progressPrefix}__line-bg`,
  circleVariant: `${progressPrefix}--circle`,
  circleBg: `${progressPrefix}__circle-bg`,
  circleFiller: `${progressPrefix}__circle-filler`,
  info: `${progressPrefix}__info`,
  infoPercent: `${progressPrefix}__info-percent`,
  infoIcon: `${progressPrefix}__info-icon`,
  error: `${progressPrefix}--error`,
  success: `${progressPrefix}--success`,
  size: (size: Size) => `${progressPrefix}--${size}`,
} as const;

export type ProgressType = 'line' | 'circle';
export enum ProgressTypes {
  line = 'line',
  circle = 'circle',
}

export type ProgressStatus = 'normal' | 'success' | 'error';
export enum ProgressStatuses {
  normal = 'normal',
  success = 'success',
  error = 'error',
}
