import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { forwardRef, ReactNode, useState } from 'react';
import { cx } from '../utils/cx';
import Backdrop, { BackdropProps } from '../Backdrop';
import { Scale } from '../Transition';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import useTopStack from '../hooks/useTopStack';
import { MOTION_EASING } from '@mezzanine-ui/system/motion';

export interface ModalContainerProps
  extends Pick<
    BackdropProps,
    | 'className'
    | 'container'
    | 'disableCloseOnBackdropClick'
    | 'disablePortal'
    | 'onBackdropClick'
    | 'onClose'
    | 'open'
  > {
  children?: ReactNode;
  /**
   * Controls whether to disable closing modal while escape key down.
   * @default false
   */
  disableCloseOnEscapeKeyDown?: boolean;
}

const defaultOptions: Pick<
  ModalContainerProps,
  | 'className'
  | 'disableCloseOnBackdropClick'
  | 'disableCloseOnEscapeKeyDown'
  | 'disablePortal'
  | 'open'
> = {
  className: classes.overlay,
  disableCloseOnBackdropClick: false,
  disableCloseOnEscapeKeyDown: false,
  disablePortal: false,
  open: false,
};

const ModalContainer = forwardRef<HTMLDivElement, ModalContainerProps>(
  function ModalContainer(props, ref) {
    const {
      children,
      className = defaultOptions.className,
      container,
      disableCloseOnBackdropClick = defaultOptions.disableCloseOnBackdropClick,
      disableCloseOnEscapeKeyDown = defaultOptions.disableCloseOnEscapeKeyDown,
      disablePortal = defaultOptions.disablePortal,
      onBackdropClick,
      onClose,
      open = defaultOptions.open,
    } = props;

    const [exited, setExited] = useState(true);

    /**
     * Escape keydown close: escape will only close the top modal
     */
    const checkIsOnTheTop = useTopStack(open);

    useDocumentEscapeKeyDown(() => {
      if (!open || disableCloseOnEscapeKeyDown || !onClose) {
        return;
      }

      return (event) => {
        if (checkIsOnTheTop()) {
          event.stopPropagation();

          onClose();
        }
      };
    }, [disableCloseOnEscapeKeyDown, checkIsOnTheTop, open, onClose]);

    if (!open && exited) {
      return null;
    }

    return (
      <Backdrop
        className={cx(className)}
        container={container}
        disableCloseOnBackdropClick={disableCloseOnBackdropClick}
        disablePortal={disablePortal}
        onBackdropClick={onBackdropClick}
        onClose={onClose}
        open={open}
        role="presentation"
      >
        <Scale
          easing={{
            enter: MOTION_EASING.entrance,
            exit: MOTION_EASING.exit,
          }}
          in={open}
          onEntered={() => setExited(false)}
          onExited={() => setExited(true)}
        >
          <div className={classes.contentWrapper} ref={ref}>
            {children}
          </div>
        </Scale>
      </Backdrop>
    );
  },
);

export default function useModalContainer() {
  return {
    Container: ModalContainer,
    defaultOptions,
  };
}
