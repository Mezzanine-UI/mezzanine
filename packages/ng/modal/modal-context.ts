import { InjectionToken, Signal } from '@angular/core';
import { ModalStatusType, ModalType } from '@mezzanine-ui/core/modal';

export interface ModalContextValue {
  readonly modalStatusType: Signal<ModalStatusType>;
  readonly loading: Signal<boolean>;
  readonly modalType: Signal<ModalType>;
}

export const MZN_MODAL_CONTEXT = new InjectionToken<ModalContextValue>(
  'MZN_MODAL_CONTEXT',
);
