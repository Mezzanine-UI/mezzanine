import { TextareaSize, TextareaDecoratorPosition } from './typings';
import { inputPrefix } from '../input/constants';

export const textareaClasses = {
  host: `${inputPrefix} textarea`,
  tag: `${inputPrefix}--tag textarea`,
  error: `${inputPrefix}--error textarea`,
  disabled: `${inputPrefix}--disabled textarea`,
  size: (size: TextareaSize) => `${inputPrefix}--${size} textarea`,
  icon: (iconPosition: TextareaDecoratorPosition) => `${inputPrefix}-icon--${iconPosition} textarea`,
  counting: `${inputPrefix}--counting`,
  decoratorHost: `${inputPrefix}-decorator`,
  clearButton: `${inputPrefix}--clearButton`,
};
