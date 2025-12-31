import { highlightText } from './highlightText';

describe('highlightText', () => {
  it('should return empty array for empty text', () => {
    expect(highlightText('')).toEqual([]);
  });

  it('should return single non-highlighted segment when keyword is not provided', () => {
    expect(highlightText('Hello World')).toEqual([
      { text: 'Hello World', highlight: false },
    ]);
  });

  it('should return single non-highlighted segment when keyword is empty', () => {
    expect(highlightText('Hello World', '')).toEqual([
      { text: 'Hello World', highlight: false },
    ]);
  });

  it('should highlight matching text (case insensitive)', () => {
    expect(highlightText('Hello World', 'hello')).toEqual([
      { text: 'Hello', highlight: true },
      { text: ' World', highlight: false },
    ]);
  });

  it('should highlight multiple matches', () => {
    expect(highlightText('Hello Hello World', 'hello')).toEqual([
      { text: 'Hello', highlight: true },
      { text: ' ', highlight: false },
      { text: 'Hello', highlight: true },
      { text: ' World', highlight: false },
    ]);
  });

  it('should handle special regex characters in keyword', () => {
    expect(highlightText('Test (value) [item]', '(value)')).toEqual([
      { text: 'Test ', highlight: false },
      { text: '(value)', highlight: true },
      { text: ' [item]', highlight: false },
    ]);
  });

  it('should handle keyword with dots', () => {
    expect(highlightText('test.com example.org', 'test.com')).toEqual([
      { text: 'test.com', highlight: true },
      { text: ' example.org', highlight: false },
    ]);
  });

  it('should handle keyword with asterisks', () => {
    expect(highlightText('test*value', 'test*')).toEqual([
      { text: 'test*', highlight: true },
      { text: 'value', highlight: false },
    ]);
  });

  it('should return single non-highlighted segment when keyword not found', () => {
    expect(highlightText('Hello World', 'xyz')).toEqual([
      { text: 'Hello World', highlight: false },
    ]);
  });

  it('should handle partial matches at start', () => {
    expect(highlightText('Hello World', 'Hel')).toEqual([
      { text: 'Hel', highlight: true },
      { text: 'lo World', highlight: false },
    ]);
  });

  it('should handle partial matches at end', () => {
    expect(highlightText('Hello World', 'orld')).toEqual([
      { text: 'Hello W', highlight: false },
      { text: 'orld', highlight: true },
    ]);
  });

  it('should handle keyword matching entire text', () => {
    expect(highlightText('Hello', 'Hello')).toEqual([
      { text: 'Hello', highlight: true },
    ]);
  });

  it('should handle overlapping matches correctly', () => {
    expect(highlightText('aaa', 'aa')).toEqual([
      { text: 'aa', highlight: true },
      { text: 'a', highlight: false },
    ]);
  });
});

