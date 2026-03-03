'use client';

import { createContext, useContext } from 'react';
import { DescriptionSize } from '@mezzanine-ui/core/description';

export interface DescriptionContextValue {
  size: DescriptionSize;
}

export const DescriptionContext = createContext<DescriptionContextValue>({
  size: 'main',
});

export const useDescriptionContext = () => useContext(DescriptionContext);
