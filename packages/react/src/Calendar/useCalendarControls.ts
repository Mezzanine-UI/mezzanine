'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateType, CalendarMode } from '@mezzanine-ui/core/calendar';
import { useCalendarControlModifiers } from './useCalendarControlModifiers';
import { useCalendarModeStack } from './useCalendarModeStack';

/**
 * 管理日曆導航控制項狀態的 Hook。
 *
 * 維護目前顯示的參考日期（`referenceDate`）與顯示模式（`currentMode`），
 * 並提供上一頁、下一頁、雙箭頭跳轉以及切換至月份／年份選擇模式等操作。
 *
 * @example
 * ```tsx
 * import { useCalendarControls } from '@mezzanine-ui/react';
 *
 * const {
 *   currentMode, referenceDate,
 *   onPrev, onNext, onMonthControlClick, onYearControlClick, popModeStack,
 * } = useCalendarControls(today, 'day');
 * ```
 *
 * @see {@link Calendar} 搭配的元件
 */
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
