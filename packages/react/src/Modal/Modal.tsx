
import { modalClasses as classes, ModalSize } from '@mezzanine-ui/core/modal';
import { TimesIcon } from '@mezzanine-ui/icons';
import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import Overlay, { OverlayProps } from '../Overlay';
import Icon from '../Icon';
import { useIsTopModal } from './useIsTopModal';
import { ModalControl, ModalControlContext } from './ModalControl';

export interface ModalProps
  extends NativeElementPropsWithoutKeyAndRef<'div'>,
  Pick<OverlayProps, 'container' | 'disablePortal' | 'hideBackdrop' | 'onBackdropClick'> {
  /**
   * Controlls whether or not to display status icon before title. <br />
   * Notice that giving a status will only display the regular title.
   */
  danger?: boolean;
  /**
   * Controls whether to disable closing modal while backdrop clicked.
   * @default false
   */
  disableCloseOnBackdropClick?: boolean;
  /**
   * Controls whether to disable closing modal while escape key down.
   * @default false
   */
  disableCloseOnEscapeKeyDown?: boolean;
  /**
   *
   */
  fullScreen?: boolean;
  /**
   * Controls whether or not to hide close button at top-end.
   * @default false
   */
  hideCloseIcon?: boolean;
  /**
   * Whether the modal is loading.
   * Controls the loading prop of confirm button in modal actions.
   */
  loading?: boolean;
  /**
   * Close handler.
   */
  onClose?: VoidFunction;
  /**
   * Controls whether or not to show the modal.
   */
  open?: boolean;
  /**
   * Controls the size of the modal.
   * @default "medium"
   */
  size?: ModalSize;
}

/**
 * The react component for `mezzanine` modal.
 */
const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(props, ref) {
  const {
    children,
    className,
    container,
    danger = false,
    disableCloseOnBackdropClick = false,
    disableCloseOnEscapeKeyDown = false,
    disablePortal,
    fullScreen = false,
    hideBackdrop,
    hideCloseIcon = false,
    loading = false,
    onBackdropClick,
    onClose,
    open,
    size = 'medium',
    ...rest
  } = props;
  const modalControl: ModalControl = {
    danger,
    loading,
  };

  /**
   * Escape keydown close: escape will only close the top modal
   */
  const isTopModal = useIsTopModal(open);

  useDocumentEscapeKeyDown(() => {
    if (!open || disableCloseOnEscapeKeyDown || !onClose) {
      return;
    }

    return () => {
      if (isTopModal()) {
        onClose();
      }
    };
  }, [
    disableCloseOnEscapeKeyDown,
    isTopModal,
    open,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  return (
    <Overlay
      className={classes.overlay}
      container={container}
      disablePortal={disablePortal}
      hideBackdrop={hideBackdrop}
      onBackdropClick={(event) => {
        if (!disableCloseOnBackdropClick && onClose) {
          onClose();
        }

        if (onBackdropClick) {
          onBackdropClick(event);
        }
      }}
    >
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.size(size),
          {
            [classes.danger]: danger,
            [classes.fullScreen]: fullScreen,
            [classes.withCloseIcon]: !hideCloseIcon,
          },
          className,
        )}
      >
        <ModalControlContext.Provider value={modalControl}>
          {children}
        </ModalControlContext.Provider>
        {!hideCloseIcon && (
          <Icon
            className={classes.closeIcon}
            icon={TimesIcon}
            onClick={onClose}
          />
        )}
      </div>
    </Overlay>
  );
});

export default Modal;
