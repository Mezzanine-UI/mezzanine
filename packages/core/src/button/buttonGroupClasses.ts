import { ButtonGroupOrientation } from './typings';
import { buttonGroupPrefix } from './constants';

export const buttonGroupClasses = {
  host: buttonGroupPrefix,
  fullWidth: `${buttonGroupPrefix}--full-width`,
  orientation: (orientation: ButtonGroupOrientation) => `${buttonGroupPrefix}--${orientation}`,
  attached: `${buttonGroupPrefix}--attached`,
};
