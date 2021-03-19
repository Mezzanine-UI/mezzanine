import { CheckboxSize } from '@mezzanine-ui/core/checkbox';
import { createContext } from 'react';
import { CheckboxGroupControlContextValue } from '../Form/useCheckboxControlValue';

export interface CheckboxGroupContextValue extends CheckboxGroupControlContextValue {
  disabled?: boolean;
  name?: string;
  size?: CheckboxSize;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | undefined>(undefined);
