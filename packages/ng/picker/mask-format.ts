import { parseFormatSegments } from './format-utils';

/**
 * Format keys that can be used in mask format.
 *
 * - `'YYYY'` — 四位數年份
 * - `'gggg'` — ISO 週年（小寫）
 * - `'GGGG'` — ISO 週年（大寫）
 * - `'WW'` — 週次（2 位）
 * - `'MM'` — 月份
 * - `'DD'` — 日
 * - `'HH'` — 時（0–23）
 * - `'mm'` — 分
 * - `'ss'` — 秒
 * - `'SSS'` — 毫秒
 * - `'Q'` — 季度
 */
export const FORMAT_KEYS = [
  'YYYY', // Year
  'gggg', // ISO week year (lowercase)
  'GGGG', // ISO week year (uppercase)
  'WW', // Week of year (2 digits)
  'MM', // Month
  'DD', // Day
  'HH', // Hour
  'mm', // Minute
  'ss', // Second
  'SSS', // Millisecond
  'Q', // Quarter
] as const;

/**
 * Cell 代表 mask 格式中的單一欄位或分隔符。
 */
export interface Cell {
  /** 此 cell 的文字內容。 */
  readonly text: string;
  /** 若為可編輯欄位，此為 mask key（例如 `'YYYY'`、`'MM'`）；分隔符為 undefined。 */
  readonly mask?: string;
  /** 在格式化值中的起始位置。 */
  readonly start: number;
  /** 在格式化值中的結束位置（exclusive）。 */
  readonly end: number;
}

/**
 * 取得 mask 欄位的合法值範圍。
 *
 * @param key - Mask key（例如 `'YYYY'`、`'MM'`、`'DD'`）
 * @returns `[min, max]` tuple
 *
 * @example
 * ```ts
 * import { getMaskRange } from '@mezzanine-ui/ng/picker';
 *
 * const [min, max] = getMaskRange('MM'); // [1, 12]
 * ```
 */
export function getMaskRange(key: string): [number, number] {
  switch (key) {
    case 'YYYY':
    case 'gggg':
    case 'GGGG':
      return [1000, 9999];
    case 'WW':
    case 'ww':
      return [1, 53];
    case 'MM':
      return [1, 12];
    case 'DD':
      return [1, 31];
    case 'HH':
      return [0, 23];
    case 'n':
      return [1, 2];
    case 'mm':
    case 'ss':
      return [0, 59];
    case 'SSS':
      return [0, 999];
    case 'Q':
      return [1, 4];
    default:
      return [0, 99];
  }
}

/**
 * MaskFormat 將格式字串解析為可操作的 cells，供 mask 輸入框使用。
 *
 * 這是一個純 TypeScript 工具類別（無 Angular decorator），
 * 可在 service 或 component 中直接實例化。
 *
 * @example
 * ```ts
 * import { MaskFormat } from '@mezzanine-ui/ng/picker';
 *
 * const mask = new MaskFormat('YYYY-MM-DD');
 * console.log(mask.maskCells); // [{ text: 'YYYY', mask: 'YYYY', start: 0, end: 4 }, ...]
 * console.log(mask.match('2024-01-15')); // true
 * ```
 *
 * @see {@link MznFormattedInput} 使用此類別的格式化輸入元件
 */
export class MaskFormat {
  /** 所有 cells，包含分隔符。 */
  readonly cells: readonly Cell[];
  /** 僅可編輯的 mask cells（不含分隔符）。 */
  readonly maskCells: readonly Cell[];

  constructor(format: string) {
    const allCells: Cell[] = [];
    const editableCells: Cell[] = [];

    const segments = parseFormatSegments(format);

    for (const segment of segments) {
      if (segment.type === 'mask') {
        const cell: Cell = {
          text: segment.text,
          mask: segment.text,
          start: segment.start,
          end: segment.end,
        };
        allCells.push(cell);
        editableCells.push(cell);
      } else {
        allCells.push({
          text: segment.text,
          start: segment.start,
          end: segment.end,
        });
      }
    }

    this.cells = allCells;
    this.maskCells = editableCells;
  }

  /**
   * 檢查輸入文字是否符合此格式。
   *
   * @param text - 要驗證的輸入文字
   * @returns 若文字結構符合格式則為 `true`
   *
   * @example
   * ```ts
   * const mask = new MaskFormat('YYYY-MM-DD');
   * mask.match('2024-01-15'); // true
   * mask.match('2024-1-5');   // false
   * ```
   */
  match(text: string): boolean {
    const lastCell = this.cells[this.cells.length - 1];
    if (text.length !== lastCell?.end) {
      return false;
    }

    for (const cell of this.cells) {
      const cellText = text.slice(cell.start, cell.end);

      if (cell.mask) {
        if (!/^\d+$/.test(cellText)) {
          return false;
        }
      } else {
        if (cellText !== cell.text) {
          return false;
        }
      }
    }

    return true;
  }
}
