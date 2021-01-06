import { InputSize } from './typings';
import { inputPrefix } from './constants';

export const inputClasses = {
  host: inputPrefix,
  error: `${inputPrefix}--error`,
  inputSize: (inputSize: InputSize) => `${inputPrefix}--${inputSize}`,
  // icon: `${inputPrefix}--icon`,
};
