'use client';

import { ReactNode } from 'react';
import { CalendarLocaleValue } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarConfigProvider from './CalendarContext';

export type CalendarConfigProviderDayjsProps = {
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
 * Pre-configured CalendarConfigProvider with Dayjs methods.
 * Use this component in Next.js App Router to avoid Server/Client Component boundary issues.
 *
 * @example
 * ```tsx
 * // In your Next.js app/layout.tsx
 * import { CalendarConfigProviderDayjs, CalendarLocale } from '@mezzanine-ui/react';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <CalendarConfigProviderDayjs locale={CalendarLocale.ZH_TW}>
 *           {children}
 *         </CalendarConfigProviderDayjs>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function CalendarConfigProviderDayjs(
  props: CalendarConfigProviderDayjsProps,
) {
  const { children, defaultDateFormat, defaultTimeFormat, locale } = props;

  return (
    <CalendarConfigProvider
      defaultDateFormat={defaultDateFormat}
      defaultTimeFormat={defaultTimeFormat}
      locale={locale}
      methods={CalendarMethodsDayjs}
    >
      {children}
    </CalendarConfigProvider>
  );
}

export default CalendarConfigProviderDayjs;
