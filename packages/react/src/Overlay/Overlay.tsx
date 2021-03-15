import { forwardRef, MouseEventHandler } from 'react';
import { overlayClasses as classes } from '@mezzanine-ui/core/overlay';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Portal, { PortalProps } from '../Portal';
import { Fade } from '../Transition';

export interface OverlayProps
  extends
  Pick<PortalProps, 'children' | 'container' | 'disablePortal'>,
  NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Controls whether to disable closing element while backdrop clicked.
   * @default false
   */
  disableCloseOnBackdropClick?: boolean;
  /**
   * Whether to hide backdrop.
   * @default false
   */
  hideBackdrop?: boolean;
  /**
   * Click handler for backdrop.
   */
  onBackdropClick?: MouseEventHandler;
  /**
   * Callback fired while the element will be closed.
   */
  onClose?: VoidFunction;
  /**
   * Controls whether to show the element.
   * @default false
   */
  open?: boolean;
}

/**
 * The react component for `mezzanine` overlay.
 */
const Overlay = forwardRef<HTMLDivElement, OverlayProps>(function Overlay(props, ref) {
  const {
    children,
    className,
    container,
    disableCloseOnBackdropClick = false,
    disablePortal,
    hideBackdrop = false,
    onBackdropClick,
    onClose,
    open = false,
    ...rest
  } = props;

  return (
    <Portal
      container={container}
      disablePortal={disablePortal}
    >
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          className,
        )}
      >
        {hideBackdrop ? null : (
          <Fade in={open}>
            <div
              aria-hidden
              className={classes.backdrop}
              onClick={(event) => {
                if (!disableCloseOnBackdropClick && onClose) {
                  onClose();
                }

                if (onBackdropClick) {
                  onBackdropClick(event);
                }
              }}
            />
          </Fade>
        )}
        {children}
      </div>
    </Portal>
  );
});

export default Overlay;

