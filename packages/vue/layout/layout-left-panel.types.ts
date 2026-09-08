import type { ScrollbarProps } from '../scrollbar/scrollbar.types';

export interface LayoutLeftPanelProps {
  /** Initial width (in px) of the panel. Clamped to a minimum of 240px. */
  defaultWidth?: number;
  /** Controls whether the panel and its divider are visible. */
  open?: boolean;
  /** Props passed to the internal scrollbar. */
  scrollbarProps?: ScrollbarProps;
}
