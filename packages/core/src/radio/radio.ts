import {
  InputCheckGroupOrientation,
  InputCheckSize,
} from '../_internal/input-check';

export type RadioSize = InputCheckSize;

export interface RadioGroupOption {
  disabled?: boolean;
  error?: boolean;
  label: string | number;
  value: string;
}

export type RadioGroupOrientation = InputCheckGroupOrientation;

export const radioPrefix = 'mzn-radio';

export const radioClasses = {
  host: radioPrefix,
  checked: `${radioPrefix}--checked`,
  error: `${radioPrefix}--error`,
} as const;
