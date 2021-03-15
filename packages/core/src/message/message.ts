import {
  CheckCircleFilledIcon,
  ExclamationCircleFilledIcon,
  InfoCircleFilledIcon,
  MinusCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

export type MessageSeverity = SeverityWithInfo;

export const messagePrefix = 'mzn-message';

export const messageIcons = {
  success: CheckCircleFilledIcon,
  warning: ExclamationCircleFilledIcon,
  error: MinusCircleFilledIcon,
  info: InfoCircleFilledIcon,
} as const;

export const messageClasses = {
  host: messagePrefix,
  root: `${messagePrefix}__root`,
  icon: `${messagePrefix}__icon`,
  content: `${messagePrefix}__content`,
  severity: (severity: MessageSeverity) => `${messagePrefix}--${severity}`,
} as const;
