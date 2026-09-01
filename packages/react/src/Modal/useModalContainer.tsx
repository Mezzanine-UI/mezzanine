import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { forwardRef, ReactNode, useRef, useState } from 'react';
import { cx } from '../utils/cx';
import Backdrop, { BackdropProps } from '../Backdrop';
import { Scale } from '../Transition';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import useTopStack from '../hooks/useTopStack';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useFocusTrap } from '../hooks/useFocusTrap';
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
     * Dialog focus model: focus moves into the content on open, Tab cycles
     * inside it, and the previously focused element gets focus back on close.
     * Nested overlays share `useTopStack`, so only the top one traps Tab.
     */
    const contentRef = useRef<HTMLDivElement>(null);
    const composedContentRef = useComposeRefs([ref, contentRef]);

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

    const { focusFirst } = useFocusTrap({
      containerRef: contentRef,
      enabled: Boolean(open),
      isTopStack: checkIsOnTheTop,
    });

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
          onEntered={() => {
            setExited(false);
            // The content is portalled and animated in, so it can be moved
            // after mount — which drops focus back to <body>. Re-assert it
            // once the enter transition has finished.
            focusFirst();
          }}
          onExited={() => setExited(true)}
          /**
           * Scale clones its child to inject its own ref, so a ref placed on the
           * div below would be dropped. Scale composes whatever ref it is given
           * into that clone, which is how both the forwarded ref and the focus
           * trap's container ref reach the wrapper element.
           */
          ref={composedContentRef}
        >
          <div className={classes.contentWrapper} tabIndex={-1}>
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
