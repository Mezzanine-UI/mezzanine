'use client';

import { ModalStatusType } from '@mezzanine-ui/core/modal';
import { createContext } from 'react';

export interface ModalControl {
  loading: boolean;
  modalStatusType: ModalStatusType;
  /**
   * Called by a titled `ModalHeader` on mount so the dialog can point
   * `aria-labelledby` at `titleId`. Returns the unregister callback.
   */
  registerTitle?: () => () => void;
  /**
   * Id assigned to the `ModalHeader` title, used as the dialog's accessible name.
   */
  titleId?: string;
}

export const ModalControlContext = createContext<ModalControl>({
  loading: false,
  modalStatusType: 'info',
});
