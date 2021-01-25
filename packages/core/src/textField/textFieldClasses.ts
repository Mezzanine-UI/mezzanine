import { TextFieldSize } from './typings';
import { textFieldPrefix } from './constants';

export const textFieldClasses = {
  host: textFieldPrefix,
  error: `${textFieldPrefix}--error`,
  disabled: `${textFieldPrefix}--disabled`,
  size: (size: TextFieldSize) => `${textFieldPrefix}--${size}`,
  prefix: `${textFieldPrefix}--prefix`,
  suffix: `${textFieldPrefix}--suffix`,
  clearButton: `${textFieldPrefix}--clearButton`,
  multiple: `${textFieldPrefix}--multiple`,
};
