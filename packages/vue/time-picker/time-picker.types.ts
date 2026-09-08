import type { DateType } from '@mezzanine-ui/core/calendar';
import type { PickerTriggerProps } from '../picker/picker-trigger.types';
import type { TimePickerPanelProps } from './time-picker-panel.types';

export interface TimePickerProps
  extends Omit<TimePickerPanelProps, 'anchor' | 'open' | 'value'>,
    Omit<PickerTriggerProps, 'format' | 'value'> {
  /**
   * Default value for time picker.
   */
  defaultValue?: DateType;
  /**
   * The format for displaying time.
   * @default 'HH:mm:ss' or 'HH:mm' based on hideSecond
   */
  format?: string;
  /**
   * Current value of time picker.
   */
  value?: DateType;
}
