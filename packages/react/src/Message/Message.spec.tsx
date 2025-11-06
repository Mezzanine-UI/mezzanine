import {
  CheckedFilledIcon,
  WarningFilledIcon,
  ErrorFilledIcon,
  InfoFilledIcon,
  SpinnerIcon,
} from '@mezzanine-ui/icons';
import { MessageSeverity } from '@mezzanine-ui/core/message';
import { Key } from 'react';
import { act, cleanup, render } from '../../__test-utils__';
import Message from '.';

const severities: MessageSeverity[] = [
  'success',
  'warning',
  'error',
  'info',
  'loading',
];

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
        icon: CheckedFilledIcon,
      },
      warning: {
        icon: WarningFilledIcon,
      },
      error: {
        icon: ErrorFilledIcon,
      },
      info: {
        icon: InfoFilledIcon,
      },
      loading: {
        icon: SpinnerIcon,
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

      expect(onExited).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe('prop: duration', () => {
    it('should not auto close if duration is false', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <Message duration={false}>持續顯示</Message>,
      );

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      const element = getHostHTMLElement();

      expect(element.textContent).toBe('持續顯示');

      jest.useRealTimers();
    });

    it('should auto close after custom duration', () => {
      jest.useFakeTimers();

      const onExited = jest.fn();

      render(
        <Message duration={5000} onExited={onExited}>
          5秒後關閉
        </Message>,
      );

      act(() => {
        jest.advanceTimersByTime(4999);
      });

      expect(onExited).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(onExited).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });

  describe('icon spin', () => {
    it('should spin icon when severity is loading', () => {
      const { getHostHTMLElement } = render(
        <Message severity="loading" icon={SpinnerIcon}>
          載入中
        </Message>,
      );

      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-icon');

      expect(iconElement?.classList.contains('mzn-icon--spin')).toBeTruthy();
    });

    it('should not spin icon for other severities', () => {
      const { getHostHTMLElement } = render(
        <Message severity="success" icon={CheckedFilledIcon}>
          成功
        </Message>,
      );

      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-icon');

      expect(iconElement?.classList.contains('mzn-icon--spin')).toBeFalsy();
    });
  });
});

describe('Message API', () => {
  afterEach(() => {
    act(() => {
      Message.destroy();
    });
    cleanup();
  });

  severities.forEach((severity) => {
    describe(`Message.${severity}`, () => {
      const testMessage = 'foo';
      const handler = Message[severity];

      it('should be a function', () => {
        expect(handler).toBeInstanceOf(Function);
      });

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

      if (severity === 'loading') {
        it('should not auto close by default for loading', () => {
          jest.useFakeTimers();

          act(() => {
            handler(testMessage);
          });

          const { lastElementChild: rootElement } = document.body;

          expect(rootElement?.childElementCount).toBe(1);

          act(() => {
            jest.advanceTimersByTime(10000);
          });

          expect(rootElement?.childElementCount).toBe(1);

          jest.useRealTimers();
        });
      } else {
        it('should remove message after 3 seconds by default', () => {
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

          jest.useRealTimers();
        });
      }
    });
  });

  describe('Message update functionality', () => {
    it('should update message with same key', () => {
      jest.useFakeTimers();

      let key: Key;

      act(() => {
        key = Message.loading('載入中...');
      });

      const { lastElementChild: rootElement } = document.body;
      let messageElement = rootElement?.firstElementChild;

      expect(messageElement?.textContent).toBe('載入中...');
      expect(
        messageElement?.classList.contains('mzn-message--loading'),
      ).toBeTruthy();

      act(() => {
        Message.success('載入成功！', { key });
      });

      messageElement = rootElement?.firstElementChild;

      expect(messageElement?.textContent).toBe('載入成功！');
      expect(
        messageElement?.classList.contains('mzn-message--success'),
      ).toBeTruthy();

      jest.useRealTimers();
    });

    it('should start timer when updating loading to success', () => {
      jest.useFakeTimers();

      let key: Key;

      act(() => {
        key = Message.loading('處理中...');
      });

      const { lastElementChild: rootElement } = document.body;

      expect(rootElement?.childElementCount).toBe(1);

      // Loading 不會自動關閉
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(rootElement?.childElementCount).toBe(1);

      // 更新為 success
      act(() => {
        Message.success('處理完成！', { key });
      });

      // Success 會在 3 秒後自動關閉
      act(() => {
        jest.runAllTimers();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(rootElement?.childElementCount).toBe(0);

      jest.useRealTimers();
    });

    it('should support multiple step updates', () => {
      jest.useFakeTimers();

      let key: Key;

      act(() => {
        key = Message.loading('步驟 1/3');
      });

      const { lastElementChild: rootElement } = document.body;
      let messageElement = rootElement?.firstElementChild;

      expect(messageElement?.textContent).toBe('步驟 1/3');

      act(() => {
        Message.loading('步驟 2/3', { key });
      });

      messageElement = rootElement?.firstElementChild;

      expect(messageElement?.textContent).toBe('步驟 2/3');

      act(() => {
        Message.loading('步驟 3/3', { key });
      });

      messageElement = rootElement?.firstElementChild;

      expect(messageElement?.textContent).toBe('步驟 3/3');

      act(() => {
        Message.success('完成！', { key });
      });

      messageElement = rootElement?.firstElementChild;

      expect(messageElement?.textContent).toBe('完成！');
      expect(
        messageElement?.classList.contains('mzn-message--success'),
      ).toBeTruthy();

      jest.useRealTimers();
    });
  });

  describe('Message queue with maxCount', () => {
    it('should queue messages when exceeding maxCount (4)', async () => {
      const keys: Key[] = [];

      // 添加 5 個訊息
      for (let i = 0; i < 5; i += 1) {
        act(() => {
          keys.push(Message.info(`訊息 ${i + 1}`, { duration: false }));
        });
      }

      // 等待所有 React 更新和動畫完成
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });

      const { lastElementChild: rootElement } = document.body;

      // 只顯示 4 個（第 5 個在 queue 中）
      expect(rootElement?.childElementCount).toBe(4);
    });

    it('should display queued message after one is removed', async () => {
      const keys: Key[] = [];

      // 添加 5 個訊息
      for (let i = 0; i < 5; i += 1) {
        act(() => {
          keys.push(Message.info(`訊息 ${i + 1}`, { duration: false }));
        });
      }

      // 等待 React 更新和動畫
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });

      const { lastElementChild: rootElement } = document.body;

      expect(rootElement?.childElementCount).toBe(4);

      // 移除第一個訊息
      act(() => {
        Message.remove(keys[0]);
      });

      // 等待退場動畫和 queue 補位
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });

      // 還是 4 個，但第 5 個訊息補上了
      expect(rootElement?.childElementCount).toBe(4);

      const messages = Array.from(rootElement?.children || []);
      const lastMessage = messages[messages.length - 1];

      expect(lastMessage?.textContent).toBe('訊息 5');
    });
  });
});
