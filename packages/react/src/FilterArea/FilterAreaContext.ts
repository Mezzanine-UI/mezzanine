'use client';

import { createContext } from 'react';
import type { FilterAreaSize } from '@mezzanine-ui/core/filter-area';

export interface FilterAreaContextValue {
  size?: FilterAreaSize;
}

const FilterAreaContext = createContext<FilterAreaContextValue | undefined>(undefined);

export default FilterAreaContext;
