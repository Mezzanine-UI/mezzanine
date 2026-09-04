import type { TimePanelUnit } from '@mezzanine-ui/core/time-panel';

export interface TimePanelColumnProps {
  /**
   * The active unit of time.
   */
  activeUnit?: TimePanelUnit['value'];
  /**
   * `cellHeight` controls the scroll positioning. This should meet the value of the computed cell height.
   */
  cellHeight?: number;
  /**
   * Display units inside the column.
   */
  units: TimePanelUnit[];
}
