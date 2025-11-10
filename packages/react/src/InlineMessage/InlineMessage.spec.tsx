import { InlineMessageSeverity } from '@mezzanine-ui/core/inline-message';
import { InfoFilledIcon } from '@mezzanine-ui/icons';
import InlineMessage from '.';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

describe('<InlineMessage />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<InlineMessage ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<InlineMessage className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<InlineMessage>Hello</InlineMessage>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-inline-message')).toBeTruthy();
  });

  it('should render children', () => {
    const { getHostHTMLElement } = render(<InlineMessage>Hello World</InlineMessage>);
    const element = getHostHTMLElement();

    expect(element.textContent).toContain('Hello World');
  });

  it('should have accessibility attributes', () => {
    const { getHostHTMLElement } = render(<InlineMessage severity="info">Message</InlineMessage>);
    const element = getHostHTMLElement();

    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-live')).toBe('polite');
  });

  describe('prop: severity', () => {
    const severities: InlineMessageSeverity[] = ['info', 'warning', 'error'];

    severities.forEach((severity) => {
      it(`should add class if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(
          <InlineMessage severity={severity}>Message</InlineMessage>,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-inline-message--${severity}`),
        ).toBeTruthy();
      });

      it(`should render default icon if severity="${severity}" and no custom icon`, () => {
        const { getHostHTMLElement } = render(
          <InlineMessage severity={severity}>Message</InlineMessage>,
        );
        const element = getHostHTMLElement();
        const iconElement = element.querySelector('.mzn-inline-message__icon');

        expect(iconElement).toBeTruthy();
      });
    });
  });

  describe('prop: icon', () => {
    it('should render custom icon when provided', () => {
      const { getHostHTMLElement } = render(
        <InlineMessage severity="info" icon={InfoFilledIcon}>
          Message
        </InlineMessage>,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-inline-message__icon');

      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('data-icon-name')).toBe(InfoFilledIcon.name);
    });

    it('should not render icon when severity is not provided', () => {
      const { getHostHTMLElement } = render(<InlineMessage>Message</InlineMessage>);
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-inline-message__icon');

      expect(iconElement).toBeNull();
    });
  });

  describe('prop: onClose', () => {
    it('should render close button when severity is info', () => {
      const { getHostHTMLElement } = render(
        <InlineMessage severity="info">Message</InlineMessage>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector('.mzn-inline-message__close');

      expect(closeButton).toBeTruthy();
    });

    it('should not render close button when severity is warning', () => {
      const { getHostHTMLElement } = render(
        <InlineMessage severity="warning">Message</InlineMessage>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector('.mzn-inline-message__close');

      expect(closeButton).toBeNull();
    });

    it('should not render close button when severity is error', () => {
      const { getHostHTMLElement } = render(
        <InlineMessage severity="error">Message</InlineMessage>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector('.mzn-inline-message__close');

      expect(closeButton).toBeNull();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      const { getHostHTMLElement } = render(
        <InlineMessage severity="info" onClose={onClose}>
          Message
        </InlineMessage>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector('.mzn-inline-message__close') as HTMLButtonElement;

      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should hide message when close button is clicked', () => {
      const { getHostHTMLElement, container } = render(
        <InlineMessage severity="info">Message</InlineMessage>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector('.mzn-inline-message__close') as HTMLButtonElement;

      fireEvent.click(closeButton);

      // Message should be removed from DOM
      expect(container.querySelector('.mzn-inline-message')).toBeNull();
    });

    it('should have aria-label on close button', () => {
      const { getHostHTMLElement } = render(
        <InlineMessage severity="info">Message</InlineMessage>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector('.mzn-inline-message__close') as HTMLButtonElement;

      expect(closeButton.getAttribute('aria-label')).toBe('Close');
    });
  });

  describe('content structure', () => {
    it('should render content in content container', () => {
      const { getHostHTMLElement } = render(
        <InlineMessage severity="info">Message content</InlineMessage>,
      );
      const element = getHostHTMLElement();
      const contentContainer = element.querySelector('.mzn-inline-message__content-container');
      const content = element.querySelector('.mzn-inline-message__content');

      expect(contentContainer).toBeTruthy();
      expect(content).toBeTruthy();
      expect(content?.textContent).toBe('Message content');
    });
  });
});
