/**
 * Temporal-specific entry point for Mezzanine UI React.
 * Import from this path to use the JS-native Temporal API without loading
 * any other date library (moment / dayjs / luxon).
 *
 * Runtime requirement: `globalThis.Temporal` must be available **on the
 * client** before any import of `CalendarMethodsTemporal`. On runtimes that
 * lack native support (Safari, Node 22), install `@js-temporal/polyfill` as
 * a peer dependency and register it from a Client Component side-effect.
 *
 * @example Vite / CRA — register at the client entry
 * ```tsx
 * // main.tsx
 * import { Temporal } from '@js-temporal/polyfill';
 * (globalThis as { Temporal?: unknown }).Temporal = Temporal;
 *
 * import { CalendarConfigProviderTemporal, CalendarLocale } from '@mezzanine-ui/react/temporal';
 * ```
 *
 * @example Next.js App Router — Server Component layouts cannot register
 * the polyfill for the browser, so wrap it in a Client Component module:
 * ```tsx
 * // app/temporal-polyfill.tsx
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

export { CalendarLocale } from '@mezzanine-ui/core/calendar';
export type { CalendarLocaleValue } from '@mezzanine-ui/core/calendar';

export { default as CalendarConfigProviderTemporal } from './Calendar/CalendarConfigProviderTemporal';
export type { CalendarConfigProviderTemporalProps } from './Calendar/CalendarConfigProviderTemporal';
