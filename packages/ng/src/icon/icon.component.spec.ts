import { CheckIcon, IconDefinition, PlusIcon } from '@mezzanine-ui/icons';
import { toCssVar } from '@mezzanine-ui/system/css';
import { Color } from '@mezzanine-ui/system/palette';
import { IconColor } from '@mezzanine-ui/core/icon';
import { render } from '@testing-library/angular';
import { MznIconComponent } from '.';

describe('MznIconComponent', () => {
  describe('attrs, aria-*, data-*', () => {
    let element: HTMLElement;

    beforeEach(async () => {
      const result = await render(MznIconComponent, {
        template: `
          <i [mzn-icon]="icon"></i>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });

      element = result.container.firstElementChild as HTMLElement;
    });

    it('should set host class', () => {
      expect(element.classList.contains('mzn-icon')).toBeTruthy();
    });

    it('should set aria-hidden to true', () => {
      expect(element.getAttribute('aria-hidden')).toBe('true');
    });

    it('should set data-icon-name to name of icon', () => {
      expect(element.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });

    it('should set focusable of svg to false', () => {
      const svgElement = element.firstElementChild as SVGElement;

      expect(svgElement.getAttribute('focusable')).toBe('false');
    });
  });

  describe('input: icon', () => {
    it('should sync IconDefinition after changed', async () => {
      const result = await render(MznIconComponent, {
        template: `
          <i [mzn-icon]="icon"></i>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });
      const element = result.container.firstElementChild as HTMLElement;
      const svgElement = element.firstElementChild as SVGElement;
      const path = svgElement.querySelector('path');

      function testIconDefinition(icon: IconDefinition) {
        expect(element.getAttribute('data-icon-name')).toBe(icon.name);
        expect(svgElement.getAttribute('viewBox')).toBe(icon.definition.svg?.viewBox ?? null);
        expect(path?.getAttribute('d')).toBe(icon.definition.path?.d ?? null);
        expect(path?.getAttribute('fill-rule')).toBe(icon.definition.path?.fillRule ?? null);
        expect(path?.getAttribute('fill')).toBe(icon.definition.path?.fill ?? null);
        expect(path?.getAttribute('stroke')).toBe(icon.definition.path?.stroke ?? null);
        expect(path?.getAttribute('stroke-width')).toBe(
          icon.definition.path?.strokeWidth !== undefined
            ? `${icon.definition.path?.strokeWidth}`
            : null,
        );
        expect(path?.getAttribute('transform')).toBe(icon.definition.path?.transform ?? null);
      }

      testIconDefinition(PlusIcon);

      result.rerender({
        icon: CheckIcon,
      });

      testIconDefinition(CheckIcon);
    });
  });

  describe('prop: color', () => {
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
        expected = colorMap || '';
      }

      const message = color
        ? `should add class and style if color="${color}"`
        : 'should not add class and style if color=undefined';

      it(message, async () => {
        const result = await render(MznIconComponent, {
          template: `
            <i [mzn-icon]="icon" [color]="color"></i>
          `,
          componentProperties: {
            icon: PlusIcon,
            color,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-icon--color')).toBe(!!color);
        expect(element.style.getPropertyValue('--mzn-icon-color')).toBe(expected);
      });
    });

    it('should sync color css variable after changed', async () => {
      const result = await render(MznIconComponent, {
        template: `
          <i [mzn-icon]="icon" [color]="color"></i>
        `,
        componentProperties: {
          icon: PlusIcon,
          color: 'primary',
        },
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-icon--color')).toBeTruthy();
      expect(element.style.getPropertyValue('--mzn-icon-color')).toBe(toCssVar('mzn-color-primary'));

      result.rerender({
        color: 'secondary',
      } as any);

      expect(element.classList.contains('mzn-icon--color')).toBeTruthy();
      expect(element.style.getPropertyValue('--mzn-icon-color')).toBe(toCssVar('mzn-color-secondary'));

      result.rerender({
        color: undefined,
      } as any);

      expect(element.classList.contains('mzn-icon--color')).toBeFalsy();
      expect(element.style.getPropertyValue('--mzn-icon-color')).toBe('');
    });
  });

  describe('input: spin', () => {
    [false, true].forEach((spin) => {
      const message = spin
        ? 'should add class if spin=true'
        : 'should not add class if spin=false';

      it(message, async () => {
        const result = await render(MznIconComponent, {
          template: `
            <i [mzn-icon]="icon" [spin]="spin"></i>
          `,
          componentProperties: {
            icon: PlusIcon,
            spin,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-icon--spin')).toBe(spin);
      });
    });
  });
});
