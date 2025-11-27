import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
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
  getWeek: (date) => dayjs(date).week(),
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
  addDay: (date, diff) => dayjs(date).add(diff, 'day').toISOString(),
  addYear: (date, diff) => dayjs(date).add(diff, 'year').toISOString(),
  addMonth: (date, diff) => dayjs(date).add(diff, 'month').toISOString(),
  setSecond: (date, second) => dayjs(date).second(second).toISOString(),
  setMinute: (date, minute) => dayjs(date).minute(minute).toISOString(),
  setHour: (date, hour) => dayjs(date).hour(hour).toISOString(),
  setMonth: (date, month) => dayjs(date).month(month).toISOString(),
  setYear: (date, year) => dayjs(date).year(year).toISOString(),
  setDate: (date, target) => dayjs(date).date(target).toISOString(),
  startOf: (target, granularity) =>
    dayjs(target).startOf(granularity).toISOString(),

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

    return result.format(format);
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

      const date = dayjs(formatText, format, localeMapping(locale), true);

      if (date.isValid()) {
        return date.toISOString();
      }
    }

    return undefined;
  },
};

const CalendarMethods: CalendarMethodsType = hasInit
  ? CalendarMethodsDayjs
  : (() => {
      init();

      return CalendarMethodsDayjs;
    })();

export default CalendarMethods;
