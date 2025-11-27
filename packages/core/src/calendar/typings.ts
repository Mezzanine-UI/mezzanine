import { DateType } from './calendar';

/** Method Types */
export type CalendarMethods<TDateType = DateType> = {
  /** Get date infos */
  getNow: () => TDateType;
  getSecond: (value: TDateType) => number;
  getMinute: (value: TDateType) => number;
  getHour: (value: TDateType) => number;
  getDate: (value: TDateType) => number;
  getWeek: (value: TDateType) => number;
  getWeekDay: (value: TDateType) => number;
  getMonth: (value: TDateType) => number;
  getYear: (value: TDateType) => number;
  getQuarter: (value: TDateType) => number;
  getHalfYear: (value: TDateType) => number;
  getWeekDayNames: (locale: string) => string[];
  getMonthShortName: (value: number, locale: string) => string;
  getMonthShortNames: (locale: string) => Readonly<string[]>;

  /** Manipulate */
  addDay: (value: TDateType, diff: number) => TDateType;
  addYear: (value: TDateType, diff: number) => TDateType;
  addMonth: (value: TDateType, diff: number) => TDateType;
  setSecond: (value: TDateType, second: number) => TDateType;
  setMinute: (value: TDateType, minute: number) => TDateType;
  setHour: (value: TDateType, hour: number) => TDateType;
  setYear: (value: TDateType, year: number) => TDateType;
  setMonth: (value: TDateType, month: number) => TDateType;
  setDate: (value: TDateType, date: number) => TDateType;
  startOf: (value: TDateType, granularity: any) => TDateType;

  /** Generate day calendar */
  getCalendarGrid: (target: TDateType) => number[][];

  /** Compares */
  isBefore: (target: TDateType, comparison: TDateType) => boolean;
  isBetween: (
    value: TDateType,
    target1: TDateType,
    target2: TDateType,
    granularity: any,
  ) => boolean;
  isSameDate: (dateOne: TDateType, dateTwo: TDateType) => boolean;
  isSameWeek: (dateOne: TDateType, dateTwo: TDateType) => boolean;
  isInMonth: (target: TDateType, month: number) => boolean;
  isDateIncluded: (date: TDateType, targets: TDateType[]) => boolean;
  isWeekIncluded: (firstDateOfWeek: TDateType, targets: TDateType[]) => boolean;
  isMonthIncluded: (date: TDateType, targets: TDateType[]) => boolean;
  isYearIncluded: (date: TDateType, targets: TDateType[]) => boolean;
  isQuarterIncluded: (date: TDateType, targets: TDateType[]) => boolean;
  isHalfYearIncluded: (date: TDateType, targets: TDateType[]) => boolean;

  /** Format */
  formatToString: (locale: string, date: TDateType, format: string) => string;

  /** Parse */
  parse: (
    locale: string,
    text: string,
    formats: string[],
  ) => TDateType | undefined;
};
