import type { CalendarMode, DateType } from './calendar';
import type { CalendarMethods } from './typings';

/**
 * Custom label of the calendar footer control.
 * - `string` — Used in every mode.
 * - `Partial<Record<CalendarMode, string>>` — Overrides the listed modes; the
 *   others keep their default label. Prefer this in pickers, whose footer
 *   follows the panel the user drilled down to.
 */
export type CalendarFooterControlChildren =
  | string
  | Partial<Record<CalendarMode, string>>;

/** The calendar methods needed to resolve the footer control target. */
export type CalendarFooterControlMethods = Pick<
  CalendarMethods,
  | 'getCurrentHalfYearFirstDate'
  | 'getCurrentMonthFirstDate'
  | 'getCurrentQuarterFirstDate'
  | 'getCurrentWeekFirstDate'
  | 'getCurrentYearFirstDate'
  | 'getNow'
  | 'setHour'
  | 'setMillisecond'
  | 'setMinute'
  | 'setSecond'
>;

/** The disabled predicates a calendar may receive. */
export interface CalendarFooterControlDisabledPredicates {
  /** Whether the date is disabled. */
  isDateDisabled?: (date: DateType) => boolean;
  /** Whether the half year of the date is disabled. */
  isHalfYearDisabled?: (date: DateType) => boolean;
  /** Whether the month of the date is disabled. */
  isMonthDisabled?: (date: DateType) => boolean;
  /** Whether the quarter of the date is disabled. */
  isQuarterDisabled?: (date: DateType) => boolean;
  /** Whether the week of the date is disabled. */
  isWeekDisabled?: (date: DateType) => boolean;
  /** Whether the year of the date is disabled. */
  isYearDisabled?: (date: DateType) => boolean;
}

/** The default footer control label of each mode. */
export const calendarFooterControlDefaultLabels: Readonly<
  Record<CalendarMode, string>
> = {
  day: 'Today',
  'half-year': 'This half year',
  month: 'This month',
  quarter: 'This quarter',
  week: 'This week',
  year: 'This year',
};

/**
 * Resolve the footer control label of a mode.
 *
 * @param mode - The mode of the displayed panel
 * @param children - The custom label, if any
 * @returns The custom label, or the default label of the mode
 */
export function getCalendarFooterControlLabel(
  mode: CalendarMode,
  children?: CalendarFooterControlChildren,
): string {
  if (typeof children === 'string') {
    return children;
  }

  return children?.[mode] ?? calendarFooterControlDefaultLabels[mode];
}

/**
 * Resolve the date the footer control selects: the start of the current period.
 *
 * @param mode - The mode of the displayed panel
 * @param methods - The calendar methods
 * @param weekLocale - The locale deciding the first day of the week
 * @returns The target date
 */
export function getCalendarFooterControlTarget(
  mode: CalendarMode,
  methods: CalendarFooterControlMethods,
  weekLocale: string,
): DateType {
  const now = methods.getNow();

  switch (mode) {
    case 'week':
      return methods.getCurrentWeekFirstDate(now, weekLocale);
    case 'month':
      return methods.getCurrentMonthFirstDate(now);
    case 'year':
      return methods.getCurrentYearFirstDate(now);
    case 'quarter':
      return methods.getCurrentQuarterFirstDate(now);
    case 'half-year':
      return methods.getCurrentHalfYearFirstDate(now);
    case 'day':
    default:
      return methods.setMillisecond(
        methods.setSecond(methods.setMinute(methods.setHour(now, 0), 0), 0),
        0,
      );
  }
}

/**
 * Whether the footer control target is disabled. The predicates combine the
 * same way the cells of each mode combine them, so the shortcut can never
 * select a period that the board shows as disabled.
 *
 * @param mode - The mode of the displayed panel
 * @param target - The date the footer control would select
 * @param predicates - The disabled predicates of the calendar
 * @returns `true` when the target must not be selected
 */
export function isCalendarFooterControlDisabled(
  mode: CalendarMode,
  target: DateType,
  predicates: CalendarFooterControlDisabledPredicates,
): boolean {
  const {
    isDateDisabled,
    isHalfYearDisabled,
    isMonthDisabled,
    isQuarterDisabled,
    isWeekDisabled,
    isYearDisabled,
  } = predicates;

  switch (mode) {
    case 'day':
      return Boolean(
        isYearDisabled?.(target) ||
          isMonthDisabled?.(target) ||
          isDateDisabled?.(target),
      );
    case 'week':
      return Boolean(
        isYearDisabled?.(target) ||
          isMonthDisabled?.(target) ||
          isWeekDisabled?.(target),
      );
    case 'month':
      return Boolean(isYearDisabled?.(target) || isMonthDisabled?.(target));
    case 'year':
      return Boolean(isYearDisabled?.(target));
    case 'quarter':
      return Boolean(isQuarterDisabled?.(target));
    case 'half-year':
      return Boolean(isHalfYearDisabled?.(target));
    default:
      return false;
  }
}
