/**
 * Dayjs-specific entry point for Mezzanine UI React
 * Import from this path to use Dayjs without loading other date libraries
 *
 * @example
 * ```tsx
 * import { CalendarConfigProviderDayjs, CalendarLocale } from '@mezzanine-ui/react/dayjs';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <CalendarConfigProviderDayjs locale={CalendarLocale.ZH_TW}>
 *       {children}
 *     </CalendarConfigProviderDayjs>
 *   );
 * }
 * ```
 */

export { CalendarLocale } from '@mezzanine-ui/core/calendar';
export type { CalendarLocaleValue } from '@mezzanine-ui/core/calendar';

export { default as CalendarConfigProviderDayjs } from './Calendar/CalendarConfigProviderDayjs';
export type { CalendarConfigProviderDayjsProps } from './Calendar/CalendarConfigProviderDayjs';
