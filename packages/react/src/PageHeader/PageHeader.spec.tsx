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
    render(
      <PageHeader ref={ref}>
        <ContentHeader title="Test Title" />
      </PageHeader>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <PageHeader className={className}>
        <ContentHeader title="Test Title" />
      </PageHeader>,
    ),
  );

  it('should bind host class', () => {
    const { container } = render(
      <PageHeader>
        <ContentHeader title="Test Title" />
      </PageHeader>,
    );
    const element = container.querySelector(`.${classes.host}`);

    expect(element).toBeInstanceOf(HTMLElement);
  });

  it('should render as header element', () => {
    const { container } = render(
      <PageHeader>
        <ContentHeader title="Test Title" />
      </PageHeader>,
    );

    expect(container.firstChild).toBeInstanceOf(HTMLElement);
    expect(container.firstChild?.nodeName).toBe('HEADER');
  });

  describe('prop: children - Breadcrumb', () => {
    it('should render Breadcrumb when provided as child', () => {
      const { getByText } = render(
        <PageHeader>
          <Breadcrumb
            items={[
              { id: 'home', name: 'Home' },
              { id: 'category', name: 'Category' },
            ]}
          />
          <ContentHeader title="Test Title" />
        </PageHeader>,
      );

      expect(getByText('Home')).toBeInstanceOf(HTMLElement);
      expect(getByText('Category')).toBeInstanceOf(HTMLElement);
    });

    it('should not render breadcrumb when not provided', () => {
      const { container } = render(
        <PageHeader>
          <ContentHeader title="Test Title" />
        </PageHeader>,
      );
      const breadcrumb = container.querySelector('.mzn-breadcrumb');

      expect(breadcrumb).toBe(null);
    });
  });

  describe('prop: children - Button (back button)', () => {
    it('should render back button when Button is provided as child', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <PageHeader>
          <ContentHeader title="Test Title">
            <Button onClick={handleClick}>Back</Button>
          </ContentHeader>
        </PageHeader>,
      );
      const backButton = container.querySelector('button');

      expect(backButton).toBeInstanceOf(HTMLButtonElement);
    });

    it('should preserve Button onClick handler', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <PageHeader>
          <ContentHeader title="Test Title">
            <Button onClick={handleClick}>Back</Button>
          </ContentHeader>
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
        <PageHeader>
          <ContentHeader title="Test Title">
            <a href="/back" title="back" />
          </ContentHeader>
        </PageHeader>,
      );
      const link = container.querySelector('a[title="back"]');

      expect(link).toBeInstanceOf(HTMLAnchorElement);
      expect(link?.getAttribute('href')).toBe('/back');
    });
  });

  describe('prop: children - ContentHeader', () => {
    it('should render ContentHeader when provided as child', () => {
      const { container } = render(
        <PageHeader>
          <ContentHeader
            actions={[{ children: 'Action', variant: 'base-primary' }]}
            title="Content Title"
          />
        </PageHeader>,
      );
      const contentHeader = container.querySelector('.mzn-content-header');

      expect(contentHeader).toBeInstanceOf(HTMLElement);
    });
  });

  describe('complete layout', () => {
    it('should render all children together', () => {
      const { container, getByText } = render(
        <PageHeader>
          <Breadcrumb
            items={[
              { id: 'home', name: 'Home' },
              { id: 'category', name: 'Category' },
            ]}
          />
          <ContentHeader
            actions={[{ children: 'Action', variant: 'base-primary' }]}
            description="Page Description"
            title="Test Title"
          >
            <Button>Back</Button>
          </ContentHeader>
        </PageHeader>,
      );

      expect(getByText('Home')).toBeInstanceOf(HTMLElement);
      expect(container.querySelector('button')).toBeInstanceOf(
        HTMLButtonElement,
      );
      expect(container.querySelector('.mzn-content-header')).toBeInstanceOf(
        HTMLElement,
      );
    });

    it('should render minimal layout with ContentHeader', () => {
      const { getByText } = render(
        <PageHeader>
          <ContentHeader title="Test Title" />
        </PageHeader>,
      );

      expect(getByText('Test Title')).toBeInstanceOf(HTMLElement);
    });
  });

  describe('HTML attributes', () => {
    it('should pass through additional props to header element', () => {
      const { container } = render(
        <PageHeader data-testid="custom-header">
          <ContentHeader title="Test Title" />
        </PageHeader>,
      );
      const header = container.querySelector('header');

      expect(header?.getAttribute('data-testid')).toBe('custom-header');
    });

    it('should support ARIA attributes', () => {
      const { container } = render(
        <PageHeader aria-label="Page header">
          <ContentHeader title="Test Title" />
        </PageHeader>,
      );
      const header = container.querySelector('header');

      expect(header?.getAttribute('aria-label')).toBe('Page header');
    });
  });
});
