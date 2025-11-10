import { inlineMessagePrefix } from './inlineMessage';

export const inlineMessageGroupPrefix = `${inlineMessagePrefix}-group` as const;

export type InlineMessageGroupType = 'message' | 'form';

export const inlineMessageGroupClasses = {
  host: inlineMessageGroupPrefix,
  type: (type: InlineMessageGroupType) =>
    `${inlineMessageGroupPrefix}--${type}`,
} as const;
