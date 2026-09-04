import { inject, provide } from 'vue';
import type { ComputedRef, InjectionKey } from 'vue';
import {
  CalendarLocale,
  type CalendarMethods,
} from '@mezzanine-ui/core/calendar';

export interface CalendarConfigs extends CalendarMethods {
  /** The date format used when a consumer provides none. */
  defaultDateFormat: string;
  /** The time format used when a consumer provides none. */
  defaultTimeFormat: string;
  /**
   * The unified locale for all calendar display and value processing.
   */
  locale: string;
}

export { CalendarLocale };

/**
 * The configs are provided as a `ComputedRef` rather than a plain object so a
 * change of `methods` or `locale` reaches every calendar below the provider,
 * the way React's context value does when its `useMemo` recomputes.
 */
export const CalendarContext: InjectionKey<ComputedRef<CalendarConfigs>> =
  Symbol('MznCalendarContext');

export function provideCalendarContext(
  configs: ComputedRef<CalendarConfigs>,
): void {
  provide(CalendarContext, configs);
}

/**
 * Reads the calendar configs provided by `MznCalendarConfigProvider`.
 *
 * @example
 * ```ts
 * const calendar = useCalendarContext();
 *
 * const today = computed(() => calendar.value.getNow());
 * ```
 *
 * @see MznCalendarConfigProvider 提供 configs 的元件
 */
export function useCalendarContext(): ComputedRef<CalendarConfigs> {
  const configs = inject(CalendarContext, undefined);

  if (!configs) {
    throw new Error(
      'Cannot find values in your context. ' +
        'Make sure you use `MznCalendarConfigProvider` in your app ' +
        'and pass in one of the following as methods: `CalendarMethodsMoment`.',
    );
  }

  return configs;
}
