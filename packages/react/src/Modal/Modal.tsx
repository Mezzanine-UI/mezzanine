
import { modalClasses as classes, ModalSeverity, ModalSize } from '@mezzanine-ui/core/modal';
import { TimesIcon } from '@mezzanine-ui/icons';
import { forwardRef, useState } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import Overlay, { OverlayProps } from '../Overlay';
import Icon from '../Icon';
import { SlideFade } from '../Transition';
import { useIsTopModal } from './useIsTopModal';
import { ModalControl, ModalControlContext } from './ModalControl';

export interface ModalProps
  extends
  NativeElementPropsWithoutKeyAndRef<'div'>,
  Pick<
  OverlayProps,
  | 'container'
  | 'disableCloseOnBackdropClick'
  | 'disablePortal'
  | 'hideBackdrop'
  | 'onBackdropClick'
  | 'onClose'
  | 'open'
  > {
  /**
   * Controls whether to disable closing modal while escape key down.
   * @default false
   */
  disableCloseOnEscapeKeyDown?: boolean;
  /**
   * Whether to force full screen on any breakpoint.
   * @default false
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
   * Controlls whether or not to display status icon before title. <br />
   * Notice that giving a status will only display the regular title.
   * @default 'info'
   */
  severity?: ModalSeverity;
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
    severity = 'info',
    size = 'medium',
    ...rest
  } = props;
  const modalControl: ModalControl = {
    loading,
    severity,
  };
  const [exited, setExited] = useState(true);
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

  if (!open && exited) {
    return null;
  }

  return (
    <Overlay
      className={classes.overlay}
      container={container}
      disableCloseOnBackdropClick={disableCloseOnBackdropClick}
      disablePortal={disablePortal}
      hideBackdrop={hideBackdrop}
      onBackdropClick={onBackdropClick}
      onClose={onClose}
      open={open}
    >
      <ModalControlContext.Provider value={modalControl}>
        <SlideFade
          ref={ref}
          in={open}
          direction="down"
          onEntered={() => setExited(false)}
          onExited={() => setExited(true)}
        >
          <div
            {...rest}
            className={cx(
              classes.host,
              classes.severity(severity),
              classes.size(size),
              {
                [classes.fullScreen]: fullScreen,
                [classes.withCloseIcon]: !hideCloseIcon,
              },
              className,
            )}
          >
            {children}
            {!hideCloseIcon && (
              <Icon
                className={classes.closeIcon}
                icon={TimesIcon}
                onClick={onClose}
              />
            )}
          </div>
        </SlideFade>
      </ModalControlContext.Provider>
    </Overlay>
  );
});

export default Modal;
