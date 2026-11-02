'use client';

import { createContext, ReactNode, use, useMemo } from 'react';
import {
  CalendarLocale,
  CalendarLocaleValue,
  CalendarMethods,
  normalizeLocale,
} from '@mezzanine-ui/core/calendar';

export interface CalendarConfigs extends CalendarMethods {
  defaultDateFormat: string;
  defaultTimeFormat: string;
  /**
   * The unified locale for all calendar display and value processing.
   */
  locale: string;
}

export type CalendarConfigProviderProps = {
  children?: ReactNode;
  defaultDateFormat?: string;
  defaultTimeFormat?: string;
  /**
   * The unified locale for all calendar display and value processing.
   * This determines the first day of week, month names, weekday names, etc.
   * Use CalendarLocale enum for type-safe locale values.
   * @example CalendarLocale.EN_US, CalendarLocale.ZH_TW, CalendarLocale.DE_DE
   * @default CalendarLocale.EN_US
   */
  locale?: CalendarLocaleValue;
  methods: CalendarMethods;
};

export { CalendarLocale };

export const CalendarContext = createContext<CalendarConfigs | undefined>(
  undefined,
);

export function useCalendarContext() {
  const configs = use(CalendarContext);

  if (!configs) {
    throw new Error(
      'Cannot find values in your context. ' +
        'Make sure you use `CalendarConfigProvider` in your app ' +
        'and pass in one of the following as methods: `CalendarMethodsMoment`.',
    );
  }

  return configs;
}

function CalendarConfigProvider(props: CalendarConfigProviderProps) {
  const {
    children,
    defaultDateFormat = 'YYYY-MM-DD',
    defaultTimeFormat = 'HH:mm:ss',
    locale = CalendarLocale.EN_US,
    methods,
  } = props;

  const resolvedLocale = normalizeLocale(locale);

  const context = useMemo(
    () => ({
      ...methods,
      defaultDateFormat,
      defaultTimeFormat,
      locale: resolvedLocale,
    }),
    [methods, defaultDateFormat, defaultTimeFormat, resolvedLocale],
  );

  return <CalendarContext value={context}>{children}</CalendarContext>;
}

export default CalendarConfigProvider;
