'use client';

import { forwardRef, MouseEventHandler } from 'react';
import {
  backdropClasses as classes,
  BackdropVariant,
} from '@mezzanine-ui/core/backdrop';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Portal, { PortalProps } from '../Portal';
import { Fade } from '../Transition';

export interface BackdropProps
  extends Pick<PortalProps, 'children' | 'container' | 'disablePortal'>,
    NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Controls whether to disable closing element while backdrop clicked.
   * @default false
   */
  disableCloseOnBackdropClick?: boolean;
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
  /**
   * The variant of backdrop.
   * @default 'dark'
   */
  variant?: BackdropVariant;
}

/**
 * The react component for `mezzanine` backdrop.
 */
const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  function Backdrop(props, ref) {
    const {
      children,
      className,
      container,
      disableCloseOnBackdropClick = false,
      disablePortal,
      onBackdropClick,
      onClose,
      open = false,
      variant = 'dark',
      ...rest
    } = props;

    // When using custom container or disablePortal, overlay should be absolutely positioned
    // When using default Portal (to #mzn-portal-container), overlay uses relative positioning
    const applyAbsolutePosition = Boolean(disablePortal || container);

    return (
      <Portal
        container={container}
        disablePortal={disablePortal}
        layer="default"
      >
        <div
          {...rest}
          ref={ref}
          aria-hidden={!open}
          className={cx(
            classes.host,
            {
              [classes.hostAbsolute]: applyAbsolutePosition,
              [classes.hostOpen]: open,
            },
            className,
          )}
          role="presentation"
        >
          <Fade in={open}>
            <div
              aria-hidden="true"
              className={cx(classes.backdrop, classes.backdropVariant(variant))}
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
          <div className={classes.content}>{children}</div>
        </div>
      </Portal>
    );
  },
);

export default Backdrop;
