import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import IsoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import range from 'lodash/range';
import chunk from 'lodash/chunk';
import { CalendarMethods as CalendarMethodsType } from '../calendar/typings';

const localeMappingTable: Record<string, string> = {
  'en-us': 'en',
};

const localeMapping = (locale: string) => localeMappingTable[locale] ?? locale;

const hasInit = false;

function init() {
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(isBetween);
  dayjs.extend(weekOfYear);
  dayjs.extend(IsoWeek);
  dayjs.extend(utc);
  dayjs.extend(quarterOfYear);

  return true;
}

const CalendarMethodsDayjs: CalendarMethodsType = {
  /** Get date infos */
  getNow: () => dayjs().toISOString(),
  getSecond: (date) => dayjs(date).second(),
  getMinute: (date) => dayjs(date).minute(),
  getHour: (date) => dayjs(date).hour(),
  getDate: (date) => dayjs(date).date(),
  getWeek: (date) => dayjs(date).isoWeek(),
  getWeekDay: (date) => {
    const clone = dayjs(date).locale('en');

    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getMonth: (date) => dayjs(date).month(),
  getYear: (date) => dayjs(date).year(),
  getQuarter: (date) => dayjs(date).quarter(),
  getHalfYear: (date) => Math.floor(dayjs(date).month() / 6) + 1,
  getWeekDayNames: (locale) => {
    return dayjs().locale(localeMapping(locale)).localeData().weekdaysMin();
  },
  getMonthShortName: (month, locale) => {
    const names = CalendarMethodsDayjs.getMonthShortNames(
      localeMapping(locale),
    );

    return names[month];
  },
  getMonthShortNames: (locale) => {
    return dayjs().locale(localeMapping(locale)).localeData().monthsShort();
  },

  /** Manipulate */
  addHour: (date, diff) => dayjs(date).add(diff, 'hour').toISOString(),
  addMinute: (date, diff) => dayjs(date).add(diff, 'minute').toISOString(),
  addSecond: (date, diff) => dayjs(date).add(diff, 'second').toISOString(),
  addDay: (date, diff) => dayjs(date).add(diff, 'day').toISOString(),
  addYear: (date, diff) => dayjs(date).add(diff, 'year').toISOString(),
  addMonth: (date, diff) => dayjs(date).add(diff, 'month').toISOString(),
  setMillisecond: (date, millisecond) =>
    dayjs(date).millisecond(millisecond).toISOString(),
  setSecond: (date, second) => dayjs(date).second(second).toISOString(),
  setMinute: (date, minute) => dayjs(date).minute(minute).toISOString(),
  setHour: (date, hour) => dayjs(date).hour(hour).toISOString(),
  setMonth: (date, month) => dayjs(date).month(month).toISOString(),
  setYear: (date, year) => dayjs(date).year(year).toISOString(),
  setDate: (date, target) => dayjs(date).date(target).toISOString(),
  startOf: (target, granularity) =>
    dayjs(target).startOf(granularity).toISOString(),

  /** Get first date of period at 00:00:00 */
  getCurrentWeekFirstDate: (value) => {
    // Get ISO week start date, then normalize to UTC midnight
    const weekStart = dayjs(value).startOf('isoWeek');
    // Get the date portion and create a new date at UTC midnight
    const year = weekStart.year();
    const month = weekStart.month();
    const date = weekStart.date();
    return dayjs
      .utc()
      .year(year)
      .month(month)
      .date(date)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();
  },
  getCurrentMonthFirstDate: (value) =>
    dayjs(value)
      .startOf('month')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString(),
  getCurrentYearFirstDate: (value) =>
    dayjs(value)
      .startOf('year')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString(),
  getCurrentQuarterFirstDate: (value) => {
    const d = dayjs(value);
    const quarterStart = Math.floor(d.month() / 3) * 3;
    return d
      .month(quarterStart)
      .startOf('month')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();
  },
  getCurrentHalfYearFirstDate: (value) => {
    const d = dayjs(value);
    const halfYearStart = Math.floor(d.month() / 6) * 6;
    return d
      .month(halfYearStart)
      .startOf('month')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();
  },

  /** Generate day calendar */
  getCalendarGrid: (target) => {
    const lastDateOfPrevMonth = dayjs(target)
      .subtract(1, 'month')
      .endOf('month')
      .date();
    const firstDayOfCurrentMonth = dayjs(target).date(1).day();
    const lastDateOfCurrentMonth = dayjs(target).endOf('month').date();

    return chunk(
      [
        ...range(
          lastDateOfPrevMonth - firstDayOfCurrentMonth + 1,
          lastDateOfPrevMonth + 1,
        ),
        ...range(1, lastDateOfCurrentMonth + 1),
        ...range(1, 42 - lastDateOfCurrentMonth - firstDayOfCurrentMonth + 1),
      ],
      7,
    );
  },

  /** Compares */
  isBefore: (target, comparison) => dayjs(target).isBefore(comparison),
  isBetween: (value, target1, target2, granularity) =>
    dayjs(value).isBetween(target1, target2, granularity),
  isSameDate: (dateOne, dateTwo) =>
    dayjs(dateOne).isSame(dayjs(dateTwo), 'date'),
  isSameWeek: (dateOne, dateTwo) =>
    dayjs(dateOne).isSame(dayjs(dateTwo), 'week'),
  isInMonth: (target, month) => dayjs(target).month() === month,
  isDateIncluded: (date, targets) =>
    targets.some((target) => dayjs(date).isSame(dayjs(target), 'day')),
  isWeekIncluded: (firstDateOfWeek, targets) =>
    targets.some((target) =>
      dayjs(firstDateOfWeek).isSame(dayjs(target), 'week'),
    ),
  isMonthIncluded: (date, targets) =>
    targets.some((target) => dayjs(date).isSame(dayjs(target), 'month')),
  isYearIncluded: (date, targets) =>
    targets.some((target) => dayjs(date).isSame(dayjs(target), 'year')),
  isQuarterIncluded: (date, targets) =>
    targets.some((target) => dayjs(date).isSame(dayjs(target), 'quarter')),
  isHalfYearIncluded: (date, targets) => {
    const halfYear = Math.floor(dayjs(date).month() / 6);
    return targets.some((target) => {
      const targetHalfYear = Math.floor(dayjs(target).month() / 6);
      return (
        dayjs(date).isSame(dayjs(target), 'year') && halfYear === targetHalfYear
      );
    });
  },

  /** Format */
  formatToString: (locale, date, format) => {
    const clone = dayjs(date);
    const result = clone.locale(localeMapping(locale));

    // Handle half-year format: convert n to half-year number (1 or 2)
    if (format.includes('[H]n')) {
      const quarter = result.quarter();
      const halfYear = Math.ceil(quarter / 2);
      return result.format(format.replace('n', halfYear.toString()));
    }

    return result.format(format);
  },
  formatToISOString: (date) => dayjs(date).toISOString(),

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

      const date = dayjs(formatText, format, localeMapping(locale), true);

      if (date.isValid()) {
        return date.toISOString();
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

    // Try to parse with dayjs
    const parsed = dayjs(parseText, parseFormat, 'en', true);

    if (!parsed.isValid()) {
      return undefined;
    }

    // Validate based on format keys present
    const hasWeek = parseFormat.includes('W');
    const hasQuarter = parseFormat.includes('Q');
    const hasMonth = parseFormat.includes('M') && !hasQuarter;
    const hasDay = parseFormat.includes('D');
    const hasYear = parseFormat.includes('Y') || parseFormat.includes('G');

    // If it's a week format, validate that the week number is valid for that year
    if (hasWeek && hasYear && !hasMonth && !hasDay) {
      // Use ISO week year for validation (GGGG format)
      const year = parsed.isoWeekYear();
      const weekNum = parsed.isoWeek();

      // Find max ISO weeks in the year
      // Check from 12-28 which is always in the last week of the ISO year
      let checkDate = dayjs(`${year}-12-28`);
      while (checkDate.isoWeekYear() !== year && checkDate.month() === 11) {
        checkDate = checkDate.subtract(1, 'day');
      }
      const maxWeeks =
        checkDate.isoWeekYear() === year ? checkDate.isoWeek() : 52;

      if (weekNum > maxWeeks) {
        return undefined;
      }

      return CalendarMethodsDayjs.getCurrentWeekFirstDate(parsed.toISOString());
    }

    // If it's a quarter format, validate and normalize
    if (hasQuarter && hasYear && !hasMonth && !hasDay) {
      const quarter = parsed.quarter();
      if (quarter < 1 || quarter > 4) {
        return undefined;
      }
      return CalendarMethodsDayjs.getCurrentQuarterFirstDate(
        parsed.toISOString(),
      );
    }

    // If it's a month format without day, normalize to first day
    if (hasMonth && hasYear && !hasDay && !hasWeek && !hasQuarter) {
      return CalendarMethodsDayjs.getCurrentMonthFirstDate(
        parsed.toISOString(),
      );
    }

    // If it's year only, normalize to first day of year
    if (hasYear && !hasMonth && !hasDay && !hasWeek && !hasQuarter) {
      return CalendarMethodsDayjs.getCurrentYearFirstDate(parsed.toISOString());
    }

    // For complete dates, just validate
    if (hasYear && hasMonth && hasDay) {
      return parsed.toISOString();
    }

    return parsed.toISOString();
  },
};

const CalendarMethods: CalendarMethodsType = hasInit
  ? CalendarMethodsDayjs
  : (() => {
      init();

      return CalendarMethodsDayjs;
    })();

export default CalendarMethods;
