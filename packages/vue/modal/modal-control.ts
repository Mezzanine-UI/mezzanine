import { computed, inject, provide } from 'vue';
import type { ComputedRef, InjectionKey } from 'vue';
import type { ModalStatusType } from '@mezzanine-ui/core/modal';

export interface ModalControl {
  /** Whether the modal is loading. The confirm button reads it. */
  loading: boolean;
  /** The status the header draws its icon and colour from. */
  modalStatusType: ModalStatusType;
}

/**
 * What a header or footer rendered outside a modal sees, matching the value
 * React gives `createContext`.
 */
const DEFAULT_MODAL_CONTROL: ModalControl = {
  loading: false,
  modalStatusType: 'info',
};

/**
 * Provided by `MznModal`, injected by the header and the footer.
 *
 * Carries a `ComputedRef` rather than a plain object so those re-render when
 * the modal's status or loading state moves; React gets that from re-rendering
 * the provider.
 */
export const modalControlKey: InjectionKey<ComputedRef<ModalControl>> =
  Symbol('MznModalControl');

export function provideModalControl(value: () => ModalControl): void {
  provide(modalControlKey, computed(value));
}

export function useModalControl(): ComputedRef<ModalControl> {
  return inject(
    modalControlKey,
    computed(() => DEFAULT_MODAL_CONTROL),
  );
}
