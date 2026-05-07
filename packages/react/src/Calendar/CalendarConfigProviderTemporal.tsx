'use client';

import { ReactNode } from 'react';
import { CalendarLocaleValue } from '@mezzanine-ui/core/calendar';
import CalendarMethodsTemporal from '@mezzanine-ui/core/calendarMethodsTemporal';
import CalendarConfigProvider from './CalendarContext';

export type CalendarConfigProviderTemporalProps = {
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
 * Pre-configured CalendarConfigProvider backed by the JS-native Temporal API.
 *
 * Requires `globalThis.Temporal` to be present **on the client** before any
 * code imports `CalendarMethodsTemporal`. On runtimes that lack native
 * support (Safari, Node 22), install `@js-temporal/polyfill` as a peer
 * dependency.
 *
 * IMPORTANT: in Next.js App Router (and other RSC frameworks), default
 * layouts are Server Components — registering the polyfill at module level
 * in such a layout only runs on the server, leaving the browser without
 * `globalThis.Temporal`. Use a Client Component wrapper instead. See the
 * Calendar story docs for full setup examples (Vite/CRA vs App Router).
 *
 * @example
 * ```tsx
 * // app/temporal-polyfill.tsx (Client Component)
 * 'use client';
 * import { Temporal } from '@js-temporal/polyfill';
 * (globalThis as { Temporal?: unknown }).Temporal = Temporal;
 * export function TemporalPolyfill() { return null; }
 *
 * // app/layout.tsx
 * import { TemporalPolyfill } from './temporal-polyfill';
 * import { CalendarConfigProviderTemporal, CalendarLocale } from '@mezzanine-ui/react/temporal';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html><body>
 *       <TemporalPolyfill />
 *       <CalendarConfigProviderTemporal locale={CalendarLocale.ZH_TW}>
 *         {children}
 *       </CalendarConfigProviderTemporal>
 *     </body></html>
 *   );
 * }
 * ```
 */
export function CalendarConfigProviderTemporal(
  props: CalendarConfigProviderTemporalProps,
) {
  const { children, defaultDateFormat, defaultTimeFormat, locale } = props;

  return (
    <CalendarConfigProvider
      defaultDateFormat={defaultDateFormat}
      defaultTimeFormat={defaultTimeFormat}
      locale={locale}
      methods={CalendarMethodsTemporal}
    >
      {children}
    </CalendarConfigProvider>
  );
}

export default CalendarConfigProviderTemporal;
