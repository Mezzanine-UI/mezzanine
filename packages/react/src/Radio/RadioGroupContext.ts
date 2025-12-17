'use client';

import { RadioSize } from '@mezzanine-ui/core/radio';
import { createContext } from 'react';
import { RadioGroupControlContextValue } from '../Form/useRadioControlValue';

export interface RadioGroupContextValue extends RadioGroupControlContextValue {
  disabled?: boolean;
  name?: string;
  size?: RadioSize;
}

export const RadioGroupContext = createContext<
  RadioGroupContextValue | undefined
>(undefined);
