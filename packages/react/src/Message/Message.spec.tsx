import {
  CheckCircleFilledIcon,
  ExclamationCircleFilledIcon,
  TimesCircleFilledIcon,
  InfoCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { Key } from 'react';
import { act, cleanup, render } from '../../__test-utils__';
import Message from '.';

const severities: SeverityWithInfo[] = ['success', 'warning', 'error', 'info'];

describe('<Message />', () => {
  afterEach(cleanup);

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Message>No Data</Message>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-message')).toBeTruthy();
  });

  it('should render children', () => {
    const { getHostHTMLElement } = render(<Message>foo</Message>);
    const element = getHostHTMLElement();

    expect(element.textContent).toBe('foo');
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
      custom: {
        color: 'custom',
        icon: undefined,
      },
    };

    severities.forEach((severity) => {
      it(`should add class if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(<Message severity={severity} />);
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-message--${severity}`),
        ).toBeTruthy();
      });

      const targetIcon = icons[severity].icon;

      it(`should render "${targetIcon?.name}" icon if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(
          <Message icon={targetIcon} severity={severity} />,
        );

        const element = getHostHTMLElement();
        const { firstElementChild: iconElement } = element;

        expect(iconElement?.getAttribute('data-icon-name')).toBe(
          targetIcon?.name,
        );
      });
    });
  });

  describe('prop: onExited', () => {
    it('should be invoked when transition ended', () => {
      jest.useFakeTimers();

      const onExited = jest.fn();

      render(<Message onExited={onExited} duration={3000} />);

      act(() => {
        jest.runAllTimers();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(onExited).toBeCalledTimes(1);
    });
  });
});

describe('Message API', () => {
  afterEach(cleanup);

  severities.forEach((severity) => {
    describe(`Message.${severity}`, () => {
      afterEach(() => {
        act(() => {
          Message.destroy();
        });
      });

      const testMessage = 'foo';
      const handler = Message[severity];

      expect(handler).toBeInstanceOf(Function);

      it('should find root at the end of body', () => {
        act(() => {
          handler(testMessage);
        });

        const { lastElementChild: rootElement } = document.body;

        expect(
          rootElement?.classList.contains('mzn-message__root'),
        ).toBeTruthy();
      });

      it(`should find ${severity} message and be able to remove it`, () => {
        let reference: Key;

        act(() => {
          reference = handler(testMessage);
        });

        const { lastElementChild: rootElement } = document.body;

        const messageElement = rootElement?.firstElementChild;

        expect(
          messageElement?.classList.contains(`mzn-message--${severity}`),
        ).toBeTruthy();
        expect(messageElement?.textContent).toBe(testMessage);

        act(() => {
          Message.remove(reference);
        });

        expect(rootElement?.childElementCount).toBe(0);
      });

      it('should remove message after 3 second by default', () => {
        jest.useFakeTimers();

        act(() => {
          handler(testMessage);
        });

        const { lastElementChild: rootElement } = document.body;

        expect(rootElement?.childElementCount).toBe(1);

        // wait until effect triggered
        act(() => {
          jest.runAllTimers();
        });

        // wait until transition ends
        act(() => {
          jest.runAllTimers();
        });

        expect(rootElement?.childElementCount).toBe(0);
      });
    });
  });
});
