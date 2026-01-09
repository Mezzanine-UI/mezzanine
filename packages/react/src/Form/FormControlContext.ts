'use client';

import { createContext } from 'react';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

export interface FormControl {
  disabled: boolean;
  fullWidth: boolean;
  required: boolean;
  severity?: SeverityWithInfo;
}

export const FormControlContext = createContext<FormControl | undefined>(
  undefined,
);
