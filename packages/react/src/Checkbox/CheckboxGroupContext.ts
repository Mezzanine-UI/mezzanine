'use client';

import { createContext } from 'react';
import { CheckboxGroupControlContextValue } from '../Form/useCheckboxControlValue';

export interface CheckboxGroupContextValue
  extends CheckboxGroupControlContextValue {
  disabled?: boolean;
  name?: string;
}

export const CheckboxGroupContext = createContext<
  CheckboxGroupContextValue | undefined
>(undefined);

