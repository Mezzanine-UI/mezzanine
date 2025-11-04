import {
  ErrorFilledIcon,
  InfoFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

export type MessageSeverity = SeverityWithInfo;

export enum MessageSeverityMap {
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
}

export const messagePrefix = 'mzn-message';

export const messageIcons = {
  warning: WarningFilledIcon,
  error: ErrorFilledIcon,
  info: InfoFilledIcon,
} as const;

export const messageClasses = {
  host: messagePrefix,
  root: `${messagePrefix}__root`,
  icon: `${messagePrefix}__icon`,
  contentContainer: `${messagePrefix}__content-container`,
  content: `${messagePrefix}__content`,
  close: `${messagePrefix}__close`,
  closeIcon: `${messagePrefix}__close-icon`,
  severity: (severity: MessageSeverity) => `${messagePrefix}--${severity}`,
} as const;
