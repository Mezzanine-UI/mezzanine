import { createContext } from 'react';
import { SelectControl } from './typings';

export const SelectControlContext = createContext<SelectControl | undefined>(undefined);
