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
  getCurrentWeekFirstDate: (value) =>
    moment(value)
      .startOf('week')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString(),
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
};

export default CalendarMethodsMoment;
