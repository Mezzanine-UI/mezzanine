import { PlusIcon } from '@mezzanine-ui/icons';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Navigation from './Navigation';
import NavigationSubMenu from './NavigationSubMenu';
import { NavigationContext } from './NavigationContext';

describe('<NavigationSubMenu />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLIElement, (ref) =>
    render(<NavigationSubMenu ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<NavigationSubMenu className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<NavigationSubMenu />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-navigation-sub-menu')).toBeTruthy();
  });

  describe('click on item open subMenu', () => {
    it('should open subMenu', () => {
      const { getHostHTMLElement } = render(
        <Navigation orientation="vertical">
          <NavigationSubMenu active />
        </Navigation>,
      );
      const element = getHostHTMLElement();

      const subMenuElement = element.querySelector('.mzn-navigation-sub-menu');

      act(() => {
        fireEvent.click(subMenuElement!);
      });

      const subMenuGroupElement = subMenuElement?.querySelector(
        '.mzn-navigation-sub-menu__group',
      );

      expect(subMenuGroupElement).toBeTruthy();
    });
  });

  describe('prop: active', () => {
    it('should bind active class', () => {
      const { getHostHTMLElement } = render(<NavigationSubMenu active />);
      const element = getHostHTMLElement();

      expect(element.classList).toContain('mzn-navigation-sub-menu--active');
    });
  });

  describe('prop: icon', () => {
    it('should render suffix icon', () => {
      const { getHostHTMLElement } = render(
        <NavigationSubMenu icon={PlusIcon} />,
      );
      const element = getHostHTMLElement();
      const { firstElementChild: titleElement } = element;
      const { firstElementChild: iconElement } = titleElement!;

      expect(iconElement?.tagName.toLowerCase()).toBe('i');
    });
  });

  describe('prop: title', () => {
    it('should render title', () => {
      const subMenuTitle = 'foo';
      const { getHostHTMLElement } = render(
        <NavigationSubMenu title={subMenuTitle} icon={PlusIcon} />,
      );
      const element = getHostHTMLElement();
      const { firstElementChild: titleElement } = element;

      expect(titleElement?.textContent).toBe(subMenuTitle);
    });
  });
});
