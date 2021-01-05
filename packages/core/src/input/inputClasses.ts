import { InputTextColor, InputBoarderColor, InputSize } from './typings';
import { inputPrefix } from './constants';

export const inputClasses = {
  host: inputPrefix,
  label: `${inputPrefix}__label`,
  border: (color: InputBoarderColor) => `${inputPrefix}--${color}`,
  color: (color: InputTextColor) => `${inputPrefix}--${color}`,
  inputSize: (inputSize: InputSize) => `${inputPrefix}--${inputSize}`,
  icon: `${inputPrefix}--icon`,
  loading: `${inputPrefix}--loading`,
};
