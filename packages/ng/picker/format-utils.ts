/**
 * @mezzanine-ui/ng/picker 內部格式工具函式。
 *
 * 對應 React 版的 `packages/react/src/Picker/formatUtils.ts`。
 * 這些為純 TypeScript 函式，無 Angular 依賴。
 */

/**
 * Format key 字元集合：出現在格式字串中作為可編輯欄位的字元。
 */
export const FORMAT_KEY_CHARS = new Set([
  'Y',
  'g',
  'G',
  'W',
  'w', // Locale week (not ISO week)
  'M',
  'D',
  'H', // Hour (0–23)
  'n', // Half-year number (1–2)
  'm',
  's',
  'S',
  'Q',
]);

/**
 * 格式字串的一個片段（mask 欄位、分隔符或字面量）。
 */
export interface FormatSegment {
  /** 片段類型。 */
  readonly type: 'mask' | 'separator' | 'literal';
  /** 片段文字內容。 */
  readonly text: string;
  /** 在實際值（不含括號）中的起始位置。 */
  readonly start: number;
  /** 在實際值（不含括號）中的結束位置（exclusive）。 */
  readonly end: number;
}

/**
 * 將格式字串解析為片段陣列，每個片段包含其在實際值中的位置。
 *
 * 支援括號字面量（`[...]`）與連續相同字元的 format key（例如 `YYYY`、`MM`）。
 *
 * @param format - 格式字串（例如 `'YYYY-MM-DD'`、`'[Q]Q'`）
 * @returns 片段陣列
 *
 * @example
 * ```ts
 * import { parseFormatSegments } from '@mezzanine-ui/ng/picker';
 *
 * parseFormatSegments('YYYY-MM-DD');
 * // [
 * //   { type: 'mask', text: 'YYYY', start: 0, end: 4 },
 * //   { type: 'separator', text: '-', start: 4, end: 5 },
 * //   { type: 'mask', text: 'MM', start: 5, end: 7 },
 * //   { type: 'separator', text: '-', start: 7, end: 8 },
 * //   { type: 'mask', text: 'DD', start: 8, end: 10 },
 * // ]
 * ```
 */
export function parseFormatSegments(format: string): readonly FormatSegment[] {
  const segments: FormatSegment[] = [];
  let valuePos = 0;
  let i = 0;

  while (i < format.length) {
    const char = format[i];

    // Handle escaped literals [...]
    if (char === '[') {
      const closeIndex = format.indexOf(']', i);
      if (closeIndex !== -1) {
        for (let j = i + 1; j < closeIndex; j++) {
          segments.push({
            type: 'literal',
            text: format[j],
            start: valuePos,
            end: valuePos + 1,
          });
          valuePos++;
        }
        i = closeIndex + 1;
        continue;
      }
    }

    // Handle format keys (consecutive same characters)
    if (FORMAT_KEY_CHARS.has(char)) {
      const keyStart = i;
      while (i + 1 < format.length && format[i + 1] === char) {
        i++;
      }
      const keyLength = i - keyStart + 1;
      segments.push({
        type: 'mask',
        text: char.repeat(keyLength),
        start: valuePos,
        end: valuePos + keyLength,
      });
      valuePos += keyLength;
      i++;
      continue;
    }

    // Handle separators
    segments.push({
      type: 'separator',
      text: char,
      start: valuePos,
      end: valuePos + 1,
    });
    valuePos++;
    i++;
  }

  return segments;
}

/**
 * 檢查 mask 片段是否已全數填入數字。
 *
 * @param value - 當前輸入值
 * @param segment - 要檢查的 mask 片段
 */
export function isMaskSegmentFilled(
  value: string,
  segment: FormatSegment,
): boolean {
  if (segment.type !== 'mask') return true;
  for (let i = segment.start; i < segment.end; i++) {
    if (!/\d/.test(value[i])) {
      return false;
    }
  }
  return true;
}

/**
 * 找出指定位置之前最後一個 mask 片段。
 *
 * @param segments - 所有片段
 * @param currentPos - 當前位置（起始）
 * @returns 前一個 mask 片段，若無則為 `null`
 */
export function findPreviousMaskSegment(
  segments: readonly FormatSegment[],
  currentPos: number,
): FormatSegment | null {
  let lastMask: FormatSegment | null = null;
  for (const segment of segments) {
    if (segment.start >= currentPos) break;
    if (segment.type === 'mask') {
      lastMask = segment;
    }
  }
  return lastMask;
}

/**
 * 移除格式字串中的括號，取得不含括號的模板字串。
 *
 * @param format - 格式字串（例如 `'[Q]Q-YYYY'`）
 * @returns 不含括號的模板（例如 `'Q-YYYY'`）
 *
 * @example
 * ```ts
 * import { getTemplateWithoutBrackets } from '@mezzanine-ui/ng/picker';
 *
 * getTemplateWithoutBrackets('[Q]Q-YYYY'); // 'Q-YYYY'
 * getTemplateWithoutBrackets('YYYY-MM-DD'); // 'YYYY-MM-DD'
 * ```
 */
export function getTemplateWithoutBrackets(format: string): string {
  let template = '';
  let i = 0;
  while (i < format.length) {
    const char = format[i];

    if (char === '[') {
      const closeIndex = format.indexOf(']', i);
      if (closeIndex !== -1) {
        template += format.slice(i + 1, closeIndex);
        i = closeIndex + 1;
        continue;
      }
    }

    template += char;
    i++;
  }
  return template;
}

/**
 * 檢查字元是否為 format key 字元。
 *
 * @param char - 要檢查的字元
 */
export function isFormatKeyChar(char: string): boolean {
  return FORMAT_KEY_CHARS.has(char);
}
