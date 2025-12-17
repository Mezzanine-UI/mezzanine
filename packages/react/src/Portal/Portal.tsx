'use client';

import { ReactNode, RefObject, useEffect, useState } from 'react';
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

  /** This element is fully client side, so `return null` on server side */
  if (typeof window === 'undefined') return null;

  if (disablePortal || !container) {
    return <>{children}</>;
  }

  return createPortal(children, container);
}
