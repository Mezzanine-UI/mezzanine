import { useContext } from 'react';
import { FormControlContext } from '../Form';

export type UseInputFormControlProps = InputFormControl;

export interface InputFormControl {
  disabled: boolean;
  error: boolean;
  fullWidth: boolean;
  required: boolean;
}

export function useInputFormControl(props: UseInputFormControlProps) {
  const formControl = useContext(FormControlContext);
  const {
    disabled = props.disabled,
    fullWidth = props.fullWidth,
    required = props.required,
  } = formControl || {};
  const error = formControl
    ? formControl.severity === 'error'
    : props.error;

  return {
    disabled,
    error,
    fullWidth,
    required,
  };
}
