'use client';

import { RadioType } from '@mezzanine-ui/core/radio';
import { InputCheckSize } from '@mezzanine-ui/core/_internal/input-check';
import { createContext } from 'react';
import { RadioGroupControlContextValue } from '../Form/useRadioControlValue';

export interface RadioGroupContextValue extends RadioGroupControlContextValue {
  disabled?: boolean;
  name?: string;
  size?: InputCheckSize;
  type?: RadioType;
}

export const RadioGroupContext = createContext<
  RadioGroupContextValue | undefined
>(undefined);
