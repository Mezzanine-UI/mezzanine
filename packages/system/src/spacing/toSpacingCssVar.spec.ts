import { toSpacingCssVar } from './toSpacingCssVar';

describe('spacing:toSpacingCssVar', () => {
  it('prop:level', () => {
    expect(toSpacingCssVar(1)).toBe('var(--mzn-spacing-1)');
    expect(toSpacingCssVar(2)).toBe('var(--mzn-spacing-2)');
    expect(toSpacingCssVar(3)).toBe('var(--mzn-spacing-3)');
    expect(toSpacingCssVar(4)).toBe('var(--mzn-spacing-4)');
    expect(toSpacingCssVar(5)).toBe('var(--mzn-spacing-5)');
  });
});
