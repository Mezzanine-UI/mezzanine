import { InjectionToken, Signal } from '@angular/core';
import { ModalStatusType, ModalType } from '@mezzanine-ui/core/modal';

export interface ModalContextValue {
  readonly modalStatusType: Signal<ModalStatusType>;
  readonly loading: Signal<boolean>;
  readonly modalType: Signal<ModalType>;
  /** Id assigned to the `mznModalHeader` title; names the dialog. */
  readonly titleId: string;
  /** Number of titled headers currently rendered inside the modal. */
  readonly titleCount: Signal<number>;
  /**
   * Called by a titled `mznModalHeader` so the dialog can point
   * `aria-labelledby` at `titleId`. Returns the unregister callback.
   */
  readonly registerTitle: () => () => void;
}

export const MZN_MODAL_CONTEXT = new InjectionToken<ModalContextValue>(
  'MZN_MODAL_CONTEXT',
);
