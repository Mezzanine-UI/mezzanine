import {
  calendarClasses as classes,
} from '@mezzanine-ui/core/calendar';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import CalendarCell from './CalendarCell';
import { useCalendarContext } from './CalendarContext';

export interface CalendarDayOfWeekProps extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick'> {
  /**
   * The locale you want to use when rendering the name of week day.
   * If none provided, it will use the `displayWeekDayLocale` from calendar context.
   */
  displayWeekDayLocale?: string;
}

/**
 * The react component for `mezzanine` calendar day of week.
 * You may use it to compose your own calendar.
 */
function CalendarDayOfWeek(props: CalendarDayOfWeekProps) {
  const {
    getWeekDayNames,
    displayWeekDayLocale: displayWeekDayLocaleFromConfig,
  } = useCalendarContext();
  const {
    displayWeekDayLocale = displayWeekDayLocaleFromConfig,
    className,
    ...restRowProps
  } = props;

  const weekDayNames = getWeekDayNames(displayWeekDayLocale);

  return (
    <div className={cx(classes.row, className)} {...restRowProps}>
      {weekDayNames.map((name) => (
        <CalendarCell key={`CALENDAR_DAY_OF_WEEK/${name}`}>
          {name}
        </CalendarCell>
      ))}
    </div>
  );
}

export default CalendarDayOfWeek;
