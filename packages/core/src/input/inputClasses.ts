import { InputSize, InputDecoratorPosition } from './typings';
import { inputPrefix } from './constants';

export const inputClasses = {
  host: inputPrefix,
  wrapper: `${inputPrefix}--wrapper`,
  error: `${inputPrefix}--error`,
  errorMessage: `${inputPrefix}--errorMessage`,
  disabled: `${inputPrefix}--disabled`,
  size: (size: InputSize) => `${inputPrefix}--${size}`,
  decoratorHost: `${inputPrefix}-decorator`,
  icon: (iconPosition: InputDecoratorPosition) => `${inputPrefix}-icon--${iconPosition}`,
  text: (textPosition: InputDecoratorPosition) => `${inputPrefix}-text--${textPosition}`,
};
