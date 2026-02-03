import {
  CheckedFilledIcon,
  WarningFilledIcon,
  ErrorFilledIcon,
  InfoFilledIcon,
} from '@mezzanine-ui/icons';
import { Key } from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '../../__test-utils__';
import NotificationCenter from './NotificationCenter';
import { NotificationSeverity } from '@mezzanine-ui/core/notification-center';

const severities: NotificationSeverity[] = [
  'success',
  'warning',
  'error',
  'info',
];

describe('<NotificationCenter />', () => {
  afterEach(cleanup);

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<NotificationCenter reference="test" />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-notification-center')).toBeTruthy();
  });

  it('should render description under content element', () => {
    const description = 'foo';
    const { getByText } = render(<NotificationCenter reference="test" description={description} />);
    const contentElement = getByText(description);

    expect(contentElement.textContent).toBe('foo');
    expect(contentElement.classList.contains('mzn-notification-center__content')).toBeTruthy();
  });

  it('should auto close if duration is provided', () => {
    jest.useFakeTimers();

    const { container } = render(<NotificationCenter reference="test" duration={3000} />);

    act(() => {
      jest.runAllTimers();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(container.childElementCount).toBe(0);
  });

  describe('prop: cancelButtonText', () => {
    it('should render cancel button with text under action element', () => {
      const cancelButtonText = 'foo';
      const { getByText } = render(
        <NotificationCenter reference="test" cancelButtonText={cancelButtonText} onConfirm={() => {}} onClose={() => {}} />,
      );
      const textElement = getByText(cancelButtonText);
      const buttonElement = textElement.closest('.mzn-button');

      expect(textElement.textContent).toBe(cancelButtonText);
      expect(buttonElement).toBeInstanceOf(Element);
    });
  });

  describe('prop: confirmButtonText', () => {
    it('should render confirm button with text under action element', () => {
      const confirmButtonText = 'foo';
      const { getByText } = render(
        <NotificationCenter reference="test" confirmButtonText={confirmButtonText} onConfirm={() => {}} />,
      );
      const textElement = getByText(confirmButtonText);
      const buttonElement = textElement.closest('.mzn-button');

      expect(textElement.textContent).toBe(confirmButtonText);
      expect(buttonElement).toBeInstanceOf(Element);
    });
  });

  describe('prop: onCancel', () => {
    it('`onCancel` should apply to cancel button', () => {
      const cancelButtonText = 'foo';
      const onCancel = jest.fn();
      const { getByText } = render(
        <NotificationCenter
          reference="test"
          onConfirm={() => {}}
          cancelButtonText={cancelButtonText}
          onCancel={onCancel}
        />,
      );

      const buttonElement = getByText(cancelButtonText).closest('button');

      if (buttonElement) {
        fireEvent.click(buttonElement);
      }

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('if not provided, click event handler of cancel button will fallback to `onClose`', () => {
      const cancelButtonText = 'foo';
      const onClose = jest.fn();
      const { getByText } = render(
        <NotificationCenter
          reference="test"
          onConfirm={() => {}}
          cancelButtonText={cancelButtonText}
          onClose={onClose}
        />,
      );

      const buttonElement = getByText(cancelButtonText).closest('button');

      if (buttonElement) {
        fireEvent.click(buttonElement);
      }

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: onClose', () => {
    it('should be able to close if `onClose` is not provided', async () => {
      const cancelButtonText = 'foo';
      const closeSpy = jest.spyOn(NotificationCenter, 'remove');
      const { getByText } = render(
        <NotificationCenter reference="test" onConfirm={() => {}} cancelButtonText={cancelButtonText} onCancel={() => {}} />,
      );

      const buttonElement = getByText(cancelButtonText).closest('button');

      if (buttonElement) {
        act(() => {
          fireEvent.click(buttonElement);
        });
      }

      await waitFor(() => {
        expect(closeSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('prop: onConfirm', () => {
    it('should render action element if onConfirm is provided', () => {
      const { getHostHTMLElement } = render(
        <NotificationCenter reference="test" onConfirm={() => {}} />,
      );

      const element = getHostHTMLElement();
      const actionElement = element.querySelector('.mzn-notification-center__action');

      expect(actionElement).toBeInstanceOf(Element);
    });

    it('`onConfirm` should apply to confirm button', () => {
      const confirmButtonText = 'foo';
      const onConfirm = jest.fn();
      const { getByText } = render(
        <NotificationCenter reference="test" onConfirm={onConfirm} confirmButtonText={confirmButtonText} />,
      );

      const buttonElement = getByText(confirmButtonText).closest('button');

      if (buttonElement) {
        fireEvent.click(buttonElement);
      }

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: onExited', () => {
    it('should be invoked when notification transition ended', () => {
      jest.useFakeTimers();

      const onExited = jest.fn();

      const cancelButtonText = 'foo';
      const { getByText } = render(
        <NotificationCenter
          reference="test"
          onExited={onExited}
          onConfirm={() => {}}
          cancelButtonText={cancelButtonText}
          onCancel={() => {}}
        />,
      );

      const buttonElement = getByText(cancelButtonText).closest('button');

      if (buttonElement) {
        fireEvent.click(buttonElement);
      }

      act(() => {
        jest.runAllTimers();
      });

      expect(onExited).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: reference', () => {
    it('should close notification with reference', () => {
      const reference = 'foo';
      const onClose = jest.fn();
      const { getHostHTMLElement } = render(
        <NotificationCenter
          onConfirm={() => {}}
          reference={reference}
          onClose={onClose}
        />,
      );

      const { lastElementChild: closeIconElement } = getHostHTMLElement();

      if (closeIconElement) {
        fireEvent.click(closeIconElement);
      }

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith(reference);
    });
  });

  describe('prop: severity', () => {
    const icons = {
      success: {
        color: 'success',
        icon: CheckedFilledIcon,
      },
      warning: {
        color: 'warning',
        icon: WarningFilledIcon,
      },
      error: {
        color: 'error',
        icon: ErrorFilledIcon,
      },
      info: {
        color: 'primary',
        icon: InfoFilledIcon,
      },
    };

    severities.forEach((severity) => {
      it(`should add class if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(
          <NotificationCenter reference="test" severity={severity} />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-notification-center--${severity}`),
        ).toBeTruthy();
      });

      const targetIcon = icons[severity].icon;

      it(`should render "${targetIcon.name}" icon under icon-container element if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(
          <NotificationCenter reference="test" severity={severity} />,
        );
        const element = getHostHTMLElement();
        const containerElement = element.querySelector(
          '.mzn-notification-center__icon-container',
        );

        const iconElement = containerElement?.firstElementChild;

        expect(containerElement).toBeInstanceOf(Element);
        expect(iconElement?.getAttribute('data-icon-name')).toBe(
          targetIcon.name,
        );
      });
    });
  });

  describe('prop: title', () => {
    it('should render title under title element', () => {
      const title = 'foo';
      const { getHostHTMLElement } = render(<NotificationCenter reference="test" title={title} />);

      const element = getHostHTMLElement();
      const titleElement = element.querySelector('.mzn-notification-center__title');

      expect(titleElement).toBeInstanceOf(Element);
      expect(titleElement?.textContent).toBe(title);
    });
  });
});

describe('NotificationCenter API', () => {
  afterEach(cleanup);

  severities.forEach((severity) => {
    describe(`NotificationCenter.${severity}`, () => {
      afterEach(() => {
        act(() => {
          NotificationCenter.destroy();
        });
      });

      const children = 'foo';
      const handler = NotificationCenter[severity];

      expect(handler).toBeInstanceOf(Function);

      it('should find root at the end of body', () => {
        act(() => {
          handler({
            description: children,
          });
        });

        const { lastElementChild: rootElement } = document.body;

        expect(rootElement?.classList.contains('mzn-notification-center-root')).toBeTruthy();
      });

      it(`should find ${severity} message and be able to remove it`, () => {
        let reference: Key;

        act(() => {
          reference = handler({
            description: children,
          });
        });

        const { lastElementChild: rootElement } = document.body;

        const notificationElement = rootElement?.firstElementChild;

        expect(
          notificationElement?.classList.contains(`mzn-notification-center--${severity}`),
        ).toBeTruthy();
        expect(notificationElement?.textContent).toContain(children);

        act(() => {
          NotificationCenter.remove(reference);
        });

        expect(rootElement?.childElementCount).toBe(0);
      });
    });
  });
});
