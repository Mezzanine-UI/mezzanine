/**
 * Format key characters that can appear in patterns
 */
export const FORMAT_KEY_CHARS = new Set([
  'Y',
  'g',
  'G',
  'W',
  'w', // Locale week (not ISO week)
  'M',
  'D',
  'H', // Hour (0-23)
  'n', // Half-year number (1-2)
  'm',
  's',
  'S',
  'Q',
]);

/**
 * Represents a segment of the format string (mask field, separator, or literal)
 */
export interface FormatSegment {
  type: 'mask' | 'separator' | 'literal';
  text: string;
  start: number; // Position in actual value (without brackets)
  end: number;
}

/**
 * Parse format string into segments with their actual value positions
 * Handles bracket literals and consecutive format keys
 */
export function parseFormatSegments(format: string): FormatSegment[] {
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
 * Check if a mask segment is fully filled with digits
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
 * Find the last mask segment before a given position
 */
export function findPreviousMaskSegment(
  segments: FormatSegment[],
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
 * Strip brackets from format string to get template without brackets
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
 * Check if a character is a format key character
 */
export function isFormatKeyChar(char: string): boolean {
  return FORMAT_KEY_CHARS.has(char);
}
