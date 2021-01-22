import { InputSize, InputDecoratorPosition } from './typings';
import { inputPrefix } from './constants';

export const inputClasses = {
  host: inputPrefix,
  error: `${inputPrefix}--error`,
  disabled: `${inputPrefix}--disabled`,
  size: (size: InputSize) => `${inputPrefix}--${size}`,
  decoratorHost: `${inputPrefix}-decorator`,
  icon: (iconPosition: InputDecoratorPosition) => `${inputPrefix}-icon--${iconPosition}`,
  clearButton: `${inputPrefix}--clearButton`,
  counting: `${inputPrefix}--counting`,
  multiple: `${inputPrefix}--multiple`,
};
