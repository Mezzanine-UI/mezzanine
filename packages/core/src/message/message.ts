import {
  CheckCircleFilledIcon,
  ExclamationCircleFilledIcon,
  InfoCircleFilledIcon,
  MinusCircleFilledIcon,
} from '@mezzanine-ui/icons';

export type MessageStatus = 'success' | 'warning' | 'error' | 'info';

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
  status: (status: MessageStatus) => `${messagePrefix}--${status}`,
} as const;
