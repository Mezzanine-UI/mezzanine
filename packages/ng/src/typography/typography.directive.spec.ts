import { toCssVar } from '@mezzanine-ui/core/css';
import { Color } from '@mezzanine-ui/core/palette';
import {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
  TypographyVariant,
} from '@mezzanine-ui/core/typography';
import { render } from '@testing-library/angular';
import { MznTypographyDirective } from '.';

describe('MznTypographyDirective', () => {
  describe('input: variant', () => {
    it('should render variant="body1" by default', async () => {
      const result = await render(MznTypographyDirective, {
        template: `
          <p mznTypography>Hello</p>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-typography--body1')).toBeTruthy();
    });

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
      it(`should render variant="${variant}"`, async () => {
        const result = await render(MznTypographyDirective, {
          template: `
            <p [mznTypography]="variant">Hello</p>
          `,
          componentProperties: {
            variant,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-typography--${variant}`)).toBeTruthy();
      });
    });

    it('should sync corresponding class of variant after changed', async () => {
      const result = await render(MznTypographyDirective, {
        template: `
          <p [mznTypography]="variant">Hello</p>
        `,
        componentProperties: {
          variant: 'body1',
        },
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-typography--body1')).toBeTruthy();

      result.rerender({
        variant: 'body2',
      } as any);

      expect(element.classList.contains('mzn-typography--body1')).toBeFalsy();
      expect(element.classList.contains('mzn-typography--body2')).toBeTruthy();
    });
  });

  describe('input: align', () => {
    const aligns: (TypographyAlign | undefined)[] = [undefined, 'left', 'center', 'right', 'justify'];

    aligns.forEach((align) => {
      const message = align
        ? `should add class and style if align="${align}"`
        : 'should not add class and style if align=undefined';

      it(message, async () => {
        const result = await render(MznTypographyDirective, {
          template: `
            <p mznTypography [mznTypographyAlign]="align">Hello</p>
          `,
          componentProperties: {
            align,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-typography--align')).toBe(!!align);
        expect(element.style.getPropertyValue('--mzn-typography-align')).toBe(align || '');
      });
    });
  });

  describe('input: color', () => {
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
        const [typographyColor, expectedColor] = colorMap;
        color = typographyColor;
        expected = toCssVar(`mzn-color-${expectedColor}`);
      } else {
        color = colorMap;
        expected = colorMap || '';
      }

      const message = color
        ? `should add class and style if color="${color}"`
        : 'should not add class and style if color=undefined';

      it(message, async () => {
        const result = await render(MznTypographyDirective, {
          template: `
            <p mznTypography [mznTypographyColor]="color">Hello</p>
          `,
          componentProperties: {
            color,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-typography--color')).toBe(!!color);
        expect(element.style.getPropertyValue('--mzn-typography-color')).toBe(expected);
      });
    });
  });

  describe('input: display', () => {
    const displays: (TypographyDisplay | undefined)[] = [undefined, 'block', 'inline-block', 'flex', 'inline-flex'];

    displays.forEach((display) => {
      const message = display
        ? `should add class and style if display="${display}"`
        : 'should not add class and style if display=undefined';

      it(message, async () => {
        const result = await render(MznTypographyDirective, {
          template: `
            <p mznTypography [mznTypographyDisplay]="display">Hello</p>
          `,
          componentProperties: {
            display,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-typography--display')).toBe(!!display);
        expect(element.style.getPropertyValue('--mzn-typography-display')).toBe(display || '');
      });
    });
  });

  describe('input: ellipsis', () => {
    [false, true].forEach((ellipsis) => {
      const message = ellipsis
        ? 'should add class and provide titile attribute if ellipsis=true'
        : 'should not add class and not provide titile attribute if ellipsis=false';

      it(message, async () => {
        const result = await render(MznTypographyDirective, {
          template: `
            <p mznTypography [mznTypographyEllipsis]="ellipsis">Hello</p>
          `,
          componentProperties: {
            ellipsis,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-typography--ellipsis')).toBe(ellipsis);
        expect(element.getAttribute('title')).toBe(ellipsis ? 'Hello' : null);
      });
    });

    it('should sync title attribute after ellipsis or text changed', async () => {
      const result = await render(MznTypographyDirective, {
        template: `
          <p mznTypography [mznTypographyEllipsis]="ellipsis">{{content}}</p>
        `,
        componentProperties: {
          content: 'Hello',
          ellipsis: false,
        },
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.getAttribute('title')).toBe(null);

      result.rerender({
        ellipsis: true,
      } as any);

      expect(element.getAttribute('title')).toBe('Hello');

      result.rerender({
        content: 'World!',
      } as any);

      expect(element.getAttribute('title')).toBe('World!');

      result.rerender({
        ellipsis: false,
      } as any);

      expect(element.getAttribute('title')).toBe(null);
    });
  });

  describe('input: noWrap', () => {
    [false, true].forEach((noWrap) => {
      const message = noWrap
        ? 'should add class if noWrap=true'
        : 'should not add class if noWrap=false';

      it(message, async () => {
        const result = await render(MznTypographyDirective, {
          template: `
            <p mznTypography [mznTypographyNoWrap]="noWrap">Hello</p>
          `,
          componentProperties: {
            noWrap,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-typography--nowrap')).toBe(noWrap);
      });
    });
  });
});
