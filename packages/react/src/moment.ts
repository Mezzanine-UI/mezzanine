/**
 * Moment-specific entry point for Mezzanine UI React
 * Import from this path to use Moment without loading other date libraries
 *
 * @example
 * ```tsx
 * import { CalendarConfigProviderMoment, CalendarLocale } from '@mezzanine-ui/react/moment';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <CalendarConfigProviderMoment locale={CalendarLocale.ZH_TW}>
 *       {children}
 *     </CalendarConfigProviderMoment>
 *   );
 * }
 * ```
 */

export { CalendarLocale } from '@mezzanine-ui/core/calendar';
export type { CalendarLocaleValue } from '@mezzanine-ui/core/calendar';

export { default as CalendarConfigProviderMoment } from './Calendar/CalendarConfigProviderMoment';
export type { CalendarConfigProviderMomentProps } from './Calendar/CalendarConfigProviderMoment';
