import { inlineMessagePrefix } from './inlineMessage';

export const inlineMessageGroupPrefix = `${inlineMessagePrefix}-group` as const;

export const inlineMessageGroupClasses = {
  host: inlineMessageGroupPrefix,
} as const;
