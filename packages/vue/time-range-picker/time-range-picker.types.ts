import type { RangePickerTriggerProps } from '../picker/range-picker-trigger.types';
import type { TimePickerPanelProps } from '../time-picker/time-picker-panel.types';
import type { TimeRangePickerValue } from './use-time-range-picker-value';

export interface TimeRangePickerProps
  extends Pick<
      TimePickerPanelProps,
      | 'fadeProps'
      | 'hideHour'
      | 'hideMinute'
      | 'hideSecond'
      | 'hourStep'
      | 'minuteStep'
      | 'popperProps'
      | 'secondStep'
    >,
    Pick<
      RangePickerTriggerProps,
      | 'clearable'
      | 'disabled'
      | 'error'
      | 'errorMessagesFrom'
      | 'errorMessagesTo'
      | 'fullWidth'
      | 'inputFromPlaceholder'
      | 'inputFromProps'
      | 'inputToPlaceholder'
      | 'inputToProps'
      | 'readOnly'
      | 'required'
      | 'size'
      | 'validateFrom'
      | 'validateTo'
    > {
  /**
   * The format for displaying time.
   * @default 'HH:mm:ss' or 'HH:mm' based on hideSecond
   */
  format?: string;
  /**
   * Value of the range picker.
   * It is an array of your declared `DateType` which represents from and to in order.
   */
  value?: TimeRangePickerValue;
}
