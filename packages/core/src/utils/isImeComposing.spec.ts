import { isImeComposing } from './isImeComposing';

describe('isImeComposing', () => {
  it('returns true when isComposing is true', () => {
    expect(isImeComposing({ isComposing: true })).toBe(true);
  });

  it('returns true when keyCode is 229', () => {
    expect(isImeComposing({ isComposing: false, keyCode: 229 })).toBe(true);
  });

  it('reads nativeEvent for React synthetic events', () => {
    expect(
      isImeComposing({
        nativeEvent: { isComposing: true, keyCode: 13 },
      }),
    ).toBe(true);
  });

  it('returns false for a normal Enter keydown', () => {
    expect(isImeComposing({ isComposing: false, keyCode: 13 })).toBe(false);
  });
});
