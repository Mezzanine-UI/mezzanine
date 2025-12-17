'use client';

import { ReactNode } from 'react';
import { CalendarLocaleValue } from '@mezzanine-ui/core/calendar';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import CalendarConfigProvider from './CalendarContext';

export type CalendarConfigProviderLuxonProps = {
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
};

/**
 * Pre-configured CalendarConfigProvider with Luxon methods.
 * Use this component in Next.js App Router to avoid Server/Client Component boundary issues.
 */
export function CalendarConfigProviderLuxon(
  props: CalendarConfigProviderLuxonProps,
) {
  const { children, defaultDateFormat, defaultTimeFormat, locale } = props;

  return (
    <CalendarConfigProvider
      defaultDateFormat={defaultDateFormat}
      defaultTimeFormat={defaultTimeFormat}
      locale={locale}
      methods={CalendarMethodsLuxon}
    >
      {children}
    </CalendarConfigProvider>
  );
}

export default CalendarConfigProviderLuxon;
