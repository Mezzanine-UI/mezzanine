'use client';

import {
  ReactNode,
  RefObject,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { getContainer, type PortalLayer } from './portalRegistry';

export interface PortalProps {
  /**
   * The element you want to portal.
   */
  children?: ReactNode;
  /**
   * The destination where to portal.
   * If provided, it will override the default portal container.
   * Accepts HTMLElement, RefObject, or null.
   */
  container?:
    | HTMLElement
    | RefObject<HTMLElement | null>
    | RefObject<HTMLElement>
    | null;
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

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` during server rendering and the hydration pass, `true` afterwards
 * and on every plain client render. Unlike `typeof window`, this lets the
 * first hydration render match the server markup exactly.
 */
function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );
}

/**
 * Renders its children into a DOM node outside the parent hierarchy.
 *
 * Without `container` the children go to the Mezzanine portal layer chosen by
 * `layer` (created on first use); `container` overrides the destination and
 * `disablePortal` keeps the children in place.
 *
 * Portaled content is client-only: the server and the hydration pass render
 * nothing, then the children are portaled once mounted, so hydration never
 * mismatches. With `disablePortal` the children are rendered in place on the
 * server as well.
 *
 * @example
 * ```tsx
 * import { Portal } from '@mezzanine-ui/react';
 *
 * <Portal layer="alert">
 *   <div>Rendered into the alert layer</div>
 * </Portal>
 * ```
 *
 * @see Backdrop
 * @see Popper
 */
export default function Portal({
  children,
  container: containerProp,
  disablePortal = false,
  layer = 'default',
}: PortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // Extract ref.current for dependency tracking
  const refCurrent =
    containerProp && 'current' in containerProp
      ? containerProp.current
      : undefined;

  useEffect(() => {
    if (disablePortal) return;

    if (containerProp) {
      // Handle RefObject
      if ('current' in containerProp) {
        setContainer(containerProp.current);

        return;
      }

      // Handle HTMLElement
      setContainer(containerProp);

      return;
    }

    const targetContainer = getContainer(layer);

    setContainer(targetContainer);
  }, [containerProp, disablePortal, layer, refCurrent]);

  const isClient = useIsClient();

  if (disablePortal) return <>{children}</>;

  if (!isClient) return null;

  if (!container) return <>{children}</>;

  return createPortal(children, container);
}
