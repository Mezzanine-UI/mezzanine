import {
  calendarClasses as classes,
} from '@mezzanine-ui/core/calendar';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@mezzanine-ui/icons';
import { Icon } from '..';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface CalendarControlsProps extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick'> {
  /**
   * Disable the next controller if true.
   */
  disableOnNext?: boolean;
  /**
   * Disable the prev controller if true.
   */
  disableOnPrev?: boolean;
  /**
   * Click handler for next controller.
   */
  onNext?: VoidFunction;
  /**
   * Click handler for prev controller.
   */
  onPrev?: VoidFunction;
}

/**
 * The react component for `mezzanine` calendar controls.
 * You may use it to compose your own calendar.
 */
function CalendarControls(props: CalendarControlsProps) {
  const {
    children,
    className,
    disableOnNext,
    disableOnPrev,
    onNext,
    onPrev,
    ...restElementProps
  } = props;

  return (
    <div
      {...restElementProps}
      className={cx(
        classes.controls,
        className,
      )}
    >
      {onPrev && (
        <button
          type="button"
          aria-disabled={disableOnPrev}
          disabled={disableOnPrev}
          onClick={onPrev}
          className={cx(
            classes.button,
            classes.controlsIconButton,
            classes.controlsPrev,
            {
              [classes.buttonDisabled]: disableOnPrev,
            },
          )}
        >
          <Icon icon={ChevronLeftIcon} />
        </button>
      )}
      {children}
      {onNext && (
        <button
          type="button"
          aria-disabled={disableOnNext}
          disabled={disableOnNext}
          onClick={onNext}
          className={cx(
            classes.button,
            classes.controlsIconButton,
            classes.controlsNext,
            {
              [classes.buttonDisabled]: disableOnNext,
            },
          )}
        >
          <Icon icon={ChevronRightIcon} />
        </button>
      )}
    </div>
  );
}

export default CalendarControls;
