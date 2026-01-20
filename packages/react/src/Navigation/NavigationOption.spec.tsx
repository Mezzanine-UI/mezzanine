import { PlusIcon } from '@mezzanine-ui/icons';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Navigation from './Navigation';
import NavigationOption from './NavigationOption';
import NavigationOptionCategory from './NavigationOptionCategory';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

describe('<NavigationOption />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLIElement, (ref) =>
    render(
      <Navigation>
        <NavigationOption ref={ref} title="Option" icon={PlusIcon} />
      </Navigation>,
    ),
  );

  describe('className', () => {
    it('should append class name on host element', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption className="foo" title="Option" icon={PlusIcon} />
        </Navigation>,
      );
      const option = getHostHTMLElement().querySelector(
        '.mzn-navigation-option',
      );

      expect(option?.classList.contains('foo')).toBeTruthy();
    });
  });

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Navigation>
        <NavigationOption title="Option" icon={PlusIcon} />
      </Navigation>,
    );
    const element = getHostHTMLElement();
    const option = element.querySelector('.mzn-navigation-option');

    expect(option).toBeTruthy();
  });

  describe('prop: title', () => {
    it('should render title', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="My Title" icon={PlusIcon} />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const title = element.querySelector('.mzn-navigation-option__title');

      expect(title?.textContent).toBe('My Title');
    });
  });

  describe('prop: icon', () => {
    it('should render icon', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Option" icon={PlusIcon} />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-navigation-option__icon');

      expect(icon?.tagName.toLowerCase()).toBe('i');
    });
  });

  describe('prop: href', () => {
    it('should render as anchor when href is provided', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Option" icon={PlusIcon} href="/test" />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const content = element.querySelector('.mzn-navigation-option__content');

      expect(content?.tagName.toLowerCase()).toBe('a');
      expect(content?.getAttribute('href')).toBe('/test');
    });
  });

  describe('prop: active', () => {
    it('should apply active class when active is true', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption active title="Option" icon={PlusIcon} />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const option = element.querySelector('.mzn-navigation-option');

      expect(
        option?.classList.contains('mzn-navigation-option--active'),
      ).toBeTruthy();
    });
  });

  describe('prop: children (nested options)', () => {
    it('should render toggle icon when has children', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Parent" icon={PlusIcon}>
            <NavigationOption title="Child" icon={PlusIcon} />
          </NavigationOption>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const toggleIcon = element.querySelector(
        '.mzn-navigation-option__toggle-icon',
      );

      expect(toggleIcon).toBeTruthy();
    });

    it('should toggle children visibility on click', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Parent" icon={PlusIcon}>
            <NavigationOption title="Child" icon={PlusIcon} />
          </NavigationOption>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const content = element.querySelector('.mzn-navigation-option__content');

      // Initially closed
      let group = element.querySelector('.mzn-navigation-option__group');

      expect(group).toBeFalsy();

      // Click to open
      fireEvent.click(content!);

      group = element.querySelector('.mzn-navigation-option__group');

      expect(group).toBeTruthy();
    });

    it('should apply basic class when no children', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption title="Option" icon={PlusIcon} />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const option = element.querySelector('.mzn-navigation-option');

      expect(
        option?.classList.contains('mzn-navigation-option--basic'),
      ).toBeTruthy();
    });
  });

  describe('prop: defaultOpen', () => {
    it('should be open by default when defaultOpen is true', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption defaultOpen title="Parent" icon={PlusIcon}>
            <NavigationOption title="Child" icon={PlusIcon} />
          </NavigationOption>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const option = element.querySelector('.mzn-navigation-option');

      expect(
        option?.classList.contains('mzn-navigation-option--open'),
      ).toBeTruthy();
    });
  });

  describe('prop: onTriggerClick', () => {
    it('should call onTriggerClick when clicked', () => {
      const onTriggerClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOption
            icon={PlusIcon}
            onTriggerClick={onTriggerClick}
            title="Option"
          />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const content = element.querySelector('.mzn-navigation-option__content');

      fireEvent.click(content!);

      expect(onTriggerClick).toHaveBeenCalled();
    });
  });
});

describe('<NavigationOptionCategory />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLIElement, (ref) =>
    render(
      <Navigation>
        <NavigationOptionCategory ref={ref} title="Category" />
      </Navigation>,
    ),
  );

  describe('className', () => {
    it('should append class name on host element', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOptionCategory className="foo" title="Category" />
        </Navigation>,
      );
      const category = getHostHTMLElement().querySelector(
        '.mzn-navigation-option-category',
      );

      expect(category?.classList.contains('foo')).toBeTruthy();
    });
  });

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Navigation>
        <NavigationOptionCategory title="Category" />
      </Navigation>,
    );
    const element = getHostHTMLElement();
    const category = element.querySelector('.mzn-navigation-option-category');

    expect(category).toBeTruthy();
  });

  describe('prop: title', () => {
    it('should render title', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOptionCategory title="My Category" />
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const title = element.querySelector(
        '.mzn-navigation-option-category__title',
      );

      expect(title?.textContent).toBe('My Category');
    });
  });

  describe('prop: children', () => {
    it('should render NavigationOption children', () => {
      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOptionCategory title="Category">
            <NavigationOption title="Option 1" icon={PlusIcon} />
            <NavigationOption title="Option 2" icon={PlusIcon} />
          </NavigationOptionCategory>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const options = element.querySelectorAll('.mzn-navigation-option');

      expect(options.length).toBe(2);
    });

    it('should only render NavigationOption children', () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const { getHostHTMLElement } = render(
        <Navigation>
          <NavigationOptionCategory title="Category">
            <NavigationOption title="Option" icon={PlusIcon} />
            <div data-testid="invalid">Invalid</div>
          </NavigationOptionCategory>
        </Navigation>,
      );
      const element = getHostHTMLElement();
      const invalid = element.querySelector('[data-testid="invalid"]');

      expect(invalid).toBeFalsy();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });
});
