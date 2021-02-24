import { Severity } from '@mezzanine-ui/system/severity';
import { createContext } from 'react';

export interface FormControl {
  disabled: boolean;
  fullWidth: boolean;
  required: boolean;
  severity?: Severity;
}

export const FormControlContext = createContext<FormControl | undefined>(undefined);
