/**
 * Token translation helpers for the Temporal-based CalendarMethods.
 *
 * The other adapters (dayjs/moment/luxon) inherit moment's format token syntax
 * (YYYY/MM/DD/HH/mm/ss/Q/[H]n/gggg/GGGG/ww/WW/...). Temporal has no such API,
 * so we tokenize the format string manually and translate to either:
 *  1. A formatted output string (formatTokens), or
 *  2. A regex with field captures for parsing (buildParseRegex).
 */

const pad = (value: number, length = 2): string =>
  String(Math.abs(value)).padStart(length, '0');

const TOKEN_PATTERN =
  'YYYY|YY|Y|MMMM|MMM|MM|M|DDDD|DDD|DD|Do|D|dddd|ddd|dd|d|e|HH|H|hh|h|kk|k|mm|m|ss|s|SSS|SS|S|A|a|Q|gggg|GGGG|ww|WW|w|W|x|X';

const TOKEN_REGEX = new RegExp(TOKEN_PATTERN, 'g');

export interface FormatContext {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  /** ISO day of week (1=Mon..7=Sun). */
  dayOfWeek: number;
  /**
   * Locale-relative day of week (0=locale firstDay..6). Used by the moment
   * `e` token. For Sunday-first locales this equals `dayOfWeek === 7 ? 0 : dayOfWeek`;
   * for Monday-first it shifts so Monday=0; for Saturday-first Saturday=0.
   */
  localeWeekDay: number;
  isoWeek: number;
  isoWeekYear: number;
  localeWeek: number;
  localeWeekYear: number;
  quarter: number;
  halfYear: 1 | 2;
  monthShort: string;
  monthLong: string;
  weekdayShort: string;
  weekdayLong: string;
  weekdayNarrow: string;
  dayOfYear: number;
  unixMs: number;
}

interface Segment {
  literal?: string;
  token?: string;
}

function tokenize(format: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  while (cursor < format.length) {
    if (format[cursor] === '[') {
      const end = format.indexOf(']', cursor);
      if (end === -1) {
        segments.push({ literal: format.slice(cursor) });
        return segments;
      }
      segments.push({ literal: format.slice(cursor + 1, end) });
      cursor = end + 1;
      continue;
    }

    TOKEN_REGEX.lastIndex = cursor;
    const match = TOKEN_REGEX.exec(format);
    if (match && match.index === cursor) {
      segments.push({ token: match[0] });
      cursor += match[0].length;
      continue;
    }

    const nextSpecial = findNextSpecial(format, cursor);
    segments.push({ literal: format.slice(cursor, nextSpecial) });
    cursor = nextSpecial;
  }

  return segments;
}

function findNextSpecial(format: string, from: number): number {
  for (let i = from; i < format.length; i += 1) {
    if (format[i] === '[') return i;
    TOKEN_REGEX.lastIndex = i;
    const m = TOKEN_REGEX.exec(format);
    if (m && m.index === i) return i;
  }
  return format.length;
}

function preprocessHalfYear(format: string, halfYear: 1 | 2): string {
  if (!format.includes('[H]n')) return format;
  return format.replace('[H]n', `[H${halfYear}]`);
}

const hour12 = (hour: number): number => {
  const mod = hour % 12;
  return mod === 0 ? 12 : mod;
};

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

export function formatTokens(format: string, ctx: FormatContext): string {
  const normalized = preprocessHalfYear(format, ctx.halfYear);
  const segments = tokenize(normalized);

  return segments
    .map((segment) => {
      if (segment.literal !== undefined) return segment.literal;
      const token = segment.token as string;

      switch (token) {
        case 'YYYY':
          return pad(ctx.year, 4);
        case 'YY':
          return pad(ctx.year % 100, 2);
        case 'Y':
          return String(ctx.year);
        case 'MMMM':
          return ctx.monthLong;
        case 'MMM':
          return ctx.monthShort;
        case 'MM':
          return pad(ctx.month);
        case 'M':
          return String(ctx.month);
        case 'DDDD':
          return pad(ctx.dayOfYear, 3);
        case 'DDD':
          return String(ctx.dayOfYear);
        case 'DD':
          return pad(ctx.day);
        case 'Do':
          return ordinal(ctx.day);
        case 'D':
          return String(ctx.day);
        case 'dddd':
          return ctx.weekdayLong;
        case 'ddd':
          return ctx.weekdayShort;
        case 'dd':
          return ctx.weekdayNarrow;
        case 'd':
          // moment `d`: ISO Sunday-indexed (Sun=0..Sat=6).
          return String(ctx.dayOfWeek === 7 ? 0 : ctx.dayOfWeek);
        case 'e':
          // moment `e`: locale-relative (firstDay=0..6).
          return String(ctx.localeWeekDay);
        case 'HH':
          return pad(ctx.hour);
        case 'H':
          return String(ctx.hour);
        case 'hh':
          return pad(hour12(ctx.hour));
        case 'h':
          return String(hour12(ctx.hour));
        case 'kk':
          return pad(ctx.hour === 0 ? 24 : ctx.hour);
        case 'k':
          return String(ctx.hour === 0 ? 24 : ctx.hour);
        case 'mm':
          return pad(ctx.minute);
        case 'm':
          return String(ctx.minute);
        case 'ss':
          return pad(ctx.second);
        case 's':
          return String(ctx.second);
        case 'SSS':
          return pad(ctx.millisecond, 3);
        case 'SS':
          return pad(Math.floor(ctx.millisecond / 10), 2);
        case 'S':
          return String(Math.floor(ctx.millisecond / 100));
        case 'A':
          return ctx.hour < 12 ? 'AM' : 'PM';
        case 'a':
          return ctx.hour < 12 ? 'am' : 'pm';
        case 'Q':
          return String(ctx.quarter);
        case 'gggg':
          return pad(ctx.localeWeekYear, 4);
        case 'GGGG':
          return pad(ctx.isoWeekYear, 4);
        case 'ww':
          return pad(ctx.localeWeek);
        case 'WW':
          return pad(ctx.isoWeek);
        case 'w':
          return String(ctx.localeWeek);
        case 'W':
          return String(ctx.isoWeek);
        case 'x':
          return String(ctx.unixMs);
        case 'X':
          return String(Math.floor(ctx.unixMs / 1000));
        default:
          return token;
      }
    })
    .join('');
}

export type ParseFieldKey =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'hour12'
  | 'minute'
  | 'second'
  | 'millisecond'
  | 'isoWeek'
  | 'isoWeekYear'
  | 'localeWeek'
  | 'localeWeekYear'
  | 'quarter'
  | 'halfYear'
  | 'meridiem-upper'
  | 'meridiem-lower'
  /** Captured short month name; resolved against `LocaleNames.monthShort`. */
  | 'month-short'
  /** Captured long month name; resolved against `LocaleNames.monthLong`. */
  | 'month-long'
  /** `Do` ordinal — captured digit only, suffix consumed by regex. */
  | 'day-ordinal'
  /** `S` token — 1-digit centiseconds; multiply by 100 → millisecond. */
  | 'fractional-1'
  /** `SS` token — 2-digit deciseconds; multiply by 10 → millisecond. */
  | 'fractional-2'
  /**
   * `k` / `kk` — 1-24 hour clock used by some locales. The digit 24
   * represents midnight (= hour 0); other values map straight to `hour`.
   */
  | 'hour-1to24'
  /** `DDD` / `DDDD` — day of year (1-366); resolved with `year` to a date. */
  | 'day-of-year'
  /** `x` — Unix epoch milliseconds; standalone enough to derive full datetime. */
  | 'unix-ms'
  /** `X` — Unix epoch seconds; standalone enough to derive full datetime. */
  | 'unix-s'
  /** Weekday tokens / `d` / `e` are consumed but discarded (redundant). */
  | 'skip';

/**
 * Locale-aware name tables consumed by `buildParseRegex`. Each array is
 * pre-computed by the caller so that `tokens.ts` stays free of `Intl.*` use.
 */
export interface LocaleNames {
  /** 12 entries, January..December — short form ("Jan"). */
  monthShort: string[];
  /** 12 entries, January..December — long form ("January"). */
  monthLong: string[];
  /** 7 entries, Sunday-indexed — short form ("Mon"). */
  weekdayShort: string[];
  /** 7 entries, Sunday-indexed — long form ("Monday"). */
  weekdayLong: string[];
  /** 7 entries, Sunday-indexed — narrow form ("M"). */
  weekdayNarrow: string[];
}

export interface ParsedFields {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  hour12?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  isoWeek?: number;
  isoWeekYear?: number;
  localeWeek?: number;
  localeWeekYear?: number;
  quarter?: number;
  halfYear?: 1 | 2;
  meridiem?: 'am' | 'pm';
  dayOfYear?: number;
  unixMs?: number;
}

const HALF_YEAR_SENTINEL = '\x00HALFYEAR\x00';

export function buildParseRegex(
  format: string,
  names: LocaleNames,
): {
  regex: RegExp;
  captures: ParseFieldKey[];
  tokens: Set<string>;
} {
  const normalized = format.replace('[H]n', HALF_YEAR_SENTINEL);

  let body = '';
  const captures: ParseFieldKey[] = [];
  const tokens = new Set<string>();

  let cursor = 0;
  while (cursor < normalized.length) {
    if (normalized.startsWith(HALF_YEAR_SENTINEL, cursor)) {
      body += 'H(\\d)';
      captures.push('halfYear');
      tokens.add('[H]n');
      cursor += HALF_YEAR_SENTINEL.length;
      continue;
    }

    if (normalized[cursor] === '[') {
      const end = normalized.indexOf(']', cursor);
      if (end === -1) {
        body += escapeRegex(normalized.slice(cursor));
        break;
      }
      body += escapeRegex(normalized.slice(cursor + 1, end));
      cursor = end + 1;
      continue;
    }

    TOKEN_REGEX.lastIndex = cursor;
    const match = TOKEN_REGEX.exec(normalized);
    if (match && match.index === cursor) {
      const token = match[0];
      tokens.add(token);

      const result = tokenToCapture(token, names);
      if (result) {
        body += result.pattern;
        if (result.field) captures.push(result.field);
      } else {
        body += escapeRegex(token);
      }
      cursor += token.length;
      continue;
    }

    const next = findNextSpecialOrSentinel(normalized, cursor);
    body += escapeRegex(normalized.slice(cursor, next));
    cursor = next;
  }

  return {
    regex: new RegExp(`^${body}$`),
    captures,
    tokens,
  };
}

/**
 * Build a regex alternation that matches any of the supplied names, longest
 * first to avoid the regex engine matching a prefix of a longer entry.
 */
function namesAlternation(names: string[]): string {
  // De-dupe and sort longest-first.
  const sorted = Array.from(new Set(names))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  return `(${sorted.map(escapeRegex).join('|')})`;
}

/** Variant that also stops at the half-year sentinel. */
function findNextSpecialOrSentinel(format: string, from: number): number {
  for (let i = from; i < format.length; i += 1) {
    if (format[i] === '[') return i;
    if (format.startsWith(HALF_YEAR_SENTINEL, i)) return i;
    TOKEN_REGEX.lastIndex = i;
    const m = TOKEN_REGEX.exec(format);
    if (m && m.index === i) return i;
  }
  return format.length;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tokenToCapture(
  token: string,
  names: LocaleNames,
): { pattern: string; field?: ParseFieldKey } | null {
  switch (token) {
    case 'YYYY':
      return { pattern: '(\\d{4})', field: 'year' };
    case 'YY':
      return { pattern: '(\\d{2})', field: 'year' };
    case 'Y':
      return { pattern: '(\\d{1,4})', field: 'year' };
    case 'MMMM':
      return {
        pattern: namesAlternation(names.monthLong),
        field: 'month-long',
      };
    case 'MMM':
      return {
        pattern: namesAlternation(names.monthShort),
        field: 'month-short',
      };
    case 'MM':
      return { pattern: '(\\d{2})', field: 'month' };
    case 'M':
      return { pattern: '(\\d{1,2})', field: 'month' };
    case 'Do':
      // Capture the digit; consume the ordinal suffix non-capturing.
      return {
        pattern: '(\\d{1,2})(?:st|nd|rd|th)',
        field: 'day-ordinal',
      };
    case 'DDDD':
      return { pattern: '(\\d{3})', field: 'day-of-year' };
    case 'DDD':
      return { pattern: '(\\d{1,3})', field: 'day-of-year' };
    case 'DD':
      return { pattern: '(\\d{2})', field: 'day' };
    case 'D':
      return { pattern: '(\\d{1,2})', field: 'day' };
    case 'dddd':
      return { pattern: namesAlternation(names.weekdayLong), field: 'skip' };
    case 'ddd':
      return { pattern: namesAlternation(names.weekdayShort), field: 'skip' };
    case 'dd':
      return { pattern: namesAlternation(names.weekdayNarrow), field: 'skip' };
    case 'd':
      // ISO Sunday-indexed weekday number — consume but cannot derive date.
      return { pattern: '(\\d)', field: 'skip' };
    case 'e':
      // Locale-relative weekday number — consume but cannot derive date.
      return { pattern: '(\\d)', field: 'skip' };
    case 'HH':
      return { pattern: '(\\d{2})', field: 'hour' };
    case 'H':
      return { pattern: '(\\d{1,2})', field: 'hour' };
    case 'hh':
      return { pattern: '(\\d{2})', field: 'hour12' };
    case 'h':
      return { pattern: '(\\d{1,2})', field: 'hour12' };
    case 'mm':
      return { pattern: '(\\d{2})', field: 'minute' };
    case 'm':
      return { pattern: '(\\d{1,2})', field: 'minute' };
    case 'ss':
      return { pattern: '(\\d{2})', field: 'second' };
    case 's':
      return { pattern: '(\\d{1,2})', field: 'second' };
    case 'SSS':
      return { pattern: '(\\d{3})', field: 'millisecond' };
    case 'SS':
      return { pattern: '(\\d{2})', field: 'fractional-2' };
    case 'S':
      return { pattern: '(\\d)', field: 'fractional-1' };
    case 'kk':
      return { pattern: '(\\d{2})', field: 'hour-1to24' };
    case 'k':
      return { pattern: '(\\d{1,2})', field: 'hour-1to24' };
    case 'A':
      return { pattern: '(AM|PM)', field: 'meridiem-upper' };
    case 'a':
      return { pattern: '(am|pm)', field: 'meridiem-lower' };
    case 'Q':
      return { pattern: '(\\d)', field: 'quarter' };
    case 'gggg':
      return { pattern: '(\\d{4})', field: 'localeWeekYear' };
    case 'GGGG':
      return { pattern: '(\\d{4})', field: 'isoWeekYear' };
    case 'ww':
      return { pattern: '(\\d{2})', field: 'localeWeek' };
    case 'WW':
      return { pattern: '(\\d{2})', field: 'isoWeek' };
    case 'w':
      return { pattern: '(\\d{1,2})', field: 'localeWeek' };
    case 'W':
      return { pattern: '(\\d{1,2})', field: 'isoWeek' };
    case 'x':
      // Unix epoch milliseconds — anchor `$` and adjacent literals constrain
      // the greedy match.
      return { pattern: '(\\d+)', field: 'unix-ms' };
    case 'X':
      // Unix epoch seconds.
      return { pattern: '(\\d+)', field: 'unix-s' };
    default:
      return null;
  }
}

export function applyParseRegex(
  text: string,
  regex: RegExp,
  captures: ParseFieldKey[],
  names: LocaleNames,
): ParsedFields | undefined {
  const match = text.match(regex);
  if (!match) return undefined;

  const fields: ParsedFields = {};
  for (let idx = 0; idx < captures.length; idx += 1) {
    const field = captures[idx];
    const raw = match[idx + 1];
    if (raw === undefined) continue;

    if (field === 'skip') continue;

    if (field === 'meridiem-upper') {
      fields.meridiem = raw === 'PM' ? 'pm' : 'am';
      continue;
    }
    if (field === 'meridiem-lower') {
      fields.meridiem = raw === 'pm' ? 'pm' : 'am';
      continue;
    }

    if (field === 'month-short' || field === 'month-long') {
      const table =
        field === 'month-short' ? names.monthShort : names.monthLong;
      const monthIndex = table.indexOf(raw);
      if (monthIndex === -1) return undefined;
      fields.month = monthIndex + 1;
      continue;
    }

    if (field === 'day-ordinal') {
      const value = parseInt(raw, 10);
      if (Number.isNaN(value)) return undefined;
      fields.day = value;
      continue;
    }

    if (field === 'fractional-1') {
      const value = parseInt(raw, 10);
      if (Number.isNaN(value)) return undefined;
      fields.millisecond = value * 100;
      continue;
    }

    if (field === 'fractional-2') {
      const value = parseInt(raw, 10);
      if (Number.isNaN(value)) return undefined;
      fields.millisecond = value * 10;
      continue;
    }

    if (field === 'hour-1to24') {
      const value = parseInt(raw, 10);
      if (Number.isNaN(value)) return undefined;
      if (value < 1 || value > 24) return undefined;
      // 24 represents midnight (start of next day in moment), but mezzanine
      // round-trips through ISO so we map it to hour 0 of the same day.
      fields.hour = value === 24 ? 0 : value;
      continue;
    }

    if (field === 'day-of-year') {
      const value = parseInt(raw, 10);
      if (Number.isNaN(value)) return undefined;
      // Validate against max possible (366 for leap year). Tighter validation
      // against the actual `year` happens in the parseFormattedValue branch.
      if (value < 1 || value > 366) return undefined;
      fields.dayOfYear = value;
      continue;
    }

    if (field === 'unix-ms') {
      const value = Number(raw);
      if (!Number.isFinite(value)) return undefined;
      fields.unixMs = value;
      continue;
    }

    if (field === 'unix-s') {
      const value = Number(raw);
      if (!Number.isFinite(value)) return undefined;
      fields.unixMs = value * 1000;
      continue;
    }

    const value = parseInt(raw, 10);
    if (Number.isNaN(value)) continue;

    if (field === 'halfYear') {
      if (value !== 1 && value !== 2) continue;
      fields.halfYear = value;
      continue;
    }

    if (field === 'year' && raw.length === 2) {
      // 2-digit year pivot matches moment.js / dayjs behaviour:
      //   00..68 → 2000..2068
      //   69..99 → 1969..1999
      fields.year = value > 68 ? value + 1900 : value + 2000;
      continue;
    }

    (fields as Record<string, number>)[field] = value;
  }

  return fields;
}
