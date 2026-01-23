import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import ContentHeader from '.';
import { DotHorizontalIcon, MenuIcon, PlusIcon } from '@mezzanine-ui/icons';
import Button from '../Button';

const queryContentHeaderHostElement = (container: Element): HTMLElement => {
  const host = container.querySelector('.mzn-content-header');

  if (!host) {
    throw new Error('ContentHeader host element not found');
  }

  return host as HTMLElement;
};

describe('<ContentHeader />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ContentHeader ref={ref} title="Test" />),
  );

  describeHostElementClassNameAppendable('foo', (className) => {
    const result = render(<ContentHeader className={className} title="Test" />);

    return {
      ...result,
      getHostHTMLElement: <E extends Element = HTMLElement>() =>
        queryContentHeaderHostElement(
          result.getHostHTMLElement(),
        ) as unknown as E,
    };
  });

  it('should bind content header class', () => {
    const { getHostHTMLElement } = render(<ContentHeader title="Test" />);
    const element = queryContentHeaderHostElement(getHostHTMLElement());

    expect(element.classList.contains('mzn-content-header')).toBeTruthy();
  });

  describe('prop: size', () => {
    it('should append size class for main variant', () => {
      const { getHostHTMLElement } = render(
        <ContentHeader size="main" title="Test" />,
      );
      const element = queryContentHeaderHostElement(getHostHTMLElement());

      expect(
        element.classList.contains('mzn-content-header--main'),
      ).toBeTruthy();
    });

    it('should append size class for sub variant', () => {
      const { getHostHTMLElement } = render(
        <ContentHeader size="sub" title="Test" />,
      );
      const element = queryContentHeaderHostElement(getHostHTMLElement());

      expect(
        element.classList.contains('mzn-content-header--sub'),
      ).toBeTruthy();
    });
  });

  describe('prop: title', () => {
    it('should render title', () => {
      const title = 'Test Title';
      const { getHostHTMLElement } = render(<ContentHeader title={title} />);
      const element = getHostHTMLElement();

      expect(element.textContent).toContain(title);
    });
  });

  describe('prop: description', () => {
    it('should render description', () => {
      const description = 'Test Description';
      const { getHostHTMLElement } = render(
        <ContentHeader description={description} title="Test" />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain(description);
    });
  });

  describe('prop: onBackClick', () => {
    it('should call onBackClick when back button is clicked', () => {
      const onBackClick = jest.fn();
      const { getHostHTMLElement } = render(
        <ContentHeader onBackClick={onBackClick} title="Test" />,
      );
      const backButton = getHostHTMLElement().querySelector(
        '.mzn-content-header__back',
      ) as HTMLButtonElement;

      backButton?.click();

      expect(onBackClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: filter', () => {
    it('should render search input', () => {
      const { getHostHTMLElement } = render(
        <ContentHeader
          filter={{
            placeholder: 'Search...',
            variant: 'search',
          }}
          title="Test"
        />,
      );
      const input = getHostHTMLElement().querySelector(
        'input[placeholder="Search..."]',
      );

      expect(input).toBeTruthy();
    });
  });

  describe('prop: actions', () => {
    it('should render action buttons', () => {
      const { getHostHTMLElement } = render(
        <ContentHeader
          actions={[
            { children: 'Primary', variant: 'base-primary' },
            { children: 'Secondary', variant: 'base-secondary' },
          ]}
          title="Test"
        />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Primary');
      expect(element.textContent).toContain('Secondary');
    });
  });

  describe('prop: utilities', () => {
    it('should render utility buttons', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <ContentHeader
          title="Test"
          utilities={[
            {
              icon: PlusIcon,
              onClick,
            },
            {
              icon: MenuIcon,
              onClick,
            },
          ]}
        />,
      );
      const buttons = getHostHTMLElement().querySelectorAll(
        '.mzn-content-header__utilities button',
      );

      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render dropdown utility', () => {
      const { getHostHTMLElement } = render(
        <ContentHeader
          title="Test"
          utilities={[
            {
              children: <Button icon={DotHorizontalIcon} />,
              options: [
                { id: '1', name: 'Option 1' },
                { id: '2', name: 'Option 2' },
              ],
            },
          ]}
        />,
      );
      const dropdown = getHostHTMLElement().querySelector('.mzn-dropdown');

      expect(dropdown).toBeTruthy();
    });
  });

  describe('prop: children', () => {
    it('should render children with link as back button', () => {
      const { getHostHTMLElement } = render(
        <ContentHeader title="Test">
          <a href="/back" title="back" />
        </ContentHeader>,
      );
      const link = getHostHTMLElement().querySelector('a[title="back"]');

      expect(link).toBeTruthy();
      expect(link?.getAttribute('href')).toBe('/back');
    });

    it('should render multiple children elements', () => {
      const { getHostHTMLElement } = render(
        <ContentHeader title="Test">
          <Button>Primary</Button>
          <Button variant="base-secondary">Secondary</Button>
        </ContentHeader>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Primary');
      expect(element.textContent).toContain('Secondary');
    });
  });

  it('should forward rest props to host element', () => {
    const { getHostHTMLElement } = render(
      <ContentHeader
        aria-label="content-header"
        data-testid="content-header"
        title="Test"
      />,
    );
    const element = queryContentHeaderHostElement(getHostHTMLElement());

    expect(element.getAttribute('aria-label')).toBe('content-header');
    expect(element.dataset.testid).toBe('content-header');
  });
});
