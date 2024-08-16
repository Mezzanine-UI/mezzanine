import { Key, act } from 'react';
import { cleanup, cleanupHook } from '../../__test-utils__';
import { createNotifier, Notifier, NotifierData, RenderNotifier } from '.';

interface MockRendererProps extends NotifierData {
  testString?: string;
  reference?: Key;
}

const testRenderId = 'mock-render';

const mockRender: RenderNotifier<MockRendererProps> = ({
  children,
  duration,
  testString,
  reference,
}) => (
  <div
    key={reference}
    id={testRenderId}
    data-test-duration={duration}
    data-test-extensible={testString}
  >
    {children}
  </div>
);

function expectCommonBehavior(notifier: Notifier<NotifierData>) {
  afterEach(() => {
    act(() => {
      notifier.destroy();
    });
  });

  it('should return methods', () => {
    const { add, remove, destroy, config, getConfig } = notifier;

    expect(add).toBeInstanceOf(Function);
    expect(remove).toBeInstanceOf(Function);
    expect(destroy).toBeInstanceOf(Function);
    expect(config).toBeInstanceOf(Function);
    expect(getConfig).toBeInstanceOf(Function);
  });

  it('should be able to add and remove notifications from a div of the last child of body', () => {
    const { add, remove } = notifier;

    let key: Key;

    act(() => {
      key = add({
        children: 'foo',
      });
    });

    const notifierRootElement = document.body.lastChild;
    const targetElement = notifierRootElement?.childNodes.item(0);

    expect(targetElement?.textContent).toBe('foo');

    act(() => {
      remove(key);
    });

    expect(notifierRootElement?.nodeName.toLowerCase()).toBe('div');
    expect(notifierRootElement?.childNodes.length).toBe(0);
  });

  it('should be able to stack notifications', () => {
    const { add } = notifier;

    const testCount = 99;

    for (let i = 0; i < testCount; i += 1) {
      act(() => {
        add({
          children: 'foo',
          key: `${i}`,
        });
      });

      const notifierElement = document.body.lastElementChild;

      expect(notifierElement?.children.length).toBe(i + 1);
    }

    const notifierElement = document.body.lastElementChild;

    expect(notifierElement?.children.length).toBe(testCount);
  });

  it('should replace old message with newer one at the same index if both having the same key', () => {
    const beforeKey = 'foo';
    const mockMessages = ['1', beforeKey, '2'];

    const targetIndex = mockMessages.indexOf(beforeKey);

    const { add } = notifier;

    mockMessages.forEach((key) => {
      act(() => {
        add({
          children: key,
          key,
        });
      });
    });

    const notifierElement = document.body.lastElementChild;

    const beforeTarget = notifierElement?.children[targetIndex];

    expect(beforeTarget?.textContent).toBe(beforeKey);
    expect(notifierElement?.children.length).toBe(mockMessages.length);

    const afterKey = 'bar';

    act(() => {
      add({
        children: afterKey,
        key: beforeKey,
      });
    });

    const afterTarget = notifierElement?.children[targetIndex];

    expect(afterTarget?.textContent).toBe(afterKey);
    expect(notifierElement?.children.length).toBe(mockMessages.length);
  });

  it('should be able to destory the notifier root', () => {
    const { add, destroy } = notifier;

    act(() => {
      add({
        children: 'foo',
      });
    });

    const notifierRootElement = document.body.lastChild;

    expect(notifierRootElement?.childNodes.item(0).textContent).toBe('foo');

    act(() => {
      destroy();
    });

    expect(document.body.childNodes.item(0)).toBe(null);
  });

  it('should be able to add again after destroying the notifier', () => {
    const { add, destroy } = notifier;

    const testTimes = 5;

    for (let i = 0; i < testTimes; i += 1) {
      act(() => {
        add({
          children: 'foo',
          key: `${i}`,
        });
      });

      const notifierRootElement = document.body.lastChild;

      expect(notifierRootElement?.childNodes.item(0).textContent).toBe('foo');

      act(() => {
        destroy();
      });

      expect(document.body.childNodes.item(0)).toBe(null);

      act(() => {
        add({
          children: 'foo',
        });
      });

      expect(notifierRootElement?.childNodes.item(0).textContent).toBe('foo');
    }
  });

  it('should be able to configure', () => {
    const maxCount = 3;

    const { add, config } = notifier;

    config({
      maxCount,
    });

    for (let i = 0; i < maxCount + 10; i += 1) {
      act(() => {
        add({
          children: 'foo',
          key: `${i}`,
        });
      });
    }

    const notifierRootElement = document.body.lastElementChild;

    expect(notifierRootElement?.childElementCount).toBe(maxCount);
  });

  it('should be able to get configurations', () => {
    const maxCount = 3;
    const duration = 2;

    const { config, getConfig } = notifier;

    config({
      maxCount,
      duration,
    });

    const { maxCount: returnedMaxCount, duration: returnedDuration } =
      getConfig();

    expect(returnedMaxCount).toEqual(maxCount);
    expect(returnedDuration).toEqual(duration);
  });
}

describe('createNotifier()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
    document.body.innerHTML = '';
  });

  it('should be safe to invoke remove before add is called', () => {
    const notifier = createNotifier<MockRendererProps>({
      render: mockRender,
    });

    const removeSpy = jest.spyOn(notifier, 'remove');

    act(() => {
      notifier.remove('foo');
    });

    expect(removeSpy).toBeCalledWith('foo');

    act(() => {
      notifier.destroy();
    });
  });

  describe('without configs', () => {
    type TestNotifierData = NotifierData & {
      reference?: Key;
    };
    const notifier = createNotifier<TestNotifierData>({
      render: mockRender,
    });

    expectCommonBehavior(notifier);
  });

  describe('prop: duration', () => {
    const testDuration = 3;

    it('should be passed to render result', () => {
      const notifier = createNotifier({
        duration: testDuration,
        render: mockRender,
      });

      act(() => {
        notifier.add({
          children: 'foo',
        });
      });

      const notifierRootElement = document.body.lastElementChild;
      const messageElement = notifierRootElement?.firstElementChild;

      expect(messageElement?.tagName.toLowerCase()).toBe('div');
      expect(messageElement?.textContent).toBe('foo');
      expect(messageElement?.getAttribute('id')).toBe(testRenderId);
      expect(messageElement?.getAttribute('data-test-duration')).toBe(
        `${testDuration}`,
      );
    });
  });

  describe('prop: render', () => {
    const testDuration = 3;
    const testExtensibleString = 'bar';

    describe('passing render props', () => {
      const notifier = createNotifier({
        render: mockRender,
      });

      it('should have render result under root after message added', () => {
        act(() => {
          notifier.add({
            children: 'foo',
            duration: testDuration,
          });
        });

        const notifierRootElement = document.body.lastElementChild;
        const messageElement = notifierRootElement?.firstElementChild;

        expect(messageElement?.tagName.toLowerCase()).toBe('div');
        expect(messageElement?.textContent).toBe('foo');
        expect(messageElement?.getAttribute('id')).toBe(testRenderId);
        expect(messageElement?.getAttribute('data-test-duration')).toBe(
          `${testDuration}`,
        );
      });
    });

    describe('message can be extensible', () => {
      const notifier = createNotifier<MockRendererProps>({
        render: mockRender,
      });

      it('passing extended message to renderer', () => {
        act(() => {
          notifier.add({
            children: 'foo',
            testString: testExtensibleString,
          });
        });

        const notifierRootElement = document.body.lastElementChild;
        const messageElement = notifierRootElement?.firstElementChild;

        expect(messageElement?.tagName.toLowerCase()).toBe('div');
        expect(messageElement?.textContent).toBe('foo');
        expect(messageElement?.getAttribute('id')).toBe(testRenderId);
        expect(messageElement?.getAttribute('data-test-extensible')).toBe(
          testExtensibleString,
        );
      });
    });

    describe('common behaviors', () => {
      const notifier = createNotifier({
        render: mockRender,
      });

      expectCommonBehavior(notifier);
    });
  });

  describe('prop: setRoot', () => {
    describe('should render given root', () => {
      const testId = 'foo';
      const testClass = 'bar';

      const notifier = createNotifier({
        render: mockRender,
        setRoot: (root) => {
          root.setAttribute('id', testId);
          root.setAttribute('class', testClass);
        },
      });

      it('should find attributes at root', () => {
        act(() => {
          notifier.add({
            children: 'foo',
          });
        });

        const notifierRootElement = document.body.lastElementChild;

        expect(notifierRootElement?.getAttribute('id')).toBe(testId);
        expect(notifierRootElement?.getAttribute('class')).toBe(testClass);
      });
    });

    describe('common behaviors', () => {
      const testId = 'foo';
      const testClass = 'bar';

      const notifier = createNotifier({
        render: mockRender,
        setRoot: (root) => {
          root.setAttribute('id', testId);
          root.setAttribute('class', testClass);
        },
      });

      expectCommonBehavior(notifier);
    });
  });

  describe('prop: maxCount', () => {
    it('should be passed to Notification Controller and controlls notifications count', () => {
      const maxCount = 3;

      const notifier = createNotifier({
        maxCount,
        render: mockRender,
      });

      for (let i = 0; i < maxCount + 10; i += 1) {
        act(() => {
          notifier.add({
            children: 'foo',
            key: `${i}`,
          });
        });
      }

      const notifierRootElement = document.body.lastElementChild;

      expect(notifierRootElement?.childElementCount).toBe(maxCount);
    });
  });
});
