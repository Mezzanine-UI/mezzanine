'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const onPrev = useMemo(() => {
    const modifiers = modifierGroup[currentMode].single;
    if (!modifiers) return;

    return () => {
      const [handleMinus] = modifiers;
      setReferenceDate(handleMinus(referenceDate));
    };
  }, [currentMode, modifierGroup, referenceDate]);

  const onNext = useMemo(() => {
    const modifiers = modifierGroup[currentMode].single;
    if (!modifiers) return;

    return () => {
      const [, handleAdd] = modifiers;
      setReferenceDate(handleAdd(referenceDate));
    };
  }, [currentMode, modifierGroup, referenceDate]);

  const onDoublePrev = useMemo(() => {
    const modifiers = modifierGroup[currentMode].double;
    if (!modifiers) return;

    return () => {
      const [handleMinus] = modifiers;
      setReferenceDate(handleMinus(referenceDate));
    };
  }, [currentMode, modifierGroup, referenceDate]);

  const onDoubleNext = useMemo(() => {
    const modifiers = modifierGroup[currentMode].double;
    if (!modifiers) return;

    return () => {
      const [, handleAdd] = modifiers;
      setReferenceDate(handleAdd(referenceDate));
    };
  }, [currentMode, modifierGroup, referenceDate]);

  const onMonthControlClick = useCallback(
    () => pushModeStack('month'),
    [pushModeStack],
  );

  const onYearControlClick = useCallback(
    () => pushModeStack('year'),
    [pushModeStack],
  );

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
