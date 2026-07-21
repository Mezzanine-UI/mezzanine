import { isSameOptionName } from './isSameOptionName';

describe('isSameOptionName()', () => {
  it('should return true for equal strings', () => {
    expect(isSameOptionName('Colorado', 'Colorado')).toBe(true);
  });

  it('should return true for differing case by default (caseSensitive defaults to false)', () => {
    expect(isSameOptionName('Colorado', 'colorado')).toBe(true);
  });

  it('should return false for differing case when caseSensitive is true', () => {
    expect(isSameOptionName('Colorado', 'colorado', true)).toBe(false);
  });

  it('should return true for equal strings when caseSensitive is true', () => {
    expect(isSameOptionName('Colorado', 'Colorado', true)).toBe(true);
  });

  it('should return false for non-matching strings regardless of caseSensitive', () => {
    expect(isSameOptionName('Colorado', 'Virginia')).toBe(false);
    expect(isSameOptionName('Colorado', 'Virginia', true)).toBe(false);
  });
});
