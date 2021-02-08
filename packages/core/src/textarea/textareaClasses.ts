import { TextareaSize } from './typings';
import { textareaPrefix } from './constants';

export const textareaClasses = {
  host: textareaPrefix,
  size: (size: TextareaSize) => `${textareaPrefix}--${size}`,
  upperLimit: `${textareaPrefix}--upper-limit`,
  count: `${textareaPrefix}__count`,
};
