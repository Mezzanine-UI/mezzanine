import type { DateType } from '@mezzanine-ui/core/calendar';

export interface TimePanelProps {
  /**
   * Controls whether or not to hide hours column.
   */
  hideHour?: boolean;
  /**
   * Controls whether or not to hide minutes column.
   */
  hideMinute?: boolean;
  /**
   * Controls whether or not to hide seconds column.
   */
  hideSecond?: boolean;
  /**
   * The steps of hour.
   * @default 1
   */
  hourStep?: number;
  /**
   * The steps of minute.
   * @default 1
   */
  minuteStep?: number;
  /**
   * The steps of second.
   * @default 1
   */
  secondStep?: number;
  /**
   * Display value of the panel
   */
  value?: DateType;
}
