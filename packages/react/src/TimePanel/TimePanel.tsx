'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import {
  getUnits,
  timePanelClasses as classes,
  TimePanelMode,
  TimePanelUnit,
} from '@mezzanine-ui/core/time-panel';
import { forwardRef, ReactNode, useMemo } from 'react';
import { useCalendarContext } from '../Calendar';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import TimePanelAction, { TimePanelActionProps } from './TimePanelAction';
import TimePanelColumn from './TimePanelColumn';

export interface TimePanelProps
  extends Pick<TimePanelActionProps, 'confirmText' | 'onConfirm'>,
    Omit<
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
   * The hours column prefix.
   * @default 'Hrs''
   */
  hourPrefix?: ReactNode;
  /**
   * The steps of hour.
   * @default 1
   */
  hourStep?: number;
  /**
   * The minutes column prefix.
   * @default 'Min''
   */
  minutePrefix?: ReactNode;
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
   * The seconds column prefix.
   * @default 'Sec''
   */
  secondPrefix?: ReactNode;
  /**
   * The steps of second.
   * @default 1
   */
  secondStep?: number;
  /**
   * Display value of the panel
   */
  value?: DateType;
  /**
   * Controls whether or not to show actions.
   */
  withoutAction?: boolean;
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
      confirmText,
      hideHour = false,
      hideMinute = false,
      hideSecond = false,
      hourPrefix = 'Hrs',
      hourStep = 1,
      minutePrefix = 'Min',
      minuteStep = 1,
      onChange,
      onConfirm,
      secondPrefix = 'Sec',
      secondStep = 1,
      value,
      withoutAction = false,
      ...restHostProps
    } = props;
    const setters = {
      hour: setHour,
      minute: setMinute,
      second: setSecond,
    };
    const getters = {
      hour: getHour,
      minute: getMinute,
      second: getSecond,
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

    function getControlHandle(
      granularity: TimePanelMode,
      units: TimePanelUnit[] | undefined,
      steps: number,
    ) {
      if (!onChange || !units) return undefined;

      const getter = getters[granularity];
      const setter = setters[granularity];

      return () => {
        if (!value) {
          const target = startOf(getNow(), 'day');

          onChange(target);

          return;
        }

        const nextIndex = (getter(value) + steps) / Math.abs(steps);
        const guardedNextIndex =
          nextIndex >= 0 ? nextIndex : units.length + nextIndex;
        const newUnitIndex = guardedNextIndex % units.length;
        const newUnit = units[newUnitIndex].value;
        const target = setter(value, newUnit);

        onChange(target);
      };
    }

    function getChangeHandle(granularity: 'hour' | 'minute' | 'second') {
      if (!onChange) return undefined;

      const setter = setters[granularity];

      const currentValue = value || startOf(getNow(), 'day');

      return (target: TimePanelUnit) => {
        const result = setter(currentValue, target.value);

        onChange(result);
      };
    }

    return (
      <div {...restHostProps} ref={ref} className={cx(classes.host, className)}>
        <div className={classes.columns}>
          {!hideHour && hourUnits && (
            <TimePanelColumn
              prefix={hourPrefix}
              units={hourUnits}
              activeUnit={activeHour}
              onChange={getChangeHandle('hour')}
              onNext={getControlHandle('hour', hourUnits, hourStep)}
              onPrev={getControlHandle('hour', hourUnits, -hourStep)}
            />
          )}
          {!hideMinute && minuteUnits && (
            <TimePanelColumn
              prefix={minutePrefix}
              units={minuteUnits}
              activeUnit={activeMinute}
              onChange={getChangeHandle('minute')}
              onNext={getControlHandle('minute', minuteUnits, minuteStep)}
              onPrev={getControlHandle('minute', minuteUnits, -minuteStep)}
            />
          )}
          {!hideSecond && secondUnits && (
            <TimePanelColumn
              prefix={secondPrefix}
              units={secondUnits}
              activeUnit={activeSecond}
              onChange={getChangeHandle('second')}
              onNext={getControlHandle('second', secondUnits, secondStep)}
              onPrev={getControlHandle('second', secondUnits, -secondStep)}
            />
          )}
        </div>
        {!withoutAction && (
          <TimePanelAction onConfirm={onConfirm} confirmText={confirmText} />
        )}
      </div>
    );
  },
);

export default TimePanel;
