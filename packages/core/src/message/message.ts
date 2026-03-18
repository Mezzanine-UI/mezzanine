import {
  CheckedFilledIcon,
  ErrorFilledIcon,
  InfoFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

export type MessageSeverity = SeverityWithInfo | 'loading';

export const messagePrefix = 'mzn-message';

export const messageIcons = {
  success: CheckedFilledIcon,
  warning: WarningFilledIcon,
  error: ErrorFilledIcon,
  info: InfoFilledIcon,
} as const;

export const messageClasses = {
  host: messagePrefix,
  root: `${messagePrefix}__root`,
  icon: `${messagePrefix}__icon`,
  content: `${messagePrefix}__content`,
  severity: (severity: MessageSeverity) => `${messagePrefix}--${severity}`,
} as const;
