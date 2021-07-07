
import { forwardRef, useState } from 'react';
import { drawerClasses as classes, DrawerPlacement } from '@mezzanine-ui/core/drawer';
import { SlideFade, SlideFadeDirection } from '../Transition';
import Overlay, { OverlayProps } from '../Overlay';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';

export interface DrawerProps
  extends
  NativeElementPropsWithoutKeyAndRef<'div'>,
  Pick<
  OverlayProps,
  | 'container'
  | 'disableCloseOnBackdropClick'
  | 'disablePortal'
  | 'hideBackdrop'
  | 'invisibleBackdrop'
  | 'onBackdropClick'
  | 'onClose'
  | 'open'
  > {
  /**
   * Controls whether to disable closing drawer while escape key down.
   * @default false
   */
  disableCloseOnEscapeKeyDown?: boolean;
  /**
   * Whether the drawer placement.
   * @default 'left'
   */
  placement?: DrawerPlacement;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>((props, ref) => {
  const {
    className,
    children,
    container,
    disableCloseOnBackdropClick = false,
    disableCloseOnEscapeKeyDown = false,
    disablePortal,
    hideBackdrop,
    invisibleBackdrop,
    onBackdropClick,
    onClose,
    open,
    placement = 'left',
    ...rest
  } = props;

  const [exited, setExited] = useState(true);

  useDocumentEscapeKeyDown(() => {
    if (!open || disableCloseOnEscapeKeyDown || !onClose) {
      return;
    }

    return onClose;
  }, [
    disableCloseOnEscapeKeyDown,
    open,
    onClose,
  ]);

  if (!open && exited) {
    return null;
  }

  const slideFadeDirection: { [index: string]: SlideFadeDirection } = {
    top: 'down',
    left: 'right',
    right: 'left',
    bottom: 'up',
  };

  return (
    <Overlay
      className={classes.overlay}
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
        direction={slideFadeDirection[placement]}
        in={open}
        onEntered={() => setExited(false)}
        onExited={() => setExited(true)}
      >
        <div
          {...rest}
          className={cx(
            classes.host,
            classes[placement],
            className,
          )}
        >
          {children}
        </div>
      </SlideFade>
    </Overlay>
  );
});

export default Drawer;
