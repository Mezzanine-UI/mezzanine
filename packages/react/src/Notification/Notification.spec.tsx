import {
  CheckCircleFilledIcon,
  ExclamationCircleFilledIcon,
  TimesCircleFilledIcon,
  InfoCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { Key } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '../../__test-utils__';
import Notification, { NotificationSeverity } from '.';

const severities: NotificationSeverity[] = [
  'success',
  'warning',
  'error',
  'info',
];

describe('<Notification />', () => {
  afterEach(cleanup);

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Notification />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-notif')).toBeTruthy();
  });

  it('should render children under content element', () => {
    const children = 'foo';
    const { getByText } = render(<Notification>{children}</Notification>);
    const contentElement = getByText(children);

    expect(contentElement.textContent).toBe('foo');
    expect(contentElement.classList.contains('mzn-notif__content'));
  });

  it('should auto close if duration is provided', () => {
    jest.useFakeTimers();

    const { container } = render(
      <Notification duration={3000} />,
    );

    act(() => {
      jest.runAllTimers();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(container.childElementCount).toBe(0);
  });

  describe('prop: cancelText', () => {
    it('should render cancel button with text wrapped by span under action element', () => {
      const cancelText = 'foo';
      const { getByText } = render(
        <Notification
          cancelText={cancelText}
          onConfirm={() => {}}
        />,
      );
      const textElement = getByText(cancelText);

      expect(textElement.textContent).toBe(cancelText);
      expect(textElement.parentElement?.classList.contains('mzn-button')).toBe(true);
    });
  });

  describe('prop: confirmText', () => {
    it('should render confirm button with text wrapped by span under action element', () => {
      const confirmText = 'foo';
      const { getByText } = render(
        <Notification
          confirmText={confirmText}
          onConfirm={() => {}}
        />,
      );
      const textElement = getByText(confirmText);

      expect(textElement.textContent).toBe(confirmText);
      expect(textElement.parentElement?.classList.contains('mzn-button')).toBe(true);
    });
  });

  describe('prop: onCancel', () => {
    it('`onCancel` should apply to cancel button', () => {
      const cancelText = 'foo';
      const onCancel = jest.fn();
      const { getByText } = render(
        <Notification
          onConfirm={() => {}}
          cancelText={cancelText}
          onCancel={onCancel}
        />,
      );

      const {
        parentElement: buttonElement,
      } = getByText(cancelText);

      if (buttonElement) {
        fireEvent.click(buttonElement);
      }

      expect(onCancel).toBeCalledTimes(1);
    });

    it('if not provided, click event handler of cancel button will fallback to `onClose`', () => {
      const cancelText = 'foo';
      const onClose = jest.fn();
      const { getByText } = render(
        <Notification
          onConfirm={() => {}}
          cancelText={cancelText}
          onClose={onClose}
        />,
      );

      const {
        parentElement: buttonElement,
      } = getByText(cancelText);

      if (buttonElement) {
        fireEvent.click(buttonElement);
      }

      expect(onClose).toBeCalledTimes(1);
    });
  });

  describe('prop: onClose', () => {
    it('should be able to close if `onClose` is not provided', async () => {
      const cancelText = 'foo';
      const closeSpy = jest.spyOn(Notification, 'remove');
      const { getByText } = render(
        <Notification
          onConfirm={() => {}}
          cancelText={cancelText}
        />,
      );

      const {
        parentElement: buttonElement,
      } = getByText(cancelText);

      if (buttonElement) {
        act(() => {
          fireEvent.click(buttonElement);
        });
      }

      await waitFor(() => {
        expect(closeSpy).toBeCalledTimes(1);
      });
    });
  });

  describe('prop: onConfirm', () => {
    it('should render action element if onConfirm is provided', () => {
      const { getHostHTMLElement } = render(
        <Notification
          onConfirm={() => {}}
        />,
      );

      const element = getHostHTMLElement();
      const actionElement = element.querySelector('.mzn-notif__action');

      expect(actionElement).toBeInstanceOf(Element);
    });

    it('`onConfirm` should apply to confirm button', () => {
      const confirmText = 'foo';
      const onConfirm = jest.fn();
      const { getByText } = render(
        <Notification
          onConfirm={onConfirm}
          confirmText={confirmText}
        />,
      );

      const {
        parentElement: buttonElement,
      } = getByText(confirmText);

      if (buttonElement) {
        fireEvent.click(buttonElement);
      }

      expect(onConfirm).toBeCalledTimes(1);
    });
  });

  describe('prop: onExited', () => {
    it('should be invoked when notification transition ended', () => {
      jest.useFakeTimers();

      const onExited = jest.fn();

      render(<Notification onExited={onExited} />);

      const cancelText = 'foo';
      const { getByText } = render(
        <Notification
          onExited={onExited}
          onConfirm={() => {}}
          cancelText={cancelText}
        />,
      );

      const {
        parentElement: buttonElement,
      } = getByText(cancelText);

      fireEvent.click(buttonElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(onExited).toBeCalledTimes(1);
    });
  });

  describe('prop: reference', () => {
    it('should close notification with reference', () => {
      const reference = 'foo';
      const onClose = jest.fn();
      const { getHostHTMLElement } = render(
        <Notification
          onConfirm={() => {}}
          reference={reference}
          onClose={onClose}
        />,
      );

      const {
        lastElementChild: closeIconElement,
      } = getHostHTMLElement();

      if (closeIconElement) {
        fireEvent.click(closeIconElement);
      }

      expect(onClose).toBeCalledTimes(1);
      expect(onClose).toBeCalledWith(reference);
    });
  });

  describe('prop: severity', () => {
    const icons = {
      success: {
        color: 'success',
        icon: CheckCircleFilledIcon,
      },
      warning: {
        color: 'warning',
        icon: ExclamationCircleFilledIcon,
      },
      error: {
        color: 'error',
        icon: TimesCircleFilledIcon,
      },
      info: {
        color: 'primary',
        icon: InfoCircleFilledIcon,
      },
    };

    severities.forEach((severity) => {
      it(`should add class if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(<Notification severity={severity} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-notif--${severity}`)).toBeTruthy();
      });

      const targetIcon = icons[severity].icon;

      it(`should render "${targetIcon.name}" icon under icon-container element if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(<Notification severity={severity} />);
        const element = getHostHTMLElement();
        const containerElement = element.querySelector('.mzn-notif__icon-container');

        const iconElement = containerElement?.firstElementChild;

        expect(containerElement).toBeInstanceOf(Element);
        expect(iconElement?.getAttribute('data-icon-name')).toBe(targetIcon.name);
      });
    });
  });

  describe('prop: title', () => {
    it('should render title under title element', () => {
      const title = 'foo';
      const {
        getHostHTMLElement,
      } = render(
        <Notification title={title} />,
      );

      const element = getHostHTMLElement();
      const titleElement = element.querySelector('.mzn-notif__title');

      expect(titleElement).toBeInstanceOf(Element);
      expect(titleElement?.textContent).toBe(title);
    });
  });
});

describe('Notification API', () => {
  afterEach(cleanup);

  severities.forEach((severity) => {
    describe(`Notification.${severity}`, () => {
      afterEach(() => {
        act(() => {
          Notification.destroy();
        });
      });

      const children = 'foo';
      const handler = Notification[severity];

      expect(handler).toBeInstanceOf(Function);

      it('should find root at the end of body', () => {
        act(() => {
          handler({
            children,
          });
        });

        const {
          lastElementChild: rootElement,
        } = document.body;

        expect(rootElement?.classList.contains('mzn-notif-root')).toBeTruthy();
      });

      it(`should find ${severity} message and be able to remove it`, () => {
        let reference: Key;

        act(() => {
          reference = handler({
            children,
          });
        });

        const {
          lastElementChild: rootElement,
        } = document.body;

        const notificationElement = rootElement?.firstElementChild;

        expect(notificationElement?.classList.contains(`mzn-notif--${severity}`)).toBeTruthy();
        expect(notificationElement?.textContent).toBe(children);

        act(() => {
          Notification.remove(reference);
        });

        expect(rootElement?.childElementCount).toBe(0);
      });
    });
  });
});
