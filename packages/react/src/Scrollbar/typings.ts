import type { OverlayScrollbars, PartialOptions } from 'overlayscrollbars';
import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-react';
import type { CSSProperties, ReactNode } from 'react';
import type { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface ScrollbarProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * The content to be rendered inside the scrollable container.
   */
  children?: ReactNode;
  /**
   * Whether to defer the initialization of OverlayScrollbars.
   * This can improve initial render performance.
   * @default true
   */
  defer?: boolean | object;
  /**
   * When true, disables the custom scrollbar and renders as a plain div.
   * Useful for nested contexts where custom scrollbar is not needed.
   * @default false
   */
  disabled?: boolean;
  /**
   * The maximum height of the scrollable container.
   * Can be a CSS value string (e.g., '300px', '50vh') or a number (treated as pixels).
   */
  maxHeight?: CSSProperties['maxHeight'];
  /**
   * The maximum width of the scrollable container.
   * Can be a CSS value string (e.g., '500px', '100%') or a number (treated as pixels).
   */
  maxWidth?: CSSProperties['maxWidth'];
  /**
   * Additional options to pass to OverlayScrollbars.
   * @see https://kingsora.github.io/OverlayScrollbars/#!documentation/options
   */
  options?: PartialOptions;
  /**
   * Event handlers for OverlayScrollbars events.
   * @see https://kingsora.github.io/OverlayScrollbars/#!documentation/events
   */
  events?: OverlayScrollbarsComponentProps['events'];
  /**
   * Callback fired when the scrollbar is initialized.
   * Provides access to the viewport element for external integrations (e.g., virtualization, DnD).
   */
  onViewportReady?: (
    viewport: HTMLDivElement,
    instance: OverlayScrollbars,
  ) => void;
}
