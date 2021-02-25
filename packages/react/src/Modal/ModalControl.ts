import { createContext } from 'react';

export interface ModalControl {
  danger: boolean;
  loading: boolean;
}

export const ModalControlContext = createContext<ModalControl>({
  danger: false,
  loading: false,
});
