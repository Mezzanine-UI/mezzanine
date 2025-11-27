import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
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
   * Apply today styles if true.
   */
  today?: boolean;
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
    // today,
    ...restCalendarCellProps
  } = props;

  return (
    <div
      className={cx(
        classes.cell,
        {
          [classes.cellActive]: active,
          [classes.cellDisabled]: disabled,
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
