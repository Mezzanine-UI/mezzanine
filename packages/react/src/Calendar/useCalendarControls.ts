'use client';

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

  const { currentMode, pushModeStack, popModeStack } = useCalendarModeStack(
    mode || 'day',
  );

  const modifierGroup = useCalendarControlModifiers();

  const onPrev = () => {
    const modifiers = modifierGroup[currentMode].single;
    if (!modifiers) return;

    const [handleMinus] = modifiers;
    setReferenceDate(handleMinus(referenceDate));
  };

  const onNext = () => {
    const modifiers = modifierGroup[currentMode].single;
    if (!modifiers) return;

    const [, handleAdd] = modifiers;
    setReferenceDate(handleAdd(referenceDate));
  };

  const onDoublePrev = () => {
    const [handleMinus] = modifierGroup[currentMode].double;
    setReferenceDate(handleMinus(referenceDate));
  };

  const onDoubleNext = () => {
    const [, handleAdd] = modifierGroup[currentMode].double;
    setReferenceDate(handleAdd(referenceDate));
  };

  const onMonthControlClick = () => pushModeStack('month');

  const onYearControlClick = () => pushModeStack('year');

  return {
    currentMode,
    onMonthControlClick,
    onNext,
    onPrev,
    onDoubleNext,
    onDoublePrev,
    onYearControlClick,
    popModeStack,
    referenceDate,
    updateReferenceDate: setReferenceDate,
  };
}
