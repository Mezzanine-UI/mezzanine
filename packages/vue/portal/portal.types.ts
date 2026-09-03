import type { Ref } from 'vue';
import type { PortalLayer } from './portal-registry';

export interface PortalProps {
  /**
   * The destination where to portal.
   * If provided, it will override the default portal container.
   * Accepts HTMLElement, a template ref, or null.
   */
  container?: HTMLElement | Ref<HTMLElement | null> | null;
  /**
   * Whether to disable portal.
   * If true, it will be a normal component.
   * @default false
   */
  disablePortal?: boolean;
  /**
   * The portal layer to use.
   * - 'alert': Portal to alert container (above root, sticky)
   * - 'default': Portal to default container (inside root, fixed)
   * @default 'default'
   */
  layer?: PortalLayer;
}
