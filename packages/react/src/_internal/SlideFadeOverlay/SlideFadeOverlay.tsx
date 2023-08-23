import { overlayWithSlideFadeClasses as classes } from '@mezzanine-ui/core/_internal/overlay-with-slide-fade';
import {
  forwardRef,
  useState,
  useEffect,
} from 'react';
import { cx } from '../../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import Overlay, { OverlayProps } from '../../Overlay';
import { SlideFade, SlideFadeProps, SlideFadeDirection } from '../../Transition';
import { useDocumentEscapeKeyDown } from '../../hooks/useDocumentEscapeKeyDown';
import { allowBodyScroll, lockBodyScroll } from '../../utils/scroll-lock';
import useTopStack from './useTopStack';

export interface SlideFadeOverlayProps
  extends
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'>,
  Pick<
  OverlayProps,
  | 'container'
  | 'disableCloseOnBackdropClick'
  | 'disablePortal'
  | 'invisibleBackdrop'
  | 'hideBackdrop'
  | 'onBackdropClick'
  | 'onClose'
  | 'open'
  >,
  Pick<
  SlideFadeProps,
  'children'
  > {
  /**
   * Control slide fade in direction
   * @default 'down'
   */
  direction?: SlideFadeDirection;
  /**
   * Controls whether to disable closing modal while escape key down.
   * @default false
   */
  disableCloseOnEscapeKeyDown?: boolean;
}

/**
 * The react component for slide fade + overlay compose
 */
const SlideFadeOverlay = forwardRef<HTMLDivElement, SlideFadeOverlayProps>(
  function SlideFadeOverlay(props, ref) {
    const {
      children,
      className,
      container,
      direction = 'down',
      disableCloseOnBackdropClick = false,
      disableCloseOnEscapeKeyDown = false,
      disablePortal = false,
      hideBackdrop = false,
      invisibleBackdrop = false,
      onBackdropClick,
      onClose,
      open,
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
    }, [
      disableCloseOnEscapeKeyDown,
      checkIsOnTheTop,
      open,
      onClose,
    ]);

    /** lock body scroll */
    useEffect(() => {
      if (open) {
        lockBodyScroll();
      }
    }, [open]);

    /** unlock body scroll */
    useEffect(() => {
      function checkAndAllowScroll() {
        // wait until dom element unmount, and check if other modal existed
        const allStacks = document.querySelectorAll('.mzn-overlay-with-slide-fade');

        if (!allStacks.length) {
          allowBodyScroll();
        }
      }

      if (!open && exited) {
        checkAndAllowScroll();
      }

      return (() => {
        requestAnimationFrame(checkAndAllowScroll);
      });
    }, [open, exited]);

    if (!open && exited) {
      return null;
    }

    return (
      <Overlay
        className={cx(classes.host, className)}
        container={container}
        disableCloseOnBackdropClick={disableCloseOnBackdropClick}
        disablePortal={disablePortal}
        hideBackdrop={hideBackdrop}
        invisibleBackdrop={invisibleBackdrop}
        onBackdropClick={onBackdropClick}
        onClose={onClose}
        open={open}
        role="presentation"
      >
        <SlideFade
          ref={ref}
          in={open}
          direction={direction}
          onEntered={() => setExited(false)}
          onExited={() => setExited(true)}
        >
          {children}
        </SlideFade>
      </Overlay>
    );
  },
);

export default SlideFadeOverlay;
