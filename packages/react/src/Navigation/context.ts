import { createContext } from 'react';

export const navigationOptionLevelContextDefaultValues = { level: 0, path: [] };

export const NavigationOptionLevelContext = createContext<{
  level: number;
  path: string[];
}>(navigationOptionLevelContextDefaultValues);

export const NavigationActivatedContext = createContext<{
  activatedPath: string[];
  setActivatedPath: (path: string[]) => void;
  currentPathname: string | null;
  collapsed: boolean;
  handleCollapseChange: (newCollapsed: boolean) => void;
}>(null as any);
