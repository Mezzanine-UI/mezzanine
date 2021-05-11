/** Method Types */
export type CalendarMethods<DateType> = {
  /** Get date infos */
  getNow: () => DateType;
  getSecond: (value: DateType) => number;
  getMinute: (value: DateType) => number;
  getHour: (value: DateType) => number;
  getDate: (value: DateType) => number;
  getWeekDay: (value: DateType) => number;
  getMonth: (value: DateType) => number;
  getYear: (value: DateType) => number;
  getWeekDayNames: (locale: string) => string[];
  getMonthShortName: (value: number, locale: string) => string;
  getMonthShortNames: (locale: string) => Readonly<string[]>;

  /** Manipulate */
  addDay: (value: DateType, diff: number) => DateType;
  addYear: (value: DateType, diff: number) => DateType;
  addMonth: (value: DateType, diff: number) => DateType;
  setSecond: (value: DateType, second: number) => DateType;
  setMinute: (value: DateType, minute: number) => DateType;
  setHour: (value: DateType, hour: number) => DateType;
  setYear: (value: DateType, year: number) => DateType;
  setMonth: (value: DateType, month: number) => DateType;
  setDate: (value: DateType, date: number) => DateType;
  startOf: (value: DateType, granularity: any) => DateType;

  /** Generate day calendar */
  getCalendarGrid: (target: DateType) => number[][];

  /** Compares */
  isBefore: (target: DateType, comparison: DateType) => boolean;
  isBetween: (value: DateType, target1: DateType, target2: DateType, granularity: any) => boolean;
  isSameDate: (dateOne: DateType, dateTwo: DateType) => boolean;
  isSameWeek: (dateOne: DateType, dateTwo: DateType) => boolean;
  isInMonth: (target: DateType, month: number) => boolean;
  isDateIncluded: (date: DateType, targets: DateType[]) => boolean;
  isWeekIncluded: (firstDateOfWeek: DateType, targets: DateType[]) => boolean;
  isMonthIncluded: (date: DateType, targets: DateType[]) => boolean;
  isYearIncluded: (date: DateType, targets: DateType[]) => boolean;

  /** Format */
  formatToString: (locale: string, date: DateType, format: string) => string;

  /** Parse */
  parse: (locale: string, text: string, formats: string[]) => DateType | undefined;
};
