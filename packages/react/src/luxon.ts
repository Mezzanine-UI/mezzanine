/**
 * Luxon-specific entry point for Mezzanine UI React
 * Import from this path to use Luxon without loading other date libraries
 *
 * @example
 * ```tsx
 * import { CalendarConfigProviderLuxon, CalendarLocale } from '@mezzanine-ui/react/luxon';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <CalendarConfigProviderLuxon locale={CalendarLocale.ZH_TW}>
 *       {children}
 *     </CalendarConfigProviderLuxon>
 *   );
 * }
 * ```
 */

export { CalendarLocale } from '@mezzanine-ui/core/calendar';
export type { CalendarLocaleValue } from '@mezzanine-ui/core/calendar';

export { default as CalendarConfigProviderLuxon } from './Calendar/CalendarConfigProviderLuxon';
export type { CalendarConfigProviderLuxonProps } from './Calendar/CalendarConfigProviderLuxon';
