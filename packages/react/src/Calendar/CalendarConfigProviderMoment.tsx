'use client';

import { ReactNode } from 'react';
import { CalendarLocaleValue } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import CalendarConfigProvider from './CalendarContext';

export type CalendarConfigProviderMomentProps = {
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
 * Pre-configured CalendarConfigProvider with Moment methods.
 * Use this component in Next.js App Router to avoid Server/Client Component boundary issues.
 *
 * @example
 * ```tsx
 * // In your Next.js app/layout.tsx
 * import { CalendarConfigProviderMoment, CalendarLocale } from '@mezzanine-ui/react';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <CalendarConfigProviderMoment locale={CalendarLocale.ZH_TW}>
 *           {children}
 *         </CalendarConfigProviderMoment>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function CalendarConfigProviderMoment(
  props: CalendarConfigProviderMomentProps,
) {
  const { children, defaultDateFormat, defaultTimeFormat, locale } = props;

  return (
    <CalendarConfigProvider
      defaultDateFormat={defaultDateFormat}
      defaultTimeFormat={defaultTimeFormat}
      locale={locale}
      methods={CalendarMethodsMoment}
    >
      {children}
    </CalendarConfigProvider>
  );
}

export default CalendarConfigProviderMoment;
