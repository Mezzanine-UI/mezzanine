import type { CascaderOption } from './cascader.types';

export interface CascaderPanelProps {
  /**
   * The id of the currently active (navigating) option.
   */
  activeId?: string;
  /**
   * The id of the keyboard-focused option in this panel.
   */
  focusedId?: string;
  /**
   * The max height for the panel.
   */
  maxHeight?: number | string;
  /**
   * The options to render in this panel.
   */
  options: CascaderOption[];
  /**
   * The id of the confirmed selected option at this level.
   */
  selectedId?: string;
}
