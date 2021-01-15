import { TextareaSize } from './typings';
// import { textareaPrefix } from './constants';
import { inputPrefix } from '../input/constants';

export const textareaClasses = {
  host: `${inputPrefix} textarea`,
  tag: `${inputPrefix}--tag textarea`,
  error: `${inputPrefix}--error textarea`,
  disabled: `${inputPrefix}--disabled textarea`,
  size: (size: TextareaSize) => `${inputPrefix}--${size} textarea`,
  counting: `${inputPrefix}--counting`,
};
