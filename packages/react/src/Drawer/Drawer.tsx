
import { forwardRef, useMemo } from 'react';
import { drawerClasses as classes, DrawerPlacement } from '@mezzanine-ui/core/drawer';
import { cx } from '../utils/cx';
import SlideFadeOverlay, { SlideFadeOverlayProps } from '../_internal/SlideFadeOverlay';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface DrawerProps
  extends
  Omit<SlideFadeOverlayProps, 'children'>,
  Pick<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
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

  const slideFadeDirection: { [index: string]: SlideFadeOverlayProps['direction'] } = useMemo(() => ({
    top: 'down',
    left: 'right',
    right: 'left',
    bottom: 'up',
  }), []);

  return (
    <SlideFadeOverlay
      className={classes.overlay}
      container={container}
      direction={slideFadeDirection[placement]}
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
          classes[placement],
          className,
        )}
      >
        {children}
      </div>
    </SlideFadeOverlay>
  );
});

export default Drawer;
