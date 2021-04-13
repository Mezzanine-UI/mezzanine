import moment, { Moment, unitOfTime } from 'moment';
import range from 'lodash/range';
import chunk from 'lodash/chunk';
import { CalendarMethods as CalendarMethodsType } from './typings';

export const CalendarMethods: CalendarMethodsType<Moment> = {
  /** Get date infos */
  getNow: () => moment(),
  getDate: (date) => date.date(),
  getWeekDay: (date) => {
    const clone = date.clone().locale('en_US');

    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getMonth: (date) => date.month(),
  getYear: (date) => date.year(),
  getWeekDayNames: (locale) => {
    const date = moment().locale(locale);

    return date.localeData().weekdaysMin();
  },
  getMonthShortName: (month, locale) => {
    const names = CalendarMethods.getMonthShortNames(locale);

    return names[month];
  },
  getMonthShortNames: (locale) => {
    const date = moment().locale(locale);

    return date.localeData().monthsShort();
  },

  /** Manipulate */
  addDay: (date, diff) => {
    const clone = date.clone();

    return clone.add(diff, 'day');
  },
  addYear: (date, diff) => {
    const clone = date.clone();

    return clone.add(diff, 'year');
  },
  addMonth: (date, diff) => {
    const clone = date.clone();

    return clone.add(diff, 'month');
  },
  setMonth: (date, month) => {
    const clone = date.clone();

    return clone.month(month);
  },
  setYear: (date, year) => {
    const clone = date.clone();

    return clone.year(year);
  },
  setDate: (date, target) => {
    const clone = date.clone();

    return clone.date(target);
  },

  /** Generate day calendar */
  getCalendarGrid: (target) => {
    const lastDateOfPrevMonth = target.clone().subtract(1, 'month').endOf('month').date();
    const firstDayOfCurrentMonth = target.clone().date(1).day();
    const lastDateOfCurrentMonth = target.clone().endOf('month').date();

    return chunk(
      [
        ...range(lastDateOfPrevMonth - firstDayOfCurrentMonth + 1, lastDateOfPrevMonth + 1),
        ...range(1, lastDateOfCurrentMonth + 1),
        ...range(1, 42 - lastDateOfCurrentMonth - firstDayOfCurrentMonth + 1),
      ],
      7,
    );
  },

  /** Compares */
  isBefore: (target, comparison) => target.isBefore(comparison),
  isBetween: (
    value,
    target1,
    target2,
    granularity: unitOfTime.StartOf,
  ) => value.isBetween(target1, target2, granularity),
  isSameDate: (dateOne, dateTwo) => dateOne.isSame(dateTwo, 'date'),
  isSameWeek: (dateOne, dateTwo) => dateOne.isSame(dateTwo, 'week'),
  isInMonth: (target, month) => target.month() === month,
  isDateIncluded: (date, targets) => targets.some((target) => date.isSame(target, 'day')),
  isWeekIncluded: (firstDateOfWeek, targets) => targets.some((target) => firstDateOfWeek.isSame(target, 'week')),
  isMonthIncluded: (date, targets) => targets.some((target) => date.isSame(target, 'month')),
  isYearIncluded: (date, targets) => targets.some((target) => date.isSame(target, 'year')),

  /** Format */
  formatToString: (locale, date, format) => {
    const clone = date.clone();
    const result = clone.locale(locale);

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

      const date = moment(formatText, format, locale, true);

      if (date.isValid()) {
        return date;
      }
    }

    return null;
  },
};
