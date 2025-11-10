import { inlineMessagePrefix } from './inlineMessage';

export const inlineMessageGroupPrefix = `${inlineMessagePrefix}-group` as const;

export type InlineMessageGroupPlacement = 'top' | 'center' | 'bottom';
export type InlineMessageGroupType = 'message' | 'form';

export const inlineMessageGroupClasses = {
  host: inlineMessageGroupPrefix,
  placement: (placement: InlineMessageGroupPlacement) =>
    `${inlineMessageGroupPrefix}--${placement}`,
  type: (type: InlineMessageGroupType) =>
    `${inlineMessageGroupPrefix}--${type}`,
} as const;
