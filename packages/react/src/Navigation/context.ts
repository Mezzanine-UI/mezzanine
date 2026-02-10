import { createContext } from 'react';

export const navigationOptionLevelContextDefaultValues = { level: 0, path: [] };

export const NavigationOptionLevelContext = createContext<{
  level: number;
  path: string[];
}>(navigationOptionLevelContextDefaultValues);

export const NavigationActivatedContext = createContext<{
  activatedPath: string[];
  collapsed: boolean;
  currentPathname: string | null;
  filterText: string;
  handleCollapseChange: (newCollapsed: boolean) => void;
  setActivatedPath: (path: string[]) => void;
  optionsAnchorComponent?: React.ElementType;
}>(null as any);
