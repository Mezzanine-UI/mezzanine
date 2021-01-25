import { InputSize } from './typings';
import { inputPrefix } from './constants';

export const inputClasses = {
  host: inputPrefix,
  error: `${inputPrefix}--error`,
  disabled: `${inputPrefix}--disabled`,
  size: (size: InputSize) => `${inputPrefix}--${size}`,
  counting: `${inputPrefix}--counting`,
  multiple: `${inputPrefix}--multiple`,
};
