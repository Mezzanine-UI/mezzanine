import { parseFormatSegments } from './formatUtils';

/**
 * Format keys that can be used in mask format
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
];

/**
 * Cell represents a single mask field or separator in the format
 */
export interface Cell {
  /** Text content of this cell */
  text: string;
  /** Mask key if this is an editable field (e.g., 'YYYY', 'MM'), undefined for separators */
  mask?: string;
  /** Start position in the format string */
  start: number;
  /** End position in the format string */
  end: number;
}

/**
 * Get valid range for a mask field
 * @param key Mask key (e.g., 'YYYY', 'MM', 'DD')
 * @returns [min, max] tuple
 */
export function getMaskRange(key: string): [number, number] {
  switch (key) {
    case 'YYYY':
    case 'gggg':
    case 'GGGG':
      return [1000, 9999];
    case 'WW':
      return [1, 53];
    case 'MM':
      return [1, 12];
    case 'DD':
      return [1, 31];
    case 'HH':
      return [0, 23];
    case 'n':
      return [1, 2]; // Half-year number: 1 or 2
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
 * MaskFormat class parses format string into cells for mask input
 */
export default class MaskFormat {
  /** All cells including separators */
  cells: Cell[];
  /** Only editable mask cells (excludes separators) */
  maskCells: Cell[];

  constructor(format: string) {
    this.cells = [];
    this.maskCells = [];

    const segments = parseFormatSegments(format);

    for (const segment of segments) {
      let cell: Cell;

      if (segment.type === 'mask') {
        cell = {
          text: segment.text,
          mask: segment.text,
          start: segment.start,
          end: segment.end,
        };
        this.maskCells.push(cell);
      } else {
        cell = {
          text: segment.text,
          start: segment.start,
          end: segment.end,
        };
      }

      this.cells.push(cell);
    }
  }

  /**
   * Check if text matches this format
   * @param text Input text to validate
   * @returns true if text structure matches format
   */
  match(text: string): boolean {
    if (text.length !== this.cells[this.cells.length - 1]?.end) {
      return false;
    }

    for (const cell of this.cells) {
      const cellText = text.slice(cell.start, cell.end);

      if (cell.mask) {
        // Editable field should be all digits
        if (!/^\d+$/.test(cellText)) {
          return false;
        }
      } else {
        // Separator should match exactly
        if (cellText !== cell.text) {
          return false;
        }
      }
    }

    return true;
  }
}
