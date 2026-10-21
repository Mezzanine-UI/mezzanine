import dayjs from 'dayjs';
import CalendarMethodsDayjs from '.';
import CalendarMethodsMoment from '../calendarMethodsMoment';

describe('calendarMethodsDayjs', () => {
  describe('parseFormattedValue (week / quarter / half-year)', () => {
    const parse = (text: string, format: string, locale: string) =>
      CalendarMethodsDayjs.parseFormattedValue(text, format, locale);
    const toDate = (iso: string | undefined) =>
      iso === undefined ? undefined : dayjs(iso).format('YYYY-MM-DD');

    it.each([
      // ISO week: Monday of the ISO week, ISO week year may start in December
      ['2026-W05', 'GGGG-[W]WW', 'de-DE', '2026-01-26'],
      ['2026-W01', 'GGGG-[W]WW', 'de-DE', '2025-12-29'],
      // Locale week (en-US: Sunday-first, week 1 contains Jan 1)
      ['2026-W05', 'gggg-[W]ww', 'en-US', '2026-01-25'],
      ['2026-W01', 'gggg-[W]ww', 'en-US', '2025-12-28'],
      // Quarter: first day of the quarter
      ['2026-Q1', 'YYYY-[Q]Q', 'en-US', '2026-01-01'],
      ['2026-Q3', 'YYYY-[Q]Q', 'en-US', '2026-07-01'],
      // Half-year: first day of the half-year
      ['2026-H1', 'YYYY-[H]n', 'en-US', '2026-01-01'],
      ['2026-H2', 'YYYY-[H]n', 'en-US', '2026-07-01'],
    ])(
      'should parse %s with %s (%s) like the Moment adapter',
      (text, format, locale, date) => {
        const parsed = parse(text, format, locale);

        expect(toDate(parsed)).toBe(date);
        expect(parsed).toBe(
          CalendarMethodsMoment.parseFormattedValue(text, format, locale),
        );
      },
    );

    it('should accept ISO week 53 in a 53-week ISO year', () => {
      // 2026 starts on a Thursday, so it has 53 ISO weeks. The Moment
      // adapter rejects this text, so only the calendar date is asserted.
      expect(toDate(parse('2026-W53', 'GGGG-[W]WW', 'de-DE'))).toBe(
        '2026-12-28',
      );
    });

    it.each([
      // Monday-first locale week (yearStart 1), not ISO
      ['2026-W05', 'en-AU', 5, 1],
      // Sunday-first locale week
      ['2026-W05', 'zh-TW', 5, 0],
    ])(
      'should parse %s in %s to the start of that locale week',
      (text, locale, week, weekDay) => {
        const parsed = parse(text, 'gggg-[W]ww', locale) as string;

        expect(parsed).toBeDefined();
        expect(CalendarMethodsDayjs.getWeek(parsed, locale)).toBe(week);
        expect(CalendarMethodsDayjs.getWeekYear(parsed, locale)).toBe(2026);
        expect(dayjs(parsed).day()).toBe(weekDay);
      },
    );

    it.each([
      ['2026-W00', 'GGGG-[W]WW', 'de-DE'],
      ['2026-W54', 'GGGG-[W]WW', 'de-DE'],
      ['2025-W53', 'GGGG-[W]WW', 'de-DE'],
      ['2026-W00', 'gggg-[W]ww', 'en-US'],
      ['2026-W53', 'gggg-[W]ww', 'en-US'],
      ['2026-W54', 'gggg-[W]ww', 'en-US'],
      ['2026-W5', 'GGGG-[W]WW', 'de-DE'],
      ['2026-Q0', 'YYYY-[Q]Q', 'en-US'],
      ['2026-Q5', 'YYYY-[Q]Q', 'en-US'],
      ['2026-Q', 'YYYY-[Q]Q', 'en-US'],
      ['2026-H0', 'YYYY-[H]n', 'en-US'],
      ['2026-H3', 'YYYY-[H]n', 'en-US'],
      ['2026-Q1', 'YYYY-[H]n', 'en-US'],
    ])('should reject %s with %s (%s)', (text, format, locale) => {
      expect(parse(text, format, locale)).toBeUndefined();
    });

    it('should round-trip with formatToString', () => {
      const weekStart = parse('2026-W20', 'GGGG-[W]WW', 'de-DE') as string;
      const quarterStart = parse('2026-Q2', 'YYYY-[Q]Q', 'en-US') as string;
      const halfYearStart = parse('2026-H2', 'YYYY-[H]n', 'en-US') as string;

      expect(
        CalendarMethodsDayjs.formatToString('de-DE', weekStart, 'GGGG-[W]WW'),
      ).toBe('2026-W20');
      expect(
        CalendarMethodsDayjs.formatToString('en-US', quarterStart, 'YYYY-[Q]Q'),
      ).toBe('2026-Q2');
      expect(
        CalendarMethodsDayjs.formatToString(
          'en-US',
          halfYearStart,
          'YYYY-[H]n',
        ),
      ).toBe('2026-H2');
    });
  });

  describe('getWeekYear (locale week-year heuristic for non-ISO locales)', () => {
    // dayjs has no native `.weekYear()`, so we synthesize one using a
    // moment-compatible heuristic. These cases lock the behaviour at the
    // year-end boundary where calendar year diverges from week year.
    const cases: Array<{ date: string; locale: string; expected: number }> = [
      // en-US: Sunday-first, minimalDays=1.
      { date: '2025-12-28T12:00:00Z', locale: 'en-US', expected: 2026 },
      { date: '2025-12-31T12:00:00Z', locale: 'en-US', expected: 2026 },
      { date: '2026-01-01T12:00:00Z', locale: 'en-US', expected: 2026 },
      { date: '2026-12-31T12:00:00Z', locale: 'en-US', expected: 2027 },
      { date: '2027-01-01T12:00:00Z', locale: 'en-US', expected: 2027 },

      // zh-CN: Monday-first, minimalDays=1 (CLDR), but dayjs locale data
      // matches CLDR for week boundaries.
      { date: '2025-12-28T12:00:00Z', locale: 'zh-CN', expected: 2025 },
      { date: '2027-01-01T12:00:00Z', locale: 'zh-CN', expected: 2026 },
    ];

    for (const { date, locale, expected } of cases) {
      it(`${locale} ${date.slice(0, 10)} → weekYear ${expected}`, () => {
        expect(CalendarMethodsDayjs.getWeekYear(date, locale)).toBe(expected);
      });
    }
  });
});
