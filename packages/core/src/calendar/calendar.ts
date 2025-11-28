/** Types */
export type CalendarMode =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'quarter'
  | 'half-year';

/** ISO 8601 text */
export type DateType = string;

/** Classes */
export const calendarPrefix = 'mzn-calendar';
export const calendarMainPrefix = `${calendarPrefix}-main`;
export const calendarBoardPrefix = `${calendarPrefix}-board`;
export const calendarWeekPrefix = `${calendarPrefix}-week`;
export const calendarDaysGridPrefix = `${calendarPrefix}-days-grid`;
export const calendarRowPrefix = `${calendarPrefix}-row`;
export const calendarCellPrefix = `${calendarPrefix}-cell`;
export const calendarButtonPrefix = `${calendarPrefix}-button`;
export const calendarTwelveGridPrefix = `${calendarPrefix}-twelve-grid`;
export const calendarControlsPrefix = `${calendarPrefix}-controls`;
export const calendarFooterControlPrefix = `${calendarPrefix}-footer-control`;
export const calendarFooterActionsPrefix = `${calendarPrefix}-footer-actions`;

export const calendarClasses = {
  host: calendarPrefix,
  rangeHost: `${calendarPrefix}--range`,
  noShadowHost: `${calendarPrefix}--no-shadow`,
  mode: (mode: CalendarMode) => `${calendarPrefix}--${mode}`,
  main: calendarMainPrefix,

  /** Date grid classes */
  board: calendarBoardPrefix,
  week: calendarWeekPrefix,
  weekRow: `${calendarWeekPrefix}__row`,
  daysGrid: calendarDaysGridPrefix,

  /** Button classes */
  button: calendarButtonPrefix,
  buttonActive: `${calendarButtonPrefix}--active`,
  buttonDisabled: `${calendarButtonPrefix}--disabled`,
  buttonInRange: `${calendarButtonPrefix}--inRange`,
  buttonInactive: `${calendarButtonPrefix}--inactive`,

  /** Row classes */
  row: calendarRowPrefix,
  rowWithBorder: `${calendarRowPrefix}--with-border`,

  /** Cell classes */
  cell: calendarCellPrefix,
  cellInner: `${calendarCellPrefix}__inner`,
  cellActive: `${calendarCellPrefix}--active`,
  cellDisabled: `${calendarCellPrefix}--disabled`,

  /** Twelve grid classes */
  twelveGrid: calendarTwelveGridPrefix,

  /** Controls classes */
  controls: calendarControlsPrefix,
  controlsActions: `${calendarControlsPrefix}__actions`,
  controlsButton: `${calendarControlsPrefix}__button`,
  controlsMain: `${calendarControlsPrefix}__main`,

  /** Footer control classes */
  footerControl: calendarFooterControlPrefix,
  footerActions: calendarFooterActionsPrefix,
};

/** Constants */
export const calendarYearsBase = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const calendarYearModuler = 10;
export const calendarMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const calendarQuarters = [1, 2, 3, 4];
export const calendarQuarterYearsCount = 5;
export const calendarHalfYears = [1, 2];
export const calendarHalfYearYearsCount = 5;

/** Helpers */
export function getYearRange(year: number, mod: number) {
  const remainder = year % mod;
  const end = year + (mod - 1) - remainder;
  const start = end - (mod - 1);

  return [start, end];
}

export function getCalendarYearRange(year: number) {
  const [start, end] = getYearRange(year, calendarYearModuler);

  return [start - 1, end + 1];
}

export function getDefaultModeFormat(mode: CalendarMode) {
  if (mode === 'week') {
    return 'gggg-wo';
  }

  if (mode === 'month') {
    return 'YYYY-MM';
  }

  if (mode === 'year') {
    return 'YYYY';
  }

  if (mode === 'quarter') {
    return 'YYYY-[Q]Q';
  }

  if (mode === 'half-year') {
    // Use quarter format as base, will be converted to half-year (Q1,Q2→H1, Q3,Q4→H2)
    return 'YYYY-[Q]Q';
  }

  return 'YYYY-MM-DD';
}
