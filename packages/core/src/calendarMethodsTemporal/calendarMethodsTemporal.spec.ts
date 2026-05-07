import { Temporal } from '@js-temporal/polyfill';

// Make Temporal available on the global as if a polyfill side-effect import had run.
type TemporalGlobal = { Temporal: typeof Temporal };
(globalThis as Partial<TemporalGlobal>).Temporal = Temporal;

import { getDefaultModeFormat } from '../calendar/calendar';
import CalendarMethodsTemporal from '.';

const ZH_TW = 'zh-TW'; // Sunday-first
const EN_US = 'en-US'; // Sunday-first
const DE_DE = 'de-DE'; // Monday-first
const FA_IR = 'fa-IR'; // Saturday-first (firstDay=6), weekend=[Friday]
const AR_SA = 'ar-SA'; // Sunday-first, weekend=[Friday, Saturday]
const ZH_CN = 'zh-CN'; // Monday-first BUT minimalDays=1 (NOT ISO)
const EN_AU = 'en-AU'; // Monday-first BUT minimalDays=1 (NOT ISO)

const fixedISO = '2026-05-05T14:30:45.000Z';

describe('calendarMethodsTemporal', () => {
  describe('basic getters', () => {
    it('returns ISO 8601 string from getNow', () => {
      const now = CalendarMethodsTemporal.getNow();
      expect(typeof now).toBe('string');
      expect(() => Temporal.Instant.from(now)).not.toThrow();
    });

    it('reads numeric components in system timezone', () => {
      const date = '2026-01-15T08:30:45.123Z';
      expect(CalendarMethodsTemporal.getYear(date)).toBe(2026);
      // Month is 0-indexed for parity with moment/dayjs.
      expect(CalendarMethodsTemporal.getMonth(date)).toBe(0);
      // Day/hour/minute/second values shift with system timezone — assert they exist.
      expect(typeof CalendarMethodsTemporal.getDate(date)).toBe('number');
      expect(typeof CalendarMethodsTemporal.getHour(date)).toBe('number');
      expect(CalendarMethodsTemporal.getMinute(date)).toBe(30);
      expect(CalendarMethodsTemporal.getSecond(date)).toBe(45);
    });

    it('returns 0-indexed weekday matching moment/dayjs convention', () => {
      // 2026-05-05 is Tuesday → ISO 2 → 0-indexed 2.
      const tue = '2026-05-05T12:00:00Z';
      expect(CalendarMethodsTemporal.getWeekDay(tue)).toBe(2);
      // 2026-05-10 is Sunday → 0.
      const sun = '2026-05-10T12:00:00Z';
      expect(CalendarMethodsTemporal.getWeekDay(sun)).toBe(0);
    });

    it('computes quarter and half-year', () => {
      expect(CalendarMethodsTemporal.getQuarter('2026-04-15T12:00:00Z')).toBe(
        2,
      );
      expect(CalendarMethodsTemporal.getHalfYear('2026-04-15T12:00:00Z')).toBe(
        1,
      );
      expect(CalendarMethodsTemporal.getHalfYear('2026-08-15T12:00:00Z')).toBe(
        2,
      );
    });
  });

  describe('locale week numbering', () => {
    it('uses ISO week (Monday-first) for Monday-first locales', () => {
      // 2026-01-04 is Sunday — last day of ISO week 1 of 2026.
      const sun = '2026-01-04T12:00:00Z';
      expect(CalendarMethodsTemporal.getWeek(sun, DE_DE)).toBe(1);
      expect(CalendarMethodsTemporal.getWeekYear(sun, DE_DE)).toBe(2026);

      // 2026-01-05 (Mon) starts ISO week 2.
      const mon = '2026-01-05T12:00:00Z';
      expect(CalendarMethodsTemporal.getWeek(mon, DE_DE)).toBe(2);
    });

    it('uses locale week (Sunday-first, minimalDays=1) for en-US', () => {
      // 2026-01-01 is Thursday. Week 1 contains Jan 1.
      const jan1 = '2026-01-01T12:00:00Z';
      expect(CalendarMethodsTemporal.getWeek(jan1, EN_US)).toBe(1);
      expect(CalendarMethodsTemporal.getWeekYear(jan1, EN_US)).toBe(2026);

      // 2026-01-04 is Sunday → starts week 2 in US numbering.
      const jan4 = '2026-01-04T12:00:00Z';
      expect(CalendarMethodsTemporal.getWeek(jan4, EN_US)).toBe(2);
    });
  });

  describe('locale weekday/month names', () => {
    it('returns Monday-first weekday names for de-DE', () => {
      const names = CalendarMethodsTemporal.getWeekDayNames(DE_DE);
      expect(names).toHaveLength(7);
      // Monday-first locales should NOT start with Sunday.
      const sun = names[0]; // Should be Monday narrow (M).
      expect(sun.length).toBeGreaterThan(0);
      // Last entry should be Sunday's narrow name.
      expect(names[6].length).toBeGreaterThan(0);
    });

    it('returns Sunday-first weekday names for en-US', () => {
      const names = CalendarMethodsTemporal.getWeekDayNames(EN_US);
      expect(names).toHaveLength(7);
    });

    it('returns 12 month short names', () => {
      const names = CalendarMethodsTemporal.getMonthShortNames(EN_US);
      expect(names).toHaveLength(12);
      expect(names[0]).toMatch(/^Jan/);
    });

    it('forces Gregorian calendar for locales with non-Gregorian defaults (fa-IR)', () => {
      // fa-IR's default Intl calendar is Persian solar Hijri, where Jan 15
      // 2024 sits in the Persian month "دی" (Day). Forcing Gregorian must
      // give the Persian transliteration of "January" (ژانویه), matching
      // the underlying ISO/Gregorian date math.
      const names = CalendarMethodsTemporal.getMonthShortNames(FA_IR);
      expect(names[0]).toMatch(/ژانویه|ژانو/);
      // Specifically NOT the Persian-calendar default "دی".
      expect(names[0]).not.toBe('دی');
    });
  });

  describe('weekends', () => {
    it('Monday-first locale weekends at positions 5,6', () => {
      expect(CalendarMethodsTemporal.getWeekends(DE_DE)).toEqual([
        false,
        false,
        false,
        false,
        false,
        true,
        true,
      ]);
    });

    it('Sunday-first locale weekends at positions 0,6', () => {
      expect(CalendarMethodsTemporal.getWeekends(EN_US)).toEqual([
        true,
        false,
        false,
        false,
        false,
        false,
        true,
      ]);
    });

    it('fa-IR (Saturday-first, Friday-only weekend) — Friday at position 6', () => {
      // [Sat, Sun, Mon, Tue, Wed, Thu, Fri] → only Friday (position 6) weekend.
      expect(CalendarMethodsTemporal.getWeekends(FA_IR)).toEqual([
        false,
        false,
        false,
        false,
        false,
        false,
        true,
      ]);
    });

    it('ar-SA (Sunday-first, Fri+Sat weekend) — Fri/Sat at positions 5,6', () => {
      // [Sun, Mon, Tue, Wed, Thu, Fri, Sat] → Fri/Sat weekend at 5,6.
      expect(CalendarMethodsTemporal.getWeekends(AR_SA)).toEqual([
        false,
        false,
        false,
        false,
        false,
        true,
        true,
      ]);
    });
  });

  describe('isISOWeekLocale consistency with weekInfo', () => {
    it('returns true only when weekInfo.firstDay=1 AND minimalDays=4', () => {
      // de-DE: firstDay=1, minimalDays=4 → ISO.
      expect(CalendarMethodsTemporal.isISOWeekLocale(DE_DE)).toBe(true);
      // en-US: firstDay=7 (Sunday) → not ISO.
      expect(CalendarMethodsTemporal.isISOWeekLocale(EN_US)).toBe(false);
      // ar-SA: firstDay=7 per CLDR weekInfo even though listed in the
      // legacy ISO_WEEK_LOCALES set — the Temporal adapter must report
      // false so it stays consistent with its own grid/week math.
      expect(CalendarMethodsTemporal.isISOWeekLocale(AR_SA)).toBe(false);
      // fa-IR: firstDay=6 → not ISO.
      expect(CalendarMethodsTemporal.isISOWeekLocale(FA_IR)).toBe(false);
      // zh-CN / en-AU: firstDay=1 BUT minimalDays=1 → NOT ISO.
      expect(CalendarMethodsTemporal.isISOWeekLocale(ZH_CN)).toBe(false);
      expect(CalendarMethodsTemporal.isISOWeekLocale(EN_AU)).toBe(false);
    });
  });

  describe('Monday-first non-ISO locales (zh-CN / en-AU): use locale week algorithm', () => {
    // 2027-01-01 (Friday). Under ISO rules (de-DE) it sits in W53 of weekYear
    // 2026 because ISO needs ≥4 days of the new year for week 1. Under
    // zh-CN / en-AU rules (minimalDays=1) Jan 1 is in week 1 of 2027.
    const jan1_2027 = '2027-01-01T12:00:00Z';

    it('getWeekYear differs between zh-CN and de-DE on year boundary', () => {
      expect(CalendarMethodsTemporal.getWeekYear(jan1_2027, ZH_CN)).toBe(2027);
      expect(CalendarMethodsTemporal.getWeekYear(jan1_2027, DE_DE)).toBe(2026);
    });

    it('getWeek for zh-CN gives 1 not 53', () => {
      expect(CalendarMethodsTemporal.getWeek(jan1_2027, ZH_CN)).toBe(1);
      expect(CalendarMethodsTemporal.getWeek(jan1_2027, DE_DE)).toBe(53);
    });

    it('formatToString gggg-[W]ww uses locale week year for en-AU', () => {
      expect(
        CalendarMethodsTemporal.formatToString(EN_AU, jan1_2027, 'gggg-[W]ww'),
      ).toBe('2027-W01');
    });

    it('formatToString GGGG-[W]WW always reports ISO week regardless of locale', () => {
      // Even with a Monday-first non-ISO locale, ISO format tokens must
      // still emit ISO numbers.
      expect(
        CalendarMethodsTemporal.formatToString(EN_AU, jan1_2027, 'GGGG-[W]WW'),
      ).toBe('2026-W53');
    });

    it('getDefaultModeFormat picks gggg-[W]ww for en-AU after static set fix', () => {
      // Regression for the format/getWeek divergence Codex flagged: with
      // en-AU correctly classified as non-ISO, mode="week" should default
      // to locale-week tokens, and the formatted output should match
      // what getWeek/getWeekYear return.
      const fmt = getDefaultModeFormat('week', EN_AU);
      expect(fmt).toBe('gggg-[W]ww');
      const formatted = CalendarMethodsTemporal.formatToString(
        EN_AU,
        jan1_2027,
        fmt,
      );
      expect(formatted).toBe('2027-W01');
      expect(CalendarMethodsTemporal.getWeek(jan1_2027, EN_AU)).toBe(1);
      expect(CalendarMethodsTemporal.getWeekYear(jan1_2027, EN_AU)).toBe(2027);
    });

    it('getDefaultModeFormat picks gggg-[W]ww for ar-SA after static set fix', () => {
      const fmt = getDefaultModeFormat('week', AR_SA);
      expect(fmt).toBe('gggg-[W]ww');
    });
  });

  describe('non-binary first day of week (fa-IR Saturday-first)', () => {
    it('getFirstDayOfWeek returns 6 for fa-IR', () => {
      // mezzanine convention: 0=Sunday, 1=Monday, …, 6=Saturday.
      expect(CalendarMethodsTemporal.getFirstDayOfWeek(FA_IR)).toBe(6);
    });

    it('getWeekDayNames starts with Saturday for fa-IR', () => {
      const names = CalendarMethodsTemporal.getWeekDayNames(FA_IR);
      expect(names).toHaveLength(7);
      // Compare against Sunday-indexed narrow names rotated by 6.
      // We can't assert exact strings (locale dependent), but we can assert
      // the rotation is consistent — first name should equal the original
      // index-6 name.
      const sundayIndexed = new Intl.DateTimeFormat(FA_IR, {
        weekday: 'narrow',
        timeZone: 'UTC',
      });
      const saturdayUtc = new Date(Date.UTC(2024, 0, 13)); // Sat
      expect(names[0]).toBe(sundayIndexed.format(saturdayUtc));
    });

    it('getCalendarGrid for fa-IR starts week with Saturday', () => {
      // Use 2026-01-15 (Thursday) — first day of January 2026 is Thursday.
      // ISO Thursday = 4. firstDay = 6. daysFromPrev = (4 - 6 + 7) % 7 = 5.
      // So row 0 has 5 days from December (27, 28, 29, 30, 31) then Jan 1, 2.
      const grid = CalendarMethodsTemporal.getCalendarGrid(
        '2026-01-15T12:00:00Z',
        FA_IR,
      );
      expect(grid[0]).toEqual([27, 28, 29, 30, 31, 1, 2]);
    });
  });

  describe('manipulation', () => {
    it('addDay handles month boundaries', () => {
      const result = CalendarMethodsTemporal.addDay('2026-01-31T12:00:00Z', 1);
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(1); // February
    });

    it('addMonth clamps day to month length', () => {
      const result = CalendarMethodsTemporal.addMonth(
        '2026-01-31T12:00:00Z',
        1,
      );
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(1);
      expect(CalendarMethodsTemporal.getDate(result)).toBeLessThanOrEqual(28);
    });

    it('startOf "month" zeros the time', () => {
      const result = CalendarMethodsTemporal.startOf(fixedISO, 'month');
      expect(CalendarMethodsTemporal.getDate(result)).toBe(1);
      expect(CalendarMethodsTemporal.getHour(result)).toBe(0);
    });

    it('startOf "year" returns Jan 1', () => {
      const result = CalendarMethodsTemporal.startOf(fixedISO, 'year');
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(0);
      expect(CalendarMethodsTemporal.getDate(result)).toBe(1);
    });

    it('startOf "isoWeek" returns Monday', () => {
      // 2026-05-08 is Friday → ISO week starts Monday 2026-05-04.
      const result = CalendarMethodsTemporal.startOf(
        '2026-05-08T12:00:00Z',
        'isoWeek',
      );
      const zdt = Temporal.Instant.from(result).toZonedDateTimeISO(
        Temporal.Now.zonedDateTimeISO().timeZoneId,
      );
      expect(zdt.dayOfWeek).toBe(1);
    });

    it('startOf "week" defaults to Sunday-first (matches dayjs/moment)', () => {
      // 2026-05-08 is Friday → Sunday-first week starts Sunday 2026-05-03.
      const result = CalendarMethodsTemporal.startOf(
        '2026-05-08T12:00:00Z',
        'week',
      );
      const zdt = Temporal.Instant.from(result).toZonedDateTimeISO(
        Temporal.Now.zonedDateTimeISO().timeZoneId,
      );
      expect(zdt.dayOfWeek).toBe(7);
    });
  });

  describe('setter rollover (parity with moment/dayjs)', () => {
    // Previous-month grid cells pass `setMonth(ref, currentMonth - 1)` which
    // can be -1 in January. moment/dayjs normalise this to last December.
    it('setMonth handles month = -1 → previous December', () => {
      const jan = '2026-01-15T12:00:00Z';
      const result = CalendarMethodsTemporal.setMonth(jan, -1);
      expect(CalendarMethodsTemporal.getYear(result)).toBe(2025);
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(11);
    });

    it('setMonth handles month = 12 → next January', () => {
      const jan = '2026-01-15T12:00:00Z';
      const result = CalendarMethodsTemporal.setMonth(jan, 12);
      expect(CalendarMethodsTemporal.getYear(result)).toBe(2027);
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(0);
    });

    it('setMonth in-range still constrains day to month length', () => {
      // Mar 31 → Feb: clamp to Feb 28 (2026 is non-leap).
      const mar31 = '2026-03-31T12:00:00Z';
      const result = CalendarMethodsTemporal.setMonth(mar31, 1);
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(1);
      expect(CalendarMethodsTemporal.getDate(result)).toBe(28);
    });

    // Week range cells pass `setDate(value, currentDate ± 6)` which can spill
    // out of the current month. moment/dayjs normalise across boundaries.
    it('setDate handles target = 0 → last day of previous month', () => {
      const may15 = '2026-05-15T12:00:00Z';
      const result = CalendarMethodsTemporal.setDate(may15, 0);
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(3); // April
      expect(CalendarMethodsTemporal.getDate(result)).toBe(30);
    });

    it('setDate handles target > daysInMonth → spills into next month', () => {
      const may15 = '2026-05-15T12:00:00Z';
      const result = CalendarMethodsTemporal.setDate(may15, 35);
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(5); // June
      expect(CalendarMethodsTemporal.getDate(result)).toBe(4);
    });

    it('setDate target = -3 rolls back into previous month', () => {
      const may15 = '2026-05-15T12:00:00Z';
      const result = CalendarMethodsTemporal.setDate(may15, -3);
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(3); // April
      expect(CalendarMethodsTemporal.getDate(result)).toBe(27);
    });

    it('setYear clamps Feb 29 of leap year to Feb 28 of non-leap year', () => {
      // 2024 is leap; 2025 is not.
      const feb29 = '2024-02-29T12:00:00Z';
      const result = CalendarMethodsTemporal.setYear(feb29, 2025);
      expect(CalendarMethodsTemporal.getYear(result)).toBe(2025);
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(1); // February
      expect(CalendarMethodsTemporal.getDate(result)).toBe(28);
    });
  });

  describe('first-of-period helpers', () => {
    it('getCurrentWeekFirstDate returns Monday for de-DE', () => {
      // 2026-05-08 (Friday) → week starts Monday 2026-05-04.
      const result = CalendarMethodsTemporal.getCurrentWeekFirstDate(
        '2026-05-08T12:00:00Z',
        DE_DE,
      );
      // Use Temporal to inspect — bypass tz-sensitive day check.
      const zdt = Temporal.Instant.from(result).toZonedDateTimeISO(
        Temporal.Now.zonedDateTimeISO().timeZoneId,
      );
      expect(zdt.dayOfWeek).toBe(1);
    });

    it('getCurrentWeekFirstDate returns Sunday for en-US', () => {
      const result = CalendarMethodsTemporal.getCurrentWeekFirstDate(
        '2026-05-08T12:00:00Z',
        EN_US,
      );
      const zdt = Temporal.Instant.from(result).toZonedDateTimeISO(
        Temporal.Now.zonedDateTimeISO().timeZoneId,
      );
      expect(zdt.dayOfWeek).toBe(7);
    });

    it('getCurrentQuarterFirstDate returns first day of the quarter', () => {
      const result = CalendarMethodsTemporal.getCurrentQuarterFirstDate(
        '2026-05-15T12:00:00Z',
      );
      expect(CalendarMethodsTemporal.getMonth(result)).toBe(3); // April
      expect(CalendarMethodsTemporal.getDate(result)).toBe(1);
    });

    it('getCurrentHalfYearFirstDate returns Jan 1 or Jul 1', () => {
      expect(
        CalendarMethodsTemporal.getMonth(
          CalendarMethodsTemporal.getCurrentHalfYearFirstDate(
            '2026-05-15T12:00:00Z',
          ),
        ),
      ).toBe(0);
      expect(
        CalendarMethodsTemporal.getMonth(
          CalendarMethodsTemporal.getCurrentHalfYearFirstDate(
            '2026-08-15T12:00:00Z',
          ),
        ),
      ).toBe(6);
    });
  });

  describe('comparators', () => {
    const a = '2026-05-05T10:00:00Z';
    const b = '2026-05-05T15:00:00Z';
    const c = '2026-05-06T10:00:00Z';

    it('isValid', () => {
      expect(CalendarMethodsTemporal.isValid(a)).toBe(true);
      expect(CalendarMethodsTemporal.isValid('not a date')).toBe(false);
    });

    it('isBefore', () => {
      expect(CalendarMethodsTemporal.isBefore(a, b)).toBe(true);
      expect(CalendarMethodsTemporal.isBefore(b, a)).toBe(false);
    });

    it('isBetween at "day" granularity ignores time-of-day', () => {
      // a / b same UTC day → at day granularity b normalises to same day as
      // a, so b is NOT strictly "between" a..c (exclusive).
      expect(CalendarMethodsTemporal.isBetween(b, a, c, 'day')).toBe(false);

      // Use noon-UTC fixtures so day boundaries don't shift across tz.
      const before = '2026-05-03T12:00:00Z';
      const between = '2026-05-04T12:00:00Z';
      const after = '2026-05-05T12:00:00Z';
      expect(
        CalendarMethodsTemporal.isBetween(between, before, after, 'day'),
      ).toBe(true);
    });

    it('isBetween treats both bounds as exclusive (matches dayjs/moment default)', () => {
      const start = '2026-05-04T12:00:00Z';
      const middle = '2026-05-05T12:00:00Z';
      const end = '2026-05-06T12:00:00Z';
      // Boundary values exactly equal lo/hi → exclusive → false.
      expect(CalendarMethodsTemporal.isBetween(start, start, end, 'day')).toBe(
        false,
      );
      expect(CalendarMethodsTemporal.isBetween(end, start, end, 'day')).toBe(
        false,
      );
      // Strictly between → true.
      expect(CalendarMethodsTemporal.isBetween(middle, start, end, 'day')).toBe(
        true,
      );
    });

    it('isSameDate ignores time-of-day', () => {
      expect(CalendarMethodsTemporal.isSameDate(a, b)).toBe(true);
    });

    it('isSameWeek aligns with locale rules', () => {
      const monday = '2026-05-04T12:00:00Z';
      const sunday = '2026-05-10T12:00:00Z';
      // de-DE Monday-first → Mon-Sun is one week.
      expect(CalendarMethodsTemporal.isSameWeek(monday, sunday, DE_DE)).toBe(
        true,
      );
      // en-US Sunday-first → Sunday May 10 starts a NEW week.
      expect(CalendarMethodsTemporal.isSameWeek(monday, sunday, EN_US)).toBe(
        false,
      );
    });
  });

  describe('calendar grid', () => {
    it('returns 6×7 grid', () => {
      const grid = CalendarMethodsTemporal.getCalendarGrid(fixedISO, EN_US);
      expect(grid).toHaveLength(6);
      grid.forEach((row) => expect(row).toHaveLength(7));
    });

    it('Monday-first vs Sunday-first alignment', () => {
      const monday = CalendarMethodsTemporal.getCalendarGrid(
        '2026-05-15T12:00:00Z',
        DE_DE,
      );
      const sunday = CalendarMethodsTemporal.getCalendarGrid(
        '2026-05-15T12:00:00Z',
        EN_US,
      );
      // Both grids cover 42 cells but the offset differs by 1 day.
      expect(monday.flat()).toHaveLength(42);
      expect(sunday.flat()).toHaveLength(42);
    });
  });

  describe('formatToString', () => {
    it('formats common date tokens', () => {
      const out = CalendarMethodsTemporal.formatToString(
        EN_US,
        '2026-05-05T03:30:00Z',
        'YYYY-MM-DD HH:mm:ss',
      );
      expect(out).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      expect(out.startsWith('2026-')).toBe(true);
    });

    it('formats month names per locale', () => {
      const out = CalendarMethodsTemporal.formatToString(
        EN_US,
        '2026-01-15T12:00:00Z',
        'MMM',
      );
      expect(out).toMatch(/^Jan/);

      const outDE = CalendarMethodsTemporal.formatToString(
        DE_DE,
        '2026-01-15T12:00:00Z',
        'MMMM',
      );
      expect(outDE).toMatch(/Januar/);
    });

    it('quotes literals via [...] brackets', () => {
      const out = CalendarMethodsTemporal.formatToString(
        EN_US,
        '2026-05-05T03:30:00Z',
        'YYYY-[Q]Q',
      );
      expect(out).toBe('2026-Q2');
    });

    it('formats half-year via [H]n', () => {
      const out1 = CalendarMethodsTemporal.formatToString(
        EN_US,
        '2026-03-05T12:00:00Z',
        'YYYY-[H]n',
      );
      expect(out1).toBe('2026-H1');

      const out2 = CalendarMethodsTemporal.formatToString(
        EN_US,
        '2026-08-05T12:00:00Z',
        'YYYY-[H]n',
      );
      expect(out2).toBe('2026-H2');
    });

    it('formats ISO week year and number', () => {
      // 2026-01-01 (Thursday) is in ISO week 1 of 2026.
      const out = CalendarMethodsTemporal.formatToString(
        DE_DE,
        '2026-01-01T12:00:00Z',
        'GGGG-[W]WW',
      );
      expect(out).toBe('2026-W01');
    });

    it('formats `d` (ISO Sunday-indexed weekday) consistently across locales', () => {
      // 2026-05-04 is Monday → ISO Sunday-indexed = 1.
      const monday = '2026-05-04T12:00:00Z';
      expect(CalendarMethodsTemporal.formatToString(EN_US, monday, 'd')).toBe(
        '1',
      );
      expect(CalendarMethodsTemporal.formatToString(DE_DE, monday, 'd')).toBe(
        '1',
      );
    });

    it('formats `e` as locale-relative weekday (firstDay = 0)', () => {
      // 2026-05-04 is Monday.
      const monday = '2026-05-04T12:00:00Z';
      // de-DE: Monday-first → Monday = 0.
      expect(CalendarMethodsTemporal.formatToString(DE_DE, monday, 'e')).toBe(
        '0',
      );
      // en-US: Sunday-first → Monday = 1.
      expect(CalendarMethodsTemporal.formatToString(EN_US, monday, 'e')).toBe(
        '1',
      );

      // 2026-05-09 is Saturday.
      const saturday = '2026-05-09T12:00:00Z';
      // fa-IR: Saturday-first → Saturday = 0.
      expect(CalendarMethodsTemporal.formatToString(FA_IR, saturday, 'e')).toBe(
        '0',
      );
    });

    it('formats DDDD (3-digit day-of-year) padded', () => {
      // Jan 5 → day 5 → "005".
      const out = CalendarMethodsTemporal.formatToString(
        EN_US,
        '2026-01-05T12:00:00Z',
        'DDDD',
      );
      expect(out).toBe('005');
    });

    it('round-trips DDDD output as YYYY-DDDD', () => {
      const original = '2026-05-15T12:00:00Z';
      const formatted = CalendarMethodsTemporal.formatToString(
        EN_US,
        original,
        'YYYY-DDDD',
      );
      const parsed = CalendarMethodsTemporal.parseFormattedValue(
        formatted,
        'YYYY-DDDD',
        EN_US,
      );
      expect(parsed).toBeDefined();
      expect(CalendarMethodsTemporal.getYear(parsed as string)).toBe(2026);
      // Same calendar day in system tz.
      const reformatted = CalendarMethodsTemporal.formatToString(
        EN_US,
        parsed as string,
        'YYYY-DDDD',
      );
      expect(reformatted).toBe(formatted);
    });
  });

  describe('parseFormattedValue', () => {
    it('round-trips a full date format', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '2026-05-05',
        'YYYY-MM-DD',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getYear(iso as string)).toBe(2026);
      expect(CalendarMethodsTemporal.getMonth(iso as string)).toBe(4);
      expect(CalendarMethodsTemporal.getDate(iso as string)).toBe(5);
    });

    it('rejects invalid month', () => {
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2026-13-01',
          'YYYY-MM-DD',
          EN_US,
        ),
      ).toBeUndefined();
    });

    it('rejects invalid day for month', () => {
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2026-02-30',
          'YYYY-MM-DD',
          EN_US,
        ),
      ).toBeUndefined();
    });

    it('parses month-only to first day', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '2026-05',
        'YYYY-MM',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getDate(iso as string)).toBe(1);
    });

    it('parses year-only to Jan 1', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '2026',
        'YYYY',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getMonth(iso as string)).toBe(0);
      expect(CalendarMethodsTemporal.getDate(iso as string)).toBe(1);
    });

    it('parses quarter format', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '2026-Q2',
        'YYYY-[Q]Q',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getMonth(iso as string)).toBe(3);
    });

    it('rejects out-of-range quarter', () => {
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2026-Q5',
          'YYYY-[Q]Q',
          EN_US,
        ),
      ).toBeUndefined();
    });

    it('parses half-year format', () => {
      const iso1 = CalendarMethodsTemporal.parseFormattedValue(
        '2026-H1',
        'YYYY-[H]n',
        EN_US,
      );
      const iso2 = CalendarMethodsTemporal.parseFormattedValue(
        '2026-H2',
        'YYYY-[H]n',
        EN_US,
      );
      expect(iso1).toBeDefined();
      expect(iso2).toBeDefined();
      expect(CalendarMethodsTemporal.getMonth(iso1 as string)).toBe(0);
      expect(CalendarMethodsTemporal.getMonth(iso2 as string)).toBe(6);
    });

    it('rejects out-of-range half-year', () => {
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2026-H3',
          'YYYY-[H]n',
          EN_US,
        ),
      ).toBeUndefined();
    });

    it('parses ISO week format', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '2026-W01',
        'GGGG-[W]WW',
        DE_DE,
      );
      expect(iso).toBeDefined();
      // ISO week 1 of 2026 starts on Monday Dec 29 2025.
      expect(CalendarMethodsTemporal.getYear(iso as string)).toBe(2025);
    });

    it('rejects ISO week 53 in a 52-week year (e.g. 2021)', () => {
      // 2021 is a 52-week ISO year; 2021-W53 is impossible.
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2021-W53',
          'GGGG-[W]WW',
          DE_DE,
        ),
      ).toBeUndefined();
    });

    it('accepts ISO week 53 in a 53-week year (e.g. 2020)', () => {
      // 2020 is a 53-week ISO year.
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2020-W53',
          'GGGG-[W]WW',
          DE_DE,
        ),
      ).toBeDefined();
    });

    it('returns undefined (not crash) when format has weekYear but no week number', () => {
      // gggg-only: previously NaN propagated into Temporal.add() → RangeError.
      expect(
        CalendarMethodsTemporal.parseFormattedValue('2026', 'gggg', EN_US),
      ).toBeUndefined();
      // GGGG-only: same crash path.
      expect(
        CalendarMethodsTemporal.parseFormattedValue('2026', 'GGGG', DE_DE),
      ).toBeUndefined();
    });

    it('parses YY 2-digit year with moment-style pivot at 68/69', () => {
      // Pivot semantics matching dayjs/moment:
      //   00..68 → 21st century (2000..2068)
      //   69..99 → 20th century (1969..1999)
      const cases: Array<[string, number]> = [
        ['00-05-15', 2000],
        ['67-05-15', 2067],
        ['68-05-15', 2068],
        ['69-05-15', 1969],
        ['99-05-15', 1999],
      ];
      for (const [text, expectedYear] of cases) {
        const iso = CalendarMethodsTemporal.parseFormattedValue(
          text,
          'YY-MM-DD',
          EN_US,
        );
        expect(iso).toBeDefined();
        expect(CalendarMethodsTemporal.getYear(iso as string)).toBe(
          expectedYear,
        );
      }
    });

    it('returns undefined for incoherent mixed weekYear/week tokens', () => {
      // gggg + WW: locale weekYear with ISO week number — incoherent
      // semantics. Must return undefined rather than silently drop the week.
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2026-W01',
          'gggg-[W]WW',
          EN_US,
        ),
      ).toBeUndefined();
    });

    it('rejects en-US locale week 53 in a 52-week year (2025)', () => {
      // en-US uses minimalDays=1, Sunday-first. 2025 has 52 locale weeks.
      // Critically: 2025-12-28 (the previous Dec 28 anchor) is already
      // 2026-W01 under en-US rules, so the old Dec-28 algorithm wrongly
      // accepted 2025-W53.
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2025-W53',
          'gggg-[W]ww',
          EN_US,
        ),
      ).toBeUndefined();
    });

    it('accepts en-US locale week 53 in a 53-week year (2022)', () => {
      // en-US 2022 has 53 locale weeks (Jan 1 2022 is Sat, Sunday-first
      // calendar starts week 1 at 2021-12-26 → 53 buckets fit by year-end).
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2022-W53',
          'gggg-[W]ww',
          EN_US,
        ),
      ).toBeDefined();
    });

    it('parses datetime with hours and minutes', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '2026-05-05 14:30:00',
        'YYYY-MM-DD HH:mm:ss',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getMinute(iso as string)).toBe(30);
    });

    it('parses time-only HH:mm against today as anchor', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '14:30',
        'HH:mm',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getHour(iso as string)).toBe(14);
      expect(CalendarMethodsTemporal.getMinute(iso as string)).toBe(30);
      expect(CalendarMethodsTemporal.getSecond(iso as string)).toBe(0);
    });

    it('parses time-only HH:mm:ss', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '23:59:45',
        'HH:mm:ss',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getHour(iso as string)).toBe(23);
      expect(CalendarMethodsTemporal.getMinute(iso as string)).toBe(59);
      expect(CalendarMethodsTemporal.getSecond(iso as string)).toBe(45);
    });

    it('parses 12-hour time with meridiem', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '02:30 PM',
        'hh:mm A',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getHour(iso as string)).toBe(14);
      expect(CalendarMethodsTemporal.getMinute(iso as string)).toBe(30);
    });

    it('rejects out-of-range time-only values', () => {
      expect(
        CalendarMethodsTemporal.parseFormattedValue('25:00', 'HH:mm', EN_US),
      ).toBeUndefined();
      expect(
        CalendarMethodsTemporal.parseFormattedValue('12:60', 'HH:mm', EN_US),
      ).toBeUndefined();
    });

    it('parses MMM short month names back to month index (en-US)', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        'Jan 5, 2026',
        'MMM D, YYYY',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getYear(iso as string)).toBe(2026);
      expect(CalendarMethodsTemporal.getMonth(iso as string)).toBe(0);
      expect(CalendarMethodsTemporal.getDate(iso as string)).toBe(5);
    });

    it('parses MMMM long month names + Do ordinal day', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        'January 5th, 2026',
        'MMMM Do, YYYY',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getMonth(iso as string)).toBe(0);
      expect(CalendarMethodsTemporal.getDate(iso as string)).toBe(5);
    });

    it('rejects MMM with mismatched casing/short-vs-long', () => {
      // Long form input against short token → should not match.
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          'January 5, 2026',
          'MMM D, YYYY',
          EN_US,
        ),
      ).toBeUndefined();
    });

    it('round-trips formatToString output for MMM D, YYYY', () => {
      const formatted = CalendarMethodsTemporal.formatToString(
        EN_US,
        '2026-03-15T12:00:00Z',
        'MMM D, YYYY',
      );
      const parsed = CalendarMethodsTemporal.parseFormattedValue(
        formatted,
        'MMM D, YYYY',
        EN_US,
      );
      expect(parsed).toBeDefined();
      expect(CalendarMethodsTemporal.getYear(parsed as string)).toBe(2026);
      expect(CalendarMethodsTemporal.getMonth(parsed as string)).toBe(2);
    });

    it('parses SS fractional second (deciseconds → ms × 10)', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '12:00:00.45',
        'HH:mm:ss.SS',
        EN_US,
      );
      expect(iso).toBeDefined();
      const isoStr = iso as string;
      // SS=45 → 450ms.
      const dt = new Date(isoStr);
      expect(dt.getUTCMilliseconds() % 1000).toBe(450);
    });

    it('parses S fractional second (centiseconds → ms × 100)', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '12:00:00.7',
        'HH:mm:ss.S',
        EN_US,
      );
      expect(iso).toBeDefined();
      const dt = new Date(iso as string);
      expect(dt.getUTCMilliseconds()).toBe(700);
    });

    it('parses kk 1-24 hour clock; "24" maps to hour 0', () => {
      const iso24 = CalendarMethodsTemporal.parseFormattedValue(
        '24:00',
        'kk:mm',
        EN_US,
      );
      expect(iso24).toBeDefined();
      expect(CalendarMethodsTemporal.getHour(iso24 as string)).toBe(0);

      const iso13 = CalendarMethodsTemporal.parseFormattedValue(
        '13:30',
        'kk:mm',
        EN_US,
      );
      expect(iso13).toBeDefined();
      expect(CalendarMethodsTemporal.getHour(iso13 as string)).toBe(13);
    });

    it('rejects k=0 and k=25 (out of 1-24 range)', () => {
      expect(
        CalendarMethodsTemporal.parseFormattedValue('00:00', 'kk:mm', EN_US),
      ).toBeUndefined();
      expect(
        CalendarMethodsTemporal.parseFormattedValue('25:00', 'kk:mm', EN_US),
      ).toBeUndefined();
    });

    it('parses DDD day-of-year + YYYY back to a calendar date', () => {
      // Day 125 of 2026 = May 5 (Jan=31 + Feb=28 + Mar=31 + Apr=30 + 5).
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '2026-125',
        'YYYY-DDD',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getMonth(iso as string)).toBe(4);
      expect(CalendarMethodsTemporal.getDate(iso as string)).toBe(5);
    });

    it('rejects DDD outside year length', () => {
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2026-366',
          'YYYY-DDD',
          EN_US,
        ),
      ).toBeUndefined(); // 2026 not leap
      // Leap year accepts 366.
      expect(
        CalendarMethodsTemporal.parseFormattedValue(
          '2024-366',
          'YYYY-DDD',
          EN_US,
        ),
      ).toBeDefined();
    });

    it('parses x unix epoch ms standalone', () => {
      // 1746460800000 ≈ 2025-05-05T16:00:00Z (rough fixture).
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '1746460800000',
        'x',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(new Date(iso as string).getTime()).toBe(1746460800000);
    });

    it('parses X unix epoch seconds standalone', () => {
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        '1746460800',
        'X',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(new Date(iso as string).getTime()).toBe(1746460800 * 1000);
    });

    it('consumes weekday tokens but discards them', () => {
      // dddd appears in input but year/month/day come from other tokens.
      const iso = CalendarMethodsTemporal.parseFormattedValue(
        'Tuesday, May 5, 2026',
        'dddd, MMMM D, YYYY',
        EN_US,
      );
      expect(iso).toBeDefined();
      expect(CalendarMethodsTemporal.getMonth(iso as string)).toBe(4);
      expect(CalendarMethodsTemporal.getDate(iso as string)).toBe(5);
    });
  });

  describe('inclusion checks', () => {
    // Use noon UTC fixtures so the day boundary is unambiguous across timezones.
    const targets = ['2026-05-05T12:00:00Z', '2026-08-15T12:00:00Z'];

    it('isDateIncluded', () => {
      // Two times within the same UTC day as the first target.
      expect(
        CalendarMethodsTemporal.isDateIncluded('2026-05-05T11:30:00Z', targets),
      ).toBe(true);
      expect(
        CalendarMethodsTemporal.isDateIncluded('2026-05-07T12:00:00Z', targets),
      ).toBe(false);
    });

    it('isMonthIncluded', () => {
      expect(
        CalendarMethodsTemporal.isMonthIncluded(
          '2026-05-15T20:00:00Z',
          targets,
        ),
      ).toBe(true);
      expect(
        CalendarMethodsTemporal.isMonthIncluded(
          '2026-06-15T20:00:00Z',
          targets,
        ),
      ).toBe(false);
    });

    it('isQuarterIncluded', () => {
      // 2026-05-05 is Q2; 2026-08-15 is Q3.
      expect(
        CalendarMethodsTemporal.isQuarterIncluded(
          '2026-04-30T12:00:00Z',
          targets,
        ),
      ).toBe(true);
    });

    it('isYearIncluded', () => {
      expect(
        CalendarMethodsTemporal.isYearIncluded('2026-12-31T12:00:00Z', targets),
      ).toBe(true);
      expect(
        CalendarMethodsTemporal.isYearIncluded('2025-01-01T12:00:00Z', targets),
      ).toBe(false);
    });
  });

  describe('format ↔ parse round-trip property', () => {
    // Fixture dates spread across the year so we exercise different months,
    // quarters, half-years, and ISO week boundaries.
    const fixtures = [
      '2026-01-15T12:00:00Z', // mid-January, Q1, H1
      '2026-03-31T12:00:00Z', // end of March (boundary day)
      '2026-05-05T12:00:00Z', // mid-Q2
      '2026-08-15T12:00:00Z', // mid-Q3, H2
      '2026-12-31T12:00:00Z', // end-of-year
    ];

    // mezzanine's mode-format catalogue. We validate the same date keys the
    // mode is actually meant to round-trip:
    //  - day:        Y/M/D
    //  - week:       weekYear / weekNumber
    //  - month:      Y/M
    //  - year:       Y
    //  - quarter:    Y / quarter
    //  - half-year:  Y / halfYear
    const modes = [
      'day',
      'week',
      'month',
      'year',
      'quarter',
      'half-year',
    ] as const;

    type Mode = (typeof modes)[number];

    function expectRoundTrip(iso: string, locale: string, mode: Mode): void {
      const format = getDefaultModeFormat(mode, locale);
      const formatted = CalendarMethodsTemporal.formatToString(
        locale,
        iso,
        format,
      );
      const parsed = CalendarMethodsTemporal.parseFormattedValue(
        formatted,
        format,
        locale,
      );
      expect(parsed).toBeDefined();
      const p = parsed as string;

      switch (mode) {
        case 'day':
          expect(CalendarMethodsTemporal.getYear(p)).toBe(
            CalendarMethodsTemporal.getYear(iso),
          );
          expect(CalendarMethodsTemporal.getMonth(p)).toBe(
            CalendarMethodsTemporal.getMonth(iso),
          );
          expect(CalendarMethodsTemporal.getDate(p)).toBe(
            CalendarMethodsTemporal.getDate(iso),
          );
          break;
        case 'week':
          expect(CalendarMethodsTemporal.getWeek(p, locale)).toBe(
            CalendarMethodsTemporal.getWeek(iso, locale),
          );
          expect(CalendarMethodsTemporal.getWeekYear(p, locale)).toBe(
            CalendarMethodsTemporal.getWeekYear(iso, locale),
          );
          break;
        case 'month':
          expect(CalendarMethodsTemporal.getYear(p)).toBe(
            CalendarMethodsTemporal.getYear(iso),
          );
          expect(CalendarMethodsTemporal.getMonth(p)).toBe(
            CalendarMethodsTemporal.getMonth(iso),
          );
          break;
        case 'year':
          expect(CalendarMethodsTemporal.getYear(p)).toBe(
            CalendarMethodsTemporal.getYear(iso),
          );
          break;
        case 'quarter':
          expect(CalendarMethodsTemporal.getYear(p)).toBe(
            CalendarMethodsTemporal.getYear(iso),
          );
          expect(CalendarMethodsTemporal.getQuarter(p)).toBe(
            CalendarMethodsTemporal.getQuarter(iso),
          );
          break;
        case 'half-year':
          expect(CalendarMethodsTemporal.getYear(p)).toBe(
            CalendarMethodsTemporal.getYear(iso),
          );
          expect(CalendarMethodsTemporal.getHalfYear(p)).toBe(
            CalendarMethodsTemporal.getHalfYear(iso),
          );
          break;
      }
    }

    for (const locale of [EN_US, DE_DE, ZH_TW]) {
      for (const mode of modes) {
        for (const iso of fixtures) {
          it(`${locale} / ${mode} / ${iso.slice(0, 10)}`, () => {
            expectRoundTrip(iso, locale, mode);
          });
        }
      }
    }

    // Also cover the default time format used by TimePicker.
    it('time format HH:mm:ss round-trips', () => {
      const formatted = CalendarMethodsTemporal.formatToString(
        EN_US,
        '2026-05-05T03:30:45Z',
        'HH:mm:ss',
      );
      const parsed = CalendarMethodsTemporal.parseFormattedValue(
        formatted,
        'HH:mm:ss',
        EN_US,
      );
      expect(parsed).toBeDefined();
      // Hour will reflect system tz, so just compare the formatted view.
      expect(
        CalendarMethodsTemporal.formatToString(
          EN_US,
          parsed as string,
          'HH:mm:ss',
        ),
      ).toBe(formatted);
    });
  });

  describe('weekInfo partial response (older runtime simulation)', () => {
    // Some older V8 / Safari builds expose `Intl.Locale#weekInfo` but only
    // populate `firstDay` / `weekend`, not `minimalDays`. The adapter must
    // fall back to the static ISO_WEEK_LOCALES set for `minimalDays` so
    // that ISO locales like de-DE stay classified as ISO.
    const OriginalLocale = Intl.Locale;

    afterEach(() => {
      (Intl as unknown as { Locale: typeof OriginalLocale }).Locale =
        OriginalLocale;
      // Re-import to clear the module's weekInfoCache.
      jest.resetModules();
    });

    it('classifies de-DE as ISO when minimalDays is missing from weekInfo', () => {
      class StubLocale extends OriginalLocale {
        get weekInfo(): { firstDay: number; weekend: number[] } {
          // Mirror what de-DE looks like with the minimalDays field absent.
          return { firstDay: 1, weekend: [6, 7] };
        }
      }
      (Intl as unknown as { Locale: typeof OriginalLocale }).Locale =
        StubLocale as unknown as typeof OriginalLocale;

      // Re-import so the new module instance reads the patched Intl.Locale
      // and starts with a fresh weekInfoCache.
      jest.isolateModules(() => {
         
        const adapter = require('.').default as typeof CalendarMethodsTemporal;
        expect(adapter.isISOWeekLocale(DE_DE)).toBe(true);
        // 2027-01-01 (Friday): with the static-set fallback giving
        // minimalDays=4, this must resolve to ISO weekYear 2026 W53.
        const jan1_2027 = '2027-01-01T12:00:00Z';
        expect(adapter.getWeekYear(jan1_2027, DE_DE)).toBe(2026);
        expect(adapter.getWeek(jan1_2027, DE_DE)).toBe(53);
      });
    });

    it('classifies ISO variants (de-AT, fr-CH) as ISO via language-only fallback', () => {
      // de-AT and fr-CH are not literally in ISO_WEEK_LOCALES, but their
      // language codes (de, fr) are. The variant-aware defaultMinimalDays
      // must inherit ISO from the language code when the runtime omits
      // minimalDays.
      class StubLocale extends OriginalLocale {
        get weekInfo(): { firstDay: number; weekend: number[] } {
          return { firstDay: 1, weekend: [6, 7] };
        }
      }
      (Intl as unknown as { Locale: typeof OriginalLocale }).Locale =
        StubLocale as unknown as typeof OriginalLocale;

      jest.isolateModules(() => {
         
        const adapter = require('.').default as typeof CalendarMethodsTemporal;
        expect(adapter.isISOWeekLocale('de-AT')).toBe(true);
        expect(adapter.isISOWeekLocale('fr-CH')).toBe(true);
        // 2027-01-01 → ISO 2026-W53.
        expect(adapter.getWeekYear('2027-01-01T12:00:00Z', 'de-AT')).toBe(2026);
      });
    });
  });

  describe('polyfill guard', () => {
    it('throws a descriptive error if Temporal is missing', () => {
      const original = (globalThis as Partial<TemporalGlobal>).Temporal;
      (globalThis as Partial<TemporalGlobal>).Temporal = undefined;
      try {
        expect(() => CalendarMethodsTemporal.getNow()).toThrow(
          /@js-temporal\/polyfill|Temporal API/,
        );
      } finally {
        (globalThis as Partial<TemporalGlobal>).Temporal = original;
      }
    });

    it('isValid surfaces the polyfill guard instead of returning false', () => {
      // Otherwise consumers in Safari / unpolyfilled Node would see "every
      // date is invalid" without ever seeing the installation guide.
      const original = (globalThis as Partial<TemporalGlobal>).Temporal;
      (globalThis as Partial<TemporalGlobal>).Temporal = undefined;
      try {
        expect(() =>
          CalendarMethodsTemporal.isValid('2026-05-05T12:00:00Z'),
        ).toThrow(/@js-temporal\/polyfill|Temporal API/);
      } finally {
        (globalThis as Partial<TemporalGlobal>).Temporal = original;
      }
    });
  });
});
