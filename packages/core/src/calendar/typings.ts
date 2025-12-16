import { DateType } from './calendar';

/** Method Types */
export type CalendarMethods<TDateType = DateType> = {
  /** Get date infos */
  getNow: () => TDateType;
  getSecond: (value: TDateType) => number;
  getMinute: (value: TDateType) => number;
  getHour: (value: TDateType) => number;
  getDate: (value: TDateType) => number;
  /**
   * Get week number based on locale.
   * For locales with Monday as first day (e.g., de-de, fr-fr), returns ISO week number.
   * For locales with Sunday as first day (e.g., en-us, zh-tw), returns locale-based week number.
   */
  getWeek: (value: TDateType, locale: string) => number;
  /**
   * Get the week year (the year that the week belongs to).
   * Important for weeks that span two calendar years.
   */
  getWeekYear: (value: TDateType, locale: string) => number;
  getWeekDay: (value: TDateType) => number;
  getMonth: (value: TDateType) => number;
  getYear: (value: TDateType) => number;
  getQuarter: (value: TDateType) => number;
  getHalfYear: (value: TDateType) => number;
  /**
   * Get localized weekday names, ordered by locale's first day of week.
   * For Monday-first locales: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
   * For Sunday-first locales: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
   */
  getWeekDayNames: (locale: string) => string[];
  getMonthShortName: (value: number, locale: string) => string;
  getMonthShortNames: (locale: string) => Readonly<string[]>;
  /**
   * Get the first day of week for a locale (0 = Sunday, 1 = Monday, etc.)
   */
  getFirstDayOfWeek: (locale: string) => number;
  /**
   * Check if locale uses ISO week (Monday as first day)
   */
  isISOWeekLocale: (locale: string) => boolean;

  /** Manipulate */
  addHour: (value: TDateType, diff: number) => TDateType;
  addMinute: (value: TDateType, diff: number) => TDateType;
  addSecond: (value: TDateType, diff: number) => TDateType;
  addDay: (value: TDateType, diff: number) => TDateType;
  addYear: (value: TDateType, diff: number) => TDateType;
  addMonth: (value: TDateType, diff: number) => TDateType;
  setMillisecond: (value: TDateType, millisecond: number) => TDateType;
  setSecond: (value: TDateType, second: number) => TDateType;
  setMinute: (value: TDateType, minute: number) => TDateType;
  setHour: (value: TDateType, hour: number) => TDateType;
  setYear: (value: TDateType, year: number) => TDateType;
  setMonth: (value: TDateType, month: number) => TDateType;
  setDate: (value: TDateType, date: number) => TDateType;
  startOf: (value: TDateType, granularity: any) => TDateType;

  /** Get first date of period at 00:00:00 */
  /**
   * Get the first date of the week containing the given value.
   * For ISO week locales (Monday-first), returns Monday.
   * For Sunday-first locales, returns Sunday.
   */
  getCurrentWeekFirstDate: (value: TDateType, locale: string) => TDateType;
  getCurrentMonthFirstDate: (value: TDateType) => TDateType;
  getCurrentYearFirstDate: (value: TDateType) => TDateType;
  getCurrentQuarterFirstDate: (value: TDateType) => TDateType;
  getCurrentHalfYearFirstDate: (value: TDateType) => TDateType;

  /**
   * Generate day calendar grid.
   * For ISO week locales (Monday-first), grid starts with Monday.
   * For Sunday-first locales, grid starts with Sunday.
   */
  getCalendarGrid: (target: TDateType, locale: string) => number[][];

  /** Compares */
  isValid: (date: TDateType) => boolean;
  isBefore: (target: TDateType, comparison: TDateType) => boolean;
  isBetween: (
    value: TDateType,
    target1: TDateType,
    target2: TDateType,
    granularity: any,
  ) => boolean;
  isSameDate: (dateOne: TDateType, dateTwo: TDateType) => boolean;
  /**
   * Check if two dates are in the same week.
   * Uses ISO week for Monday-first locales, locale week for Sunday-first locales.
   */
  isSameWeek: (
    dateOne: TDateType,
    dateTwo: TDateType,
    locale: string,
  ) => boolean;
  isInMonth: (target: TDateType, month: number) => boolean;
  isDateIncluded: (date: TDateType, targets: TDateType[]) => boolean;
  /**
   * Check if a week is included in the target dates.
   * Uses ISO week for Monday-first locales, locale week for Sunday-first locales.
   */
  isWeekIncluded: (
    firstDateOfWeek: TDateType,
    targets: TDateType[],
    locale: string,
  ) => boolean;
  isMonthIncluded: (date: TDateType, targets: TDateType[]) => boolean;
  isYearIncluded: (date: TDateType, targets: TDateType[]) => boolean;
  isQuarterIncluded: (date: TDateType, targets: TDateType[]) => boolean;
  isHalfYearIncluded: (date: TDateType, targets: TDateType[]) => boolean;

  /** Format */
  formatToString: (locale: string, date: TDateType, format: string) => string;
  formatToISOString: (date: TDateType) => string;

  /** Parse */
  parse: (
    locale: string,
    text: string,
    formats: string[],
  ) => TDateType | undefined;

  /** Parse and validate formatted input */
  parseFormattedValue: (
    text: string,
    format: string,
    locale: string,
  ) => TDateType | undefined;
};
