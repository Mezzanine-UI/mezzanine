import { ModalSeverity } from '@mezzanine-ui/core/modal';
import { createContext } from 'react';

export interface ModalControl {
  loading: boolean;
  severity: ModalSeverity;
}

export const ModalControlContext = createContext<ModalControl>({
  loading: false,
  severity: 'info',
});
