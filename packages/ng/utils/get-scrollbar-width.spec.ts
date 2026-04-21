import { getScrollbarWidth } from './get-scrollbar-width';

describe('getScrollbarWidth', () => {
  it('should return 0 when document does not overflow', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 500,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      configurable: true,
    });

    expect(getScrollbarWidth()).toBe(0);
  });

  it('should return scrollbar width when document overflows', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      configurable: true,
    });

    const width = getScrollbarWidth();

    expect(typeof width).toBe('number');
    expect(width).toBeGreaterThanOrEqual(0);
  });
});
