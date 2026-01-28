import { DateTime, Info, Interval } from 'luxon';
import range from 'lodash/range';
import chunk from 'lodash/chunk';
import { CalendarMethods as CalendarMethodsType } from '../calendar/typings';

/**
 * CalendarMethodsLuxon - Luxon implementation of CalendarMethods
 *
 * NOTE: Luxon only supports ISO week (Monday as first day of week).
 * Regardless of the locale parameter, this implementation always uses ISO week.
 * If you need Sunday-first week support, please use moment or dayjs instead.
 */
const CalendarMethodsLuxon: CalendarMethodsType = {
  /** Locale helpers - Luxon always uses ISO week (Monday-first) */
  getFirstDayOfWeek: () => 1, // Always Monday for Luxon
  isISOWeekLocale: () => true, // Always ISO week for Luxon

  /** Get date infos */
  getNow: () => DateTime.now().toISO() as string,
  getSecond: (date) => DateTime.fromISO(date).second,
  getMinute: (date) => DateTime.fromISO(date).minute,
  getHour: (date) => DateTime.fromISO(date).hour,
  getDate: (date) => DateTime.fromISO(date).day,
  getWeek: (date) => DateTime.fromISO(date).weekNumber,
  getWeekYear: (date) => DateTime.fromISO(date).weekYear,
  getWeekDay: (date) => DateTime.fromISO(date).weekday,
  getMonth: (date) => DateTime.fromISO(date).month - 1,
  getYear: (date) => DateTime.fromISO(date).year,
  getQuarter: (date) => DateTime.fromISO(date).quarter,
  getHalfYear: (date) => Math.floor((DateTime.fromISO(date).month - 1) / 6) + 1,
  getWeekDayNames: (locale) => {
    // Luxon returns Monday-first by default (ISO week)
    return Info.weekdays('narrow', { locale });
  },
  getMonthShortName: (month, locale) => {
    const names = CalendarMethodsLuxon.getMonthShortNames(locale);
    return names[month];
  },
  getMonthShortNames: (locale) => Info.months('short', { locale }),
  getWeekends: () => {
    // Luxon always uses ISO week (Monday-first)
    // [Mon, Tue, Wed, Thu, Fri, Sat, Sun] → positions 5, 6 are weekends
    return [false, false, false, false, false, true, true];
  },

  /** Manipulate */
  addHour: (date, diff) =>
    DateTime.fromISO(date).plus({ hour: diff }).toISO() as string,
  addMinute: (date, diff) =>
    DateTime.fromISO(date).plus({ minute: diff }).toISO() as string,
  addSecond: (date, diff) =>
    DateTime.fromISO(date).plus({ second: diff }).toISO() as string,
  addDay: (date, diff) =>
    DateTime.fromISO(date).plus({ day: diff }).toISO() as string,
  addYear: (date, diff) =>
    DateTime.fromISO(date).plus({ year: diff }).toISO() as string,
  addMonth: (date, diff) =>
    DateTime.fromISO(date).plus({ month: diff }).toISO() as string,
  setMillisecond: (date, millisecond) =>
    DateTime.fromISO(date).set({ millisecond }).toISO() as string,
  setSecond: (date, second) =>
    DateTime.fromISO(date).set({ second }).toISO() as string,
  setMinute: (date, minute) =>
    DateTime.fromISO(date).set({ minute }).toISO() as string,
  setHour: (date, hour) =>
    DateTime.fromISO(date).set({ hour }).toISO() as string,
  setMonth: (date, month) =>
    DateTime.fromISO(date)
      .set({ month: month + 1 })
      .toISO() as string,
  setYear: (date, year) =>
    DateTime.fromISO(date).set({ year }).toISO() as string,
  setDate: (date, target) =>
    DateTime.fromISO(date).set({ day: target }).toISO() as string,
  startOf: (target, granularity) =>
    DateTime.fromISO(target).startOf(granularity).toISO() as string,

  getCurrentWeekFirstDate: (value) => {
    // Luxon startOf('week') gives Monday (ISO week)
    return DateTime.fromISO(value)
      .startOf('week')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toISO() as string;
  },
  getCurrentMonthFirstDate: (value) =>
    DateTime.fromISO(value)
      .startOf('month')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toISO() as string,
  getCurrentYearFirstDate: (value) =>
    DateTime.fromISO(value)
      .startOf('year')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toISO() as string,
  getCurrentQuarterFirstDate: (value) => {
    const dt = DateTime.fromISO(value);
    const quarterStart = Math.floor((dt.month - 1) / 3) * 3 + 1;
    return dt
      .set({
        month: quarterStart,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISO() as string;
  },
  getCurrentHalfYearFirstDate: (value) => {
    const dt = DateTime.fromISO(value);
    const halfYearStart = Math.floor((dt.month - 1) / 6) * 6 + 1;
    return dt
      .set({
        month: halfYearStart,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISO() as string;
  },

  /** Generate day calendar - Always Monday-first for Luxon */
  getCalendarGrid: (target) => {
    const lastDateOfPrevMonth = DateTime.fromISO(target)
      .minus({ month: 1 })
      .endOf('month').day;
    // Luxon weekday: 1=Monday, 7=Sunday
    const firstDayWeekday = DateTime.fromISO(target).set({ day: 1 }).weekday;
    const lastDateOfCurrentMonth = DateTime.fromISO(target).endOf('month').day;

    // Monday-first: weekday 1 (Monday) should appear at position 0
    const daysFromPrevMonth = firstDayWeekday - 1;

    const totalDaysInGrid = 42; // 6 weeks * 7 days
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

  /** Compares */
  isValid: (date) => DateTime.fromISO(date).isValid,
  isBefore: (target, comparison) =>
    DateTime.fromISO(target) < DateTime.fromISO(comparison),
  isBetween: (value, target1, target2) =>
    Interval.fromDateTimes(
      DateTime.fromISO(target1),
      DateTime.fromISO(target2),
    ).contains(DateTime.fromISO(value)),
  isSameDate: (dateOne, dateTwo) =>
    DateTime.fromISO(dateOne).hasSame(DateTime.fromISO(dateTwo), 'day'),
  isSameWeek: (dateOne, dateTwo) => {
    // Use Luxon's default ISO week comparison
    return DateTime.fromISO(dateOne).hasSame(DateTime.fromISO(dateTwo), 'week');
  },
  isInMonth: (target, month) => DateTime.fromISO(target).month === month + 1,
  isDateIncluded: (date, targets) =>
    targets.some((target) =>
      DateTime.fromISO(date).hasSame(DateTime.fromISO(target), 'day'),
    ),
  isWeekIncluded: (firstDateOfWeek, targets) => {
    return targets.some((target) =>
      DateTime.fromISO(firstDateOfWeek).hasSame(
        DateTime.fromISO(target),
        'week',
      ),
    );
  },
  isMonthIncluded: (date, targets) =>
    targets.some((target) =>
      DateTime.fromISO(date).hasSame(DateTime.fromISO(target), 'month'),
    ),
  isYearIncluded: (date, targets) =>
    targets.some((target) =>
      DateTime.fromISO(date).hasSame(DateTime.fromISO(target), 'year'),
    ),
  isQuarterIncluded: (date, targets) =>
    targets.some((target) =>
      DateTime.fromISO(date).hasSame(DateTime.fromISO(target), 'quarter'),
    ),
  isHalfYearIncluded: (date, targets) => {
    const dateTime = DateTime.fromISO(date);
    const halfYear = Math.floor((dateTime.month - 1) / 6);
    return targets.some((target) => {
      const targetTime = DateTime.fromISO(target);
      const targetHalfYear = Math.floor((targetTime.month - 1) / 6);
      return (
        dateTime.hasSame(targetTime, 'year') && halfYear === targetHalfYear
      );
    });
  },

  /** Format */
  formatToString: (locale, date: string | Date, format) => {
    // Handle half-year format: convert n to half-year number (1 or 2)
    if (format.includes('[H]n')) {
      const dt =
        date instanceof Date
          ? DateTime.fromJSDate(date)
          : DateTime.fromISO(date);
      const quarter = dt.quarter;
      const halfYear = Math.ceil(quarter / 2);
      return dt.toFormat(
        format.replace('n', `'${halfYear}'`).replace(/YYYY/g, 'yyyy'),
        { locale },
      );
    }

    const luxonFormat = format
      .replace(/YYYY/g, 'yyyy')
      .replace(/YY/g, 'yy')
      .replace(/Y/g, 'y')
      .replace(/dddd/g, 'EEEE')
      .replace(/ddd/g, 'EEE')
      .replace(/dd/g, 'EEE')
      .replace(/d/g, 'E')
      .replace(/DDDD/g, 'ooo')
      .replace(/DDD/g, 'o')
      .replace(/DD/g, 'dd')
      .replace(/D/g, 'd')
      .replace(/e/g, 'E')
      .replace(/ww/g, 'WW')
      .replace(/w/g, 'W')
      .replace(/kk/g, 'HH')
      .replace(/k/g, 'H')
      .replace(/gggg/g, 'kkkk')
      .replace(/gg/g, 'kk')
      .replace(/GGGG/g, 'kkkk')
      .replace(/GG/g, 'kk')
      .replace(/SSS/g, 'uuu')
      .replace(/SS/g, 'uu')
      .replace(/S/g, 'u')
      .replace(/zz/g, 'ZZZZ')
      .replace(/z/g, 'ZZZZ');

    return (
      date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date)
    ).toFormat(luxonFormat, { locale });
  },
  formatToISOString: (date) => DateTime.fromISO(date).toISO() as string,

  /** Parse and validate formatted input */
  parseFormattedValue: (text, format) => {
    // Handle half-year format: convert n to Q for parsing
    let parseFormat = format;
    let parseText = text;

    if (format.includes('[H]n')) {
      // Extract half-year value (1 or 2) and convert to quarter (1-4)
      const halfYearMatch = text.match(/(\d{4})-H(\d)/);
      if (halfYearMatch) {
        const year = halfYearMatch[1];
        const halfYear = parseInt(halfYearMatch[2], 10);

        if (halfYear < 1 || halfYear > 2) {
          return undefined;
        }

        // Convert n to Q: H1 → Q1, H2 → Q3
        const quarter = halfYear === 1 ? 1 : 3;
        parseText = `${year}-Q${quarter}`;
        parseFormat = format.replace('[H]n', '[Q]Q');
      }
    }

    // Convert format from dayjs/moment style to luxon style
    const luxonFormat = parseFormat
      .replace(/\[([^\]]+)\]/g, "'$1'") // Convert [W] to 'W'
      .replace(/YYYY/g, 'yyyy')
      .replace(/YY/g, 'yy')
      .replace(/Y/g, 'y')
      .replace(/dddd/g, 'EEEE')
      .replace(/ddd/g, 'EEE')
      .replace(/dd/g, 'EEE')
      .replace(/d/g, 'E')
      .replace(/DDDD/g, 'ooo')
      .replace(/DDD/g, 'o')
      .replace(/DD/g, 'dd')
      .replace(/D/g, 'd')
      .replace(/e/g, 'E')
      .replace(/WW/g, 'WW')
      .replace(/ww/g, 'WW')
      .replace(/w/g, 'W')
      .replace(/kk/g, 'HH')
      .replace(/k/g, 'H')
      .replace(/gggg/g, 'kkkk')
      .replace(/gg/g, 'kk')
      .replace(/GGGG/g, 'kkkk')
      .replace(/GG/g, 'kk')
      .replace(/SSS/g, 'uuu')
      .replace(/SS/g, 'uu')
      .replace(/S/g, 'u')
      .replace(/zz/g, 'ZZZZ')
      .replace(/z/g, 'ZZZZ');

    const parsed = DateTime.fromFormat(parseText, luxonFormat);

    if (!parsed.isValid) {
      return undefined;
    }

    // Validate based on format keys present (use parseFormat for converted H→Q)
    // Luxon always uses ISO week format (GGGG-[W]WW)
    const hasISOWeek =
      (parseFormat.includes('G') || parseFormat.includes('g')) &&
      (parseFormat.includes('W') || parseFormat.includes('w'));
    const hasQuarter = parseFormat.includes('Q');
    const hasMonth = parseFormat.includes('M') && !hasQuarter;
    const hasDay = parseFormat.includes('D');
    const hasYear =
      parseFormat.includes('Y') ||
      parseFormat.includes('G') ||
      parseFormat.includes('g');

    // If it's a week format - Luxon always uses ISO week
    if (hasISOWeek && hasYear && !hasMonth && !hasDay) {
      const weekYear = parsed.weekYear;
      const weekNum = parsed.weekNumber;

      // Find max weeks in the week year
      const lastWeekOfYear = DateTime.fromObject({ weekYear, weekNumber: 52 });
      const maxWeeks = lastWeekOfYear.weekYear === weekYear ? 52 : 53;

      if (weekNum < 1 || weekNum > maxWeeks) {
        return undefined;
      }

      // Return start of ISO week (Monday)
      return parsed
        .startOf('week')
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toISO() as string;
    }

    // If it's a quarter format, validate and normalize
    if (hasQuarter && hasYear && !hasMonth && !hasDay) {
      const quarter = parsed.quarter;
      if (quarter < 1 || quarter > 4) {
        return undefined;
      }
      return CalendarMethodsLuxon.getCurrentQuarterFirstDate(
        parsed.toISO() as string,
      );
    }

    // If it's a month format without day, normalize to first day
    if (hasMonth && hasYear && !hasDay && !hasISOWeek && !hasQuarter) {
      return CalendarMethodsLuxon.getCurrentMonthFirstDate(
        parsed.toISO() as string,
      );
    }

    // If it's year only, normalize to first day of year
    if (hasYear && !hasMonth && !hasDay && !hasISOWeek && !hasQuarter) {
      return CalendarMethodsLuxon.getCurrentYearFirstDate(
        parsed.toISO() as string,
      );
    }

    // For complete dates, just validate
    if (hasYear && hasMonth && hasDay) {
      return parsed.toISO() as string;
    }

    return parsed.toISO() as string;
  },
};

export default CalendarMethodsLuxon;
