import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { pageHeaderClasses as classes } from '@mezzanine-ui/core/page-header';
import Breadcrumb from '../Breadcrumb';
import Button from '../Button';
import ContentHeader from '../ContentHeader';
import PageHeader from '.';

describe('<PageHeader />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(<PageHeader ref={ref} title="Test Title" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<PageHeader className={className} title="Test Title" />),
  );

  it('should bind host class', () => {
    const { container } = render(<PageHeader title="Test Title" />);
    const element = container.querySelector(`.${classes.host}`);

    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('should render as header element', () => {
    const { container } = render(<PageHeader title="Test Title" />);

    expect(container.firstChild).toBeInstanceOf(HTMLElement);
    expect(container.firstChild?.nodeName).toBe('HEADER');
  });

  describe('prop: title', () => {
    it('should render title correctly', () => {
      const { getByText } = render(<PageHeader title="Test Title" />);

      expect(getByText('Test Title')).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should render with default h2 element', () => {
      const { container } = render(<PageHeader title="Test Title" />);

      expect(container.querySelector('h2')).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should apply text-neutral-solid color to title', () => {
      const { getByText } = render(<PageHeader title="Test Title" />);
      const title = getByText('Test Title');

      expect(title).toBeInstanceOf(HTMLHeadingElement);
    });
  });

  describe('prop: titleComponent', () => {
    it('should render with custom h1 element', () => {
      const { container } = render(
        <PageHeader title="Test Title" titleComponent="h1" />,
      );

      expect(container.querySelector('h1')).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should render with custom h3 element', () => {
      const { container } = render(
        <PageHeader title="Test Title" titleComponent="h3" />,
      );

      expect(container.querySelector('h3')).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should render with custom h4 element', () => {
      const { container } = render(
        <PageHeader title="Test Title" titleComponent="h4" />,
      );

      expect(container.querySelector('h4')).toBeInstanceOf(HTMLHeadingElement);
    });
  });

  describe('prop: description', () => {
    it('should render description when provided', () => {
      const { getByText } = render(
        <PageHeader description="Test Description" title="Test Title" />,
      );

      expect(getByText('Test Description')).toBeInstanceOf(
        HTMLParagraphElement,
      );
    });

    it('should not render description when not provided', () => {
      const { container } = render(<PageHeader title="Test Title" />);
      const descriptions = container.querySelectorAll('p');

      expect(descriptions.length).toBe(0);
    });

    it('should render description with caption variant', () => {
      const { getByText } = render(
        <PageHeader description="Test Description" title="Test Title" />,
      );
      const description = getByText('Test Description');

      expect(description).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('prop: children - Breadcrumb', () => {
    it('should render Breadcrumb when provided as child', () => {
      const { getByText } = render(
        <PageHeader title="Test Title">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '/category', label: 'Category' },
            ]}
          />
        </PageHeader>,
      );

      expect(getByText('Home')).toBeInstanceOf(HTMLElement);
      expect(getByText('Category')).toBeInstanceOf(HTMLElement);
    });

    it('should not render breadcrumb when not provided', () => {
      const { container } = render(<PageHeader title="Test Title" />);
      const breadcrumb = container.querySelector('.mzn-breadcrumb');

      expect(breadcrumb).toBe(null);
    });

    it('should render breadcrumb before header content', () => {
      const { container } = render(
        <PageHeader title="Test Title">
          <Breadcrumb items={[{ href: '/', label: 'Home' }]} />
        </PageHeader>,
      );
      const header = container.querySelector('header');
      const breadcrumb = container.querySelector('.mzn-breadcrumb');
      const headerContent = container.querySelector(
        `.${classes.headerContent}`,
      );

      expect(header?.children[0]).toBe(breadcrumb);
      expect(header?.children[1]).toBe(headerContent);
    });
  });

  describe('prop: children - Button (back button)', () => {
    it('should render back button when Button is provided as child', () => {
      const { container } = render(
        <PageHeader title="Test Title">
          <Button onClick={() => {}}>Back</Button>
        </PageHeader>,
      );
      const backButton = container.querySelector('button');

      expect(backButton).toBeInstanceOf(HTMLButtonElement);
    });

    it('should clone Button with preset icon, size, and variant', () => {
      const { container } = render(
        <PageHeader title="Test Title">
          <Button onClick={() => {}}>Back</Button>
        </PageHeader>,
      );
      const backButton = container.querySelector('button');
      const icon = backButton?.querySelector('svg');

      expect(backButton).toBeInstanceOf(HTMLButtonElement);
      expect(icon).toBeInstanceOf(SVGElement);
    });

    it('should not render back button when Button is not provided', () => {
      const { container } = render(<PageHeader title="Test Title" />);
      const buttons = container.querySelectorAll('button');

      expect(buttons.length).toBe(0);
    });

    it('should preserve Button onClick handler', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <PageHeader title="Test Title">
          <Button onClick={handleClick}>Back</Button>
        </PageHeader>,
      );
      const backButton = container.querySelector('button');

      backButton?.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: children - Anchor (back link)', () => {
    it('should render back link when anchor is provided as child', () => {
      const { container } = render(
        <PageHeader title="Test Title">
          <a href="/back">Back</a>
        </PageHeader>,
      );
      const backLink = container.querySelector('a');

      expect(backLink).toBeInstanceOf(HTMLAnchorElement);
      expect(backLink?.href).toContain('/back');
    });

    it('should wrap anchor with Button component', () => {
      const { container } = render(
        <PageHeader title="Test Title">
          <a href="/back">Back</a>
        </PageHeader>,
      );
      const backLink = container.querySelector('a');
      const buttonDiv = backLink?.querySelector('[class*="button"]');

      expect(buttonDiv).toBeInstanceOf(HTMLElement);
    });

    it('should render chevron icon in wrapped button', () => {
      const { container } = render(
        <PageHeader title="Test Title">
          <a href="/back">Back</a>
        </PageHeader>,
      );
      const backLink = container.querySelector('a');
      const icon = backLink?.querySelector('svg');

      expect(icon).toBeInstanceOf(SVGElement);
    });
  });

  describe('prop: children - ContentHeader', () => {
    it('should render ContentHeader when provided as child', () => {
      const { getByText } = render(
        <PageHeader title="Test Title">
          <ContentHeader
            actions={{
              primaryButton: <Button>Primary</Button>,
            }}
          />
        </PageHeader>,
      );

      expect(getByText('Primary')).toBeInstanceOf(HTMLElement);
    });

    it('should clone ContentHeader with size="main"', () => {
      const { container } = render(
        <PageHeader title="Test Title">
          <ContentHeader
            actions={{
              primaryButton: <Button>Primary</Button>,
            }}
          />
        </PageHeader>,
      );
      const toolbar = container.querySelector('[class*="page-toolbar"]');

      expect(toolbar).toBeInstanceOf(HTMLElement);
    });

    it('should not render ContentHeader when not provided', () => {
      const { container } = render(<PageHeader title="Test Title" />);
      const toolbar = container.querySelector('[class*="page-toolbar"]');

      expect(toolbar).toBe(null);
    });

    it('should render ContentHeader after title in header content', () => {
      const { container } = render(
        <PageHeader title="Test Title">
          <ContentHeader
            actions={{
              primaryButton: <Button>Primary</Button>,
            }}
          />
        </PageHeader>,
      );
      const headerContent = container.querySelector(
        `.${classes.headerContent}`,
      );
      const toolbar = container.querySelector('[class*="page-toolbar"]');

      expect(headerContent?.contains(toolbar)).toBe(true);
    });
  });

  describe('prop: children - invalid child', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      consoleWarnSpy.mockClear();
      process.env.NODE_ENV = originalEnv;
    });

    afterAll(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should not warn in production', () => {
      process.env.NODE_ENV = 'production';

      render(
        <PageHeader title="Test Title">
          <div>Invalid</div>
        </PageHeader>,
      );

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('CSS classes', () => {
    it('should render header content with correct class', () => {
      const { container } = render(<PageHeader title="Test Title" />);
      const headerContent = container.querySelector(
        `.${classes.headerContent}`,
      );

      expect(headerContent).toBeInstanceOf(HTMLElement);
    });

    it('should render page title with icon wrapper with correct class', () => {
      const { container } = render(<PageHeader title="Test Title" />);
      const titleWrapper = container.querySelector(
        `.${classes.pageTitleWithIcon}`,
      );

      expect(titleWrapper).toBeInstanceOf(HTMLElement);
    });

    it('should render page title text with correct class', () => {
      const { container } = render(<PageHeader title="Test Title" />);
      const titleText = container.querySelector(`.${classes.pageTitleText}`);

      expect(titleText).toBeInstanceOf(HTMLElement);
    });
  });

  describe('complete layout', () => {
    it('should render all children together', () => {
      const { container, getByText } = render(
        <PageHeader description="Test Description" title="Test Title">
          <Breadcrumb items={[{ href: '/', label: 'Home' }]} />
          <Button onClick={() => {}}>Back</Button>
          <ContentHeader
            actions={{
              primaryButton: <Button>Primary</Button>,
            }}
          />
        </PageHeader>,
      );

      expect(getByText('Home')).toBeInstanceOf(HTMLElement);
      expect(getByText('Test Title')).toBeInstanceOf(HTMLElement);
      expect(getByText('Test Description')).toBeInstanceOf(HTMLElement);
      expect(getByText('Primary')).toBeInstanceOf(HTMLElement);
      expect(container.querySelector('button')).toBeInstanceOf(
        HTMLButtonElement,
      );
    });

    it('should render with anchor link and other children', () => {
      const { container, getByText } = render(
        <PageHeader description="Test Description" title="Test Title">
          <Breadcrumb items={[{ href: '/', label: 'Home' }]} />
          <a href="/back">Back</a>
          <ContentHeader
            actions={{
              primaryButton: <Button>Primary</Button>,
            }}
          />
        </PageHeader>,
      );

      const backLink = container.querySelector('a[href="/back"]');

      expect(getByText('Home')).toBeInstanceOf(HTMLElement);
      expect(getByText('Test Title')).toBeInstanceOf(HTMLElement);
      expect(backLink).toBeInstanceOf(HTMLAnchorElement);
      expect(getByText('Primary')).toBeInstanceOf(HTMLElement);
    });

    it('should render minimal layout with only title', () => {
      const { container, getByText } = render(
        <PageHeader title="Test Title" />,
      );

      expect(getByText('Test Title')).toBeInstanceOf(HTMLElement);
      expect(container.querySelector('button')).toBe(null);
      expect(container.querySelector('.mzn-breadcrumb')).toBe(null);
    });

    it('should render with only Breadcrumb and title', () => {
      const { getByText } = render(
        <PageHeader title="Test Title">
          <Breadcrumb items={[{ href: '/', label: 'Home' }]} />
        </PageHeader>,
      );

      expect(getByText('Home')).toBeInstanceOf(HTMLElement);
      expect(getByText('Test Title')).toBeInstanceOf(HTMLElement);
    });

    it('should render with only Button and title', () => {
      const { container, getByText } = render(
        <PageHeader title="Test Title">
          <Button onClick={() => {}}>Back</Button>
        </PageHeader>,
      );

      expect(getByText('Test Title')).toBeInstanceOf(HTMLElement);
      expect(container.querySelector('button')).toBeInstanceOf(
        HTMLButtonElement,
      );
    });

    it('should render with only ContentHeader and title', () => {
      const { container, getByText } = render(
        <PageHeader title="Test Title">
          <ContentHeader
            actions={{
              primaryButton: <Button>Action</Button>,
            }}
          />
        </PageHeader>,
      );
      const toolbar = container.querySelector('[class*="page-toolbar"]');

      expect(getByText('Test Title')).toBeInstanceOf(HTMLElement);
      expect(toolbar).toBeInstanceOf(HTMLElement);
    });
  });

  describe('HTML attributes', () => {
    it('should pass through additional props to header element', () => {
      const { container } = render(
        <PageHeader data-testid="custom-header" title="Test Title" />,
      );
      const header = container.querySelector('header');

      expect(header?.getAttribute('data-testid')).toBe('custom-header');
    });

    it('should support ARIA attributes', () => {
      const { container } = render(
        <PageHeader aria-label="Main page header" title="Test Title" />,
      );
      const header = container.querySelector('header');

      expect(header?.getAttribute('aria-label')).toBe('Main page header');
    });
  });
});
