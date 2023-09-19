import {
  CheckCircleFilledIcon,
  ExclamationCircleFilledIcon,
  TimesCircleFilledIcon,
  InfoCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

export type NotificationSeverity = SeverityWithInfo;

export const notificationPrefix = 'mzn-notif';
export const notificationRootPrefix = `${notificationPrefix}-root`;

export const notificationIcons = {
  success: CheckCircleFilledIcon,
  warning: ExclamationCircleFilledIcon,
  error: TimesCircleFilledIcon,
  info: InfoCircleFilledIcon,
} as const;

export const notificationClasses = {
  host: notificationPrefix,
  severity: (severity: NotificationSeverity) => `${notificationPrefix}--${severity}`,
  closeIcon: `${notificationPrefix}__close-icon`,

  /** Severity Icon classes */
  iconContainer: `${notificationPrefix}__icon-container`,
  severityIcon: `${notificationPrefix}__severity-icon`,

  /** Body classes */
  body: `${notificationPrefix}__body`,
  title: `${notificationPrefix}__title`,
  content: `${notificationPrefix}__content`,
  action: `${notificationPrefix}__action`,

  /** Root classes */
  root: notificationRootPrefix,
} as const;
