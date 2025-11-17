import {
  ErrorFilledIcon,
  InfoFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';

export type AlertBannerSeverity = 'info' | 'warning' | 'error';

export const alertBannerPrefix = 'mzn-alert-banner';
export const alertBannerGroupPrefix = `${alertBannerPrefix}-group`;

export const alertBannerIcons = {
  info: InfoFilledIcon,
  warning: WarningFilledIcon,
  error: ErrorFilledIcon,
} as const;

export const alertBannerClasses = {
  host: alertBannerPrefix,
  root: `${alertBannerPrefix}__root`,
  icon: `${alertBannerPrefix}__icon`,
  body: `${alertBannerPrefix}__body`,
  message: `${alertBannerPrefix}__message`,
  controls: `${alertBannerPrefix}__controls`,
  actions: `${alertBannerPrefix}__actions`,
  close: `${alertBannerPrefix}__close`,
  severity: (severity: AlertBannerSeverity) =>
    `${alertBannerPrefix}--${severity}`,
} as const;

export const alertBannerGroupClasses = {
  host: alertBannerGroupPrefix,
} as const;
