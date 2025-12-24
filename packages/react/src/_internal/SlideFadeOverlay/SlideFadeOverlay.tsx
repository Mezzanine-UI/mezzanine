import { overlayWithSlideFadeClasses as classes } from '@mezzanine-ui/core/_internal/overlay-with-slide-fade';
import { forwardRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import Backdrop, { BackdropProps } from '../../Backdrop';
import {
  SlideFade,
  SlideFadeProps,
  SlideFadeDirection,
} from '../../Transition';
import { useDocumentEscapeKeyDown } from '../../hooks/useDocumentEscapeKeyDown';
import useTopStack from './useTopStack';

export interface SlideFadeOverlayProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'>,
    Pick<
      BackdropProps,
      | 'container'
      | 'disableCloseOnBackdropClick'
      | 'disablePortal'
      | 'onBackdropClick'
      | 'onClose'
      | 'open'
    >,
    Pick<SlideFadeProps, 'children'> {
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
 * @deprecated
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
    }, [disableCloseOnEscapeKeyDown, checkIsOnTheTop, open, onClose]);

    if (!open && exited) {
      return null;
    }

    return (
      <Backdrop
        className={cx(classes.host, className)}
        container={container}
        disableCloseOnBackdropClick={disableCloseOnBackdropClick}
        disablePortal={disablePortal}
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
      </Backdrop>
    );
  },
);

export default SlideFadeOverlay;
