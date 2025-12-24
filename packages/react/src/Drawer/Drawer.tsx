import { forwardRef, useState } from 'react';
import {
  drawerClasses as classes,
  DrawerSize,
} from '@mezzanine-ui/core/drawer';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Backdrop, { BackdropProps } from '../Backdrop';
import { Translate } from '../Transition';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import useTopStack from '../_internal/SlideFadeOverlay/useTopStack';
import ClearActions from '../ClearActions';
import Button from '../Button';

export interface DrawerProps
  extends NativeElementPropsWithoutKeyAndRef<'div'>,
    Pick<
      BackdropProps,
      | 'container'
      | 'disableCloseOnBackdropClick'
      | 'disablePortal'
      | 'onBackdropClick'
      | 'onClose'
      | 'open'
    > {
  /**
   * Text for the ghost action button in the bottom action area.
   */
  bottomGhostActionText?: string;
  /**
   * Click handler for the ghost action button in the bottom action area.
   */
  bottomOnGhostActionClick?: VoidFunction;
  /**
   * Click handler for the primary action button in the bottom action area.
   */
  bottomOnPrimaryActionClick?: VoidFunction;
  /**
   * Click handler for the secondary action button in the bottom action area.
   */
  bottomOnSecondaryActionClick?: VoidFunction;
  /**
   * Text for the primary action button in the bottom action area.
   */
  bottomPrimaryActionText?: string;
  /**
   * Text for the secondary action button in the bottom action area.
   */
  bottomSecondaryActionText?: string;
  /**
   * Controls whether to disable closing drawer while escape key down.
   * @default false
   */
  disableCloseOnEscapeKeyDown?: boolean;
  /**
   * Title text displayed in the drawer header.
   */
  headerTitle?: string;
  /**
   * Controls whether to display the bottom action area.
   */
  isBottomDisplay?: boolean;
  /**
   * Controls whether to display the header area.
   */
  isHeaderDisplay?: boolean;
  /**
   * Controls the width of the drawer.
   * @default 'medium'
   */
  size?: DrawerSize;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>((props, ref) => {
  const {
    bottomGhostActionText,
    bottomOnGhostActionClick,
    bottomOnPrimaryActionClick,
    bottomOnSecondaryActionClick,
    bottomPrimaryActionText,
    bottomSecondaryActionText,
    children,
    className,
    container,
    disableCloseOnBackdropClick = false,
    disableCloseOnEscapeKeyDown = false,
    disablePortal,
    headerTitle,
    isBottomDisplay,
    isHeaderDisplay,
    onBackdropClick,
    onClose,
    open,
    size = 'medium',
    ...rest
  } = props;

  const [exited, setExited] = useState(true);

  /**
   * Escape keydown close: escape will only close the top drawer
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
      className={classes.overlay}
      container={container}
      disableCloseOnBackdropClick={disableCloseOnBackdropClick}
      disablePortal={disablePortal}
      onBackdropClick={onBackdropClick}
      onClose={onClose}
      open={open}
      role="presentation"
    >
      <Translate
        from="left"
        in={open}
        onEntered={() => setExited(false)}
        onExited={() => setExited(true)}
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
          {isHeaderDisplay && (
            <div className={classes.header}>
              {headerTitle}
              <ClearActions onClick={onClose} />
            </div>
          )}

          <div className={classes.content}>{children}</div>

          {isBottomDisplay && (
            <div className={classes.bottom}>
              <div>
                {bottomGhostActionText && bottomOnGhostActionClick && (
                  <Button
                    onClick={bottomOnGhostActionClick}
                    type="button"
                    variant="base-ghost"
                  >
                    {bottomGhostActionText}
                  </Button>
                )}
              </div>
              <div className={classes['bottom__actions']}>
                {bottomSecondaryActionText && bottomOnSecondaryActionClick && (
                  <Button
                    onClick={bottomOnSecondaryActionClick}
                    type="button"
                    variant="base-secondary"
                  >
                    {bottomSecondaryActionText}
                  </Button>
                )}
                {bottomPrimaryActionText && bottomOnPrimaryActionClick && (
                  <Button
                    onClick={bottomOnPrimaryActionClick}
                    type="button"
                    variant="base-primary"
                  >
                    {bottomPrimaryActionText}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Translate>
    </Backdrop>
  );
});

export default Drawer;
