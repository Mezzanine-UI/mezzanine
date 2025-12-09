'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import { CalendarMethods } from '@mezzanine-ui/core/calendar';

export interface CalendarConfigs extends CalendarMethods {
  defaultDateFormat: string;
  defaultTimeFormat: string;
  /**
   * The unified locale for all calendar display and value processing.
   */
  locale: string;
  /**
   * @deprecated Use `locale` instead. Will be removed in future versions.
   */
  displayMonthLocale: string;
  /**
   * @deprecated Use `locale` instead. Will be removed in future versions.
   */
  displayWeekDayLocale: string;
  /**
   * @deprecated Use `locale` instead. Will be removed in future versions.
   */
  valueLocale: string;
}

export type CalendarConfigProviderProps = {
  children?: ReactNode;
  defaultDateFormat?: string;
  defaultTimeFormat?: string;
  /**
   * @deprecated Use `locale` instead. Will be removed in future versions.
   */
  displayMonthLocale?: string;
  /**
   * @deprecated Use `locale` instead. Will be removed in future versions.
   */
  displayWeekDayLocale?: string;
  /**
   * The unified locale for all calendar display and value processing.
   * This determines the first day of week, month names, weekday names, etc.
   * Examples: 'en-us', 'zh-tw', 'de-de', 'fr-fr'
   */
  locale?: string;
  methods: CalendarMethods;
  /**
   * @deprecated Use `locale` instead. Will be removed in future versions.
   */
  valueLocale?: string;
};

export const CalendarContext = createContext<CalendarConfigs | undefined>(
  undefined,
);

export function useCalendarContext() {
  const configs = useContext(CalendarContext);

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
    displayMonthLocale,
    displayWeekDayLocale,
    locale = 'en-us',
    methods,
    valueLocale,
  } = props;

  // Use unified locale, but allow legacy props to override for backward compatibility
  const resolvedLocale =
    valueLocale ?? displayWeekDayLocale ?? displayMonthLocale ?? locale;

  const context = useMemo(
    () => ({
      ...methods,
      defaultDateFormat,
      defaultTimeFormat,
      locale: resolvedLocale,
      // Keep deprecated props for backward compatibility, all pointing to the same locale
      displayMonthLocale: resolvedLocale,
      displayWeekDayLocale: resolvedLocale,
      valueLocale: resolvedLocale,
    }),
    [methods, defaultDateFormat, defaultTimeFormat, resolvedLocale],
  );

  return (
    <CalendarContext.Provider value={context}>
      {children}
    </CalendarContext.Provider>
  );
}

export default CalendarConfigProvider;
