import { PlusIcon } from '@mezzanine-ui/icons';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

import Navigation from './Navigation';
import NavigationOption from './NavigationOption';
import NavigationHeader from './NavigationHeader';
import NavigationFooter from './NavigationFooter';
import NavigationOptionCategory from './NavigationOptionCategory';
import NavigationUserMenu from './NavigationUserMenu';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

describe('<Navigation />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(<Navigation ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Navigation className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Navigation />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-navigation')).toBeTruthy();
  });

  describe('prop: collapsed', () => {
    it('should apply expand class by default', () => {
      const { getHostHTMLElement } = render(<Navigation />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-navigation--expand')).toBeTruthy();
    });

    it('should apply collapsed class when collapsed is true', () => {
      const { getHostHTMLElement } = render(<Navigation collapsed />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-navigation--collapsed'),
      ).toBeTruthy();
    });
  });

  describe('prop: children', () => {
    it('should render NavigationOption children', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Option 1" icon={PlusIcon} />
          <NavigationOption title="Option 2" icon={PlusIcon} />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const options = element.querySelectorAll('.mzn-navigation-option');

      expect(options.length).toBe(2);
    });

    it('should render NavigationHeader', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationHeader title="Header Title" />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const header = element.querySelector('.mzn-navigation-header');

      expect(header).toBeTruthy();
    });

    it('should render NavigationFooter', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationFooter />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const footer = element.querySelector('.mzn-navigation-footer');

      expect(footer).toBeTruthy();
    });

    it('should render NavigationOptionCategory', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOptionCategory title="Category">
            <NavigationOption title="Option 1" icon={PlusIcon} />
          </NavigationOptionCategory>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const category = element.querySelector('.mzn-navigation-option-category');

      expect(category).toBeTruthy();
    });

    it('should allow null and Fragment children', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          {null}
          <>
            <NavigationOption title="Option 1" icon={PlusIcon} />
          </>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const options = element.querySelectorAll('.mzn-navigation-option');

      expect(options.length).toBe(1);
    });
  });

  describe('prop: filter', () => {
    it('should render search input when filter is true', () => {
      const { getHostHTMLElement } = render(<Navigation filter />);
      const element = getHostHTMLElement();
      const input = element.querySelector('.mzn-navigation__search-input');

      expect(input).toBeTruthy();
    });
  });

  describe('prop: onOptionClick', () => {
    it('should call onOptionClick when an option is clicked', () => {
      const onOptionClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Navigation onOptionClick={onOptionClick}>
          <NavigationOption title="Option 1" href="/test" icon={PlusIcon} />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const option = element.querySelector('.mzn-navigation-option__content');

      fireEvent.click(option!);

      expect(onOptionClick).toHaveBeenCalled();
    });
  });

  describe('prop: onCollapseChange', () => {
    it('should call onCollapseChange when collapse button is clicked', () => {
      const onCollapseChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Navigation onCollapseChange={onCollapseChange}>
          <NavigationHeader title="Header" />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const collapseButton = element.querySelector(
        '.mzn-navigation-icon-button',
      );

      fireEvent.click(collapseButton!);

      expect(onCollapseChange).toHaveBeenCalledWith(true);
    });
  });
});

describe('<NavigationHeader />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(
      <Navigation>
        <NavigationHeader ref={ref} title="Header" />
      </Navigation>,
    ),
  );

  describe('className', () => {
    it('should append class name on host element', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationHeader className="foo" title="Header" />
        </Navigation>,
      );
      const header = getHostHTMLElement().querySelector(
        '.mzn-navigation-header',
      );

      expect(header?.classList.contains('foo')).toBeTruthy();
    });
  });

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Navigation>
        <NavigationHeader title="Header" />
      </Navigation>,
    );
    const element = getHostHTMLElement();
    const header = element.querySelector('.mzn-navigation-header');

    expect(header).toBeTruthy();
  });

  describe('prop: title', () => {
    it('should render title', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationHeader title="My Title" />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const title = element.querySelector('.mzn-navigation-header__title');

      expect(title?.textContent).toBe('My Title');
    });
  });

  describe('prop: children', () => {
    it('should render children (logo)', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationHeader title="Header">
            <span data-testid="logo">Logo</span>
          </NavigationHeader>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const logo = element.querySelector('[data-testid="logo"]');

      expect(logo).toBeTruthy();
    });
  });

  describe('prop: onBrandClick', () => {
    it('should call onBrandClick when brand area is clicked', () => {
      const onBrandClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationHeader title="Header" onBrandClick={onBrandClick} />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const brandArea = element.querySelector(
        '.mzn-navigation-header__content',
      );

      fireEvent.click(brandArea!);

      expect(onBrandClick).toHaveBeenCalled();
    });
  });

  describe('collapse toggle', () => {
    it('should toggle collapsed state when icon button is clicked', () => {
      const onCollapseChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Navigation onCollapseChange={onCollapseChange}>
          <NavigationHeader title="Header" />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const iconButton = element.querySelector('.mzn-navigation-icon-button');

      fireEvent.click(iconButton!);

      expect(onCollapseChange).toHaveBeenCalledWith(true);
    });
  });
});

describe('<NavigationFooter />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(
      <Navigation>
        <NavigationFooter ref={ref} />
      </Navigation>,
    ),
  );

  describe('className', () => {
    it('should append class name on host element', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationFooter className="foo" />
        </Navigation>,
      );
      const footer = getHostHTMLElement().querySelector(
        '.mzn-navigation-footer',
      );

      expect(footer?.classList.contains('foo')).toBeTruthy();
    });
  });

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Navigation>
        <NavigationFooter />
      </Navigation>,
    );
    const element = getHostHTMLElement();
    const footer = element.querySelector('.mzn-navigation-footer');

    expect(footer).toBeTruthy();
  });

  describe('prop: children', () => {
    it('should render NavigationUserMenu as direct child', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationFooter>
            <NavigationUserMenu>User Name</NavigationUserMenu>
          </NavigationFooter>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const userMenu = element.querySelector('.mzn-navigation-user-menu');

      expect(userMenu).toBeTruthy();
    });

    it('should wrap other children in icons container', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationFooter>
            <button data-testid="icon-button">Icon</button>
          </NavigationFooter>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const iconsContainer = element.querySelector(
        '.mzn-navigation-footer__icons',
      );
      const iconButton = iconsContainer?.querySelector(
        '[data-testid="icon-button"]',
      );

      expect(iconButton).toBeTruthy();
    });

    it('should separate NavigationUserMenu from other children', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationFooter>
            <NavigationUserMenu>User</NavigationUserMenu>
            <button data-testid="icon-1">Icon 1</button>
            <button data-testid="icon-2">Icon 2</button>
          </NavigationFooter>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const footer = element.querySelector('.mzn-navigation-footer');
      const userMenu = footer?.querySelector('.mzn-navigation-user-menu');
      const iconsContainer = footer?.querySelector(
        '.mzn-navigation-footer__icons',
      );

      expect(userMenu).toBeTruthy();
      expect(iconsContainer?.querySelectorAll('button').length).toBe(2);
    });
  });

  describe('collapsed state', () => {
    it('should apply collapsed class when navigation is collapsed', () => {
      const { getHostHTMLElement } = render(
        <Navigation collapsed>
          <NavigationFooter />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const footer = element.querySelector('.mzn-navigation-footer');

      expect(
        footer?.classList.contains('mzn-navigation-footer--collapsed'),
      ).toBeTruthy();
    });
  });
});
