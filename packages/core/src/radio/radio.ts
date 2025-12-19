import {
  InputCheckGroupOrientation,
  InputCheckSize,
} from '../_internal/input-check';

export type RadioSize = InputCheckSize;

export type RadioGroupOrientation = InputCheckGroupOrientation;

export const radioPrefix = 'mzn-radio';

export const radioClasses = {
  host: radioPrefix,
  checked: `${radioPrefix}--checked`,
  focused: `${radioPrefix}--focused`,
  error: `${radioPrefix}--error`,
  wrapper: `${radioPrefix}__wrapper`,
} as const;
