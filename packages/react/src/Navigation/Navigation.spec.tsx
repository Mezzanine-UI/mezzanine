import { PlusIcon } from '@mezzanine-ui/icons';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

import Navigation from './Navigation';
import NavigationOption from './NavigationOption';
import NavigationHeader from './NavigationHeader';
import NavigationFooter from './NavigationFooter';
import NavigationOptionCategory from './NavigationOptionCategory';
import NavigationIconButton from './NavigationIconButton';
import NavigationUserMenu from './NavigationUserMenu';
import * as useCurrentPathnameModule from './useCurrentPathname';

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

    it('should keep native list semantics on NavigationOptionCategory', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOptionCategory title="Category">
            <NavigationOption title="Option 1" icon={PlusIcon} />
          </NavigationOptionCategory>
        </Navigation>,
      );
      const category = getHostHTMLElement().querySelector(
        '.mzn-navigation-option-category',
      )!;

      // `role="menuitem"` requires a menu/menubar/group ancestor that Navigation
      // never renders, and it also overrides the implicit `listitem`, leaving the
      // parent <ul> with a non-listitem child.
      expect(category.getAttribute('role')).toBeNull();
      expect(category.tagName).toBe('LI');
      expect(category.parentElement?.tagName).toBe('UL');
    });

    it('should let the caller override the role on NavigationOptionCategory', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOptionCategory role="presentation" title="Category">
            <NavigationOption title="Option 1" icon={PlusIcon} />
          </NavigationOptionCategory>
        </Navigation>,
      );
      const category = getHostHTMLElement().querySelector(
        '.mzn-navigation-option-category',
      )!;

      expect(category.getAttribute('role')).toBe('presentation');
    });

    it('should label the nested option list with the category title', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOptionCategory title="Category">
            <NavigationOption title="Option 1" icon={PlusIcon} />
          </NavigationOptionCategory>
        </Navigation>,
      );
      const category = getHostHTMLElement().querySelector(
        '.mzn-navigation-option-category',
      )!;
      const nestedList = category.querySelector('ul')!;
      const labelledBy = nestedList.getAttribute('aria-labelledby');

      expect(labelledBy).toBeTruthy();
      expect(document.getElementById(labelledBy!)?.textContent).toBe(
        'Category',
      );
    });

    it('should not claim menuitem on navigation options', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOptionCategory title="Category">
            <NavigationOption title="Option 1" icon={PlusIcon} />
          </NavigationOptionCategory>
        </Navigation>,
      );

      // `menuitem` requires a menu/menubar/group ancestor Navigation never
      // renders, and promises a keyboard model this component does not have.
      expect(
        getHostHTMLElement().querySelectorAll('[role="menuitem"]').length,
      ).toBe(0);
    });

    it('should expose a leaf option with href as a link', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption
            href="/dashboard"
            title="Dashboard"
            icon={PlusIcon}
          />
        </Navigation>,
      );
      const anchor = getHostHTMLElement().querySelector(
        'a[href="/dashboard"]',
      )!;

      expect(anchor.getAttribute('role')).toBeNull();
      expect(anchor.tagName).toBe('A');
    });

    it('should expose a group option as a button', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Settings" icon={PlusIcon}>
            <NavigationOption title="Profile" icon={PlusIcon} />
          </NavigationOption>
        </Navigation>,
      );
      const content = getHostHTMLElement().querySelector(
        '.mzn-navigation-option__content',
      )!;

      // Enter/Space already toggle the group — that is the button contract.
      expect(content.getAttribute('role')).toBe('button');
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

  describe('prop: exactActivatedMatch', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should activate option when pathname starts with href (prefix match by default)', async () => {
      jest
        .spyOn(useCurrentPathnameModule, 'useCurrentPathname')
        .mockReturnValue('/settings/profile');

      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Settings" href="/settings" />
        </Navigation>,
      );

      await waitFor(() => {
        const option = getHostHTMLElement().querySelector(
          '.mzn-navigation-option',
        );

        expect(
          option?.classList.contains('mzn-navigation-option--active'),
        ).toBeTruthy();
      });
    });

    it('should not activate option when pathname only shares a non-path prefix with href', async () => {
      jest
        .spyOn(useCurrentPathnameModule, 'useCurrentPathname')
        .mockReturnValue('/settings-other');

      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Settings" href="/settings" />
        </Navigation>,
      );

      await act(async () => {});

      const option = getHostHTMLElement().querySelector(
        '.mzn-navigation-option',
      );

      expect(
        option?.classList.contains('mzn-navigation-option--active'),
      ).toBeFalsy();
    });

    it('should not activate option on prefix match when exactActivatedMatch is true', async () => {
      jest
        .spyOn(useCurrentPathnameModule, 'useCurrentPathname')
        .mockReturnValue('/settings/profile');

      const { getHostHTMLElement } = render(
        <Navigation exactActivatedMatch>
          <NavigationOption title="Settings" href="/settings" />
        </Navigation>,
      );

      await act(async () => {});

      const option = getHostHTMLElement().querySelector(
        '.mzn-navigation-option',
      );

      expect(
        option?.classList.contains('mzn-navigation-option--active'),
      ).toBeFalsy();
    });

    it('should activate option when pathname matches href exactly and exactActivatedMatch is true', async () => {
      jest
        .spyOn(useCurrentPathnameModule, 'useCurrentPathname')
        .mockReturnValue('/settings');

      const { getHostHTMLElement } = render(
        <Navigation exactActivatedMatch>
          <NavigationOption title="Settings" href="/settings" />
        </Navigation>,
      );

      await waitFor(() => {
        const option = getHostHTMLElement().querySelector(
          '.mzn-navigation-option',
        );

        expect(
          option?.classList.contains('mzn-navigation-option--active'),
        ).toBeTruthy();
      });
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
            <NavigationUserMenu
              options={[]}
              imgSrc="https://example.com/avatar.png"
            >
              User Name
            </NavigationUserMenu>
          </NavigationFooter>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const userMenu = element.querySelector('.mzn-navigation-user-menu');

      expect(userMenu).toBeTruthy();
    });

    it('should render fallback icon when imgSrc is not provided', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationFooter>
            <NavigationUserMenu options={[]}>User Name</NavigationUserMenu>
          </NavigationFooter>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const avatar = element.querySelector(
        '.mzn-navigation-user-menu .mzn-navigation-user-menu__avatar',
      );
      const img = avatar?.querySelector('img');
      const icon = avatar?.querySelector('.mzn-icon');

      expect(img).toBeFalsy();
      expect(icon).toBeTruthy();
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
            <NavigationUserMenu
              options={[]}
              imgSrc="https://example.com/avatar.png"
            >
              User
            </NavigationUserMenu>
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
  describe('accessible names in the footer', () => {
    const renderFooter = (children: React.ReactNode) =>
      render(
        <Navigation>
          <NavigationFooter>{children}</NavigationFooter>
        </Navigation>,
      );

    it('should name the user menu trigger from its children', () => {
      const { getHostHTMLElement } = renderFooter(
        <NavigationUserMenu options={[{ id: '1', name: '登出' }]}>
          王小明
        </NavigationUserMenu>,
      );
      const trigger = getHostHTMLElement().querySelector(
        '.mzn-navigation-user-menu',
      );

      // The user name is hidden while collapsed, so the trigger would otherwise
      // be an avatar with no accessible name at all.
      expect(trigger?.getAttribute('aria-label')).toBe('王小明');
    });

    it('should let the caller override the user menu name', () => {
      const { getHostHTMLElement } = renderFooter(
        <NavigationUserMenu
          aria-label="帳號設定"
          options={[{ id: '1', name: '登出' }]}
        >
          王小明
        </NavigationUserMenu>,
      );
      const trigger = getHostHTMLElement().querySelector(
        '.mzn-navigation-user-menu',
      );

      expect(trigger?.getAttribute('aria-label')).toBe('帳號設定');
    });

    it('should name an icon button from aria-label', () => {
      const { getHostHTMLElement } = renderFooter(
        <NavigationIconButton aria-label="通知" icon={PlusIcon} />,
      );
      const button = getHostHTMLElement().querySelector(
        '.mzn-navigation-icon-button',
      );

      expect(button?.getAttribute('aria-label')).toBe('通知');
    });
  });
  describe('disclosure and toggle semantics', () => {
    it('should name the collapse toggle and report its state', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationHeader title="App" />
        </Navigation>,
      );
      const toggle = getHostHTMLElement().querySelector(
        '.mzn-navigation-icon-button',
      )!;

      expect(toggle.getAttribute('aria-label')).toBe('Toggle navigation');
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
    });

    it('should use a custom collapseToggleLabel', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationHeader collapseToggleLabel="切換導覽" title="App" />
        </Navigation>,
      );
      const toggle = getHostHTMLElement().querySelector(
        '.mzn-navigation-icon-button',
      )!;

      expect(toggle.getAttribute('aria-label')).toBe('切換導覽');
    });

    it('should report aria-expanded on a group option', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Settings" icon={PlusIcon}>
            <NavigationOption title="Profile" icon={PlusIcon} />
          </NavigationOption>
        </Navigation>,
      );
      const content = getHostHTMLElement().querySelector(
        '.mzn-navigation-option__content',
      )!;

      expect(content.getAttribute('aria-expanded')).toBe('false');

      fireEvent.click(content);

      expect(content.getAttribute('aria-expanded')).toBe('true');
    });

    it('should not put aria-expanded on a leaf option', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Dashboard" icon={PlusIcon} />
        </Navigation>,
      );
      const content = getHostHTMLElement().querySelector(
        '.mzn-navigation-option__content',
      )!;

      expect(content.getAttribute('aria-expanded')).toBeNull();
    });
  });
});
