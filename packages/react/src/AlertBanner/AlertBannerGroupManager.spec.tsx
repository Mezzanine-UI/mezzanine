import { AlertBannerSeverity } from '@mezzanine-ui/core/alert-banner';
import { createRef, Key } from 'react';
import { act, cleanup, render, waitFor } from '../../__test-utils__';
import type { NotifierController } from '../Notifier/NotifierManager';
import { initializePortals, resetPortals } from '../Portal/portalRegistry';
import type { AlertBannerData } from './AlertBanner';
import AlertBannerGroupManager from './AlertBannerGroupManager';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() { }

  unobserve() { }

  disconnect() { }
} as any;

type AlertBannerNotifier = AlertBannerData &
  Required<Pick<AlertBannerData, 'createdAt'>> & { key: Key };

const createMockNotifier = (
  key: Key,
  severity: AlertBannerSeverity,
  createdAt: number,
): AlertBannerNotifier => ({
  key,
  message: `${severity} message`,
  severity,
  createdAt,
});

const mockRender = (notifier: AlertBannerNotifier) => (
  <div data-testid={`banner-${notifier.key}`}>{notifier.message}</div>
);

const getAlertContainer = () => {
  const containers = document.querySelectorAll('#mzn-alert-container');

  return containers[containers.length - 1] as HTMLElement | null;
};

describe('<AlertBannerGroupManager />', () => {
  beforeEach(() => {
    // Clean up any existing portal containers
    document.getElementById('mzn-alert-container')?.remove();
    document.getElementById('mzn-portal-container')?.remove();
    resetPortals();
    initializePortals();
  });

  afterEach(() => {
    cleanup();
    // Clean up any existing portal containers
    document.getElementById('mzn-alert-container')?.remove();
    document.getElementById('mzn-portal-container')?.remove();
    resetPortals();
  });

  it('should return null when no notifiers are displayed', () => {
    const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();

    const { container } = render(
      <AlertBannerGroupManager
        controllerRef={controllerRef}
        maxCount={undefined}
        render={mockRender}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render notifiers with defaultNotifiers', async () => {
    const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
    const now = Date.now();

    const defaultNotifiers: AlertBannerNotifier[] = [
      createMockNotifier('1', 'info', now),
      createMockNotifier('2', 'error', now + 1),
    ];

    render(
      <AlertBannerGroupManager
        controllerRef={controllerRef}
        defaultNotifiers={defaultNotifiers}
        maxCount={undefined}
        render={mockRender}
      />,
    );

    await waitFor(() => {
      const alertContainer = getAlertContainer();
      const banner1 = alertContainer?.querySelector('[data-testid="banner-1"]');
      const banner2 = alertContainer?.querySelector('[data-testid="banner-2"]');

      expect(banner1).toBeInstanceOf(HTMLElement);
      expect(banner2).toBeInstanceOf(HTMLElement);
    });
  });

  describe('sorting logic', () => {
    it('should prioritize error and warning over info', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
      const now = Date.now();

      const defaultNotifiers: AlertBannerNotifier[] = [
        createMockNotifier('1', 'info', now),
        createMockNotifier('2', 'error', now + 1),
        createMockNotifier('3', 'warning', now + 2),
      ];

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          defaultNotifiers={defaultNotifiers}
          maxCount={undefined}
          render={mockRender}
        />,
      );

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(3);
      });

      const alertContainer = getAlertContainer();
      const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

      // Error and warning should come before info, and within same priority, newest first
      // banner-3 (warning, now + 2) should come before banner-2 (error, now + 1)
      expect(banners?.[0].getAttribute('data-testid')).toBe('banner-3'); // warning (newest, now + 2)
      expect(banners?.[1].getAttribute('data-testid')).toBe('banner-2'); // error (now + 1)
      expect(banners?.[2].getAttribute('data-testid')).toBe('banner-1'); // info
    });

    it('should sort same priority notifiers by createdAt (newest first)', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
      const now = Date.now();

      const defaultNotifiers: AlertBannerNotifier[] = [
        createMockNotifier('1', 'error', now),
        createMockNotifier('2', 'error', now + 100),
        createMockNotifier('3', 'error', now + 50),
      ];

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          defaultNotifiers={defaultNotifiers}
          maxCount={undefined}
          render={mockRender}
        />,
      );

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(3);
      });

      const alertContainer = getAlertContainer();
      const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

      // Should be sorted by createdAt descending (newest first)
      expect(banners?.[0].getAttribute('data-testid')).toBe('banner-2'); // now + 100
      expect(banners?.[1].getAttribute('data-testid')).toBe('banner-3'); // now + 50
      expect(banners?.[2].getAttribute('data-testid')).toBe('banner-1'); // now
    });

    it('should maintain priority order when adding new notifiers', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
      const now = Date.now();

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          defaultNotifiers={[createMockNotifier('1', 'info', now)]}
          maxCount={undefined}
          render={mockRender}
        />,
      );

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banner1 = alertContainer?.querySelector('[data-testid="banner-1"]');

        expect(banner1).toBeInstanceOf(HTMLElement);
      });

      act(() => {
        controllerRef.current?.add(createMockNotifier('2', 'error', now + 1));
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(2);
      });

      const alertContainer = getAlertContainer();
      const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

      // Error should come before info
      expect(banners?.[0].getAttribute('data-testid')).toBe('banner-2'); // error
      expect(banners?.[1].getAttribute('data-testid')).toBe('banner-1'); // info
    });
  });

  describe('controller.add', () => {
    it('should add new notifier', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          maxCount={undefined}
          render={mockRender}
        />,
      );

      act(() => {
        controllerRef.current?.add(createMockNotifier('1', 'info', Date.now()));
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banner1 = alertContainer?.querySelector('[data-testid="banner-1"]');

        expect(banner1).toBeInstanceOf(HTMLElement);
      });
    });

    it('should update existing notifier with same key', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
      const now = Date.now();

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          defaultNotifiers={[createMockNotifier('1', 'info', now)]}
          maxCount={undefined}
          render={mockRender}
        />,
      );

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banner1 = alertContainer?.querySelector('[data-testid="banner-1"]');

        expect(banner1).toBeInstanceOf(HTMLElement);
        expect(banner1?.textContent).toBe('info message');
      });

      act(() => {
        controllerRef.current?.add({
          ...createMockNotifier('1', 'error', now),
          message: 'updated message',
        });
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banner1 = alertContainer?.querySelector('[data-testid="banner-1"]');
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(1);
        expect(banner1?.textContent).toBe('updated message');
      });
    });

    it('should queue notifiers when maxCount is reached', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
      const now = Date.now();

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          defaultNotifiers={[
            createMockNotifier('1', 'info', now),
            createMockNotifier('2', 'info', now + 1),
          ]}
          maxCount={2}
          render={mockRender}
        />,
      );

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(2);
      });

      act(() => {
        controllerRef.current?.add(createMockNotifier('3', 'error', now + 2));
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        // Should still be 2, new one should be queued
        expect(banners?.length).toBe(2);
      });

      // Remove one to make space
      act(() => {
        controllerRef.current?.remove('1');
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        // Queued notifier should now be displayed
        expect(banners?.length).toBe(2);
      });

      const alertContainer = getAlertContainer();
      const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

      expect(banners?.[0].getAttribute('data-testid')).toBe('banner-3'); // error (queued)
      expect(banners?.[1].getAttribute('data-testid')).toBe('banner-2'); // info
    });
  });

  describe('controller.remove', () => {
    it('should remove notifier by key', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
      const now = Date.now();

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          defaultNotifiers={[
            createMockNotifier('1', 'info', now),
            createMockNotifier('2', 'error', now + 1),
          ]}
          maxCount={undefined}
          render={mockRender}
        />,
      );

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(2);
      });

      act(() => {
        controllerRef.current?.remove('1');
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(1);
      });

      const alertContainer = getAlertContainer();
      const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

      expect(banners?.[0].getAttribute('data-testid')).toBe('banner-2');
    });

    it('should remove notifier from queue if it exists there', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
      const now = Date.now();

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          defaultNotifiers={[
            createMockNotifier('1', 'info', now),
            createMockNotifier('2', 'info', now + 1),
          ]}
          maxCount={2}
          render={mockRender}
        />,
      );

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(2);
      });

      act(() => {
        controllerRef.current?.add(createMockNotifier('3', 'error', now + 2));
      });

      // Remove queued notifier
      act(() => {
        controllerRef.current?.remove('3');
      });

      // Remove one displayed to check queue
      act(() => {
        controllerRef.current?.remove('1');
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        // Should only have banner-2, banner-3 should not appear
        expect(banners?.length).toBe(1);
      });

      const alertContainer = getAlertContainer();
      const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

      expect(banners?.[0].getAttribute('data-testid')).toBe('banner-2');
    });
  });

  describe('maxCount', () => {
    it('should respect maxCount limit', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
      const now = Date.now();

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          maxCount={2}
          render={mockRender}
        />,
      );

      act(() => {
        controllerRef.current?.add(createMockNotifier('1', 'info', now));
        controllerRef.current?.add(createMockNotifier('2', 'info', now + 1));
        controllerRef.current?.add(createMockNotifier('3', 'error', now + 2));
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(2);
      });

      const alertContainer = getAlertContainer();
      const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

      // Error should be prioritized, so it should be displayed
      // banner-3 (error, now + 2) should come before banner-2 (info, now + 1)
      expect(banners?.[0].getAttribute('data-testid')).toBe('banner-3'); // error (newest, now + 2)
      expect(banners?.[1].getAttribute('data-testid')).toBe('banner-2'); // info (now + 1)
    });

    it('should display queued notifiers when space becomes available', async () => {
      const controllerRef = createRef<NotifierController<AlertBannerNotifier>>();
      const now = Date.now();

      render(
        <AlertBannerGroupManager
          controllerRef={controllerRef}
          defaultNotifiers={[
            createMockNotifier('1', 'info', now),
            createMockNotifier('2', 'info', now + 1),
          ]}
          maxCount={2}
          render={mockRender}
        />,
      );

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(2);
      });

      act(() => {
        controllerRef.current?.add(createMockNotifier('3', 'error', now + 2));
        controllerRef.current?.add(createMockNotifier('4', 'warning', now + 3));
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        expect(banners?.length).toBe(2);
      });

      // Remove one to make space
      act(() => {
        controllerRef.current?.remove('1');
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

        // One queued notifier should now be displayed
        expect(banners?.length).toBe(2);
      });

      const alertContainer = getAlertContainer();
      const banners = alertContainer?.querySelectorAll('[data-testid^="banner-"]');

      // Initial: '1' (info, now) and '2' (info, now+1)
      // After adding '3' (error, now+2): error replaces one info, so we have '3' (error) and '2' (info), '1' goes to queue
      // After adding '4' (warning, now+3): warning replaces '2' (info), so we have '3' (error) and '4' (warning), '2' goes to queue
      // After removing '1': '1' was in queue, so display stays '3' (error) and '4' (warning)
      // But wait, when we add '3' and '4' together, they both have priority 0, so they should be sorted by createdAt (newest first)
      // So '4' (warning, now+3) should come before '3' (error, now+2)
      expect(banners?.length).toBe(2);
      expect(banners?.[0].getAttribute('data-testid')).toBe('banner-4'); // warning (newest, now+3)
      expect(banners?.[1].getAttribute('data-testid')).toBe('banner-3'); // error (now+2)
    });
  });
});

