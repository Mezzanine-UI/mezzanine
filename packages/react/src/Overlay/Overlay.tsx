import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  MouseEventHandler,
} from 'react';
import { overlayClasses as classes } from '@mezzanine-ui/core/overlay';
import { cx } from '../utils/cx';
import Portal, { PortalProps } from '../Portal';

export interface OverlayProps
  extends
  Pick<PortalProps, 'children' | 'container' | 'disablePortal'>,
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * Whether to hide backdrop.
   * @default false
   */
  hideBackdrop?: boolean;
  /**
   * Click handler for backdrop.
   */
  onBackdropClick?: MouseEventHandler;
}

/**
 * The react component for `mezzanine` overlay.
 *
 * Use for portal components that need a backdrop.
 */
const Overlay = forwardRef<HTMLDivElement, OverlayProps>(function Overlay(props, ref) {
  const {
    disablePortal,
    children,
    className,
    container,
    hideBackdrop = false,
    onBackdropClick,
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
          <div
            aria-hidden
            className={classes.backdrop}
            onClick={onBackdropClick}
          />
        )}
        {children}
      </div>
    </Portal>
  );
});

export default Overlay;

