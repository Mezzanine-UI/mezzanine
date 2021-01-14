import { toCssVar } from './toCssVar';

describe('css:toCssVar', () => {
  it('w/o fallback', () => {
    expect(toCssVar('foo')).toBe('var(--foo)');
  });

  it('w/ fallback', () => {
    expect(toCssVar('foo', 'bar')).toBe('var(--foo, bar)');
    expect(toCssVar('foo', toCssVar('bar'))).toBe('var(--foo, var(--bar))');
  });
});
