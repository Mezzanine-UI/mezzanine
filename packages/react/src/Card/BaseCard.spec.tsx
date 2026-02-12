import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { BaseCardGeneric as BaseCard } from '.';

describe('<BaseCard />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<BaseCard ref={ref}>Content</BaseCard>),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<BaseCard className={className}>Content</BaseCard>),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<BaseCard>Content</BaseCard>);
    const element = getHostHTMLElement();

    expect(element.classList.contains(classes.base)).toBeTruthy();
  });

  it('should render as div by default', () => {
    const { getHostHTMLElement } = render(<BaseCard>Content</BaseCard>);
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('div');
  });

  it('should render as anchor when component="a"', () => {
    const { getHostHTMLElement } = render(
      <BaseCard<'a'> component="a" href="https://example.com">
        Content
      </BaseCard>,
    );
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('a');
    expect(element.getAttribute('href')).toBe('https://example.com');
  });

  describe('prop: title', () => {
    it('should render title in header', () => {
      const { getByText } = render(
        <BaseCard title="Card Title">Content</BaseCard>,
      );

      const titleElement = getByText('Card Title');

      expect(
        titleElement.classList.contains(classes.baseHeaderTitle),
      ).toBeTruthy();
    });
  });

  describe('prop: description', () => {
    it('should render description in header', () => {
      const { getByText } = render(
        <BaseCard description="Card description">Content</BaseCard>,
      );

      const descriptionElement = getByText('Card description');

      expect(
        descriptionElement.classList.contains(classes.baseHeaderDescription),
      ).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('should add disabled class when disabled', () => {
      const { getHostHTMLElement } = render(
        <BaseCard disabled>Content</BaseCard>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains(classes.baseDisabled)).toBeTruthy();
      expect(element.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not have disabled attributes when not disabled', () => {
      const { getHostHTMLElement } = render(<BaseCard>Content</BaseCard>);
      const element = getHostHTMLElement();

      expect(element.classList.contains(classes.baseDisabled)).toBeFalsy();
      expect(element.getAttribute('aria-disabled')).toBeNull();
    });
  });

  describe('prop: readOnly', () => {
    it('should add read-only class when readOnly', () => {
      const { getHostHTMLElement } = render(
        <BaseCard readOnly>Content</BaseCard>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains(classes.baseReadOnly)).toBeTruthy();
      expect(element.getAttribute('aria-readonly')).toBe('true');
    });
  });

  describe('prop: type', () => {
    it('should render type="default" by default', () => {
      const { getHostHTMLElement } = render(
        <BaseCard title="Title">Content</BaseCard>,
      );
      const element = getHostHTMLElement();
      const headerAction = element.querySelector(
        `.${classes.baseHeaderAction}`,
      );

      expect(headerAction).toBeNull();
    });

    it('should not render header when no title/description and type="default"', () => {
      const { getHostHTMLElement } = render(<BaseCard>Content</BaseCard>);
      const element = getHostHTMLElement();
      const header = element.querySelector(`.${classes.baseHeader}`);

      expect(header).toBeNull();
    });
  });

  describe('type: action', () => {
    it('should render action button in header', () => {
      const { getByRole } = render(
        <BaseCard actionName="Edit" title="Title" type="action">
          Content
        </BaseCard>,
      );

      const button = getByRole('button');

      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Edit');
    });

    it('should call onActionClick when action button is clicked', () => {
      const handleClick = jest.fn();
      const { getByRole } = render(
        <BaseCard
          actionName="Edit"
          onActionClick={handleClick}
          title="Title"
          type="action"
        >
          Content
        </BaseCard>,
      );

      const button = getByRole('button');

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should disable action button when card is disabled', () => {
      const { getByRole } = render(
        <BaseCard actionName="Edit" disabled title="Title" type="action">
          Content
        </BaseCard>,
      );

      const button = getByRole('button') as HTMLButtonElement;

      expect(button.disabled).toBe(true);
    });

    it('should render action button with destructive variant', () => {
      const { getByRole } = render(
        <BaseCard
          actionName="Delete"
          actionVariant="destructive-text-link"
          title="Title"
          type="action"
        >
          Content
        </BaseCard>,
      );

      const button = getByRole('button');

      expect(button).toBeTruthy();
    });
  });

  describe('type: overflow', () => {
    const options = [
      { id: 'edit', name: 'Edit' },
      { id: 'delete', name: 'Delete' },
    ];

    it('should render dropdown button in header', () => {
      const { getByRole } = render(
        <BaseCard options={options} title="Title" type="overflow">
          Content
        </BaseCard>,
      );

      const button = getByRole('button');

      expect(button).toBeTruthy();
    });

    it('should disable dropdown button when card is disabled', () => {
      const { getByRole } = render(
        <BaseCard disabled options={options} title="Title" type="overflow">
          Content
        </BaseCard>,
      );

      const button = getByRole('button') as HTMLButtonElement;

      expect(button.disabled).toBe(true);
    });
  });

  describe('type: toggle', () => {
    it('should render toggle in header', () => {
      const { container } = render(
        <BaseCard title="Title" type="toggle">
          Content
        </BaseCard>,
      );

      const toggle = container.querySelector('input[type="checkbox"]');

      expect(toggle).toBeTruthy();
    });

    it('should call onToggleChange when toggle is changed', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <BaseCard onToggleChange={handleChange} title="Title" type="toggle">
          Content
        </BaseCard>,
      );

      const toggle = container.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;

      fireEvent.click(toggle);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should render toggle as checked when checked prop is true', () => {
      const { container } = render(
        <BaseCard checked onToggleChange={() => {}} title="Title" type="toggle">
          Content
        </BaseCard>,
      );

      const toggle = container.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;

      expect(toggle.checked).toBe(true);
    });

    it('should disable toggle when card is disabled', () => {
      const { container } = render(
        <BaseCard disabled title="Title" type="toggle">
          Content
        </BaseCard>,
      );

      const toggle = container.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;

      expect(toggle.disabled).toBe(true);
    });
  });

  describe('children', () => {
    it('should render children in content area', () => {
      const { getByText, getHostHTMLElement } = render(
        <BaseCard>Card content</BaseCard>,
      );
      const element = getHostHTMLElement();
      const contentElement = element.querySelector(`.${classes.baseContent}`);
      const childText = getByText('Card content');

      expect(contentElement).toBeTruthy();
      expect(contentElement?.contains(childText)).toBeTruthy();
    });
  });
});
