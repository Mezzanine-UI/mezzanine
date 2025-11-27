import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
} from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface CalendarControlsProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick'> {
  /**
   * Disable the next controller if true.
   */
  disableOnNext?: boolean;
  /**
   * Disable the double next controller if true.
   */
  disableOnDoubleNext?: boolean;
  /**
   * Disable the prev controller if true.
   */
  disableOnPrev?: boolean;
  /**
   * Disable the double prev controller if true.
   */
  disableOnDoublePrev?: boolean;
  /**
   * Click handler for next controller.
   */
  onNext?: VoidFunction;
  /**
   * Click handler for double next controller.
   */
  onDoubleNext?: VoidFunction;
  /**
   * Click handler for prev controller.
   */
  onPrev?: VoidFunction;
  /**
   * Click handler for double prev controller.
   */
  onDoublePrev?: VoidFunction;
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
    disableOnDoubleNext,
    disableOnPrev,
    disableOnDoublePrev,
    onPrev,
    onNext,
    onDoubleNext,
    onDoublePrev,
    ...restElementProps
  } = props;

  return (
    <div {...restElementProps} className={cx(classes.controls, className)}>
      <div className={cx(classes.controlsActions)}>
        {onDoublePrev && (
          <button
            type="button"
            aria-disabled={disableOnDoublePrev}
            disabled={disableOnDoublePrev}
            onClick={onDoublePrev}
            title="Double Previous"
            className={cx(classes.controlsButton)}
          >
            <Icon icon={DoubleChevronLeftIcon} />
          </button>
        )}
        {onPrev && (
          <button
            type="button"
            aria-disabled={disableOnPrev}
            disabled={disableOnPrev}
            onClick={onPrev}
            title="Previous"
            className={cx(classes.controlsButton)}
          >
            <Icon icon={ChevronLeftIcon} />
          </button>
        )}
      </div>
      <div className={cx(classes.controlsMain)}>{children}</div>
      <div className={cx(classes.controlsActions)}>
        {onNext && (
          <button
            type="button"
            aria-disabled={disableOnNext}
            disabled={disableOnNext}
            onClick={onNext}
            title="Next"
            className={cx(classes.controlsButton)}
          >
            <Icon icon={ChevronRightIcon} />
          </button>
        )}
        {onDoubleNext && (
          <button
            type="button"
            aria-disabled={disableOnDoubleNext}
            disabled={disableOnDoubleNext}
            onClick={onDoubleNext}
            title="Double Next"
            className={cx(classes.controlsButton)}
          >
            <Icon icon={DoubleChevronRightIcon} />
          </button>
        )}
      </div>
    </div>
  );
}

export default CalendarControls;
