import { toCssVar } from '@mezzanine-ui/system/css';
import { Color } from '@mezzanine-ui/system/palette';
import { iconClasses as classes, IconColor, toIconCssVars } from '.';

describe('icon', () => {
  describe('iconClasses', () => {
    it('prop:host', () => {
      expect(classes.host).toBe('mzn-icon');
    });

    it('prop:color', () => {
      expect(classes.color).toBe('mzn-icon--color');
    });

    it('prop:spin', () => {
      expect(classes.spin).toBe('mzn-icon--spin');
    });

    it('prop:size', () => {
      expect(classes.size).toBe('mzn-icon--size');
    });
  });

  describe('toIconCssVars', () => {
    describe('prop:size', () => {
      it('should has size var if size given', () => {
        const size = 48;
        const cssVars = toIconCssVars({ size });

        expect(cssVars['--mzn-icon-size']).toBe(`${size}px`);
      });
    });

    describe('prop:color', () => {
      const colorMaps: ([IconColor, Color] | IconColor | undefined)[] = [
        undefined,
        'inherit',
        ['primary', 'primary'],
        ['secondary', 'secondary'],
        ['error', 'error'],
        ['warning', 'warning'],
        ['success', 'success'],
        ['disabled', 'action-disabled'],
      ];

      colorMaps.forEach((colorMap) => {
        let color: IconColor | undefined;
        let expected: string | undefined;

        if (Array.isArray(colorMap)) {
          const [iconColor, expectedColor] = colorMap;

          color = iconColor;
          expected = toCssVar(`mzn-color-${expectedColor}`);
        } else {
          color = colorMap;
          expected = colorMap;
        }

        const message = color
          ? `should has color var if color="${color}"`
          : 'should not has color var if color=undefined';

        it(message, () => {
          const cssVars = toIconCssVars({ color });

          expect(cssVars['--mzn-icon-color']).toBe(expected);
        });
      });
    });
  });
});
