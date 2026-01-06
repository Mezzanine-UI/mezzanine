'use client';

import { createContext } from 'react';

export interface FormControl {
  disabled: boolean;
  fullWidth: boolean;
  required: boolean;
}

export const FormControlContext = createContext<FormControl | undefined>(
  undefined,
);
