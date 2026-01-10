'use client';

import { ModalStatusType } from '@mezzanine-ui/core/modal';
import { createContext } from 'react';

export interface ModalControl {
  loading: boolean;
  modalStatusType: ModalStatusType;
}

export const ModalControlContext = createContext<ModalControl>({
  loading: false,
  modalStatusType: 'info',
});
