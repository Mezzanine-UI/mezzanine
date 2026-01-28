import {
  CalendarMode,
  calendarClasses as classes,
} from '@mezzanine-ui/core/calendar';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface CalendarCellProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Apply active styles if true.
   */
  active?: boolean;
  /**
   * Apply disabled styles if true.
   */
  disabled?: boolean;
  /**
   * Calendar mode for applying mode specific styles.
   * @default 'day'
   */
  mode?: CalendarMode;
  /**
   * Apply today styles if true.
   */
  today?: boolean;
  /**
   * The role attribute for accessibility
   */
  role?: string;
  /**
   * Apply range start styles if true.
   */
  isRangeStart?: boolean;
  /**
   * Apply range end styles if true.
   */
  isRangeEnd?: boolean;
  /**
   * Apply weekend styles if true.
   */
  isWeekend?: boolean;
  /**
   * Apply annotation styles if true.
   */
  withAnnotation?: boolean;
}

/**
 * The react component for `mezzanine` calendar cell.
 * You may use it to compose your own calendar.
 */
function CalendarCell(props: CalendarCellProps) {
  const {
    active,
    children,
    className,
    disabled,
    mode = 'day',
    today,
    role,
    isRangeStart,
    isRangeEnd,
    isWeekend,
    withAnnotation,
    ...restCalendarCellProps
  } = props;

  return (
    <div
      role={role}
      className={cx(
        classes.cell,
        classes.cellMode(mode),
        {
          [classes.cellToday]: today,
          [classes.cellActive]: active,
          [classes.cellDisabled]: disabled,
          [classes.cellWithAnnotation]: withAnnotation,
          [classes.cellWeekend]: isWeekend,
          [classes.cellRangeStart]: isRangeStart,
          [classes.cellRangeEnd]: isRangeEnd,
        },
        className,
      )}
      {...restCalendarCellProps}
    >
      <span className={classes.cellInner}>{children}</span>
    </div>
  );
}

export default CalendarCell;
