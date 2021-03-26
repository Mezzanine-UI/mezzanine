import { createContext } from 'react';

export interface SelectValue {
  id: string;
  name: string;
}

export interface SelectOnChange {
  onChange(v: SelectValue | null): SelectValue[];
}

export interface SelectControl extends SelectOnChange {
  value: SelectValue[];
}

export const SelectControlContext = createContext<SelectControl | undefined>(undefined);
