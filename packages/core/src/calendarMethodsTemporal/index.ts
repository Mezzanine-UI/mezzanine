/**
 * CalendarMethodsTemporal — JS-native Temporal implementation of CalendarMethods.
 *
 * Wire format: ISO 8601 string (matches the moment/dayjs adapters, NOT the
 * `Temporal.PlainDateTime#toString()` form). The internal representation is
 * `Temporal.ZonedDateTime` in the system time zone, mirroring how dayjs/moment
 * default to local time when reading/writing ISO strings.
 *
 * Locale week support: uses `Intl.Locale(locale).weekInfo` (Stage 3 / widely
 * available) to determine the first day of week and minimal days in week 1.
 * Falls back to the static ISO_WEEK_LOCALES set when `weekInfo` is missing
 * from the runtime.
 *
 * Polyfill: this module relies on `globalThis.Temporal`. Apps that need to
 * support Safari or Node SSR must install `@js-temporal/polyfill` and
 * register it on `globalThis` from a Client Component (or equivalent client
 * entry point) BEFORE this module is imported:
 *
 *   import { Temporal } from '@js-temporal/polyfill';
 *   (globalThis as { Temporal?: unknown }).Temporal = Temporal;
 *
 * If Temporal is not present at the time any method is invoked, the call
 * throws with the same installation guide.
 */

import range from 'lodash/range';
import chunk from 'lodash/chunk';
import type { Temporal as TemporalType } from '@js-temporal/polyfill';
import { CalendarMethods as CalendarMethodsType } from '../calendar/typings';
import { isISOWeekLocale } from '../calendar/calendar';
import {
  applyParseRegex,
  buildParseRegex,
  formatTokens,
  ParsedFields,
} from './tokens';

type ZonedDateTime = TemporalType.ZonedDateTime;
type PlainDate = TemporalType.PlainDate;

interface TemporalGlobal {
  Temporal: typeof TemporalType;
}

/**
 * Resolve the active Temporal namespace. Throws a helpful installation
 * message if the polyfill (or native API) is unavailable.
 */
function getTemporal(): typeof TemporalType {
  const globalRef = globalThis as Partial<TemporalGlobal>;
  if (!globalRef.Temporal) {
    throw new Error(
      '[@mezzanine-ui/core] CalendarMethodsTemporal requires the JS Temporal API. ' +
        'Install `@js-temporal/polyfill` and register it on globalThis at your app entry, ' +
        'BEFORE any code imports CalendarMethodsTemporal:\n' +
        '  import { Temporal } from "@js-temporal/polyfill";\n' +
        '  (globalThis as { Temporal?: unknown }).Temporal = Temporal;\n' +
        'Or run on a runtime with native Temporal support ' +
        '(Chrome 144+, Firefox 139+, Node 24+ with --harmony-temporal).',
    );
  }
  return globalRef.Temporal;
}

interface WeekInfo {
  /** ISO 1=Mon..7=Sun. */
  firstDay: number;
  minimalDays: number;
  weekend: number[];
}

const weekInfoCache = new Map<string, WeekInfo>();

/**
 * Best-effort default for `minimalDays` on runtimes whose
 * `Intl.Locale#weekInfo` exposes `firstDay`/`weekend` but not `minimalDays`
 * (older V8 versions, Safari incomplete impls). The static
 * `ISO_WEEK_LOCALES` set is the same source the other adapters use, so
 * deferring to it here keeps Temporal's ISO detection consistent with
 * dayjs/moment when the runtime is partially equipped.
 *
 * Variant-aware: the static set lists country variants like `de-de` and
 * the language code `de`, but not every variant. For `de-AT` / `fr-CH`
 * etc. we fall back to the language-only lookup so ISO inheritance is
 * preserved when CLDR `minimalDays` is missing from the runtime.
 */
function defaultMinimalDays(locale: string): number {
  if (isISOWeekLocale(locale)) return 4;
  const language = locale.split('-')[0].toLowerCase();
  if (
    language &&
    language !== locale.toLowerCase() &&
    isISOWeekLocale(language)
  ) {
    return 4;
  }
  return 1;
}

/**
 * Read locale week info from `Intl.Locale#weekInfo`. Falls back to the
 * mezzanine ISO_WEEK_LOCALES set when the runtime lacks weekInfo support
 * entirely OR when the returned object is missing `minimalDays`.
 */
function getWeekInfo(locale: string): WeekInfo {
  const cached = weekInfoCache.get(locale);
  if (cached) return cached;

  let info: WeekInfo;
  try {
    const intlLocale = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: Partial<WeekInfo>;
      getWeekInfo?: () => Partial<WeekInfo>;
    };
    const raw = intlLocale.weekInfo ?? intlLocale.getWeekInfo?.();
    if (raw && typeof raw.firstDay === 'number') {
      info = {
        firstDay: raw.firstDay,
        // Trust the runtime's firstDay (fresher than the static set and
        // covers all 7 weekdays), but fall back to the static set for
        // minimalDays so ISO locales stay classified as ISO when the
        // runtime omits the field.
        minimalDays:
          typeof raw.minimalDays === 'number'
            ? raw.minimalDays
            : defaultMinimalDays(locale),
        weekend: raw.weekend ?? [6, 7],
      };
    } else {
      throw new Error('weekInfo unavailable');
    }
  } catch {
    info = isISOWeekLocale(locale)
      ? { firstDay: 1, minimalDays: 4, weekend: [6, 7] }
      : { firstDay: 7, minimalDays: 1, weekend: [6, 7] };
  }

  weekInfoCache.set(locale, info);
  return info;
}

/**
 * Whether a locale follows ISO 8601 week rules (Monday-first AND week 1
 * contains at least 4 days of the new year).
 *
 * Used as the fast-path predicate for picking Temporal's native
 * `weekOfYear` / `yearOfWeek` (which are ISO-defined). For non-ISO Monday-
 * first locales such as `en-AU`, `en-NZ`, `ar-AE`, `zh-CN` (firstDay=1 but
 * minimalDays=1), the locale algorithm in `getLocaleWeekInfo` is required —
 * Temporal's native week math would yield wrong results around year ends.
 */
function usesISOWeekRules(locale: string): boolean {
  const info = getWeekInfo(locale);
  return info.firstDay === 1 && info.minimalDays === 4;
}

const systemTimeZone = (): string =>
  getTemporal().Now.zonedDateTimeISO().timeZoneId;

/**
 * Parse an ISO 8601 string into a ZonedDateTime in the system timezone.
 * Accepts inputs with `Z` suffix, with offset, or naked PlainDateTime form.
 */
function parseISO(value: string): ZonedDateTime {
  const Temporal = getTemporal();
  const tz = systemTimeZone();

  try {
    return Temporal.Instant.from(value).toZonedDateTimeISO(tz);
  } catch {
    // Naked datetime / partial form — fall back to PlainDateTime semantics.
  }

  try {
    return Temporal.PlainDateTime.from(value).toZonedDateTime(tz);
  } catch {
    return Temporal.PlainDate.from(value)
      .toPlainDateTime(Temporal.PlainTime.from('00:00:00'))
      .toZonedDateTime(tz);
  }
}

/** Round-trip a ZonedDateTime back to UTC ISO string (matches dayjs/moment wire format). */
function toISO(value: ZonedDateTime): string {
  return value.toInstant().toString();
}

const isoDow = (zdt: ZonedDateTime): number => zdt.dayOfWeek;

/**
 * Move the given date back to the start of the week as defined by the locale.
 * `firstDay` follows ISO numbering (1=Mon..7=Sun).
 */
function startOfWeekDate(date: PlainDate, firstDay: number): PlainDate {
  const offset = (date.dayOfWeek - firstDay + 7) % 7;
  return date.subtract({ days: offset });
}

/**
 * Compute the locale-aware week number for a given date using the standard
 * CLDR/ICU algorithm: week 1 of year Y is the week containing Jan `minimalDays` of Y.
 */
function getLocaleWeekInfo(
  zdt: ZonedDateTime,
  locale: string,
): { week: number; weekYear: number } {
  const Temporal = getTemporal();
  const { firstDay, minimalDays } = getWeekInfo(locale);
  const date = zdt.toPlainDate();
  const thisWeekStart = startOfWeekDate(date, firstDay);

  let year = date.year;

  const week1StartFor = (y: number): PlainDate =>
    startOfWeekDate(
      Temporal.PlainDate.from({
        year: y,
        month: 1,
        day: minimalDays,
      }),
      firstDay,
    );

  let week1Start = week1StartFor(year);

  if (Temporal.PlainDate.compare(thisWeekStart, week1Start) < 0) {
    year -= 1;
    week1Start = week1StartFor(year);
  } else {
    const nextYearWeek1 = week1StartFor(year + 1);
    if (Temporal.PlainDate.compare(thisWeekStart, nextYearWeek1) >= 0) {
      year += 1;
      week1Start = nextYearWeek1;
    }
  }

  const daysDiff = thisWeekStart.since(week1Start, {
    largestUnit: 'days',
  }).days;
  return {
    week: Math.floor(daysDiff / 7) + 1,
    weekYear: year,
  };
}

/** Cached Intl formatters keyed by `${locale}|${kind}`. */
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let fmt = formatterCache.get(key);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(key, fmt);
  }
  return fmt;
}

function intlMonthNames(locale: string, width: 'short' | 'long'): string[] {
  // Force Gregorian — locales whose default Intl calendar is non-Gregorian
  // (fa-IR → Persian solar Hijri, others may be Buddhist / Hijri / Japanese)
  // would otherwise emit month names from a different calendar system while
  // our Temporal date math is ISO/Gregorian, producing wrong labels.
  const fmt = getFormatter(locale, { month: width, calendar: 'gregory' });
  return range(0, 12).map((m) => {
    const date = new Date(Date.UTC(2024, m, 15));
    return fmt.format(date);
  });
}

function intlWeekdayNames(
  locale: string,
  width: 'short' | 'long' | 'narrow',
): string[] {
  // 2024-01-07 is Sunday; subsequent days run through Saturday.
  const fmt = getFormatter(locale, {
    weekday: width,
    timeZone: 'UTC',
    calendar: 'gregory',
  });
  return range(0, 7).map((d) => {
    const date = new Date(Date.UTC(2024, 0, 7 + d));
    return fmt.format(date);
  });
}

function startOf(zdt: ZonedDateTime, granularity: string): ZonedDateTime {
  const lower = granularity.toLowerCase();

  if (lower === 'year' || lower === 'years' || lower === 'y') {
    return zdt.with({
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
  }
  if (lower === 'month' || lower === 'months') {
    return zdt.with({
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
  }
  if (lower === 'quarter' || lower === 'quarters' || lower === 'q') {
    const quarterStartMonth = Math.floor((zdt.month - 1) / 3) * 3 + 1;
    return zdt.with({
      month: quarterStartMonth,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
  }
  if (
    lower === 'week' ||
    lower === 'weeks' ||
    lower === 'isoweek' ||
    lower === 'isoweeks'
  ) {
    // Match dayjs/moment defaults when no locale is in scope:
    //   `isoWeek` → always Monday-first (firstDay = 1)
    //   `week`    → Sunday-first by default (firstDay = 7)
    // Locale-aware week bucketing happens through getCurrentWeekFirstDate,
    // which is the path mezzanine components actually use.
    const isoWeekMode = lower.startsWith('isoweek');
    const firstDay = isoWeekMode ? 1 : 7;
    const offset = (zdt.dayOfWeek - firstDay + 7) % 7;
    return zdt.subtract({ days: offset }).with({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
  }
  if (
    lower === 'day' ||
    lower === 'days' ||
    lower === 'd' ||
    lower === 'date'
  ) {
    return zdt.with({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
  }
  if (lower === 'hour' || lower === 'hours' || lower === 'h') {
    return zdt.with({
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
  }
  if (lower === 'minute' || lower === 'minutes') {
    return zdt.with({
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
  }
  if (lower === 'second' || lower === 'seconds' || lower === 's') {
    return zdt.with({
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
  }
  // Unknown granularity — return as-is (matches dayjs/moment behavior).
  return zdt;
}

function dayOfYear(zdt: ZonedDateTime): number {
  return zdt.dayOfYear;
}

const CalendarMethodsTemporal: CalendarMethodsType = {
  getFirstDayOfWeek: (locale) => {
    const fd = getWeekInfo(locale).firstDay;
    // ISO 1..7 → mezzanine 0..6 (0=Sun, 1=Mon ..)
    return fd === 7 ? 0 : fd;
  },
  // Note: this differs from the global `isISOWeekLocale` (a static set in
  // calendar/calendar.ts shared with the dayjs/moment adapters). The static
  // set can disagree with CLDR `weekInfo` (e.g. it lists ar-SA as ISO, but
  // ar-SA is Sunday-first per CLDR). Inside the Temporal adapter, this
  // method reflects the same source of truth used everywhere else.
  isISOWeekLocale: usesISOWeekRules,

  getNow: () => toISO(getTemporal().Now.zonedDateTimeISO()),
  getSecond: (date) => parseISO(date).second,
  getMinute: (date) => parseISO(date).minute,
  getHour: (date) => parseISO(date).hour,
  getDate: (date) => parseISO(date).day,
  getWeek: (date, locale) => {
    if (usesISOWeekRules(locale)) {
      return parseISO(date).weekOfYear ?? 1;
    }
    return getLocaleWeekInfo(parseISO(date), locale).week;
  },
  getWeekYear: (date, locale) => {
    if (usesISOWeekRules(locale)) {
      return parseISO(date).yearOfWeek ?? parseISO(date).year;
    }
    return getLocaleWeekInfo(parseISO(date), locale).weekYear;
  },
  getWeekDay: (date) => {
    const dow = isoDow(parseISO(date));
    return dow === 7 ? 0 : dow;
  },
  getMonth: (date) => parseISO(date).month - 1,
  getYear: (date) => parseISO(date).year,
  getQuarter: (date) => Math.floor((parseISO(date).month - 1) / 3) + 1,
  getHalfYear: (date) => Math.floor((parseISO(date).month - 1) / 6) + 1,
  getWeekDayNames: (locale) => {
    // Intl returns Sunday-indexed names. Rotate left by `firstDay % 7` so the
    // array is ordered starting from the locale's first-day-of-week.
    const sundayIndexed = intlWeekdayNames(locale, 'narrow');
    const offset = getWeekInfo(locale).firstDay % 7;
    return [...sundayIndexed.slice(offset), ...sundayIndexed.slice(0, offset)];
  },
  getMonthShortName: (month, locale) => {
    return intlMonthNames(locale, 'short')[month];
  },
  getMonthShortNames: (locale) => intlMonthNames(locale, 'short'),
  getWeekends: (locale) => {
    // weekInfo.weekend lists the weekend days using ISO numbering (1=Mon..7=Sun).
    // Project that set onto the locale's first-day-rotated week positions.
    const { firstDay, weekend } = getWeekInfo(locale);
    const weekendSet = new Set(weekend);
    const result: boolean[] = [];
    for (let p = 0; p < 7; p += 1) {
      const isoDay = ((p + firstDay - 1) % 7) + 1;
      result.push(weekendSet.has(isoDay));
    }
    return result;
  },

  addHour: (date, diff) => toISO(parseISO(date).add({ hours: diff })),
  addMinute: (date, diff) => toISO(parseISO(date).add({ minutes: diff })),
  addSecond: (date, diff) => toISO(parseISO(date).add({ seconds: diff })),
  addDay: (date, diff) => toISO(parseISO(date).add({ days: diff })),
  addYear: (date, diff) => toISO(parseISO(date).add({ years: diff })),
  addMonth: (date, diff) => toISO(parseISO(date).add({ months: diff })),
  setMillisecond: (date, millisecond) =>
    toISO(parseISO(date).with({ millisecond })),
  setSecond: (date, second) => toISO(parseISO(date).with({ second })),
  setMinute: (date, minute) => toISO(parseISO(date).with({ minute })),
  setHour: (date, hour) => toISO(parseISO(date).with({ hour })),
  // Out-of-range setters: moment/dayjs normalize values like `setMonth(d, -1)`
  // (→ previous year's December) or `setDate(d, 0)` (→ last day of previous
  // month). Temporal's `with()` rejects month=0 and clamps day overflow, so
  // we route through `add()` to preserve cross-boundary semantics.
  setMonth: (date, month) => {
    const current = parseISO(date);
    return toISO(current.add({ months: month - (current.month - 1) }));
  },
  setYear: (date, year) => {
    const current = parseISO(date);
    return toISO(current.add({ years: year - current.year }));
  },
  setDate: (date, target) => {
    const current = parseISO(date);
    return toISO(current.add({ days: target - current.day }));
  },
  startOf: (target, granularity) =>
    toISO(startOf(parseISO(target), String(granularity))),

  getCurrentWeekFirstDate: (value, locale) => {
    const zdt = parseISO(value);
    const { firstDay } = getWeekInfo(locale);
    const offset = (zdt.dayOfWeek - firstDay + 7) % 7;
    return toISO(
      zdt.subtract({ days: offset }).with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      }),
    );
  },
  getCurrentMonthFirstDate: (value) =>
    toISO(
      parseISO(value).with({
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      }),
    ),
  getCurrentYearFirstDate: (value) =>
    toISO(
      parseISO(value).with({
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      }),
    ),
  getCurrentQuarterFirstDate: (value) => {
    const zdt = parseISO(value);
    const quarterStartMonth = Math.floor((zdt.month - 1) / 3) * 3 + 1;
    return toISO(
      zdt.with({
        month: quarterStartMonth,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      }),
    );
  },
  getCurrentHalfYearFirstDate: (value) => {
    const zdt = parseISO(value);
    const halfYearStartMonth = Math.floor((zdt.month - 1) / 6) * 6 + 1;
    return toISO(
      zdt.with({
        month: halfYearStartMonth,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      }),
    );
  },

  getCalendarGrid: (target, locale) => {
    const Temporal = getTemporal();
    const zdt = parseISO(target);
    const { firstDay } = getWeekInfo(locale);

    const firstOfMonth = zdt.with({ day: 1 });
    const firstDayWeekdayIso = firstOfMonth.dayOfWeek; // 1..7

    const lastDateOfPrevMonth = firstOfMonth.subtract({ days: 1 }).day;
    const lastDateOfCurrentMonth = Temporal.PlainYearMonth.from({
      year: zdt.year,
      month: zdt.month,
    }).daysInMonth;

    // How many cells from the previous month appear before day-1: the offset
    // between the first day of the month and the locale's first-day-of-week.
    const daysFromPrevMonth = (firstDayWeekdayIso - firstDay + 7) % 7;

    const totalDaysInGrid = 42;
    const daysFromNextMonth =
      totalDaysInGrid - daysFromPrevMonth - lastDateOfCurrentMonth;

    return chunk(
      [
        ...range(
          lastDateOfPrevMonth - daysFromPrevMonth + 1,
          lastDateOfPrevMonth + 1,
        ),
        ...range(1, lastDateOfCurrentMonth + 1),
        ...range(1, daysFromNextMonth + 1),
      ],
      7,
    );
  },

  isValid: (date) => {
    // Trigger the polyfill guard up-front: a missing Temporal API is an
    // environmental error that callers must see, not a "this date string
    // is invalid" answer. Only the actual parsing step is wrapped.
    getTemporal();
    try {
      parseISO(date);
      return true;
    } catch {
      return false;
    }
  },
  isBefore: (target, comparison) => {
    const Temporal = getTemporal();
    return (
      Temporal.ZonedDateTime.compare(parseISO(target), parseISO(comparison)) < 0
    );
  },
  isBetween: (value, target1, target2, granularity) => {
    const Temporal = getTemporal();
    const a = parseISO(target1);
    const b = parseISO(target2);
    const v = parseISO(value);

    // Truncate to the requested granularity so that values within the same
    // bucket compare equal (e.g. `'day'` ignores time-of-day differences).
    // Default granularity matches dayjs/moment default of `'milliseconds'`,
    // which is effectively no truncation.
    const granularityKey =
      typeof granularity === 'string' && granularity.length > 0
        ? granularity
        : 'milliseconds';
    const aT = startOf(a, granularityKey);
    const bT = startOf(b, granularityKey);
    const vT = startOf(v, granularityKey);

    const lo = Temporal.ZonedDateTime.compare(aT, bT) <= 0 ? aT : bT;
    const hi = Temporal.ZonedDateTime.compare(aT, bT) <= 0 ? bT : aT;

    // Match dayjs/moment default inclusivity `'()'` — both bounds exclusive.
    return (
      Temporal.ZonedDateTime.compare(vT, lo) > 0 &&
      Temporal.ZonedDateTime.compare(vT, hi) < 0
    );
  },
  isSameDate: (dateOne, dateTwo) => {
    const a = parseISO(dateOne);
    const b = parseISO(dateTwo);
    return a.year === b.year && a.month === b.month && a.day === b.day;
  },
  isSameWeek: (dateOne, dateTwo, locale) => {
    if (usesISOWeekRules(locale)) {
      const a = parseISO(dateOne);
      const b = parseISO(dateTwo);
      return (
        (a.yearOfWeek ?? a.year) === (b.yearOfWeek ?? b.year) &&
        (a.weekOfYear ?? 1) === (b.weekOfYear ?? 1)
      );
    }
    const a = getLocaleWeekInfo(parseISO(dateOne), locale);
    const b = getLocaleWeekInfo(parseISO(dateTwo), locale);
    return a.week === b.week && a.weekYear === b.weekYear;
  },
  isInMonth: (target, month) => parseISO(target).month === month + 1,
  isDateIncluded: (date, targets) =>
    targets.some((target) => CalendarMethodsTemporal.isSameDate(date, target)),
  isWeekIncluded: (firstDateOfWeek, targets, locale) =>
    targets.some((target) =>
      CalendarMethodsTemporal.isSameWeek(firstDateOfWeek, target, locale),
    ),
  isMonthIncluded: (date, targets) => {
    const a = parseISO(date);
    return targets.some((target) => {
      const t = parseISO(target);
      return a.year === t.year && a.month === t.month;
    });
  },
  isYearIncluded: (date, targets) => {
    const y = parseISO(date).year;
    return targets.some((target) => parseISO(target).year === y);
  },
  isQuarterIncluded: (date, targets) => {
    const a = parseISO(date);
    const q = Math.floor((a.month - 1) / 3);
    return targets.some((target) => {
      const t = parseISO(target);
      return t.year === a.year && Math.floor((t.month - 1) / 3) === q;
    });
  },
  isHalfYearIncluded: (date, targets) => {
    const a = parseISO(date);
    const h = Math.floor((a.month - 1) / 6);
    return targets.some((target) => {
      const t = parseISO(target);
      return t.year === a.year && Math.floor((t.month - 1) / 6) === h;
    });
  },

  formatToString: (locale, date, format) => {
    const isoInput =
      typeof date === 'string' ? date : (date as unknown as Date).toISOString();
    const zdt = parseISO(isoInput);
    const isoWeek = zdt.weekOfYear ?? 1;
    const isoWeekYear = zdt.yearOfWeek ?? zdt.year;
    const localeInfo = usesISOWeekRules(locale)
      ? { week: isoWeek, weekYear: isoWeekYear }
      : getLocaleWeekInfo(zdt, locale);
    const monthShorts = intlMonthNames(locale, 'short');
    const monthLongs = intlMonthNames(locale, 'long');
    const weekdayShorts = intlWeekdayNames(locale, 'short');
    const weekdayLongs = intlWeekdayNames(locale, 'long');
    const weekdayNarrows = intlWeekdayNames(locale, 'narrow');
    const sundayIndex = zdt.dayOfWeek === 7 ? 0 : zdt.dayOfWeek;

    const { firstDay } = getWeekInfo(locale);
    const localeWeekDay = (zdt.dayOfWeek - firstDay + 7) % 7;

    return formatTokens(format, {
      year: zdt.year,
      month: zdt.month,
      day: zdt.day,
      hour: zdt.hour,
      minute: zdt.minute,
      second: zdt.second,
      millisecond: zdt.millisecond,
      dayOfWeek: zdt.dayOfWeek,
      localeWeekDay,
      isoWeek,
      isoWeekYear,
      localeWeek: localeInfo.week,
      localeWeekYear: localeInfo.weekYear,
      quarter: Math.floor((zdt.month - 1) / 3) + 1,
      halfYear: zdt.month <= 6 ? 1 : 2,
      monthShort: monthShorts[zdt.month - 1],
      monthLong: monthLongs[zdt.month - 1],
      weekdayShort: weekdayShorts[sundayIndex],
      weekdayLong: weekdayLongs[sundayIndex],
      weekdayNarrow: weekdayNarrows[sundayIndex],
      dayOfYear: dayOfYear(zdt),
      unixMs: Number(zdt.epochMilliseconds),
    });
  },
  formatToISOString: (date) => toISO(parseISO(date)),

  parseFormattedValue: (text, format, locale) => {
    const Temporal = getTemporal();
    const localeNames = {
      monthShort: intlMonthNames(locale, 'short'),
      monthLong: intlMonthNames(locale, 'long'),
      weekdayShort: intlWeekdayNames(locale, 'short'),
      weekdayLong: intlWeekdayNames(locale, 'long'),
      weekdayNarrow: intlWeekdayNames(locale, 'narrow'),
    };
    const { regex, captures, tokens } = buildParseRegex(format, localeNames);
    const fields = applyParseRegex(text, regex, captures, localeNames);
    if (!fields) return undefined;

    if (!validateFields(fields, tokens)) return undefined;

    // If a token was present but couldn't be parsed (e.g. half-year out of range),
    // treat the whole parse as failed instead of silently dropping the field.
    if (tokens.has('[H]n') && fields.halfYear === undefined) return undefined;
    if (tokens.has('Q') && fields.quarter === undefined) return undefined;

    const tz = systemTimeZone();
    // ISO mode is determined by the *weekYear* token (GGGG), not the week
    // number tokens. Mixed formats like `YYYY-WW` (calendar year + ISO week)
    // would otherwise enable isoMode but lack `fields.isoWeekYear`, silently
    // dropping the parsed week number and falling through to the year-only
    // branch.
    const isoMode = tokens.has('GGGG');
    const localeMode =
      tokens.has('gggg') || tokens.has('ww') || tokens.has('w');
    const hasYear = fields.year !== undefined;
    const hasMonth = fields.month !== undefined;
    const hasDay = fields.day !== undefined;
    const hasQuarter = fields.quarter !== undefined;
    const hasHalfYear = fields.halfYear !== undefined;
    const hasWeek =
      isoMode ||
      localeMode ||
      fields.localeWeek !== undefined ||
      fields.isoWeek !== undefined;
    const hasUnixMs = fields.unixMs !== undefined;
    const hasDayOfYear = fields.dayOfYear !== undefined;

    // Unix epoch — standalone enough to derive a full datetime regardless
    // of whether other date tokens were present in the format.
    if (hasUnixMs) {
      try {
        return Temporal.Instant.fromEpochMilliseconds(
          fields.unixMs as number,
        ).toString();
      } catch {
        return undefined;
      }
    }

    // Day-of-year + year — derive the date by adding (doy-1) days to Jan 1.
    if (hasDayOfYear && hasYear && !hasMonth && !hasDay) {
      const year = fields.year as number;
      const doy = fields.dayOfYear as number;
      const jan1 = Temporal.PlainDate.from({ year, month: 1, day: 1 });
      const daysInYear = Temporal.PlainDate.from({
        year: year + 1,
        month: 1,
        day: 1,
      }).since(jan1, { largestUnit: 'days' }).days;
      if (doy < 1 || doy > daysInYear) return undefined;
      return toISO(
        jan1
          .add({ days: doy - 1 })
          .toPlainDateTime(Temporal.PlainTime.from('00:00:00'))
          .toZonedDateTime(tz),
      );
    }

    // Half-year: re-route to quarter-based normalization.
    if (hasHalfYear && hasYear && !hasMonth && !hasDay) {
      const quarter = fields.halfYear === 1 ? 1 : 3;
      return CalendarMethodsTemporal.getCurrentQuarterFirstDate(
        toISO(
          Temporal.PlainDateTime.from({
            year: fields.year as number,
            month: (quarter - 1) * 3 + 1,
            day: 1,
          }).toZonedDateTime(tz),
        ),
      );
    }

    // Week format
    if (hasWeek && (isoMode ? fields.isoWeekYear : fields.localeWeekYear)) {
      const weekYear = (
        isoMode ? fields.isoWeekYear : fields.localeWeekYear
      ) as number;
      const weekNum = isoMode ? fields.isoWeek : fields.localeWeek;
      // Reject when the weekYear token was present but the week-number
      // token was missing or unparsed. Otherwise a `gggg`-only or `GGGG`-only
      // format would propagate `undefined` into Temporal's `add({days:NaN})`
      // and throw RangeError instead of returning undefined per contract.
      if (weekNum === undefined || weekNum < 1) return undefined;

      const { firstDay, minimalDays } = isoMode
        ? { firstDay: 1, minimalDays: 4 }
        : getWeekInfo(locale);

      // Compute the actual max-week of `weekYear` instead of trusting the
      // hard-coded ceiling of 53. Dec 28 always falls into the LAST week of
      // its weekYear under ISO/CLDR rules, so its weekOfYear gives the max.
      const maxWeeks = computeMaxWeeksOfYear(
        weekYear,
        firstDay,
        minimalDays,
        isoMode,
      );
      if (weekNum > maxWeeks) return undefined;

      // Anchor: week 1 contains Jan minimalDays (or Jan 4 for ISO).
      const anchor = Temporal.PlainDate.from({
        year: weekYear,
        month: 1,
        day: minimalDays,
      });
      const week1Start = startOfWeekDate(anchor, firstDay);
      const target = week1Start.add({ days: (weekNum - 1) * 7 });
      return toISO(
        target
          .toPlainDateTime(Temporal.PlainTime.from('00:00:00'))
          .toZonedDateTime(tz),
      );
    }

    // Quarter format
    if (hasQuarter && hasYear && !hasMonth && !hasDay) {
      const quarter = fields.quarter as number;
      if (quarter < 1 || quarter > 4) return undefined;
      return toISO(
        Temporal.PlainDateTime.from({
          year: fields.year as number,
          month: (quarter - 1) * 3 + 1,
          day: 1,
        }).toZonedDateTime(tz),
      );
    }

    // Month-only — first of month.
    if (hasYear && hasMonth && !hasDay && !hasWeek && !hasQuarter) {
      const month = fields.month as number;
      if (month < 1 || month > 12) return undefined;
      return toISO(
        Temporal.PlainDateTime.from({
          year: fields.year as number,
          month,
          day: 1,
        }).toZonedDateTime(tz),
      );
    }

    // Year-only — first of year.
    if (hasYear && !hasMonth && !hasDay && !hasWeek && !hasQuarter) {
      return toISO(
        Temporal.PlainDateTime.from({
          year: fields.year as number,
          month: 1,
          day: 1,
        }).toZonedDateTime(tz),
      );
    }

    // Full date (with optional time).
    if (hasYear && hasMonth && hasDay) {
      const month = fields.month as number;
      const day = fields.day as number;
      if (month < 1 || month > 12) return undefined;
      if (day < 1 || day > 31) return undefined;

      const hour = resolveHour(fields);
      try {
        return toISO(
          Temporal.PlainDateTime.from(
            {
              year: fields.year as number,
              month,
              day,
              hour,
              minute: fields.minute ?? 0,
              second: fields.second ?? 0,
              millisecond: fields.millisecond ?? 0,
            },
            { overflow: 'reject' },
          ).toZonedDateTime(tz),
        );
      } catch {
        return undefined;
      }
    }

    // Time-only (HH:mm, HH:mm:ss, hh:mm A, …) — anchor to today's date.
    // Used by TimePicker / TimeRangePicker, which round-trip values through
    // `parseFormattedValue` with formats that contain no date tokens.
    const hasTime =
      fields.hour !== undefined ||
      fields.hour12 !== undefined ||
      fields.minute !== undefined ||
      fields.second !== undefined ||
      fields.millisecond !== undefined;
    if (
      hasTime &&
      !hasYear &&
      !hasMonth &&
      !hasDay &&
      !hasWeek &&
      !hasQuarter &&
      !hasHalfYear
    ) {
      const hour = resolveHour(fields);
      const today = Temporal.Now.zonedDateTimeISO(tz);
      try {
        return toISO(
          today.with({
            hour,
            minute: fields.minute ?? 0,
            second: fields.second ?? 0,
            millisecond: fields.millisecond ?? 0,
            microsecond: 0,
            nanosecond: 0,
          }),
        );
      } catch {
        return undefined;
      }
    }

    return undefined;
  },
};

function resolveHour(fields: ParsedFields): number {
  if (fields.hour12 !== undefined) {
    const base = fields.hour12 % 12;
    return (fields.meridiem ?? 'am') === 'pm' ? base + 12 : base;
  }
  return fields.hour ?? 0;
}

/**
 * Compute the actual maximum week number of `weekYear` for the supplied
 * locale week rule.
 *
 * For ISO 8601 (minimalDays=4), Dec 28 is guaranteed to fall in the last
 * week of its own weekYear, so Temporal's native `weekOfYear` is correct.
 *
 * For other locale rules (e.g. minimalDays=1 in en-US), Dec 28 may already
 * belong to the NEXT weekYear (en-US 2025-12-28 → 2026-W01). Instead we
 * derive the last day of `weekYear` as `week1StartFor(weekYear + 1) - 1`,
 * then count how many weeks elapse between `week1Start` of `weekYear` and
 * that last day's week start.
 */
function computeMaxWeeksOfYear(
  weekYear: number,
  firstDay: number,
  minimalDays: number,
  isoMode: boolean,
): number {
  const Temporal = getTemporal();

  if (isoMode) {
    return (
      Temporal.PlainDate.from({
        year: weekYear,
        month: 12,
        day: 28,
      }).weekOfYear ?? 52
    );
  }

  const week1Start = startOfWeekDate(
    Temporal.PlainDate.from({
      year: weekYear,
      month: 1,
      day: minimalDays,
    }),
    firstDay,
  );
  const nextYearWeek1Start = startOfWeekDate(
    Temporal.PlainDate.from({
      year: weekYear + 1,
      month: 1,
      day: minimalDays,
    }),
    firstDay,
  );
  // The last day belonging to `weekYear` sits one day before next year's
  // week 1. Count the week-buckets between week 1 of `weekYear` and the
  // bucket containing that last day.
  const lastDayOfWeekYear = nextYearWeek1Start.subtract({ days: 1 });
  const lastDayWeekStart = startOfWeekDate(lastDayOfWeekYear, firstDay);
  const daysDiff = lastDayWeekStart.since(week1Start, {
    largestUnit: 'days',
  }).days;
  return Math.floor(daysDiff / 7) + 1;
}

function validateFields(fields: ParsedFields, tokens: Set<string>): boolean {
  if (fields.month !== undefined && (fields.month < 1 || fields.month > 12)) {
    return false;
  }
  if (fields.day !== undefined && (fields.day < 1 || fields.day > 31)) {
    return false;
  }
  if (fields.hour !== undefined && (fields.hour < 0 || fields.hour > 23)) {
    return false;
  }
  if (
    fields.hour12 !== undefined &&
    (fields.hour12 < 1 || fields.hour12 > 12)
  ) {
    return false;
  }
  if (
    fields.minute !== undefined &&
    (fields.minute < 0 || fields.minute > 59)
  ) {
    return false;
  }
  if (
    fields.second !== undefined &&
    (fields.second < 0 || fields.second > 59)
  ) {
    return false;
  }
  if (
    fields.quarter !== undefined &&
    (fields.quarter < 1 || fields.quarter > 4)
  ) {
    return false;
  }
  if (
    fields.halfYear !== undefined &&
    fields.halfYear !== 1 &&
    fields.halfYear !== 2
  ) {
    return false;
  }
  void tokens;
  return true;
}

export default CalendarMethodsTemporal;
