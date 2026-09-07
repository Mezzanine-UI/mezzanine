import type { BackdropProps } from '../backdrop/backdrop.types';

export interface ModalContainerProps
  extends Pick<
    BackdropProps,
    'container' | 'disableCloseOnBackdropClick' | 'disablePortal' | 'open'
  > {
  /**
   * Controls whether to disable closing modal while escape key down.
   * @default false
   */
  disableCloseOnEscapeKeyDown?: boolean;
}

/**
 * The defaults the container applies, exposed by `useModalContainer` so a
 * consumer building its own overlay can start from the same ones.
 */
export const modalContainerDefaultOptions: Required<
  Pick<
    ModalContainerProps,
    | 'disableCloseOnBackdropClick'
    | 'disableCloseOnEscapeKeyDown'
    | 'disablePortal'
    | 'open'
  >
> = {
  disableCloseOnBackdropClick: false,
  disableCloseOnEscapeKeyDown: false,
  disablePortal: false,
  open: false,
};
