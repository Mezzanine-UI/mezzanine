import { TextareaSize } from './typings';
import { textareaPrefix } from './constants';

export const textareaClasses = {
  host: textareaPrefix,
  wrapper: `${textareaPrefix}--wrapper`,
  error: `${textareaPrefix}--error`,
  disabled: `${textareaPrefix}--disabled`,
  size: (size: TextareaSize) => `${textareaPrefix}--${size}`,
  counting: `${textareaPrefix}--counting`,
};
