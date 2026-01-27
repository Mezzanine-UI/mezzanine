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
export const calendarQuickSelectPrefix = `${calendarPrefix}-quick-select`;

export const calendarClasses = {
  host: calendarPrefix,
  noShadowHost: `${calendarPrefix}--no-shadow`,
  mode: (mode: CalendarMode) => `${calendarPrefix}--${mode}`,
  mainWithFooter: `${calendarMainPrefix}-with-footer`,
  main: calendarMainPrefix,

  /** Date grid classes */
  board: calendarBoardPrefix,
  week: calendarWeekPrefix,
  weekRow: `${calendarWeekPrefix}__row`,
  daysGrid: calendarDaysGridPrefix,

  /** Button classes */
  button: calendarButtonPrefix,
  buttonAnnotation: `${calendarButtonPrefix}__annotation`,
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
  cellWeekend: `${calendarCellPrefix}--weekend`,
  cellToday: `${calendarCellPrefix}--today`,
  cellActive: `${calendarCellPrefix}--active`,
  cellDisabled: `${calendarCellPrefix}--disabled`,
  cellWithAnnotation: `${calendarCellPrefix}--with-annotation`,

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

  /** Quick select classes */
  quickSelect: calendarQuickSelectPrefix,
  quickSelectButton: `${calendarQuickSelectPrefix}__button`,
  quickSelectButtonActive: `${calendarQuickSelectPrefix}__button--active`,
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

/**
 * Locales that use ISO week (Monday as first day of week).
 * These are primarily European and Middle Eastern locales.
 * Includes both full locale codes (e.g., 'de-de') and short codes (e.g., 'de').
 */
export const ISO_WEEK_LOCALES = new Set([
  'de-de',
  'de',
  'fr-fr',
  'fr',
  'it-it',
  'it',
  'es-es',
  'es',
  'nl-nl',
  'nl',
  'pl-pl',
  'pl',
  'pt-pt',
  'pt',
  'ru-ru',
  'ru',
  'sv-se',
  'sv',
  'nb-no',
  'nb',
  'da-dk',
  'da',
  'fi-fi',
  'fi',
  'cs-cz',
  'cs',
  'hu-hu',
  'hu',
  'ro-ro',
  'ro',
  'sk-sk',
  'sk',
  'sl-si',
  'sl',
  'hr-hr',
  'hr',
  'bg-bg',
  'bg',
  'el-gr',
  'el',
  'tr-tr',
  'tr',
  'uk-ua',
  'uk',
  'he-il',
  'he',
  'ar-sa',
  'ar',
  'et-ee',
  'et',
  'lv-lv',
  'lv',
  'lt-lt',
  'lt',
  'en-gb',
  'en-au',
  'en-nz',
]);

/**
 * Check if a locale uses ISO week (Monday as first day of week)
 */
export function isISOWeekLocale(locale: string): boolean {
  return ISO_WEEK_LOCALES.has(locale.toLowerCase());
}

export function getDefaultModeFormat(mode: CalendarMode, locale?: string) {
  if (mode === 'week') {
    // Use ISO week format for ISO week locales (Monday-first)
    if (locale && isISOWeekLocale(locale)) {
      return 'GGGG-[W]WW';
    }
    return 'gggg-[W]ww';
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
    return 'YYYY-[H]n';
  }

  return 'YYYY-MM-DD';
}
