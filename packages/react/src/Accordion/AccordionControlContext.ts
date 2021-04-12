import { createContext } from 'react';

export interface AccordionControlContextValue {
  detailsId?: string;
  disabled: boolean;
  expanded: boolean;
  summaryId?: string;
  toggleExpanded(e: boolean): void;
}

export const AccordionControlContext = createContext<AccordionControlContextValue | undefined>(undefined);
