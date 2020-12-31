import { toCssVar } from '../css';
import { Color } from '../palette';
import { IconColor } from './typings';
import { toIconCssVars } from './toIconCssVars';

describe('icon:toIconCssVars', () => {
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

        expect(cssVars['--mzn-css-color']).toBe(expected);
      });
    });
  });
});
