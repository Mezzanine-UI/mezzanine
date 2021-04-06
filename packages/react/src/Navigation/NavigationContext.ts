import {
  createContext,
} from 'react';
import {
  NavigationOrientation,
} from '@mezzanine-ui/core/navigation';

export interface NavigationContextValue {
  orientation: NavigationOrientation;
}

export const NavigationContext = createContext<NavigationContextValue>({
  orientation: 'horizontal',
});
