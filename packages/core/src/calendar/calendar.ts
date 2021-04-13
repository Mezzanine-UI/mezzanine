/** Types */
export type CalendarMode = 'year' | 'month' | 'week' | 'day';

/** Classes */
export const calendarPrefix = 'mzn-calendar';
export const calendarBoardPrefix = `${calendarPrefix}-board`;
export const calendarRowPrefix = `${calendarPrefix}-row`;
export const calendarCellPrefix = `${calendarPrefix}-cell`;
export const calendarButtonPrefix = `${calendarPrefix}-button`;
export const calendarTwelveGridPrefix = `${calendarPrefix}-twelve-grid`;
export const calendarControlsPrefix = `${calendarPrefix}-controls`;

export const calendarClasses = {
  host: calendarPrefix,

  /** Date grid classes */
  board: calendarBoardPrefix,

  /** Button classes */
  button: calendarButtonPrefix,
  buttonActive: `${calendarButtonPrefix}--active`,
  buttonDisabled: `${calendarButtonPrefix}--disabled`,
  buttonInRange: `${calendarButtonPrefix}--inRange`,
  buttonInactive: `${calendarButtonPrefix}--inactive`,

  /** Row classes */
  row: calendarRowPrefix,

  /** Cell classes */
  cell: calendarCellPrefix,
  cellToday: `${calendarCellPrefix}--today`,
  cellActive: `${calendarCellPrefix}--active`,
  cellDisabled: `${calendarCellPrefix}--disabled`,

  /** Twelve grid classes */
  twelveGrid: calendarTwelveGridPrefix,

  /** Controls classes */
  controls: calendarControlsPrefix,
  controlsButton: `${calendarControlsPrefix}__button`,
  controlsIconButton: `${calendarControlsPrefix}__icon-button`,
  controlsPrev: `${calendarControlsPrefix}__prev`,
  controlsNext: `${calendarControlsPrefix}__next`,
};

/** Constants */
export const calendarYearsBase = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const calendarYearModuler = 10;
export const calendarMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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

  return 'YYYY-MM-DD';
}

