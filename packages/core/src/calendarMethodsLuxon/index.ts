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
  getWeekDay: (date) => DateTime.fromISO(date).weekday,
  getMonth: (date) => DateTime.fromISO(date).month - 1,
  getYear: (date) => DateTime.fromISO(date).year,
  getWeekDayNames: (locale) => Info.weekdays('narrow', { locale }),
  getMonthShortName: (month, locale) => DateTime.now().set({ month: month + 1 }).toFormat('MMM', { locale }),
  getMonthShortNames: (locale) => Info.months('short', { locale }),

  /** Manipulate */
  addDay: (date, diff) => DateTime.fromISO(date).plus({ day: diff }).toISO() as string,
  addYear: (date, diff) => DateTime.fromISO(date).plus({ year: diff }).toISO() as string,
  addMonth: (date, diff) => DateTime.fromISO(date).plus({ month: diff }).toISO() as string,
  setSecond: (date, second) => DateTime.fromISO(date).set({ second }).toISO() as string,
  setMinute: (date, minute) => DateTime.fromISO(date).set({ minute }).toISO() as string,
  setHour: (date, hour) => DateTime.fromISO(date).set({ hour }).toISO() as string,
  setMonth: (date, month) => DateTime.fromISO(date).set({ month: month + 1 }).toISO() as string,
  setYear: (date, year) => DateTime.fromISO(date).set({ year }).toISO() as string,
  setDate: (date, target) => DateTime.fromISO(date).set({ day: target }).toISO() as string,
  startOf: (target, granularity) => DateTime.fromISO(target).startOf(granularity).toISO() as string,

  /** Generate day calendar */
  getCalendarGrid: (target) => {
    const lastDateOfPrevMonth = DateTime.fromISO(target).minus({ month: 1 }).endOf('month').day;
    const firstDayOfCurrentMonth = DateTime.fromISO(target).set({ day: 1 }).weekday;
    const lastDateOfCurrentMonth = DateTime.fromISO(target).endOf('month').day;

    return chunk(
      [
        ...range(lastDateOfPrevMonth - firstDayOfCurrentMonth + 2, lastDateOfPrevMonth + 1),
        ...range(1, lastDateOfCurrentMonth + 1),
        ...range(1, 42 - lastDateOfCurrentMonth - firstDayOfCurrentMonth + 2),
      ],
      7,
    );
  },

  /** Compares */
  isBefore: (target, comparison) => DateTime.fromISO(target) < DateTime.fromISO(comparison),
  isBetween: (
    value,
    target1,
    target2,
  ) => Interval.fromDateTimes(DateTime.fromISO(target1), DateTime.fromISO(target2)).contains(DateTime.fromISO(value)),
  isSameDate: (dateOne, dateTwo) => DateTime.fromISO(dateOne).hasSame(DateTime.fromISO(dateTwo), 'day'),
  isSameWeek: (dateOne, dateTwo) => DateTime.fromISO(dateOne).hasSame(DateTime.fromISO(dateTwo), 'week'),
  isInMonth: (target, month) => DateTime.fromISO(target).month === month + 1,
  isDateIncluded: (date, targets) => targets
    .some((target) => DateTime.fromISO(date).hasSame(DateTime.fromISO(target), 'day')),
  isWeekIncluded: (firstDateOfWeek, targets) => targets.some(
    (target) => DateTime.fromISO(firstDateOfWeek).hasSame(DateTime.fromISO(target), 'week')),
  isMonthIncluded: (date, targets) => targets
    .some((target) => DateTime.fromISO(date).hasSame(DateTime.fromISO(target), 'month')),
  isYearIncluded: (date, targets) => targets
    .some((target) => DateTime.fromISO(date).hasSame(DateTime.fromISO(target), 'year')),

  /** Format */
  formatToString: (locale, date: string | Date, format) => {
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

    return (date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date))
      .toFormat(luxonFormat, { locale });
  },

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
};

export default CalendarMethodsLuxon;
