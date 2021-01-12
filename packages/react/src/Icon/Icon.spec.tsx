import { PlusIcon } from '@mezzanine-ui/icons';
import { toCssVar } from '@mezzanine-ui/core/css';
import { Color } from '@mezzanine-ui/core/palette';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Icon, { IconColor } from '.';

describe('<Icon />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLElement,
    (ref) => render(<Icon ref={ref} icon={PlusIcon} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Icon className={className} icon={PlusIcon} />),
  );

  describe('attrs, aria-*, data-*', () => {
    it('should set aria-hidden to true', () => {
      const { getHostHTMLElement } = render(<Icon icon={PlusIcon} />);
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-hidden')).toBe('true');
    });

    it('should set data-icon-name to name of icon', () => {
      const { getHostHTMLElement } = render(<Icon icon={PlusIcon} />);
      const element = getHostHTMLElement();

      expect(element.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });

    it('should set focusable of svg to false', () => {
      const { getHostHTMLElement } = render(<Icon icon={PlusIcon} />);
      const element = getHostHTMLElement();
      const svgElement = element.firstElementChild;

      expect(svgElement?.getAttribute('focusable')).toBe('false');
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

      it(message, () => {
        const { getHostHTMLElement } = render(<Icon icon={PlusIcon} color={color} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-icon--color')).toBe(!!color);
        expect(element.style.getPropertyValue('--mzn-icon-color')).toBe(expected);
      });
    });
  });

  describe('prop: spin', () => {
    [false, true].forEach((spin) => {
      const message = spin
        ? 'should add class if spin=true'
        : 'should not add class if spin=false';

      it(message, () => {
        const { getHostHTMLElement } = render(<Icon icon={PlusIcon} spin={spin} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-icon--spin')).toBe(spin);
      });
    });
  });
});
