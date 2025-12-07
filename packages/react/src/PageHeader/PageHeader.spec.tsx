import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { pageHeaderClasses as classes } from '@mezzanine-ui/core/page-header';
import Breadcrumb from '../Breadcrumb';
import Button from '../Button';
import PageToolbar from '../PageToolbar';
import PageHeader from '.';

describe('<PageHeader />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(<PageHeader ref={ref} title="Test Title" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<PageHeader className={className} title="Test Title" />),
  );

  it('should render title correctly', () => {
    const { getByText } = render(<PageHeader title="Test Title" />);

    expect(getByText('Test Title')).toBeInstanceOf(HTMLHeadingElement);
  });

  it('should render with custom titleComponent', () => {
    const { container } = render(
      <PageHeader title="Test Title" titleComponent="h1" />,
    );

    expect(container.querySelector('h1')).toBeInstanceOf(HTMLHeadingElement);
  });

  it('should render description when provided', () => {
    const { getByText } = render(
      <PageHeader description="Test Description" title="Test Title" />,
    );

    expect(getByText('Test Description')).toBeInstanceOf(HTMLParagraphElement);
  });

  it('should not render description when not provided', () => {
    const { container } = render(<PageHeader title="Test Title" />);
    const descriptions = container.querySelectorAll('p');

    expect(descriptions.length).toBe(0);
  });

  it('should render breadcrumb when provided', () => {
    const { getByText } = render(
      <PageHeader
        breadcrumb={
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '/category', label: 'Category' },
            ]}
          />
        }
        title="Test Title"
      />,
    );

    expect(getByText('Home')).toBeInstanceOf(HTMLElement);
    expect(getByText('Category')).toBeInstanceOf(HTMLElement);
  });

  it('should render back button when onBack is provided', () => {
    const { container } = render(
      <PageHeader onBack={() => {}} title="Test Title" />,
    );
    const backButton = container.querySelector('button');

    expect(backButton).toBeInstanceOf(HTMLButtonElement);
  });

  it('should trigger onBack callback when back button is clicked', () => {
    const onBack = jest.fn();
    const { container } = render(
      <PageHeader onBack={onBack} title="Test Title" />,
    );
    const backButton = container.querySelector('button');

    fireEvent.click(backButton!);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('should trigger onBack callback on touch end', () => {
    const onBack = jest.fn();
    const { container } = render(
      <PageHeader onBack={onBack} title="Test Title" />,
    );
    const backButton = container.querySelector('button');

    fireEvent.touchEnd(backButton!);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('should not render back button when onBack is not provided', () => {
    const { container } = render(<PageHeader title="Test Title" />);
    const buttons = container.querySelectorAll('button');

    expect(buttons.length).toBe(0);
  });

  it('should render pageToolbar when provided', () => {
    const { getByText } = render(
      <PageHeader
        pageToolbar={
          <PageToolbar
            actions={{
              primaryButton: <Button>Primary</Button>,
            }}
          />
        }
        title="Test Title"
      />,
    );

    expect(getByText('Primary')).toBeInstanceOf(HTMLElement);
  });

  it('should clone pageToolbar with size="main"', () => {
    const { container } = render(
      <PageHeader
        pageToolbar={
          <PageToolbar
            actions={{
              primaryButton: <Button>Primary</Button>,
            }}
          />
        }
        title="Test Title"
      />,
    );
    const toolbar = container.querySelector('[class*="page-toolbar"]');

    expect(toolbar).toBeInstanceOf(HTMLElement);
  });

  it('should render header content with correct class', () => {
    const { container } = render(<PageHeader title="Test Title" />);
    const headerContent = container.querySelector(`.${classes.headerContent}`);

    expect(headerContent).toBeInstanceOf(HTMLElement);
  });

  it('should render page title with icon wrapper with correct class', () => {
    const { container } = render(<PageHeader title="Test Title" />);
    const titleWrapper = container.querySelector(
      `.${classes.pageTitleWithIcon}`,
    );

    expect(titleWrapper).toBeInstanceOf(HTMLElement);
  });

  it('should render complete layout with all optional props', () => {
    const onBack = jest.fn();
    const { container, getByText } = render(
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ href: '/', label: 'Home' }]} />}
        description="Test Description"
        onBack={onBack}
        pageToolbar={
          <PageToolbar
            actions={{
              primaryButton: <Button>Primary</Button>,
            }}
          />
        }
        title="Test Title"
      />,
    );

    expect(getByText('Home')).toBeInstanceOf(HTMLElement);
    expect(getByText('Test Title')).toBeInstanceOf(HTMLElement);
    expect(getByText('Test Description')).toBeInstanceOf(HTMLElement);
    expect(getByText('Primary')).toBeInstanceOf(HTMLElement);
    expect(container.querySelector('button')).toBeInstanceOf(HTMLButtonElement);
  });
});
