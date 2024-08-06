import { useCallback, useEffect, useState } from 'react';
import {
  DateType,
  CalendarMode,
  calendarYearModuler,
} from '@mezzanine-ui/core/calendar';
import { useCalendarControlModifiers } from '../Calendar/useCalendarControlModifiers';
import { useCalendarContext } from '../Calendar/CalendarContext';
import { useCalendarModeStack } from '../Calendar';

export function useDateRangeCalendarControls(
  referenceDate: DateType,
  mode: CalendarMode,
) {
  const { addMonth, addYear } = useCalendarContext();
  const modifierGroup = useCalendarControlModifiers();

  const { currentMode, popModeStack, pushModeStack } =
    useCalendarModeStack(mode);

  const getAdder = useCallback(
    (calendar: 0 | 1) => {
      if (mode === 'year') {
        return (target: DateType) =>
          addYear(
            target,
            calendar ? -calendarYearModuler : calendarYearModuler,
          );
      }

      if (mode === 'month') {
        return (target: DateType) => addYear(target, calendar ? -1 : 1);
      }

      return (target: DateType) => addMonth(target, calendar ? -1 : 1);
    },
    [addYear, addMonth, currentMode],
  );

  const [referenceDates, setReferenceDates] = useState(() => {
    const adder = getAdder(0);

    return [referenceDate, adder(referenceDate)];
  });

  useEffect(() => {
    setReferenceDates(() => {
      const adder = getAdder(0);

      return [referenceDate, adder(referenceDate)];
    });
  }, [referenceDate]);

  const updateFirstReferenceDate = useCallback(
    (date: DateType) => {
      const adder = getAdder(0);

      setReferenceDates([date, adder(date)]);
    },
    [addMonth],
  );

  const updateSecondReferenceDate = useCallback(
    (date: DateType) => {
      const adder = getAdder(1);

      setReferenceDates([adder(date), date]);
    },
    [addMonth],
  );

  const onPrevFactory = (target: 0 | 1) => () => {
    const [handleMinus] = modifierGroup[currentMode];

    const newAnchor = handleMinus(referenceDates[target]);
    const newDates = [...referenceDates];

    newDates[target] = newAnchor;

    if (currentMode === mode) {
      const adder = getAdder(target);
      const another = adder(newAnchor);
      const anotherIndex = Math.abs(target - 1);

      newDates[anotherIndex] = another;
    }

    setReferenceDates(newDates);
  };

  const onNextFactory = (target: 0 | 1) => () => {
    const [, handleAdd] = modifierGroup[currentMode];

    const newAnchor = handleAdd(referenceDates[target]);
    const newDates = [...referenceDates];

    newDates[target] = newAnchor;

    if (currentMode === mode) {
      const adder = getAdder(target);
      const another = adder(newAnchor);
      const anotherIndex = Math.abs(target - 1);

      newDates[anotherIndex] = another;
    }

    setReferenceDates(newDates);
  };

  const onMonthControlClick = () => pushModeStack('month');

  const onYearControlClick = () => pushModeStack('year');

  return {
    currentMode,
    onFirstNext: onNextFactory(0),
    onFirstPrev: onPrevFactory(0),
    onMonthControlClick,
    onSecondNext: onNextFactory(1),
    onSecondPrev: onPrevFactory(1),
    onYearControlClick,
    popModeStack,
    referenceDates,
    updateFirstReferenceDate,
    updateSecondReferenceDate,
  };
}
