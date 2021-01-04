import { toCssVar } from '../css';
import { ButtonGroupSpacing, ButtonSize } from './typings';
import { toButtonGroupCssVars } from './toButtonGroupCssVars';

describe('button:toButtonGroupCssVars', () => {
  describe('prop:spacing', () => {
    const sizeSpacingMaps: [ButtonSize, ButtonGroupSpacing][] = [
      ['large', 4],
      ['medium', 4],
      ['small', 3],
    ];

    sizeSpacingMaps.forEach(([size, spacing]) => {
      it(`should set spacing=${spacing} if size=${size}`, () => {
        const cssVars = toButtonGroupCssVars({ size });

        expect(cssVars['--mzn-button-group-spacing']).toBe(toCssVar(`mzn-spacing-${spacing}`));
      });
    });

    it('should override spacing by passed spacing', () => {
      const spacing: ButtonGroupSpacing = 1;
      const cssVars = toButtonGroupCssVars({ size: 'small', spacing });

      expect(cssVars['--mzn-button-group-spacing']).toBe(toCssVar(`mzn-spacing-${spacing}`));
    });
  });
});
