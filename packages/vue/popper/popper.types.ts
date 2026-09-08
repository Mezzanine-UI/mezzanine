import type { Middleware, Placement, Strategy } from '@floating-ui/dom';
import type { ElementGetter } from '../_internal/get-element';
import type { PortalProps } from '../portal/portal.types';
import type { UseFloatingReturn } from './use-floating';

/**
 * Where the popper is placed relative to its anchor, as accepted by
 * `@floating-ui/dom` — a side (`'top'`), optionally with an alignment
 * (`'top-start'`, `'top-end'`).
 */
export type PopperPlacement = Placement;

/**
 * The CSS position strategy used by the popper.
 * - `'absolute'` — positioned against the nearest positioned ancestor.
 * - `'fixed'` — positioned against the viewport.
 */
export type PopperPositionStrategy = Strategy;

/**
 * Everything `useFloating` tracks, handed to consumers through the component's
 * template ref so they can read the resolved position or force an update.
 */
export type PopperController = UseFloatingReturn;

/**
 * Arrow configuration.
 */
export interface PopperArrow {
  /**
   * Class applied to the arrow's `svg`.
   */
  className: string;
  /**
   * Whether to show arrow element on the popper.
   */
  enabled: boolean;
  /**
   * Keeps the arrow this many pixels away from the popper's corners.
   * @default 0
   */
  padding?: number;
}

/**
 * The subset of `useFloating`'s options this component forwards.
 *
 * React accepts `UseFloatingOptions` from `@floating-ui/react-dom` but
 * overrides `elements` and `whileElementsMounted` itself, and `middleware` is
 * merged with the arrow middleware rather than replaced — so those are the
 * options that actually reach `computePosition`.
 */
export interface PopperOptions {
  /**
   * Extra middleware, run before the arrow middleware.
   */
  middleware?: Array<Middleware | null | undefined | false>;
  /**
   * Whether the consumer considers the popper open. Only affects the
   * controller's `isPositioned`.
   */
  open?: boolean;
  /**
   * The requested placement. The resolved one is reported by `placementChange`.
   * @default 'bottom'
   */
  placement?: PopperPlacement;
  /**
   * @default 'absolute'
   */
  strategy?: PopperPositionStrategy;
  /**
   * Whether to position with `transform` instead of `top`/`left`.
   * @default true
   */
  transform?: boolean;
}

export interface PopperProps
  extends Pick<PortalProps, 'container' | 'disablePortal'> {
  /**
   * The ref of trigger Element.
   */
  anchor?: ElementGetter;
  /**
   * Whether to show arrow element on the popper.
   */
  arrow?: PopperArrow | null;
  /**
   * The portal element will show if open=true
   * @default false
   */
  open?: boolean;
  /**
   * The options of the floating position computation.
   */
  options?: PopperOptions;
}
