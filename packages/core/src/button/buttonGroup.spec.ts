import { toCssVar } from '@mezzanine-ui/system/css';
import {
  buttonGroupClasses as classes,
  ButtonGroupOrientation,
  ButtonGroupSpacing,
  ButtonSize,
  toButtonGroupCssVars,
} from '.';

describe('buttonGroup', () => {
  describe('buttonGroupClasses', () => {
    it('prop:host', () => {
      expect(classes.host).toBe('mzn-button-group');
    });

    it('prop:fullWidth', () => {
      expect(classes.fullWidth).toBe('mzn-button-group--full-width');
    });

    it('prop:orientation', () => {
      const orientations: ButtonGroupOrientation[] = [
        'horizontal',
        'vertical',
      ];

      orientations.forEach((orientation) => {
        expect(classes.orientation(orientation)).toBe(`mzn-button-group--${orientation}`);
      });
    });

    it('prop:attached', () => {
      expect(classes.attached).toBe('mzn-button-group--attached');
    });
  });

  describe('toButtonGroupCssVars', () => {
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
});
