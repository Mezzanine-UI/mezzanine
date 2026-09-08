import type { BackdropVariant } from '@mezzanine-ui/core/backdrop';
import type { PortalProps } from '../portal/portal.types';

export interface BackdropProps
  extends Pick<PortalProps, 'container' | 'disablePortal'> {
  /**
   * Controls whether to disable closing element while backdrop clicked.
   * @default false
   */
  disableCloseOnBackdropClick?: boolean;
  /**
   * Controls whether to disable scroll locking when backdrop is open.
   * @default false
   */
  disableScrollLock?: boolean;
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
