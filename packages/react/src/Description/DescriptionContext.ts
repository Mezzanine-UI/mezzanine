'use client';

import { createContext, use } from 'react';
import { DescriptionSize } from '@mezzanine-ui/core/description';

export interface DescriptionContextValue {
  size: DescriptionSize;
}

export const DescriptionContext = createContext<DescriptionContextValue>({
  size: 'main',
});

export const useDescriptionContext = () => use(DescriptionContext);
