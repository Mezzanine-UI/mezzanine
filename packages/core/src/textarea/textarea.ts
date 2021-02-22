import { Size } from '@mezzanine-ui/system/size';

export type TextareaSize = Size;

export const textareaPrefix = 'mzn-textarea';

export const textareaClasses = {
  host: textareaPrefix,
  size: (size: TextareaSize) => `${textareaPrefix}--${size}`,
  upperLimit: `${textareaPrefix}--upper-limit`,
  count: `${textareaPrefix}__count`,
} as const;
