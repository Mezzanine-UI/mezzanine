import moment, { unitOfTime } from 'moment';
import range from 'lodash/range';
import chunk from 'lodash/chunk';
import { CalendarMethods as CalendarMethodsType } from '../calendar/typings';

const CalendarMethodsMoment: CalendarMethodsType = {
  /** Get date infos */
  getNow: () => moment().toISOString(),
  getSecond: (date) => moment(date).second(),
  getMinute: (date) => moment(date).minute(),
  getHour: (date) => moment(date).hour(),
  getDate: (date) => moment(date).date(),
  getWeek: (date) => moment(date).isoWeek(),
  getWeekDay: (date) => {
    const clone = moment(date).locale('en_US');

    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getMonth: (date) => moment(date).month(),
  getYear: (date) => moment(date).year(),
  getQuarter: (date) => moment(date).quarter(),
  getHalfYear: (date) => Math.floor(moment(date).month() / 6) + 1,
  getWeekDayNames: (locale) => {
    const date = moment().locale(locale);

    return date.localeData().weekdaysMin();
  },
  getMonthShortName: (month, locale) => {
    const names = CalendarMethodsMoment.getMonthShortNames(locale);

    return names[month];
  },
  getMonthShortNames: (locale) => {
    const date = moment().locale(locale);

    return date.localeData().monthsShort();
  },

  /** Manipulate */
  addHour: (date, diff) => {
    const clone = moment(date);

    return clone.add(diff, 'hour').toISOString();
  },
  addMinute: (date, diff) => {
    const clone = moment(date);

    return clone.add(diff, 'minute').toISOString();
  },
  addSecond: (date, diff) => {
    const clone = moment(date);

    return clone.add(diff, 'second').toISOString();
  },
  addDay: (date, diff) => {
    const clone = moment(date);

    return clone.add(diff, 'day').toISOString();
  },
  addYear: (date, diff) => {
    const clone = moment(date);

    return clone.add(diff, 'year').toISOString();
  },
  addMonth: (date, diff) => {
    const clone = moment(date);

    return clone.add(diff, 'month').toISOString();
  },
  setMillisecond: (date, millisecond) => {
    const clone = moment(date);

    return clone.millisecond(millisecond).toISOString();
  },
  setSecond: (date, second) => {
    const clone = moment(date);

    return clone.second(second).toISOString();
  },
  setMinute: (date, minute) => {
    const clone = moment(date);

    return clone.minute(minute).toISOString();
  },
  setHour: (date, hour) => {
    const clone = moment(date);

    return clone.hour(hour).toISOString();
  },
  setMonth: (date, month) => {
    const clone = moment(date);

    return clone.month(month).toISOString();
  },
  setYear: (date, year) => {
    const clone = moment(date);

    return clone.year(year).toISOString();
  },
  setDate: (date, target) => {
    const clone = moment(date);

    return clone.date(target).toISOString();
  },
  startOf: (target, granularity: unitOfTime.StartOf) =>
    moment(target).startOf(granularity).toISOString(),

  /** Get first date of period at 00:00:00 */
  getCurrentWeekFirstDate: (value) => {
    // Get ISO week start date, then normalize to UTC midnight
    const weekStart = moment(value).startOf('isoWeek');
    // Get the date portion and create a new date at UTC midnight
    const year = weekStart.year();
    const month = weekStart.month();
    const date = weekStart.date();
    return moment
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
    moment(value)
      .startOf('month')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString(),
  getCurrentYearFirstDate: (value) =>
    moment(value)
      .startOf('year')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString(),
  getCurrentQuarterFirstDate: (value) => {
    const m = moment(value);
    const quarterStart = Math.floor(m.month() / 3) * 3;
    return m
      .month(quarterStart)
      .startOf('month')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();
  },
  getCurrentHalfYearFirstDate: (value) => {
    const m = moment(value);
    const halfYearStart = Math.floor(m.month() / 6) * 6;
    return m
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
    const lastDateOfPrevMonth = moment(target)
      .subtract(1, 'month')
      .endOf('month')
      .date();
    const firstDayOfCurrentMonth = moment(target).date(1).day();
    const lastDateOfCurrentMonth = moment(target).endOf('month').date();

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
  isBefore: (target, comparison) => moment(target).isBefore(comparison),
  isBetween: (value, target1, target2, granularity: unitOfTime.StartOf) =>
    moment(value).isBetween(target1, target2, granularity),
  isSameDate: (dateOne, dateTwo) =>
    moment(dateOne).isSame(moment(dateTwo), 'date'),
  isSameWeek: (dateOne, dateTwo) =>
    moment(dateOne).isSame(moment(dateTwo), 'week'),
  isInMonth: (target, month) => moment(target).month() === month,
  isDateIncluded: (date, targets) =>
    targets.some((target) => moment(date).isSame(moment(target), 'day')),
  isWeekIncluded: (firstDateOfWeek, targets) =>
    targets.some((target) =>
      moment(firstDateOfWeek).isSame(moment(target), 'week'),
    ),
  isMonthIncluded: (date, targets) =>
    targets.some((target) => moment(date).isSame(moment(target), 'month')),
  isYearIncluded: (date, targets) =>
    targets.some((target) => moment(date).isSame(moment(target), 'year')),
  isQuarterIncluded: (date, targets) =>
    targets.some((target) => moment(date).isSame(moment(target), 'quarter')),
  isHalfYearIncluded: (date, targets) => {
    const halfYear = Math.floor(moment(date).month() / 6);
    return targets.some((target) => {
      const targetHalfYear = Math.floor(moment(target).month() / 6);
      return (
        moment(date).isSame(moment(target), 'year') &&
        halfYear === targetHalfYear
      );
    });
  },

  /** Format */
  formatToString: (locale, date, format) => {
    const clone = moment(date);
    const result = clone.locale(locale);

    // Handle half-year format: convert n to half-year number (1 or 2)
    if (format.includes('[H]n')) {
      const quarter = result.quarter();
      const halfYear = Math.ceil(quarter / 2);
      return result.format(format.replace('n', halfYear.toString()));
    }

    return result.format(format);
  },
  formatToISOString: (date) => moment(date).toISOString(),

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

      const date = moment(formatText, format, locale, true);

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

    const parsed = moment(parseText, parseFormat, true);

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
      let checkDate = moment(`${year}-12-28`);
      while (checkDate.isoWeekYear() !== year && checkDate.month() === 11) {
        checkDate = checkDate.subtract(1, 'day');
      }
      const maxWeeks =
        checkDate.isoWeekYear() === year ? checkDate.isoWeek() : 52;

      if (weekNum > maxWeeks) {
        return undefined;
      }

      return CalendarMethodsMoment.getCurrentWeekFirstDate(
        parsed.toISOString(),
      );
    }

    // If it's a quarter format, validate and normalize
    if (hasQuarter && hasYear && !hasMonth && !hasDay) {
      const quarter = parsed.quarter();
      if (quarter < 1 || quarter > 4) {
        return undefined;
      }
      return CalendarMethodsMoment.getCurrentQuarterFirstDate(
        parsed.toISOString(),
      );
    }

    // If it's a month format without day, normalize to first day
    if (hasMonth && hasYear && !hasDay && !hasWeek && !hasQuarter) {
      return CalendarMethodsMoment.getCurrentMonthFirstDate(
        parsed.toISOString(),
      );
    }

    // If it's year only, normalize to first day of year
    if (hasYear && !hasMonth && !hasDay && !hasWeek && !hasQuarter) {
      return CalendarMethodsMoment.getCurrentYearFirstDate(
        parsed.toISOString(),
      );
    }

    // For complete dates, just validate
    if (hasYear && hasMonth && hasDay) {
      return parsed.toISOString();
    }

    return parsed.toISOString();
  },
};

export default CalendarMethodsMoment;
