import { useEffect, useState } from 'react';
import { DateType, CalendarMode } from '@mezzanine-ui/core/calendar';
import { useCalendarControlModifiers } from './useCalendarControlModifiers';
import { useCalendarModeStack } from './useCalendarModeStack';

export function useCalendarControls(
  referenceDateProp: DateType,
  mode?: CalendarMode,
) {
  const [referenceDate, setReferenceDate] = useState(referenceDateProp);

  useEffect(() => {
    setReferenceDate(referenceDateProp);
  }, [referenceDateProp]);

  const {
    currentMode,
    pushModeStack,
    popModeStack,
  } = useCalendarModeStack(mode || 'day');

  const modifierGroup = useCalendarControlModifiers();

  const onPrev = () => {
    const [handleMinus] = modifierGroup[currentMode];

    setReferenceDate(handleMinus(referenceDate));
  };

  const onNext = () => {
    const [, handleAdd] = modifierGroup[currentMode];

    setReferenceDate(handleAdd(referenceDate));
  };

  const onMonthControlClick = () => pushModeStack('month');

  const onYearControlClick = () => pushModeStack('year');

  return {
    currentMode,
    onMonthControlClick,
    onNext,
    onPrev,
    onYearControlClick,
    popModeStack,
    referenceDate,
    updateReferenceDate: setReferenceDate,
  };
}
