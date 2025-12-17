import { waitFor } from '@testing-library/react';
import { InlineMessageSeverity } from '@mezzanine-ui/core/inline-message';
import { InfoFilledIcon } from '@mezzanine-ui/icons';
import { MOTION_DURATION } from '@mezzanine-ui/system/motion';
import InlineMessage from '.';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

describe('<InlineMessage />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<InlineMessage ref={ref} content="Test" severity="info" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <InlineMessage className={className} content="Test" severity="info" />,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <InlineMessage content="Hello" severity="info" />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-inline-message')).toBeTruthy();
  });

  it('should render content', () => {
    const { getHostHTMLElement } = render(
      <InlineMessage content="Hello World" severity="info" />,
    );
    const element = getHostHTMLElement();

    expect(element.textContent).toContain('Hello World');
  });

  it('should have accessibility attributes', () => {
    const { getHostHTMLElement } = render(
      <InlineMessage content="Message" severity="info" />,
    );
    const element = getHostHTMLElement();

    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-live')).toBe('polite');
  });

  describe('prop: severity', () => {
    const severities: InlineMessageSeverity[] = ['info', 'warning', 'error'];

    severities.forEach((severity) => {
      it(`should add class if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(
          <InlineMessage content="Message" severity={severity} />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-inline-message--${severity}`),
        ).toBeTruthy();
      });

      it(`should render default icon if severity="${severity}" and no custom icon`, () => {
        const { getHostHTMLElement } = render(
          <InlineMessage content="Message" severity={severity} />,
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
        <InlineMessage
          content="Message"
          severity="info"
          icon={InfoFilledIcon}
        />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-inline-message__icon');

      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        InfoFilledIcon.name,
      );
    });

    it('should render default icon when custom icon is not provided', () => {
      const { getHostHTMLElement } = render(
        <InlineMessage content="Message" severity="info" />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-inline-message__icon');

      expect(iconElement).toBeTruthy();
    });
  });

  describe('prop: onClose', () => {
    it('should render close button when severity is info', () => {
      const { getByRole } = render(
        <InlineMessage content="Message" severity="info" />,
      );
      const closeButton = getByRole('button', { name: 'Close' });

      expect(closeButton).toBeTruthy();
    });

    it('should not render close button when severity is warning', () => {
      const { queryByRole } = render(
        <InlineMessage content="Message" severity="warning" />,
      );
      const closeButton = queryByRole('button', { name: 'Close' });

      expect(closeButton).toBeNull();
    });

    it('should not render close button when severity is error', () => {
      const { queryByRole } = render(
        <InlineMessage content="Message" severity="error" />,
      );
      const closeButton = queryByRole('button', { name: 'Close' });

      expect(closeButton).toBeNull();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      const { getByRole } = render(
        <InlineMessage content="Message" severity="info" onClose={onClose} />,
      );
      const closeButton = getByRole('button', { name: 'Close' });

      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should hide message when close button is clicked', async () => {
      const { getByRole, container } = render(
        <InlineMessage content="Message" severity="info" />,
      );
      const closeButton = getByRole('button', { name: 'Close' });

      fireEvent.click(closeButton);

      // Wait for fade out animation to complete
      await waitFor(
        () => {
          expect(container.querySelector('.mzn-inline-message')).toBeNull();
        },
        { timeout: MOTION_DURATION.fast + 100 },
      );
    });

    it('should have aria-label on close button', () => {
      const { getByRole } = render(
        <InlineMessage content="Message" severity="info" />,
      );
      const closeButton = getByRole('button', { name: 'Close' });

      expect(closeButton.getAttribute('aria-label')).toBe('Close');
    });
  });

  describe('content structure', () => {
    it('should render content in content container', () => {
      const { getHostHTMLElement } = render(
        <InlineMessage content="Message content" severity="info" />,
      );
      const element = getHostHTMLElement();
      const contentContainer = element.querySelector(
        '.mzn-inline-message__content-container',
      );
      const content = element.querySelector('.mzn-inline-message__content');

      expect(contentContainer).toBeTruthy();
      expect(content).toBeTruthy();
      expect(content?.textContent).toBe('Message content');
    });
  });

  describe('animation', () => {
    it('should apply fade transition when message is visible', async () => {
      const { getHostHTMLElement } = render(
        <InlineMessage content="Message" severity="info" />,
      );

      await waitFor(() => {
        const element = getHostHTMLElement();

        // After fade in, opacity should be 1
        expect(element.style.opacity).toBe('1');
      });
    });

    it('should fade out when close button is clicked', async () => {
      const { getByRole, getHostHTMLElement } = render(
        <InlineMessage content="Message" severity="info" />,
      );
      const closeButton = getByRole('button', { name: 'Close' });
      const element = getHostHTMLElement();

      // Initially visible
      await waitFor(() => {
        expect(element.style.opacity).toBe('1');
      });

      // Click close button
      fireEvent.click(closeButton);

      // Should start fading out (opacity becomes 0)
      await waitFor(
        () => {
          expect(element.style.opacity).toBe('0');
        },
        { timeout: MOTION_DURATION.fast + 100 },
      );
    });

    it('should use fast duration for fade animation', async () => {
      const { getHostHTMLElement } = render(
        <InlineMessage content="Message" severity="info" />,
      );
      const element = getHostHTMLElement();

      // Check that transition is applied with fast duration
      await waitFor(() => {
        const transition = element.style.transition;

        expect(transition).toContain(`${MOTION_DURATION.fast}ms`);
      });
    });
  });
});
