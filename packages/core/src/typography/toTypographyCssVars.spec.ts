import { toCssVar } from '../css';
import { Color } from '../palette';
import { TypographyColor } from './typings';
import { toTypographyCssVars } from './toTypographyCssVars';

describe('typography:toTypographyCssVars', () => {
  describe('prop:color', () => {
    const colorMaps: ([TypographyColor, Color] | TypographyColor | undefined)[] = [
      undefined,
      'inherit',
      ['primary', 'primary'],
      ['primary-dark', 'primary-dark'],
      ['primary-light', 'primary-light'],
      ['secondary', 'secondary'],
      ['secondary-dark', 'secondary-dark'],
      ['secondary-light', 'secondary-light'],
      ['error', 'error'],
      ['error-dark', 'error-dark'],
      ['error-light', 'error-light'],
      ['warning', 'warning'],
      ['warning-dark', 'warning-dark'],
      ['warning-light', 'warning-light'],
      ['text-primary', 'text-primary'],
      ['text-secondary', 'text-secondary'],
      ['text-disabled', 'text-disabled'],
    ];

    colorMaps.forEach((colorMap) => {
      let color: TypographyColor | undefined;
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
        const cssVars = toTypographyCssVars({ color });

        expect(cssVars['--mzn-typography-color']).toBe(expected);
      });
    });
  });
});
