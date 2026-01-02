'use client';

import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { createContext } from 'react';

export interface FormControl {
  disabled: boolean;
  fullWidth: boolean;
  required: boolean;
  severity?: SeverityWithInfo;
}

export const FormControlContext = createContext<FormControl | undefined>(
  undefined,
);
