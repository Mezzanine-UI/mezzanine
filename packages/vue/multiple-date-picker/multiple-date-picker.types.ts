import type { DateType } from '@mezzanine-ui/core/calendar';
import type { MultipleDatePickerValue } from '@mezzanine-ui/core/multiple-date-picker';
import type { CalendarFooterActionsProps } from '../calendar/calendar-footer-actions.types';
import type { CalendarProps } from '../calendar/calendar.types';
import type { InputTriggerPopperProps } from '../_internal/input-trigger-popper.types';
import type { MultipleDatePickerTriggerProps } from './multiple-date-picker-trigger.types';

export interface MultipleDatePickerProps
  extends Pick<
      MultipleDatePickerTriggerProps,
      | 'clearable'
      | 'disabled'
      | 'error'
      | 'fullWidth'
      | 'overflowStrategy'
      | 'readOnly'
      | 'size'
    >,
    Pick<
      CalendarProps,
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disabledMonthSwitch'
      | 'disabledYearSwitch'
      | 'displayMonthLocale'
      | 'isDateDisabled'
    > {
  /**
   * Custom action button props. Allows overriding confirm/cancel button text and behavior.
   */
  actions?: Partial<CalendarFooterActionsProps['actions']>;
  /**
   * Other calendar props you may provide to `MznCalendar`.
   */
  calendarProps?: Omit<
    CalendarProps,
    | 'disableOnDoubleNext'
    | 'disableOnDoublePrev'
    | 'disableOnNext'
    | 'disableOnPrev'
    | 'displayMonthLocale'
    | 'isDateDisabled'
    | 'locale'
    | 'mode'
    | 'referenceDate'
    | 'value'
  >;
  /**
   * The format for displaying date in tags.
   * @default 'YYYY-MM-DD'
   */
  format?: string;
  /**
   * Maximum number of dates that can be selected.
   */
  maxSelections?: number;
  /**
   * Placeholder text when no dates are selected.
   */
  placeholder?: string;
  /**
   * Other props you may provide to the popper.
   */
  popperProps?: Omit<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'>;
  /**
   * The reference date for getting calendars. Default to current time.
   */
  referenceDate?: DateType;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /**
   * Controlled value - array of selected dates.
   * @default []
   */
  value?: MultipleDatePickerValue;
}
