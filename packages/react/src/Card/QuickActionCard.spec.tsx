import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { CalendarIcon, FileIcon } from '@mezzanine-ui/icons';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { QuickActionCardGeneric as QuickActionCard } from '.';

describe('<QuickActionCard />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLButtonElement, (ref) =>
    render(<QuickActionCard ref={ref} title="Title" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<QuickActionCard className={className} title="Title" />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<QuickActionCard title="Title" />);
    const element = getHostHTMLElement();

    expect(element.classList.contains(classes.quickAction)).toBeTruthy();
  });

  it('should render as button by default', () => {
    const { getHostHTMLElement } = render(<QuickActionCard title="Title" />);
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('button');
  });

  it('should render as anchor when component="a"', () => {
    const { getHostHTMLElement } = render(
      <QuickActionCard<'a'>
        component="a"
        href="https://example.com"
        title="Title"
      />,
    );
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('a');
    expect(element.getAttribute('href')).toBe('https://example.com');
  });

  describe('prop: icon', () => {
    it('should render icon when provided', () => {
      const { getHostHTMLElement } = render(
        <QuickActionCard icon={CalendarIcon} />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(`.${classes.quickActionIcon}`);

      expect(iconElement).toBeTruthy();
    });

    it('should not render icon when not provided', () => {
      const { getHostHTMLElement } = render(
        <QuickActionCard title="Title Only" />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(`.${classes.quickActionIcon}`);

      expect(iconElement).toBeNull();
    });
  });

  describe('prop: title', () => {
    it('should render title when provided', () => {
      const { getByText, getHostHTMLElement } = render(
        <QuickActionCard title="Card Title" />,
      );
      const element = getHostHTMLElement();
      const titleElement = getByText('Card Title');

      expect(
        titleElement.classList.contains(classes.quickActionTitle),
      ).toBeTruthy();
      expect(
        element.querySelector(`.${classes.quickActionContent}`),
      ).toBeTruthy();
    });

    it('should not render content area when no title and no subtitle', () => {
      const { getHostHTMLElement } = render(
        <QuickActionCard icon={CalendarIcon} />,
      );
      const element = getHostHTMLElement();
      const contentElement = element.querySelector(
        `.${classes.quickActionContent}`,
      );

      expect(contentElement).toBeNull();
    });
  });

  describe('prop: subtitle', () => {
    it('should render subtitle when provided', () => {
      const { getByText } = render(
        <QuickActionCard subtitle="Card subtitle" title="Title" />,
      );
      const subtitleElement = getByText('Card subtitle');

      expect(
        subtitleElement.classList.contains(classes.quickActionSubtitle),
      ).toBeTruthy();
    });

    it('should render content area with only subtitle', () => {
      const { getByText, getHostHTMLElement } = render(
        <QuickActionCard icon={CalendarIcon} subtitle="Only subtitle" />,
      );
      const element = getHostHTMLElement();
      const contentElement = element.querySelector(
        `.${classes.quickActionContent}`,
      );
      const subtitleElement = getByText('Only subtitle');

      expect(contentElement).toBeTruthy();
      expect(subtitleElement).toBeTruthy();
    });
  });

  describe('prop: mode', () => {
    it('should render horizontal mode by default', () => {
      const { getHostHTMLElement } = render(<QuickActionCard title="Title" />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains(classes.quickActionVertical),
      ).toBeFalsy();
    });

    it('should add vertical class when mode="vertical"', () => {
      const { getHostHTMLElement } = render(
        <QuickActionCard mode="vertical" title="Title" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains(classes.quickActionVertical),
      ).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('should add disabled class when disabled', () => {
      const { getHostHTMLElement } = render(
        <QuickActionCard disabled title="Title" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains(classes.quickActionDisabled),
      ).toBeTruthy();
      expect(element.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not have disabled attributes when not disabled', () => {
      const { getHostHTMLElement } = render(<QuickActionCard title="Title" />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains(classes.quickActionDisabled),
      ).toBeFalsy();
      expect(element.getAttribute('aria-disabled')).toBeNull();
    });
  });

  describe('prop: readOnly', () => {
    it('should add read-only class when readOnly', () => {
      const { getHostHTMLElement } = render(
        <QuickActionCard readOnly title="Title" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains(classes.quickActionReadOnly),
      ).toBeTruthy();
      expect(element.getAttribute('aria-readonly')).toBe('true');
    });
  });

  describe('click handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      const { getHostHTMLElement } = render(
        <QuickActionCard onClick={handleClick} title="Title" />,
      );
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with icon and title', () => {
    it('should render both icon and title', () => {
      const { getByText, getHostHTMLElement } = render(
        <QuickActionCard icon={FileIcon} title="File Action" />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(`.${classes.quickActionIcon}`);
      const titleElement = getByText('File Action');

      expect(iconElement).toBeTruthy();
      expect(titleElement).toBeTruthy();
    });

    it('should render icon, title, and subtitle together', () => {
      const { getByText, getHostHTMLElement } = render(
        <QuickActionCard
          icon={CalendarIcon}
          subtitle="View your schedule"
          title="Calendar"
        />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(`.${classes.quickActionIcon}`);
      const titleElement = getByText('Calendar');
      const subtitleElement = getByText('View your schedule');

      expect(iconElement).toBeTruthy();
      expect(titleElement).toBeTruthy();
      expect(subtitleElement).toBeTruthy();
    });
  });
});
