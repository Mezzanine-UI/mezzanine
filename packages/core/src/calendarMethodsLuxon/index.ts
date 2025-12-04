import { DateTime, Info, Interval } from 'luxon';
import range from 'lodash/range';
import chunk from 'lodash/chunk';
import { CalendarMethods as CalendarMethodsType } from '../calendar/typings';

const CalendarMethodsLuxon: CalendarMethodsType = {
  /** Get date infos */
  getNow: () => DateTime.now().toISO() as string,
  getSecond: (date) => DateTime.fromISO(date).second,
  getMinute: (date) => DateTime.fromISO(date).minute,
  getHour: (date) => DateTime.fromISO(date).hour,
  getDate: (date) => DateTime.fromISO(date).day,
  getWeek: (date) => DateTime.fromISO(date).weekNumber,
  getWeekDay: (date) => DateTime.fromISO(date).weekday,
  getMonth: (date) => DateTime.fromISO(date).month - 1,
  getYear: (date) => DateTime.fromISO(date).year,
  getQuarter: (date) => DateTime.fromISO(date).quarter,
  getHalfYear: (date) => Math.floor((DateTime.fromISO(date).month - 1) / 6) + 1,
  getWeekDayNames: (locale) => Info.weekdays('narrow', { locale }),
  getMonthShortName: (month, locale) =>
    DateTime.now()
      .set({ month: month + 1 })
      .toFormat('MMM', { locale }),
  getMonthShortNames: (locale) => Info.months('short', { locale }),

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

  /** Get first date of period at 00:00:00 */
  getCurrentWeekFirstDate: (value) => {
    // Get ISO week start date (Monday)
    const weekStart = DateTime.fromISO(value).startOf('week');
    // Create UTC date at midnight using the date portion
    return DateTime.utc(
      weekStart.year,
      weekStart.month,
      weekStart.day,
      0,
      0,
      0,
      0,
    ).toISO() as string;
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

  /** Generate day calendar */
  getCalendarGrid: (target) => {
    const lastDateOfPrevMonth = DateTime.fromISO(target)
      .minus({ month: 1 })
      .endOf('month').day;
    const firstDayOfCurrentMonth = DateTime.fromISO(target).set({
      day: 1,
    }).weekday;
    const lastDateOfCurrentMonth = DateTime.fromISO(target).endOf('month').day;

    return chunk(
      [
        ...range(
          lastDateOfPrevMonth - firstDayOfCurrentMonth + 2,
          lastDateOfPrevMonth + 1,
        ),
        ...range(1, lastDateOfCurrentMonth + 1),
        ...range(1, 42 - lastDateOfCurrentMonth - firstDayOfCurrentMonth + 2),
      ],
      7,
    );
  },

  /** Compares */
  isBefore: (target, comparison) =>
    DateTime.fromISO(target) < DateTime.fromISO(comparison),
  isBetween: (value, target1, target2) =>
    Interval.fromDateTimes(
      DateTime.fromISO(target1),
      DateTime.fromISO(target2),
    ).contains(DateTime.fromISO(value)),
  isSameDate: (dateOne, dateTwo) =>
    DateTime.fromISO(dateOne).hasSame(DateTime.fromISO(dateTwo), 'day'),
  isSameWeek: (dateOne, dateTwo) =>
    DateTime.fromISO(dateOne).hasSame(DateTime.fromISO(dateTwo), 'week'),
  isInMonth: (target, month) => DateTime.fromISO(target).month === month + 1,
  isDateIncluded: (date, targets) =>
    targets.some((target) =>
      DateTime.fromISO(date).hasSame(DateTime.fromISO(target), 'day'),
    ),
  isWeekIncluded: (firstDateOfWeek, targets) =>
    targets.some((target) =>
      DateTime.fromISO(firstDateOfWeek).hasSame(
        DateTime.fromISO(target),
        'week',
      ),
    ),
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

  /** Parse */
  parse: (locale, text, formats) => {
    for (let i = 0; i < formats.length; i += 1) {
      let format = formats[i];
      let formatText = text;

      if (format.includes('wo') || format.includes('Wo')) {
        format = format.replace(/wo/g, 'w').replace(/Wo/g, 'W');

        const matchFormat = format.match(/[-YyMmDdHhSsWwGg]+/g);
        const matchText = formatText.match(/[-\d]+/g);

        if (matchFormat && matchText) {
          format = matchFormat.join('');
          formatText = matchText.join('');
        }
      }

      const date = DateTime.fromFormat(formatText, format, { locale });

      if (date.isValid) {
        return date.toISO() as string;
      }
    }

    return undefined;
  },

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
    const hasWeek = parseFormat.includes('W');
    const hasQuarter = parseFormat.includes('Q');
    const hasMonth = parseFormat.includes('M') && !hasQuarter;
    const hasDay = parseFormat.includes('D');
    const hasYear = parseFormat.includes('Y') || parseFormat.includes('G');

    // If it's a week format, validate that the week number is valid for that year
    if (hasWeek && hasYear && !hasMonth && !hasDay) {
      // Use ISO week year for validation (kkkk in luxon, GGGG in moment/dayjs)
      const year = parsed.weekYear;
      const weekNum = parsed.weekNumber;

      // Find max ISO weeks in the year
      // Check from 12-28 which is always in the last week of the ISO year
      let checkDate = DateTime.fromObject({ year, month: 12, day: 28 });
      while (checkDate.weekYear !== year && checkDate.month === 12) {
        checkDate = checkDate.minus({ day: 1 });
      }
      const maxWeeks = checkDate.weekYear === year ? checkDate.weekNumber : 52;

      if (weekNum > maxWeeks) {
        return undefined;
      }

      return CalendarMethodsLuxon.getCurrentWeekFirstDate(
        parsed.toISO() as string,
      );
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
    if (hasMonth && hasYear && !hasDay && !hasWeek && !hasQuarter) {
      return CalendarMethodsLuxon.getCurrentMonthFirstDate(
        parsed.toISO() as string,
      );
    }

    // If it's year only, normalize to first day of year
    if (hasYear && !hasMonth && !hasDay && !hasWeek && !hasQuarter) {
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
