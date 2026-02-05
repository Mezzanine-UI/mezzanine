'use client';

import { createContext } from 'react';

export interface AccordionControlContextValue {
  contentId?: string;
  disabled: boolean;
  expanded: boolean;
  titleId?: string;
  toggleExpanded(e: boolean): void;
}

export const AccordionControlContext = createContext<
  AccordionControlContextValue | undefined
>(undefined);
