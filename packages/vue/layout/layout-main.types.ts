import type { ScrollbarProps } from '../scrollbar/scrollbar.types';

export interface LayoutMainProps {
  /**
   * Props passed to the internal scrollbar. If not provided, the main area will still be scrollable but without the custom scrollbar styling and behavior.
   */
  scrollbarProps?: ScrollbarProps;
}
