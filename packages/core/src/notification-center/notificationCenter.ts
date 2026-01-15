import {
  CheckedFilledIcon,
  ErrorFilledIcon,
  InfoFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

export type NotificationSeverity = SeverityWithInfo;

export type NotificationType = 'notification' | 'drawer';

export const notificationPrefix = 'mzn-notification-center';
export const notificationRootPrefix = `${notificationPrefix}-root`;

export const notificationIcons = {
  success: CheckedFilledIcon,
  warning: WarningFilledIcon,
  error: ErrorFilledIcon,
  info: InfoFilledIcon,
};

export const notificationClasses = {
  host: notificationPrefix,
  severity: (severity: NotificationSeverity) =>
    `${notificationPrefix}--${severity}`,
  closeIcon: `${notificationPrefix}__close-icon`,
  type: (type: NotificationType) => `${notificationPrefix}--${type}`,
  prependTips: `${notificationPrefix}__prepend-tips`,
  appendTips: `${notificationPrefix}__append-tips`,

  /** View all button classes */
  viewAllButton: `${notificationPrefix}__view-all-button`,
  viewAllButtonText: `${notificationPrefix}__view-all-button-text`,

  /** Drawer classes */
  drawer: `${notificationPrefix}__drawer`,

  /** Empty notifications classes */
  emptyNotifications: `${notificationPrefix}__empty-notifications`,

  /** Toolbar classes for drawer */
  toolbar: `${notificationPrefix}__toolbar`,

  /** Severity Icon classes */
  iconContainer: `${notificationPrefix}__icon-container`,
  severityIcon: `${notificationPrefix}__severity-icon`,

  /** Body classes */
  body: `${notificationPrefix}__body`,
  bodyContent: `${notificationPrefix}__body-content`,
  title: `${notificationPrefix}__title`,
  content: `${notificationPrefix}__content`,
  action: `${notificationPrefix}__action`,

  /** Root classes */
  root: notificationRootPrefix,

  /** Time stamp popper classes */
  timeStampPopper: `${notificationPrefix}__time-stamp-popper`,
  timeStampPopperArrow: `${notificationPrefix}__time-stamp-popper-arrow`,
  timeStamp: `${notificationPrefix}__time-stamp`,
  timeStampText: `${notificationPrefix}__time-stamp-text`,
} as const;
