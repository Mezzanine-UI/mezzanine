'use client';

import { createContext } from 'react';
import { DescriptionGroupProps } from '.';

export type DescriptionGroupContextValue = Pick<
  DescriptionGroupProps,
  'widthType'
>;

export const DescriptionGroupContext = createContext<
  DescriptionGroupContextValue | undefined
>(undefined);
