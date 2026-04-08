import { formatNumberWithCommas, parseNumberWithCommas } from './format-number';

describe('formatNumberWithCommas', () => {
  it('should format a number with commas', () => {
    expect(formatNumberWithCommas(1234567)).toBe('1,234,567');
  });

  it('should format a numeric string with commas', () => {
    expect(formatNumberWithCommas('1234567')).toBe('1,234,567');
  });

  it('should return empty string for NaN', () => {
    expect(formatNumberWithCommas(NaN)).toBe('');
  });

  it('should return empty string for Infinity', () => {
    expect(formatNumberWithCommas(Infinity)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(formatNumberWithCommas('')).toBe('');
  });

  it('should return empty string for non-numeric string', () => {
    expect(formatNumberWithCommas('abc')).toBe('');
  });

  it('should handle decimal numbers', () => {
    expect(formatNumberWithCommas(1234.56)).toBe('1,234.56');
  });

  it('should handle negative numbers', () => {
    expect(formatNumberWithCommas(-1234567)).toBe('-1,234,567');
  });

  it('should accept locale option', () => {
    const result = formatNumberWithCommas(1234567, 'de-DE');

    expect(result).toContain('1');
  });

  it('should accept Intl.NumberFormatOptions', () => {
    const result = formatNumberWithCommas(1234.5, 'en-US', {
      minimumFractionDigits: 2,
    });

    expect(result).toBe('1,234.50');
  });
});

describe('parseNumberWithCommas', () => {
  it('should parse a comma-formatted string to number', () => {
    expect(parseNumberWithCommas('1,234,567')).toBe(1234567);
  });

  it('should parse a string without commas', () => {
    expect(parseNumberWithCommas('1234567')).toBe(1234567);
  });

  it('should return null for empty string', () => {
    expect(parseNumberWithCommas('')).toBeNull();
  });

  it('should return null for non-string input', () => {
    expect(parseNumberWithCommas(123 as unknown as string)).toBeNull();
  });

  it('should handle decimal numbers', () => {
    expect(parseNumberWithCommas('1,234.56')).toBe(1234.56);
  });

  it('should handle negative numbers', () => {
    expect(parseNumberWithCommas('-1,234,567')).toBe(-1234567);
  });

  it('should return null for non-finite result', () => {
    expect(parseNumberWithCommas('abc')).toBeNull();
  });

  describe('strict mode', () => {
    it('should accept properly formatted numbers', () => {
      expect(parseNumberWithCommas('1,234,567', true)).toBe(1234567);
    });

    it('should reject improperly formatted numbers', () => {
      expect(parseNumberWithCommas('12,34', true)).toBeNull();
    });

    it('should reject numbers without commas in strict mode', () => {
      expect(parseNumberWithCommas('1234567', true)).toBeNull();
    });

    it('should accept numbers under 1000 without commas', () => {
      expect(parseNumberWithCommas('999', true)).toBe(999);
    });
  });
});
