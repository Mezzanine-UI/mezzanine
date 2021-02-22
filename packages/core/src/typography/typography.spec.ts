import { toCssVar } from '@mezzanine-ui/system/css';
import { Color } from '@mezzanine-ui/system/palette';
import {
  toTypographyCssVars,
  typographyClasses as classes,
  TypographyColor,
  TypographyVariant,
} from '.';

describe('typography', () => {
  describe('typographyClasses', () => {
    it('prop:variant', () => {
      const variants: TypographyVariant[] = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'body1',
        'body2',
        'button1',
        'button2',
        'button3',
        'input1',
        'input2',
        'input3',
        'caption',
      ];

      variants.forEach((variant) => {
        expect(classes.variant(variant)).toBe(`mzn-typography--${variant}`);
      });
    });

    it('prop:align', () => {
      expect(classes.align).toBe('mzn-typography--align');
    });

    it('prop:color', () => {
      expect(classes.color).toBe('mzn-typography--color');
    });

    it('prop:display', () => {
      expect(classes.display).toBe('mzn-typography--display');
    });

    it('prop:ellipsis', () => {
      expect(classes.ellipsis).toBe('mzn-typography--ellipsis');
    });

    it('prop:noWrap', () => {
      expect(classes.noWrap).toBe('mzn-typography--nowrap');
    });
  });

  describe('toTypographyCssVars', () => {
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
});
