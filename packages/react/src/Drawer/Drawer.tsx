import { forwardRef } from 'react';
import {
  drawerClasses as classes,
  DrawerSize,
} from '@mezzanine-ui/core/drawer';
import { cx } from '../utils/cx';
import SlideFadeOverlay, {
  SlideFadeOverlayProps,
} from '../_internal/SlideFadeOverlay';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import ClearActions from '../ClearActions';
import Button from '../Button';

export interface DrawerProps
  extends Omit<SlideFadeOverlayProps, 'children'>,
    Pick<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  bottom?: {
    ghostActionText?: string;
    onGhostActionClick?: VoidFunction;
    secondaryActionText?: string;
    onSecondaryActionClick?: VoidFunction;
    primaryActionText?: string;
    onPrimaryActionClick?: VoidFunction;
  };
  header?: {
    title: string;
  };
  size?: DrawerSize;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>((props, ref) => {
  const {
    bottom,
    className,
    children,
    container,
    disableCloseOnBackdropClick = false,
    disableCloseOnEscapeKeyDown = false,
    disablePortal,
    header,
    onBackdropClick,
    onClose,
    open,
    size = 'medium',
    ...rest
  } = props;

  return (
    <SlideFadeOverlay
      className={classes.overlay}
      container={container}
      direction="right"
      disableCloseOnBackdropClick={disableCloseOnBackdropClick}
      disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
      disablePortal={disablePortal}
      onBackdropClick={onBackdropClick}
      onClose={onClose}
      open={open}
      ref={ref}
    >
      <div
        {...rest}
        className={cx(
          classes.host,
          classes.right,
          classes.size(size),
          className,
        )}
      >
        {header && (
          <div className={classes.header}>
            {header.title}
            <ClearActions onClick={onClose} />
          </div>
        )}

        <div className={classes.content}>{children}</div>

        {bottom && (
          <div className={classes.bottom}>
            <div>
              {bottom.ghostActionText && bottom.onGhostActionClick && (
                <Button
                  onClick={bottom.onGhostActionClick}
                  variant="base-ghost"
                  type="button"
                >
                  {bottom.ghostActionText}
                </Button>
              )}
            </div>
            <div className={classes['bottom__actions']}>
              {bottom.secondaryActionText && bottom.onSecondaryActionClick && (
                <Button
                  onClick={bottom.onSecondaryActionClick}
                  variant="base-secondary"
                  type="button"
                >
                  {bottom.secondaryActionText}
                </Button>
              )}
              {bottom.primaryActionText && bottom.onPrimaryActionClick && (
                <Button
                  onClick={bottom.onPrimaryActionClick}
                  variant="base-primary"
                  type="button"
                >
                  {bottom.primaryActionText}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </SlideFadeOverlay>
  );
});

export default Drawer;
