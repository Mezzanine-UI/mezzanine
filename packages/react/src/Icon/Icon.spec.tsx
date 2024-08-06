import { PlusIcon } from '@mezzanine-ui/icons';
import { toCssVar } from '@mezzanine-ui/system/css';
import { Color } from '@mezzanine-ui/system/palette';
import { cleanup, fireEvent, render, waitFor } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Icon, { IconColor } from '.';

describe('<Icon />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(<Icon ref={ref} icon={PlusIcon} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Icon className={className} icon={PlusIcon} />),
  );

  describe('attrs, aria-*, data-*', () => {
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

  describe('prop: size', () => {
    it('should apply size className when size is given', () => {
      const fontSize = 36;
      const { getHostHTMLElement } = render(
        <Icon icon={PlusIcon} size={fontSize} />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-icon--size')).toBe(true);
      expect(element.style.getPropertyValue('--mzn-icon-size')).toBe(
        `${fontSize}px`,
      );
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
        const { getHostHTMLElement } = render(
          <Icon icon={PlusIcon} color={color} />,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-icon--color')).toBe(!!color);
        expect(element.style.getPropertyValue('--mzn-icon-color')).toBe(
          expected,
        );
      });
    });
  });

  describe('prop: spin', () => {
    [false, true].forEach((spin) => {
      const message = spin
        ? 'should add class if spin=true'
        : 'should not add class if spin=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <Icon icon={PlusIcon} spin={spin} />,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-icon--spin')).toBe(spin);
      });
    });
  });

  describe('prop: title', () => {
    it('should render title when props.title is given.', () => {
      const customTitle = 'foo';
      const { getHostHTMLElement } = render(
        <Icon icon={PlusIcon} title={customTitle} />,
      );
      const element = getHostHTMLElement();
      const titleElements = element.getElementsByTagName('title');

      expect(titleElements[0].textContent).toBe(customTitle);
    });

    it('should render definition.title when given', () => {
      const OverridePlusIcon = {
        ...PlusIcon,
        definition: {
          ...PlusIcon.definition,
          title: 'foo',
        },
      };

      const { getHostHTMLElement } = render(<Icon icon={OverridePlusIcon} />);
      const element = getHostHTMLElement();
      const titleElements = element.getElementsByTagName('title');

      expect(titleElements[0].textContent).toBe(
        OverridePlusIcon.definition.title,
      );
    });
  });

  describe('prop: onClick, onMouseOver', () => {
    let hasClick = false;
    const setClick = () => {
      hasClick = true;
    };

    [
      { onClick: setClick, onMouseOver: undefined },
      { onClick: undefined, onMouseOver: setClick },
      { onClick: setClick, onMouseOver: setClick },
      { onClick: undefined, onMouseOver: undefined },
    ].forEach((handler) => {
      const message =
        handler.onClick || handler.onMouseOver
          ? 'cursor should be changed to pointer'
          : 'should not change cursor';

      const cursorStyle =
        handler.onClick || handler.onMouseOver ? 'pointer' : 'inherit';

      const { getHostHTMLElement } = render(
        <Icon
          icon={PlusIcon}
          onClick={handler?.onClick}
          onMouseOver={handler?.onMouseOver}
        />,
      );
      const element = getHostHTMLElement();

      fireEvent.click(element);

      it(message, async () => {
        await waitFor(() => !handler || hasClick);
        expect(element.style.getPropertyValue('--mzn-icon-cursor')).toBe(
          cursorStyle,
        );
        hasClick = false;
      });
    });
  });
});
