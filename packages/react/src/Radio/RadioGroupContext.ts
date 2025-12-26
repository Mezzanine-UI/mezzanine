'use client';

import { RadioSize, RadioType } from '@mezzanine-ui/core/radio';
import { createContext } from 'react';
import { RadioGroupControlContextValue } from '../Form/useRadioControlValue';

export interface RadioGroupContextValue extends RadioGroupControlContextValue {
  disabled?: boolean;
  name?: string;
  size?: RadioSize;
  type?: RadioType;
}

export const RadioGroupContext = createContext<
  RadioGroupContextValue | undefined
>(undefined);
