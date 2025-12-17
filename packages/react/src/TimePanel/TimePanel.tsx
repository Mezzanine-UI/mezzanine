'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import {
  getUnits,
  timePanelClasses as classes,
  TimePanelUnit,
} from '@mezzanine-ui/core/time-panel';
import { forwardRef, useMemo } from 'react';
import { useCalendarContext } from '../Calendar';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import TimePanelAction from './TimePanelAction';
import TimePanelColumn from './TimePanelColumn';

export interface TimePanelProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'value' | 'onChange' | 'children'
  > {
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
   * Change handler. Takes `DateType` as its argument.
   */
  onChange?: (target: DateType) => void;
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

/**
 * The react component for `mezzanine` time panel.
 * Notice that any component related to time-panel should be used along with `CalendarContext`.
 */
const TimePanel = forwardRef<HTMLDivElement, TimePanelProps>(
  function TimePanel(props, ref) {
    const {
      getHour,
      getMinute,
      getSecond,
      setHour,
      setMinute,
      setSecond,
      startOf,
      getNow,
    } = useCalendarContext();
    const {
      className,
      hideHour = false,
      hideMinute = false,
      hideSecond = false,
      hourStep = 1,
      minuteStep = 1,
      onChange,
      secondStep = 1,
      value,
      ...restHostProps
    } = props;
    const setters = {
      hour: setHour,
      minute: setMinute,
      second: setSecond,
    };
    const hourUnits = useMemo(
      () => (hideHour ? undefined : getUnits(0, 23, hourStep)),
      [hideHour, hourStep],
    );
    const minuteUnits = useMemo(
      () => (hideMinute ? undefined : getUnits(0, 59, minuteStep)),
      [hideMinute, minuteStep],
    );
    const secondUnits = useMemo(
      () => (hideSecond ? undefined : getUnits(0, 59, secondStep)),
      [hideSecond, secondStep],
    );
    const activeHour = value ? getHour(value) : undefined;
    const activeMinute = value ? getMinute(value) : undefined;
    const activeSecond = value ? getSecond(value) : undefined;

    function getChangeHandle(granularity: 'hour' | 'minute' | 'second') {
      if (!onChange) return undefined;

      const setter = setters[granularity];

      const currentValue = value || startOf(getNow(), 'day');

      return (target: TimePanelUnit) => {
        const result = setter(currentValue, target.value);

        onChange(result);
      };
    }

    const onThisMoment = () => {
      if (!onChange) return;

      const now = getNow();
      const currentHour = getHour(now);
      const currentMinute = getMinute(now);
      const currentSecond = getSecond(now);

      const closestHour = hideHour
        ? currentHour
        : Math.round(currentHour / hourStep) * hourStep;

      const closestMinute = hideMinute
        ? currentMinute
        : Math.round(currentMinute / minuteStep) * minuteStep;

      const closestSecond = hideSecond
        ? currentSecond
        : Math.round(currentSecond / secondStep) * secondStep;

      let result = now;
      if (!hideHour) {
        result = setHour(result, Math.min(closestHour, 23));
      }
      if (!hideMinute) {
        result = setMinute(result, Math.min(closestMinute, 59));
      }
      if (!hideSecond) {
        result = setSecond(result, Math.min(closestSecond, 59));
      }

      onChange(result);
    };

    return (
      <div {...restHostProps} ref={ref} className={cx(classes.host, className)}>
        <div className={classes.columns}>
          {!hideHour && hourUnits && (
            <TimePanelColumn
              units={hourUnits}
              activeUnit={activeHour}
              onChange={getChangeHandle('hour')}
            />
          )}
          {!hideMinute && minuteUnits && (
            <TimePanelColumn
              units={minuteUnits}
              activeUnit={activeMinute}
              onChange={getChangeHandle('minute')}
            />
          )}
          {!hideSecond && secondUnits && (
            <TimePanelColumn
              units={secondUnits}
              activeUnit={activeSecond}
              onChange={getChangeHandle('second')}
            />
          )}
        </div>
        <TimePanelAction onClick={onThisMoment} />
      </div>
    );
  },
);

export default TimePanel;
