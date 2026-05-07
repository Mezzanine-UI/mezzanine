import CalendarMethodsDayjs from '.';

describe('calendarMethodsDayjs', () => {
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
