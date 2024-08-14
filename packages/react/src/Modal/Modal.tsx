import {
  modalClasses as classes,
  ModalSeverity,
  ModalSize,
} from '@mezzanine-ui/core/modal';
import { TimesIcon } from '@mezzanine-ui/icons';
import { forwardRef, useMemo } from 'react';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import { ModalControl, ModalControlContext } from './ModalControl';
import { SlideFadeOverlayProps } from '../_internal/SlideFadeOverlay';
import useModalContainer from './useModalContainer';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface ModalProps
  extends Omit<SlideFadeOverlayProps, 'children'>,
    Pick<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
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
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  function Modal(props, ref) {
    const {
      children,
      className,
      container,
      direction = 'down',
      disableCloseOnBackdropClick = false,
      disableCloseOnEscapeKeyDown = false,
      disablePortal = false,
      fullScreen = false,
      hideBackdrop = false,
      hideCloseIcon = false,
      invisibleBackdrop = false,
      loading = false,
      onBackdropClick,
      onClose,
      open,
      severity = 'info',
      size = 'medium',
      ...rest
    } = props;
    const modalControl: ModalControl = useMemo(
      () => ({
        loading,
        severity,
      }),
      [loading, severity],
    );

    const { Container: ModalContainer } = useModalContainer();

    return (
      <ModalControlContext.Provider value={modalControl}>
        <ModalContainer
          className={classes.overlay}
          container={container}
          direction={direction}
          disableCloseOnBackdropClick={disableCloseOnBackdropClick}
          disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
          disablePortal={disablePortal}
          hideBackdrop={hideBackdrop}
          invisibleBackdrop={invisibleBackdrop}
          onBackdropClick={onBackdropClick}
          onClose={onClose}
          open={open}
          ref={ref}
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
            role="dialog"
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
        </ModalContainer>
      </ModalControlContext.Provider>
    );
  },
);

export default Modal;
