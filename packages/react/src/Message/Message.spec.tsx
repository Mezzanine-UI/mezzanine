import { messageClasses as classes, messageIcons, MessageSeverity } from '@mezzanine-ui/core/message';
import { CloseIcon } from '@mezzanine-ui/icons';
import { Key } from 'react';
import Message from '.';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';

const severities: MessageSeverity[] = ['warning', 'error', 'info'];

describe('<Message />', () => {
  afterEach(() => {
    cleanup();
    act(() => {
      Message.destroy();
    });
  });

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Message>No Data</Message>);
    const element = getHostHTMLElement();

    expect(element.classList.contains(classes.host)).toBeTruthy();
  });

  it('should render children', () => {
    const { getHostHTMLElement } = render(<Message>foo</Message>);
    const element = getHostHTMLElement();

    expect(element.textContent).toContain('foo');
  });

  describe('prop: severity', () => {
    severities.forEach((severity) => {
      it(`should add class if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(
          <Message severity={severity}>Test message</Message>,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(classes.severity(severity)),
        ).toBeTruthy();
      });

      it(`should render default icon if severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(
          <Message severity={severity}>Test message</Message>,
        );
        const element = getHostHTMLElement();
        const iconElement = element.querySelector(
          `.${classes.icon}`,
        ) as HTMLElement;

        expect(iconElement).toBeTruthy();
        expect(
          iconElement.getAttribute('data-icon-name'),
        ).toBe(messageIcons[severity].name);
      });
    });

    it('should not add severity class if severity is not provided', () => {
      const { getHostHTMLElement } = render(<Message>Test message</Message>);
      const element = getHostHTMLElement();

      severities.forEach((severity) => {
        expect(
          element.classList.contains(classes.severity(severity)),
        ).toBeFalsy();
      });
    });
  });

  describe('prop: icon', () => {
    it('should render custom icon when provided', () => {
      const CustomIcon = messageIcons.info;
      const { getHostHTMLElement } = render(
        <Message icon={CustomIcon} severity="info">
          Test message
        </Message>,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(
        `.${classes.icon}`,
      ) as HTMLElement;

      expect(iconElement).toBeTruthy();
      expect(iconElement.getAttribute('data-icon-name')).toBe(CustomIcon.name);
    });

    it('should use custom icon over severity default icon', () => {
      const CustomIcon = messageIcons.error;
      const { getHostHTMLElement } = render(
        <Message icon={CustomIcon} severity="info">
          Test message
        </Message>,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(
        `.${classes.icon}`,
      ) as HTMLElement;

      expect(iconElement.getAttribute('data-icon-name')).toBe(CustomIcon.name);
      expect(iconElement.getAttribute('data-icon-name')).not.toBe(
        messageIcons.info.name,
      );
    });

    it('should not render icon if severity is not provided and no icon', () => {
      const { getHostHTMLElement } = render(<Message>Test message</Message>);
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(`.${classes.icon}`);

      expect(iconElement).toBeFalsy();
    });
  });

  describe('prop: onClose', () => {
    it('should render close button when severity="info"', () => {
      const { getHostHTMLElement } = render(
        <Message severity="info">Test message</Message>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector(
        `.${classes.close}`,
      ) as HTMLElement;

      expect(closeButton).toBeTruthy();
      expect(closeButton.tagName.toLowerCase()).toBe('button');
    });

    it('should not render close button when severity="warning"', () => {
      const { getHostHTMLElement } = render(
        <Message severity="warning">Test message</Message>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector(`.${classes.close}`);

      expect(closeButton).toBeFalsy();
    });

    it('should not render close button when severity="error"', () => {
      const { getHostHTMLElement } = render(
        <Message severity="error">Test message</Message>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector(`.${classes.close}`);

      expect(closeButton).toBeFalsy();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      const reference = 'test-reference';
      const { getHostHTMLElement } = render(
        <Message reference={reference} severity="info" onClose={onClose}>
          Test message
        </Message>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector(
        `.${classes.close}`,
      ) as HTMLElement;

      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith(reference);
    });

    it('should render close icon in close button', () => {
      const { getHostHTMLElement } = render(
        <Message severity="info">Test message</Message>,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector(
        `.${classes.close}`,
      ) as HTMLElement;
      const closeIcon = closeButton.querySelector(
        `.${classes.closeIcon}`,
      ) as HTMLElement;

      expect(closeIcon).toBeTruthy();
      expect(closeIcon.getAttribute('data-icon-name')).toBe(CloseIcon.name);
    });
  });

  describe('prop: onExited', () => {
    it('should be invoked when transition ended', () => {
      jest.useFakeTimers();

      const onExited = jest.fn();

      render(<Message onExited={onExited} duration={3000}>
        Test message
      </Message>);

      act(() => {
        jest.runAllTimers();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(onExited).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });

    it('should call Message.remove when reference is provided', () => {
      jest.useFakeTimers();

      const reference = 'test-reference';
      const removeSpy = jest.spyOn(Message, 'remove');
      const onExited = jest.fn();

      render(
        <Message reference={reference} onExited={onExited} duration={3000}>
          Test message
        </Message>,
      );

      act(() => {
        jest.runAllTimers();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(removeSpy).toHaveBeenCalledWith(reference);

      removeSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe('prop: duration', () => {
    it('should auto close after duration', () => {
      jest.useFakeTimers();

      const onExited = jest.fn();
      render(
        <Message duration={1000} onExited={onExited}>
          Test message
        </Message>,
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(onExited).toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should not auto close if duration is not provided', () => {
      jest.useFakeTimers();

      const onExited = jest.fn();
      render(
        <Message onExited={onExited}>
          Test message
        </Message>,
      );

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onExited).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('structure', () => {
    it('should render content container with correct classes', () => {
      const { getHostHTMLElement } = render(
        <Message severity="info">Test message</Message>,
      );
      const element = getHostHTMLElement();
      const contentContainer = element.querySelector(
        `.${classes.contentContainer}`,
      );

      expect(contentContainer).toBeTruthy();
    });

    it('should render content with correct classes', () => {
      const { getHostHTMLElement } = render(
        <Message severity="info">Test message</Message>,
      );
      const element = getHostHTMLElement();
      const content = element.querySelector(`.${classes.content}`);

      expect(content).toBeTruthy();
      expect(content?.textContent).toBe('Test message');
    });
  });
});

describe('Message API', () => {
  afterEach(() => {
    cleanup();
    act(() => {
      Message.destroy();
    });
  });

  describe('Message.add', () => {
    it('should add message to root', () => {
      act(() => {
        Message.add({
          children: 'Test message',
          severity: 'info',
        });
      });

      const { lastElementChild: rootElement } = document.body;

      expect(rootElement?.classList.contains(classes.root)).toBeTruthy();
      expect(rootElement?.childElementCount).toBe(1);
    });

    it('should return reference key', () => {
      let reference: Key | undefined;

      act(() => {
        reference = Message.add({
          children: 'Test message',
          severity: 'info',
        });
      });

      expect(reference).toBeDefined();
    });
  });

  describe('Message.warning', () => {
    it('should add warning message', () => {
      act(() => {
        Message.warning('Warning message');
      });

      const { lastElementChild: rootElement } = document.body;
      const messageElement = rootElement?.firstElementChild as HTMLElement;

      expect(messageElement?.classList.contains(classes.severity('warning'))).toBeTruthy();
      expect(messageElement?.textContent).toContain('Warning message');
    });

    it('should render warning icon', () => {
      act(() => {
        Message.warning('Warning message');
      });

      const { lastElementChild: rootElement } = document.body;
      const messageElement = rootElement?.firstElementChild as HTMLElement;
      const iconElement = messageElement.querySelector(
        `.${classes.icon}`,
      ) as HTMLElement;

      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        messageIcons.warning.name,
      );
    });

    it('should remove message after default duration', () => {
      jest.useFakeTimers();

      act(() => {
        Message.warning('Warning message');
      });

      const { lastElementChild: rootElement } = document.body;

      expect(rootElement?.childElementCount).toBe(1);

      act(() => {
        jest.runAllTimers();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(rootElement?.childElementCount).toBe(0);

      jest.useRealTimers();
    });
  });

  describe('Message.error', () => {
    it('should add error message', () => {
      act(() => {
        Message.error('Error message');
      });

      const { lastElementChild: rootElement } = document.body;
      const messageElement = rootElement?.firstElementChild as HTMLElement;

      expect(messageElement?.classList.contains(classes.severity('error'))).toBeTruthy();
      expect(messageElement?.textContent).toContain('Error message');
    });

    it('should render error icon', () => {
      act(() => {
        Message.error('Error message');
      });

      const { lastElementChild: rootElement } = document.body;
      const messageElement = rootElement?.firstElementChild as HTMLElement;
      const iconElement = messageElement.querySelector(
        `.${classes.icon}`,
      ) as HTMLElement;

      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        messageIcons.error.name,
      );
    });
  });

  describe('Message.info', () => {
    it('should add info message', () => {
      act(() => {
        Message.info('Info message');
      });

      const { lastElementChild: rootElement } = document.body;
      const messageElement = rootElement?.firstElementChild as HTMLElement;

      expect(messageElement?.classList.contains(classes.severity('info'))).toBeTruthy();
      expect(messageElement?.textContent).toContain('Info message');
    });

    it('should render info icon', () => {
      act(() => {
        Message.info('Info message');
      });

      const { lastElementChild: rootElement } = document.body;
      const messageElement = rootElement?.firstElementChild as HTMLElement;
      const iconElement = messageElement.querySelector(
        `.${classes.icon}`,
      ) as HTMLElement;

      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        messageIcons.info.name,
      );
    });

    it('should render close button for info message', () => {
      act(() => {
        Message.info('Info message');
      });

      const { lastElementChild: rootElement } = document.body;
      const messageElement = rootElement?.firstElementChild as HTMLElement;
      const closeButton = messageElement.querySelector(`.${classes.close}`);

      expect(closeButton).toBeTruthy();
    });
  });

  describe('Message.remove', () => {
    it('should remove message by reference', () => {
      let reference: Key;

      act(() => {
        reference = Message.info('Test message');
      });

      const { lastElementChild: rootElement } = document.body;

      expect(rootElement?.childElementCount).toBe(1);

      act(() => {
        Message.remove(reference);
      });

      expect(rootElement?.childElementCount).toBe(0);
    });
  });

  describe('Message.destroy', () => {
    it('should remove all messages and root', () => {
      act(() => {
        Message.info('Message 1');
      });

      act(() => {
        Message.warning('Message 2');
      });

      act(() => {
        Message.error('Message 3');
      });

      const { lastElementChild: rootElementBeforeDestroy } = document.body;

      expect(rootElementBeforeDestroy?.classList.contains(classes.root)).toBeTruthy();
      expect(rootElementBeforeDestroy?.childElementCount).toBe(3);

      act(() => {
        Message.destroy();
      });

      const rootAfterDestroy = document.body.querySelector(`.${classes.root}`);

      expect(rootAfterDestroy).toBeNull();
    });
  });

  describe('Message.config', () => {
    it('should update default duration', () => {
      jest.useFakeTimers();

      act(() => {
        Message.config({ duration: 2000 });
        Message.info('Test message');
      });

      const { lastElementChild: rootElement } = document.body;

      expect(rootElement?.childElementCount).toBe(1);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(rootElement?.childElementCount).toBe(0);

      jest.useRealTimers();
    });
  });

  describe('multiple messages', () => {
    it('should handle multiple messages simultaneously', () => {
      act(() => {
        Message.info('Info message');
      });

      act(() => {
        Message.warning('Warning message');
      });

      act(() => {
        Message.error('Error message');
      });

      const { lastElementChild: rootElement } = document.body;

      expect(rootElement?.classList.contains(classes.root)).toBeTruthy();
      expect(rootElement?.childElementCount).toBe(3);
    });
  });
});
