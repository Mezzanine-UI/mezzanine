import type { DateType } from '@mezzanine-ui/core/calendar';
import type { InputTriggerPopperProps } from '../_internal/input-trigger-popper.types';
import type { TimePanelProps } from '../time-panel/time-panel.types';

export interface TimePickerPanelProps
  extends Pick<
      TimePanelProps,
      | 'hideHour'
      | 'hideMinute'
      | 'hideSecond'
      | 'hourStep'
      | 'minuteStep'
      | 'secondStep'
    >,
    Pick<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'> {
  /**
   * Other props you may provide to `MznPopper` component
   */
  popperProps?: Omit<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'>;
  /**
   * Display value of the panel.
   */
  value?: DateType;
}
