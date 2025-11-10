import {
  ErrorFilledIcon,
  InfoFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';

export const inlineMessagePrefix = 'mzn-inline-message';

export const inlineMessageIcons = {
  info: InfoFilledIcon,
  warning: WarningFilledIcon,
  error: ErrorFilledIcon,
} as const;

export type InlineMessageSeverity = keyof typeof inlineMessageIcons;

export const inlineMessageClasses = {
  host: inlineMessagePrefix,
  root: `${inlineMessagePrefix}__root`,
  icon: `${inlineMessagePrefix}__icon`,
  contentContainer: `${inlineMessagePrefix}__content-container`,
  content: `${inlineMessagePrefix}__content`,
  close: `${inlineMessagePrefix}__close`,
  closeIcon: `${inlineMessagePrefix}__close-icon`,
  severity: (severity: InlineMessageSeverity) =>
    `${inlineMessagePrefix}--${severity}`,
} as const;
