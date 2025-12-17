import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { forwardRef } from 'react';
import SlideFadeOverlay, {
  SlideFadeOverlayProps,
} from '../_internal/SlideFadeOverlay';

const defaultOptions: Pick<
  SlideFadeOverlayProps,
  | 'className'
  | 'direction'
  | 'disableCloseOnBackdropClick'
  | 'disableCloseOnEscapeKeyDown'
  | 'disablePortal'
  | 'open'
> = {
  className: classes.overlay,
  direction: 'down',
  disableCloseOnBackdropClick: false,
  disableCloseOnEscapeKeyDown: false,
  disablePortal: false,
  open: false,
};

const ModalContainer = forwardRef<HTMLDivElement, SlideFadeOverlayProps>(
  (props, ref) => {
    const {
      className = defaultOptions.className,
      children,
      container,
      direction = defaultOptions.direction,
      disableCloseOnBackdropClick = defaultOptions.disableCloseOnBackdropClick,
      disableCloseOnEscapeKeyDown = defaultOptions.disableCloseOnEscapeKeyDown,
      disablePortal = defaultOptions.disablePortal,
      onBackdropClick,
      onClose,
      open = defaultOptions.open,
    } = props;

    return (
      <SlideFadeOverlay
        className={className}
        container={container}
        direction={direction}
        disableCloseOnBackdropClick={disableCloseOnBackdropClick}
        disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
        disablePortal={disablePortal}
        onBackdropClick={onBackdropClick}
        onClose={onClose}
        open={open}
        ref={ref}
      >
        {children}
      </SlideFadeOverlay>
    );
  },
);

export default function useModalContainer() {
  return {
    Container: ModalContainer,
    defaultOptions,
  };
}
