'use client';

import { createContext } from 'react';
import { DescriptionProps } from '.';

export type DescriptionContextValue = Pick<DescriptionProps, 'widthType'>;

export const DescriptionContext = createContext<
  DescriptionContextValue | undefined
>(undefined);
