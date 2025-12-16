import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import IsoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

// Import common locales
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/zh-hk';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';
import 'dayjs/locale/de';
import 'dayjs/locale/fr';
import 'dayjs/locale/es';
import 'dayjs/locale/it';
import 'dayjs/locale/pt';
import 'dayjs/locale/ru';
import 'dayjs/locale/ar';
import 'dayjs/locale/en-au';
import 'dayjs/locale/en-ca';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/en-ie';
import 'dayjs/locale/en-in';
import 'dayjs/locale/en-nz';
import 'dayjs/locale/en-sg';

import range from 'lodash/range';
import chunk from 'lodash/chunk';
import { CalendarMethods as CalendarMethodsType } from '../calendar/typings';
import { isISOWeekLocale } from '../calendar/calendar';

const localeMappingTable: Record<string, string> = {
  // English variants
  'en-us': 'en',
  'en-au': 'en-au',
  'en-ca': 'en-ca',
  'en-gb': 'en-gb',
  'en-ie': 'en-ie',
  'en-in': 'en-in',
  'en-nz': 'en-nz',
  'en-sg': 'en-sg',

  // Chinese variants
  'zh-cn': 'zh-cn',
  'zh-tw': 'zh-tw',
  'zh-hk': 'zh-hk',

  // Spanish variants
  'es-es': 'es',
  'es-mx': 'es-mx',
  'es-do': 'es-do',
  'es-pr': 'es-pr',
  'es-us': 'es-us',

  // Portuguese variants
  'pt-pt': 'pt',
  'pt-br': 'pt-br',

  // French variants
  'fr-fr': 'fr',
  'fr-ca': 'fr-ca',
  'fr-ch': 'fr-ch',

  // German variants
  'de-de': 'de',
  'de-at': 'de-at',
  'de-ch': 'de-ch',

  // Italian variants
  'it-it': 'it',
  'it-ch': 'it-ch',

  // Dutch variants
  'nl-nl': 'nl',
  'nl-be': 'nl-be',

  // Swedish variants
  'sv-se': 'sv',
  'sv-fi': 'sv-fi',

  // Norwegian variants
  'nb-no': 'nb',

  // Other European languages
  'pl-pl': 'pl',
  'cs-cz': 'cs',
  'sk-sk': 'sk',
  'hu-hu': 'hu',
  'ro-ro': 'ro',
  'da-dk': 'da',
  'fi-fi': 'fi',
  'el-gr': 'el',
  'tr-tr': 'tr',
  'uk-ua': 'uk',
  'ru-ru': 'ru',
  'bg-bg': 'bg',
  'hr-hr': 'hr',
  'sl-si': 'sl',
  'et-ee': 'et',
  'lv-lv': 'lv',
  'lt-lt': 'lt',
  'be-by': 'be',

  // Asian languages
  'ja-jp': 'ja',
  'ko-kr': 'ko',
  'vi-vn': 'vi',
  'th-th': 'th',
  'id-id': 'id',
  'ms-my': 'ms-my',
  'bn-bd': 'bn-bd',
  'bn-in': 'bn',
  'hi-in': 'hi',
  'ta-in': 'ta',
  'te-in': 'te',
  'kn-in': 'kn',
  'ml-in': 'ml',

  // Middle East
  'ar-sa': 'ar-sa',
  'ar-ae': 'ar',
  'he-il': 'he',
  'fa-ir': 'fa',

  // Other regions
  'af-za': 'af',
  'ca-es': 'ca',
  'eu-es': 'eu',
  'gl-es': 'gl',
  'is-is': 'is',
};

const localeMapping = (locale: string): string => {
  const normalized = locale.toLowerCase();
  return localeMappingTable[normalized] ?? normalized;
};

let hasInit = false;

function init() {
  if (hasInit) return true;

  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(isBetween);
  dayjs.extend(weekOfYear);
  dayjs.extend(IsoWeek);
  dayjs.extend(utc);
  dayjs.extend(quarterOfYear);

  hasInit = true;
  return true;
}

/**
 * Get the actual first day of week from locale data
 * Returns 0 for Sunday-first, 1 for Monday-first
 */
const getActualFirstDayOfWeek = (locale: string): number => {
  const mappedLocale = localeMapping(locale);
  const localeData = dayjs().locale(mappedLocale).localeData();

  return localeData.firstDayOfWeek();
};

/**
 * Check if locale uses Monday as first day of week
 */
const isMondayFirst = (locale: string): boolean => {
  return getActualFirstDayOfWeek(locale) === 1;
};

const CalendarMethodsDayjs: CalendarMethodsType = {
  /** Locale helpers */
  getFirstDayOfWeek: (locale) => getActualFirstDayOfWeek(locale),
  isISOWeekLocale,

  /** Get date infos */
  getNow: () => dayjs().toISOString(),
  getSecond: (date) => dayjs(date).second(),
  getMinute: (date) => dayjs(date).minute(),
  getHour: (date) => dayjs(date).hour(),
  getDate: (date) => dayjs(date).date(),
  getWeek: (date, locale) => {
    if (isMondayFirst(locale)) {
      return dayjs(date).isoWeek();
    }
    return dayjs(date).week();
  },
  getWeekYear: (date, locale) => {
    if (isMondayFirst(locale)) {
      return dayjs(date).isoWeekYear();
    }
    return dayjs(date).year(); // dayjs doesn't have weekYear, use year as approximation
  },
  getWeekDay: (date) => {
    const clone = dayjs(date).locale('en');

    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getMonth: (date) => dayjs(date).month(),
  getYear: (date) => dayjs(date).year(),
  getQuarter: (date) => dayjs(date).quarter(),
  getHalfYear: (date) => Math.floor(dayjs(date).month() / 6) + 1,
  getWeekDayNames: (locale) => {
    const mappedLocale = localeMapping(locale);
    const dayjsInstance = dayjs().locale(mappedLocale);
    const localeData = dayjsInstance.localeData();
    const names = localeData.weekdaysMin();

    // If Monday-first, rotate so Monday is first
    if (isMondayFirst(locale)) {
      return [...names.slice(1), names[0]];
    }

    return names;
  },
  getMonthShortName: (month, locale) => {
    const names = CalendarMethodsDayjs.getMonthShortNames(
      localeMapping(locale),
    );

    return names[month];
  },
  getMonthShortNames: (locale) => {
    return dayjs().locale(localeMapping(locale)).localeData().monthsShort();
  },

  /** Manipulate */
  addHour: (date, diff) => dayjs(date).add(diff, 'hour').toISOString(),
  addMinute: (date, diff) => dayjs(date).add(diff, 'minute').toISOString(),
  addSecond: (date, diff) => dayjs(date).add(diff, 'second').toISOString(),
  addDay: (date, diff) => dayjs(date).add(diff, 'day').toISOString(),
  addYear: (date, diff) => dayjs(date).add(diff, 'year').toISOString(),
  addMonth: (date, diff) => dayjs(date).add(diff, 'month').toISOString(),
  setMillisecond: (date, millisecond) =>
    dayjs(date).millisecond(millisecond).toISOString(),
  setSecond: (date, second) => dayjs(date).second(second).toISOString(),
  setMinute: (date, minute) => dayjs(date).minute(minute).toISOString(),
  setHour: (date, hour) => dayjs(date).hour(hour).toISOString(),
  setMonth: (date, month) => dayjs(date).month(month).toISOString(),
  setYear: (date, year) => dayjs(date).year(year).toISOString(),
  setDate: (date, target) => dayjs(date).date(target).toISOString(),
  startOf: (target, granularity) =>
    dayjs(target).startOf(granularity).toISOString(),

  getCurrentWeekFirstDate: (value, locale) => {
    if (isMondayFirst(locale)) {
      return dayjs(value)
        .startOf('isoWeek')
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString();
    }
    return dayjs(value)
      .startOf('week')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();
  },
  getCurrentMonthFirstDate: (value) =>
    dayjs(value)
      .startOf('month')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString(),
  getCurrentYearFirstDate: (value) =>
    dayjs(value)
      .startOf('year')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString(),
  getCurrentQuarterFirstDate: (value) => {
    const d = dayjs(value);
    const quarterStart = Math.floor(d.month() / 3) * 3;
    return d
      .month(quarterStart)
      .startOf('month')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();
  },
  getCurrentHalfYearFirstDate: (value) => {
    const d = dayjs(value);
    const halfYearStart = Math.floor(d.month() / 6) * 6;
    return d
      .month(halfYearStart)
      .startOf('month')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();
  },

  /** Generate day calendar */
  getCalendarGrid: (target, locale) => {
    const mondayFirst = isMondayFirst(locale);
    const lastDateOfPrevMonth = dayjs(target)
      .subtract(1, 'month')
      .endOf('month')
      .date();

    const firstDayOfCurrentMonth = dayjs(target).date(1).day();
    const lastDateOfCurrentMonth = dayjs(target).endOf('month').date();

    // Calculate how many days from previous month to show
    // For Monday-first: if first day is Sunday (0), we need 6 days from prev month
    // For Sunday-first: if first day is Sunday (0), we need 0 days from prev month
    let daysFromPrevMonth: number;
    if (mondayFirst) {
      // Monday-first: Sunday (0) should appear at position 6
      daysFromPrevMonth =
        firstDayOfCurrentMonth === 0 ? 6 : firstDayOfCurrentMonth - 1;
    } else {
      // Sunday-first
      daysFromPrevMonth = firstDayOfCurrentMonth;
    }

    const totalDaysInGrid = 42; // 6 weeks * 7 days
    const daysFromNextMonth =
      totalDaysInGrid - daysFromPrevMonth - lastDateOfCurrentMonth;

    return chunk(
      [
        ...range(
          lastDateOfPrevMonth - daysFromPrevMonth + 1,
          lastDateOfPrevMonth + 1,
        ),
        ...range(1, lastDateOfCurrentMonth + 1),
        ...range(1, daysFromNextMonth + 1),
      ],
      7,
    );
  },

  /** Compares */
  isValid: (date) => dayjs(date).isValid(),
  isBefore: (target, comparison) => dayjs(target).isBefore(comparison),
  isBetween: (value, target1, target2, granularity) =>
    dayjs(value).isBetween(target1, target2, granularity),
  isSameDate: (dateOne, dateTwo) =>
    dayjs(dateOne).isSame(dayjs(dateTwo), 'date'),
  isSameWeek: (dateOne, dateTwo, locale) => {
    if (isMondayFirst(locale)) {
      return dayjs(dateOne).isSame(dayjs(dateTwo), 'isoWeek');
    }
    return dayjs(dateOne).isSame(dayjs(dateTwo), 'week');
  },
  isInMonth: (target, month) => dayjs(target).month() === month,
  isDateIncluded: (date, targets) =>
    targets.some((target) => dayjs(date).isSame(dayjs(target), 'day')),
  isWeekIncluded: (firstDateOfWeek, targets, locale) => {
    if (isMondayFirst(locale)) {
      return targets.some((target) =>
        dayjs(firstDateOfWeek).isSame(dayjs(target), 'isoWeek'),
      );
    }
    return targets.some((target) =>
      dayjs(firstDateOfWeek).isSame(dayjs(target), 'week'),
    );
  },
  isMonthIncluded: (date, targets) =>
    targets.some((target) => dayjs(date).isSame(dayjs(target), 'month')),
  isYearIncluded: (date, targets) =>
    targets.some((target) => dayjs(date).isSame(dayjs(target), 'year')),
  isQuarterIncluded: (date, targets) =>
    targets.some((target) => dayjs(date).isSame(dayjs(target), 'quarter')),
  isHalfYearIncluded: (date, targets) => {
    const halfYear = Math.floor(dayjs(date).month() / 6);
    return targets.some((target) => {
      const targetHalfYear = Math.floor(dayjs(target).month() / 6);
      return (
        dayjs(date).isSame(dayjs(target), 'year') && halfYear === targetHalfYear
      );
    });
  },

  /** Format */
  formatToString: (locale, date, format) => {
    const clone = dayjs(date);
    const result = clone.locale(localeMapping(locale));

    // Handle half-year format: convert n to half-year number (1 or 2)
    if (format.includes('[H]n')) {
      const quarter = result.quarter();
      const halfYear = Math.ceil(quarter / 2);
      return result.format(format.replace('n', halfYear.toString()));
    }

    return result.format(format);
  },
  formatToISOString: (date) => dayjs(date).toISOString(),

  /** Parse and validate formatted input */
  parseFormattedValue: (text, format, locale) => {
    // Handle half-year format: convert n to Q for parsing
    let parseFormat = format;
    let parseText = text;

    if (format.includes('[H]n')) {
      // Extract half-year value (1 or 2) and convert to quarter (1-4)
      const halfYearMatch = text.match(/(\d{4})-H(\d)/);
      if (halfYearMatch) {
        const year = halfYearMatch[1];
        const halfYear = parseInt(halfYearMatch[2], 10);

        if (halfYear < 1 || halfYear > 2) {
          return undefined;
        }

        // Convert n to Q: H1 → Q1, H2 → Q3
        const quarter = halfYear === 1 ? 1 : 3;
        parseText = `${year}-Q${quarter}`;
        parseFormat = format.replace('[H]n', '[Q]Q');
      }
    }

    // Try to parse with dayjs
    const parsed = dayjs(parseText, parseFormat, 'en', true);

    if (!parsed.isValid()) {
      return undefined;
    }

    // Validate based on format keys present
    // Check for ISO week format (GGGG-[W]WW) vs regular week format (gggg-[W]ww)
    const hasISOWeek = parseFormat.includes('G') && parseFormat.includes('W');
    const hasWeek = parseFormat.includes('w') && !hasISOWeek;
    const hasQuarter = parseFormat.includes('Q');
    const hasMonth = parseFormat.includes('M') && !hasQuarter;
    const hasDay = parseFormat.includes('D');
    const hasYear =
      parseFormat.includes('Y') ||
      parseFormat.includes('G') ||
      parseFormat.includes('g');

    // If it's an ISO week format (GGGG-[W]WW)
    if (hasISOWeek && hasYear && !hasMonth && !hasDay) {
      const isoWeekNum = parsed.isoWeek();

      // ISO week numbers are 1-53
      if (isoWeekNum < 1 || isoWeekNum > 53) {
        return undefined;
      }

      // Return the first day of the ISO week (Monday)
      return parsed
        .startOf('isoWeek')
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString();
    }

    // If it's a regular week format (gggg-[W]ww)
    if (hasWeek && hasYear && !hasMonth && !hasDay) {
      const weekNum = parsed.week();

      // Week numbers are generally 1-53
      if (weekNum < 1 || weekNum > 53) {
        return undefined;
      }

      return CalendarMethodsDayjs.getCurrentWeekFirstDate(
        parsed.toISOString(),
        locale,
      );
    }

    // If it's a quarter format, validate and normalize
    if (hasQuarter && hasYear && !hasMonth && !hasDay) {
      const quarter = parsed.quarter();
      if (quarter < 1 || quarter > 4) {
        return undefined;
      }
      return CalendarMethodsDayjs.getCurrentQuarterFirstDate(
        parsed.toISOString(),
      );
    }

    // If it's a month format without day, normalize to first day
    if (hasMonth && hasYear && !hasDay && !hasWeek && !hasQuarter) {
      return CalendarMethodsDayjs.getCurrentMonthFirstDate(
        parsed.toISOString(),
      );
    }

    // If it's year only, normalize to first day of year
    if (hasYear && !hasMonth && !hasDay && !hasWeek && !hasQuarter) {
      return CalendarMethodsDayjs.getCurrentYearFirstDate(parsed.toISOString());
    }

    // For complete dates, just validate
    if (hasYear && hasMonth && hasDay) {
      return parsed.toISOString();
    }

    return parsed.toISOString();
  },
};

const CalendarMethods: CalendarMethodsType = hasInit
  ? CalendarMethodsDayjs
  : (() => {
      init();

      return CalendarMethodsDayjs;
    })();

export default CalendarMethods;
