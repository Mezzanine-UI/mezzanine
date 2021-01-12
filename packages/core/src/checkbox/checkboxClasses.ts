import { checkboxPrefix } from './constants';
import {
  CheckboxSize,
} from './typings';

export const checkboxClasses = {
  host: checkboxPrefix,
  checkbox: (size: CheckboxSize) => `${checkboxPrefix}--${size}`,
  icon: (size: CheckboxSize) => `${checkboxPrefix}--${size}--icon`,
  selected: `${checkboxPrefix}--selected`,
  color: `${checkboxPrefix}--color`,
  disabled: `${checkboxPrefix}--disabled`,
  disabledBg: `${checkboxPrefix}--selected--disabled`,
  error: `${checkboxPrefix}--error`,
};
