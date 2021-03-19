import { InputCheckGroupOrientation, InputCheckSize } from '../_internal/input-check';

export type CheckboxSize = InputCheckSize;

export type CheckboxGroupOrientation = InputCheckGroupOrientation;

export interface CheckboxGroupOption {
  disabled?: boolean;
  label: string | number;
  value: string;
}

export const checkboxPrefix = 'mzn-checkbox';

export const checkboxClasses = {
  host: checkboxPrefix,
  checked: `${checkboxPrefix}--checked`,
  indeterminate: `${checkboxPrefix}--indeterminate`,
  all: `${checkboxPrefix}__all`,
} as const;
