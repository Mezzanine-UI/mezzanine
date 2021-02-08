import { TextFieldSize } from './typings';
import { textFieldPrefix } from './constants';

export const textFieldClasses = {
  host: textFieldPrefix,
  active: `${textFieldPrefix}--active`,
  clearable: `${textFieldPrefix}--clearable`,
  disabled: `${textFieldPrefix}--disabled`,
  error: `${textFieldPrefix}--error`,
  fullWidth: `${textFieldPrefix}--full-width`,
  size: (size: TextFieldSize) => `${textFieldPrefix}--${size}`,
  withPrefix: `${textFieldPrefix}--prefix`,
  withSuffix: `${textFieldPrefix}--suffix`,
  prefix: `${textFieldPrefix}__prefix`,
  suffix: `${textFieldPrefix}__suffix`,
  clearIcon: `${textFieldPrefix}__clear-icon`,
};
