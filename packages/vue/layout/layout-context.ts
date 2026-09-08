import type { InjectionKey, Ref } from 'vue';

export interface LayoutContextValue {
  /** The layout's own outermost element. */
  hostRef: Ref<HTMLDivElement | null>;
  /** The main area, whose width bounds how far a panel can be dragged. */
  mainRef: Ref<HTMLDivElement | null>;
  /** Called by the main area to report its element. */
  registerMain: (element: HTMLDivElement | null) => void;
}

/**
 * Provided by `MznLayoutHost`, injected by the main area and the side panels.
 *
 * Carries plain refs rather than a `ComputedRef`: nothing renders from them,
 * they are read while dragging to measure the main area.
 */
export const LAYOUT_CONTEXT: InjectionKey<LayoutContextValue> =
  Symbol('MznLayoutContext');
