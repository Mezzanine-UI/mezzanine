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
  mainRangeCalendarWrapper: `${calendarMainPrefix}-range-calendar-wrapper`,
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
  cellMode: (mode: CalendarMode) => `${calendarCellPrefix}--mode-${mode}`,
  cellInner: `${calendarCellPrefix}__inner`,
  cellWeekend: `${calendarCellPrefix}--weekend`,
  cellToday: `${calendarCellPrefix}--today`,
  cellActive: `${calendarCellPrefix}--active`,
  cellDisabled: `${calendarCellPrefix}--disabled`,
  cellWithAnnotation: `${calendarCellPrefix}--with-annotation`,
  cellRangeStart: `${calendarCellPrefix}--range-start`,
  cellRangeEnd: `${calendarCellPrefix}--range-end`,

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
export const calendarYearsBase = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];
export const calendarYearModuler = 20;
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

  return [start, end];
}

/**
 * Locales that follow ISO 8601 week rules — Monday is the first day of week
 * AND week 1 contains at least 4 days of the new year (`minimalDays = 4`).
 *
 * Audited against `Intl.Locale#weekInfo` (CLDR). Entries previously listed
 * here that disagree with CLDR were removed:
 *  - `pt-pt`, `pt`  → Sunday-first per CLDR (was emitting wrong week
 *    boundaries for Portuguese)
 *  - `he-il`, `he`  → Sunday-first per CLDR
 *  - `ar-sa`, `ar`  → Sunday-first / Saturday-first per CLDR
 *  - `en-au`, `en-nz` → Monday-first BUT minimalDays=1, NOT ISO
 *  - `ro-ro`, `ro`, `sl-si`, `sl`, `hr-hr`, `hr`, `tr-tr`, `tr`,
 *    `uk-ua`, `uk`, `lv-lv`, `lv` → Monday-first BUT minimalDays=1
 *
 * The Temporal adapter consumes `Intl.Locale#weekInfo` directly (see
 * `usesISOWeekRules` in calendarMethodsTemporal). The dayjs/moment
 * adapters still use this static set; the removals above also fix
 * silent format/getWeek divergences in those adapters for the affected
 * locales when CLDR data is the desired source of truth.
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
  'sk-sk',
  'sk',
  'bg-bg',
  'bg',
  'el-gr',
  'el',
  'et-ee',
  'et',
  'lt-lt',
  'lt',
  'en-gb',
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
