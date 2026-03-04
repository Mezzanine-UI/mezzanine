'use client';

import { createContext, RefObject } from 'react';

export interface LayoutContextValue {
  hostRef: RefObject<HTMLDivElement | null>;
  mainRef: RefObject<HTMLDivElement | null>;
  registerMain: (el: HTMLDivElement | null) => void;
}

export const LayoutContext = createContext<LayoutContextValue | null>(null);
