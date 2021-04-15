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
   * Whether to set backdrop invisible
   * @default false
   */
  invisibleBackdrop?: boolean;
  /**
   * Click handler for backdrop.
   */
  onBackdropClick?: MouseEventHandler;
  /**
   * Callback fired while the element will be closed.
   */
  onClose?: VoidFunction;
  /**
   * Overlay is use on top of a component(surface)
   * @default false
   */
  onSurface?: boolean;
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
    invisibleBackdrop = false,
    onBackdropClick,
    onClose,
    onSurface,
    open = false,
    ...rest
  } = props;

  const fixedAtBody = Boolean(!container);

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
          {
            [classes.hostFixed]: fixedAtBody,
          },
          className,
        )}
      >
        {hideBackdrop ? null : (
          <Fade in={open}>
            <div
              aria-hidden
              className={cx(
                classes.backdrop,
                {
                  [classes.backdropFixed]: fixedAtBody,
                  [classes.invisible]: invisibleBackdrop,
                  [classes.backdropOnSurface]: onSurface,
                },
              )}
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

