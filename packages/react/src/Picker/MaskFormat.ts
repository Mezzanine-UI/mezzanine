/**
 * Format keys that can be used in mask format
 */
export const FORMAT_KEYS = ['YYYY', 'MM', 'DD', 'HH', 'mm', 'ss', 'SSS'];

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
      return [1900, 2100];
    case 'MM':
      return [1, 12];
    case 'DD':
      return [1, 31];
    case 'HH':
      return [0, 23];
    case 'mm':
    case 'ss':
      return [0, 59];
    case 'SSS':
      return [0, 999];
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

    let i = 0;
    while (i < format.length) {
      let matched = false;

      // Try to match format keys
      for (const key of FORMAT_KEYS) {
        if (format.slice(i, i + key.length) === key) {
          const cell: Cell = {
            text: key,
            mask: key,
            start: i,
            end: i + key.length,
          };
          this.cells.push(cell);
          this.maskCells.push(cell);
          i += key.length;
          matched = true;
          break;
        }
      }

      // If not matched, it's a separator
      if (!matched) {
        this.cells.push({
          text: format[i],
          start: i,
          end: i + 1,
        });
        i += 1;
      }
    }
  }

  /**
   * Get selection range for a specific mask cell index
   * @param maskCellIndex Index in maskCells array
   * @returns [start, end] for setSelectionRange
   */
  getSelection(maskCellIndex: number): [number, number] {
    const cell = this.maskCells[maskCellIndex];
    if (!cell) {
      return [0, 0];
    }
    return [cell.start, cell.end];
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

  /**
   * Get number of editable mask cells
   */
  size(): number {
    return this.maskCells.length;
  }

  /**
   * Get mask cell index from cursor position
   * @param cursorPos Current cursor position
   * @returns Index of closest mask cell
   */
  getMaskCellIndex(cursorPos: number): number {
    for (let i = 0; i < this.maskCells.length; i++) {
      const cell = this.maskCells[i];
      if (cursorPos >= cell.start && cursorPos <= cell.end) {
        return i;
      }
    }

    // Find closest cell
    for (let i = 0; i < this.maskCells.length; i++) {
      const cell = this.maskCells[i];
      if (cursorPos < cell.start) {
        return i;
      }
    }

    return this.maskCells.length - 1;
  }
}
