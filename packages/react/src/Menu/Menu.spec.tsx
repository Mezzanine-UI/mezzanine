import { MenuSize } from '@mezzanine-ui/core/menu';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Menu from '.';
import ConfigProvider from '../Provider';

describe('<Menu />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLUListElement, (ref) =>
    render(<Menu ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Menu className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Menu />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-menu')).toBeTruthy();
  });

  describe('prop: itemsInView', () => {
    it('should render itemsInView=4 by default', () => {
      const { getHostHTMLElement } = render(<Menu />);
      const element = getHostHTMLElement();

      expect(element.style.getPropertyValue('--mzn-menu-items-in-view')).toBe(
        '4',
      );
    });

    it('should bind css variable from props', () => {
      const itemsInView = 5;
      const { getHostHTMLElement } = render(<Menu itemsInView={itemsInView} />);
      const element = getHostHTMLElement();

      expect(element.style.getPropertyValue('--mzn-menu-items-in-view')).toBe(
        `${itemsInView}`,
      );
    });
  });

  describe('prop: maxHeight', () => {
    it('should bind css variable', () => {
      const maxHeight = 200;
      const { getHostHTMLElement } = render(<Menu maxHeight={maxHeight} />);
      const element = getHostHTMLElement();

      expect(element.style.getPropertyValue('--mzn-menu-max-height')).toBe(
        `${maxHeight}px`,
      );
    });
  });

  describe('prop: role', () => {
    it('should render role="menu" by default', () => {
      const { getHostHTMLElement } = render(<Menu />);
      const element = getHostHTMLElement();

      expect(element.getAttribute('role')).toBe('menu');
    });

    it('should override original role', () => {
      const role = 'select';
      const { getHostHTMLElement } = render(<Menu role={role} />);
      const element = getHostHTMLElement();

      expect(element.getAttribute('role')).toBe(role);
    });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<Menu />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-menu--medium')).toBeTruthy();
    });

    it('should accept ConfigProvider context size changes', () => {
      const { getHostHTMLElement } = render(
        <ConfigProvider size="large">
          <Menu />
        </ConfigProvider>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-menu--large')).toBeTruthy();
    });

    const sizes: MenuSize[] = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`should add class if size=${size}`, () => {
        const { getHostHTMLElement } = render(<Menu size={size} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-menu--${size}`)).toBeTruthy();
      });
    });
  });
});
