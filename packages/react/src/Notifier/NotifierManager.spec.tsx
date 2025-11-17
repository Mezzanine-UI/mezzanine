import { createRef, Key, type ReactNode } from 'react';
import { act, cleanup, render, waitFor } from '../../__test-utils__';
import NotifierManager, {
  type NotifierController,
} from './NotifierManager';
import type { NotifierData } from './typings';

interface TestNotifier extends NotifierData {
  createdAt: number;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

type TestNotifierWithKey = TestNotifier & { key: Key };

const renderContainer = (children: ReactNode) => (
  <div data-testid="manager-container">{children}</div>
);

const mockRender = (notifier: TestNotifierWithKey) => (
  <div data-testid={`banner-${notifier.key}`}>{notifier.message}</div>
);

function getPriority(severity: TestNotifier['severity']) {
  if (severity === 'info') {
    return 1;
  }

  return 0;
}

const sortTestNotifiers = (notifiers: TestNotifierWithKey[]) =>
  [...notifiers].sort((a, b) => {
    const priorityDiff = getPriority(a.severity) - getPriority(b.severity);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    if (a.createdAt !== b.createdAt) {
      return b.createdAt - a.createdAt;
    }

    return 0;
  });

const createMockNotifier = (
  key: Key,
  severity: TestNotifier['severity'],
  createdAt: number,
): TestNotifierWithKey => ({
  createdAt,
  key,
  message: `${severity} message`,
  severity,
});

const getManagerContainer = () =>
  document.querySelector('[data-testid="manager-container"]');

const getRenderedBanners = () =>
  getManagerContainer()?.querySelectorAll('[data-testid^="banner-"]') ?? [];

describe('<NotifierManager />', () => {
  afterEach(() => {
    cleanup();
  });

  it('should return null when no notifiers are displayed', () => {
    const controllerRef = createRef<NotifierController<TestNotifier>>();

    render(
      <NotifierManager<TestNotifier>
        controllerRef={controllerRef}
        render={mockRender}
        renderContainer={renderContainer}
        sortBeforeUpdate={sortTestNotifiers}
      />,
    );

    expect(getManagerContainer()).toBeNull();
  });

  it('should render default notifiers with sorting applied', async () => {
    const controllerRef = createRef<NotifierController<TestNotifier>>();
    const now = Date.now();

    render(
      <NotifierManager<TestNotifier>
        controllerRef={controllerRef}
        defaultNotifiers={[
          createMockNotifier('1', 'info', now),
          createMockNotifier('2', 'error', now + 1),
          createMockNotifier('3', 'warning', now + 2),
        ]}
        render={mockRender}
        renderContainer={renderContainer}
        sortBeforeUpdate={sortTestNotifiers}
      />,
    );

    await waitFor(() => {
      expect(getRenderedBanners().length).toBe(3);
    });

    const banners = getRenderedBanners();

    expect(banners[0].getAttribute('data-testid')).toBe('banner-3');
    expect(banners[1].getAttribute('data-testid')).toBe('banner-2');
    expect(banners[2].getAttribute('data-testid')).toBe('banner-1');
  });

  it('should update existing notifier when key matches', async () => {
    const controllerRef = createRef<NotifierController<TestNotifier>>();
    const now = Date.now();

    render(
      <NotifierManager<TestNotifier>
        controllerRef={controllerRef}
        defaultNotifiers={[createMockNotifier('1', 'info', now)]}
        render={mockRender}
        renderContainer={renderContainer}
        sortBeforeUpdate={sortTestNotifiers}
      />,
    );

    await waitFor(() => {
      expect(getRenderedBanners().length).toBe(1);
    });

    act(() => {
      controllerRef.current?.add({
        ...createMockNotifier('1', 'error', now),
        message: 'updated message',
      });
    });

    await waitFor(() => {
      const banners = getRenderedBanners();

      expect(banners.length).toBe(1);
      expect(banners[0].textContent).toBe('updated message');
    });
  });

  it('should prioritize notifiers based on severity and createdAt when adding new ones', async () => {
    const controllerRef = createRef<NotifierController<TestNotifier>>();
    const now = Date.now();

    render(
      <NotifierManager<TestNotifier>
        controllerRef={controllerRef}
        defaultNotifiers={[createMockNotifier('1', 'info', now)]}
        render={mockRender}
        renderContainer={renderContainer}
        sortBeforeUpdate={sortTestNotifiers}
      />,
    );

    await waitFor(() => {
      expect(getRenderedBanners().length).toBe(1);
    });

    act(() => {
      controllerRef.current?.add(createMockNotifier('2', 'error', now + 1));
      controllerRef.current?.add(createMockNotifier('3', 'warning', now + 2));
    });

    await waitFor(() => {
      expect(getRenderedBanners().length).toBe(3);
    });

    const banners = getRenderedBanners();

    expect(banners[0].getAttribute('data-testid')).toBe('banner-3');
    expect(banners[1].getAttribute('data-testid')).toBe('banner-2');
    expect(banners[2].getAttribute('data-testid')).toBe('banner-1');
  });

  it('should queue notifiers when maxCount is reached and display them when space becomes available', async () => {
    const controllerRef = createRef<NotifierController<TestNotifier>>();
    const now = Date.now();

    render(
      <NotifierManager<TestNotifier>
        controllerRef={controllerRef}
        defaultNotifiers={[
          createMockNotifier('1', 'info', now),
          createMockNotifier('2', 'info', now + 1),
        ]}
        maxCount={2}
        render={mockRender}
        renderContainer={renderContainer}
        sortBeforeUpdate={sortTestNotifiers}
      />,
    );

    await waitFor(() => {
      expect(getRenderedBanners().length).toBe(2);
    });

    act(() => {
      controllerRef.current?.add(createMockNotifier('3', 'error', now + 2));
    });

    await waitFor(() => {
      const banners = getRenderedBanners();

      expect(banners.length).toBe(2);
      expect(banners[0].getAttribute('data-testid')).toBe('banner-3');
      expect(banners[1].getAttribute('data-testid')).toBe('banner-2');
    });

    act(() => {
      controllerRef.current?.remove('2');
    });

    await waitFor(() => {
      const banners = getRenderedBanners();

      expect(banners.length).toBe(2);
      expect(
        Array.from(banners).map((banner) => banner.getAttribute('data-testid')),
      ).toEqual(['banner-3', 'banner-1']);
    });
  });
});

