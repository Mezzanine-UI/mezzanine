'use client';

import { createContext } from 'react';

export interface LayoutPanelContextValue {
  onPanelStateChange: (state: { isOpen: boolean; width: number }) => void;
}

export const LayoutPanelContext = createContext<
  LayoutPanelContextValue | undefined
>(undefined);
