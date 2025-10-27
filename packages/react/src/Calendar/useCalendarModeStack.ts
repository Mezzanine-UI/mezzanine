'use client';

import { CalendarMode } from '@mezzanine-ui/core/calendar';
import { useState } from 'react';

export function useCalendarModeStack(mode: CalendarMode) {
  const [modeStack, setModeStack] = useState<CalendarMode[]>([mode]);
  const [currentMode] = modeStack;

  const pushModeStack = (newMode: CalendarMode) =>
    setModeStack((prev) => [newMode, ...prev]);
  const popModeStack = () =>
    setModeStack((prev) =>
      prev.length > 1 ? prev.slice(1, prev.length) : prev,
    );

  return {
    currentMode,
    pushModeStack,
    popModeStack,
  };
}
