import type { CalendarMode, DateType } from './calendar';
import {
  calendarFooterControlDefaultLabels,
  getCalendarFooterControlLabel,
  getCalendarFooterControlTarget,
  isCalendarFooterControlDisabled,
  type CalendarFooterControlMethods,
} from './footerControl';

const NOW = '2026-11-06T15:30:45.123Z';

const methods: CalendarFooterControlMethods = {
  getCurrentHalfYearFirstDate: (value) => `half-year:${value}`,
  getCurrentMonthFirstDate: (value) => `month:${value}`,
  getCurrentQuarterFirstDate: (value) => `quarter:${value}`,
  getCurrentWeekFirstDate: (value, locale) => `week:${value}:${locale}`,
  getCurrentYearFirstDate: (value) => `year:${value}`,
  getNow: () => NOW,
  setHour: (value, hour) => `${value}|h${hour}`,
  setMillisecond: (value, millisecond) => `${value}|ms${millisecond}`,
  setMinute: (value, minute) => `${value}|m${minute}`,
  setSecond: (value, second) => `${value}|s${second}`,
};

const never = (): boolean => false;
const always = (): boolean => true;

describe('getCalendarFooterControlLabel', () => {
  it.each<[CalendarMode, string]>([
    ['day', 'Today'],
    ['week', 'This week'],
    ['month', 'This month'],
    ['year', 'This year'],
    ['quarter', 'This quarter'],
    ['half-year', 'This half year'],
  ])('should default to the English label in %s mode', (mode, label) => {
    expect(calendarFooterControlDefaultLabels[mode]).toBe(label);
    expect(getCalendarFooterControlLabel(mode)).toBe(label);
  });

  it('should apply a string to every mode', () => {
    expect(getCalendarFooterControlLabel('day', '現在')).toBe('現在');
    expect(getCalendarFooterControlLabel('month', '現在')).toBe('現在');
  });

  it('should override only the modes present in a map', () => {
    const children = { day: '今天' };

    expect(getCalendarFooterControlLabel('day', children)).toBe('今天');
    expect(getCalendarFooterControlLabel('month', children)).toBe('This month');
  });
});

describe('getCalendarFooterControlTarget', () => {
  it('should reset the time part in day mode', () => {
    expect(getCalendarFooterControlTarget('day', methods, 'en-us')).toBe(
      `${NOW}|h0|m0|s0|ms0`,
    );
  });

  it('should resolve the week start with the given locale', () => {
    expect(getCalendarFooterControlTarget('week', methods, 'zh-tw')).toBe(
      `week:${NOW}:zh-tw`,
    );
  });

  it.each<[CalendarMode, string]>([
    ['month', `month:${NOW}`],
    ['year', `year:${NOW}`],
    ['quarter', `quarter:${NOW}`],
    ['half-year', `half-year:${NOW}`],
  ])('should resolve the period start in %s mode', (mode, target) => {
    expect(getCalendarFooterControlTarget(mode, methods, 'en-us')).toBe(target);
  });
});

describe('isCalendarFooterControlDisabled', () => {
  const target: DateType = '2026-11-01';

  it('should stay enabled without predicates', () => {
    expect(isCalendarFooterControlDisabled('day', target, {})).toBe(false);
  });

  it('should pass the target to the predicate', () => {
    const isDateDisabled = jest.fn(never);

    isCalendarFooterControlDisabled('day', target, { isDateDisabled });

    expect(isDateDisabled).toHaveBeenCalledWith(target);
  });

  it.each<[CalendarMode, string]>([
    ['day', 'isYearDisabled'],
    ['day', 'isMonthDisabled'],
    ['day', 'isDateDisabled'],
    ['week', 'isYearDisabled'],
    ['week', 'isMonthDisabled'],
    ['week', 'isWeekDisabled'],
    ['month', 'isYearDisabled'],
    ['month', 'isMonthDisabled'],
    ['year', 'isYearDisabled'],
    ['quarter', 'isQuarterDisabled'],
    ['half-year', 'isHalfYearDisabled'],
  ])('should be disabled in %s mode by %s', (mode, predicate) => {
    expect(
      isCalendarFooterControlDisabled(mode, target, { [predicate]: always }),
    ).toBe(true);
  });

  it.each<[CalendarMode, string]>([
    ['day', 'isWeekDisabled'],
    ['week', 'isDateDisabled'],
    ['month', 'isDateDisabled'],
    ['year', 'isMonthDisabled'],
    ['quarter', 'isYearDisabled'],
    ['half-year', 'isYearDisabled'],
  ])('should ignore in %s mode the unrelated %s', (mode, predicate) => {
    expect(
      isCalendarFooterControlDisabled(mode, target, { [predicate]: always }),
    ).toBe(false);
  });
});
