import type { PartialOptions } from 'overlayscrollbars';
import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-vue';
import type { CSSProperties } from 'vue';

export interface ScrollbarProps {
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
   * Event handlers for OverlayScrollbars events.
   * @see https://kingsora.github.io/OverlayScrollbars/#!documentation/events
   */
  events?: OverlayScrollbarsComponentProps['events'];
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
}
