import type { CalendarMode } from '@mezzanine-ui/core/calendar';

export interface CalendarCellProps {
  /**
   * Apply active styles if true.
   */
  active?: boolean;
  /**
   * Apply disabled styles if true.
   */
  disabled?: boolean;
  /**
   * Apply range end styles if true.
   */
  isRangeEnd?: boolean;
  /**
   * Apply range start styles if true.
   */
  isRangeStart?: boolean;
  /**
   * Apply weekend styles if true.
   */
  isWeekend?: boolean;
  /**
   * Calendar mode for applying mode specific styles.
   * @default 'day'
   */
  mode?: CalendarMode;
  /**
   * The role attribute for accessibility
   */
  role?: string;
  /**
   * Apply today styles if true.
   */
  today?: boolean;
  /**
   * Apply annotation styles if true.
   */
  withAnnotation?: boolean;
}
