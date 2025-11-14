import { AlertBannerSeverity } from '@mezzanine-ui/core/alert-banner';
import { InfoFilledIcon } from '@mezzanine-ui/icons';
import { act } from 'react';
import AlertBanner from '.';
import { cleanup, fireEvent, render, waitFor } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { initializePortals, resetPortals } from '../Portal/portalRegistry';
import { AlertBannerComponent } from './AlertBanner';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() { }

  unobserve() { }

  disconnect() { }
} as any;

describe('<AlertBanner />', () => {
  beforeEach(() => {
    resetPortals();
    initializePortals();
  });

  afterEach(() => {
    act(() => {
      AlertBanner.destroy();
    });
    cleanup();
    resetPortals();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AlertBannerComponent ref={ref} disablePortal message="系統通知" severity="info" />),
  );

  describeHostElementClassNameAppendable('mzn-alert-banner', (className) =>
    render(
      <AlertBannerComponent
        className={className}
        disablePortal
        message="系統通知"
        severity="info"
      />,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <AlertBannerComponent disablePortal message="系統通知" severity="info" />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-alert-banner')).toBeTruthy();
  });

  it('should render message', () => {
    const { getHostHTMLElement, getByText } = render(
      <AlertBannerComponent
        disablePortal
        message="注意事項"
        severity="warning"
      />,
    );
    const element = getHostHTMLElement();

    expect(getByText('注意事項')).toBeInstanceOf(HTMLElement);
    expect(
      element.querySelector('.mzn-alert-banner__message'),
    ).toBeTruthy();
  });

  it('should provide accessibility attributes', () => {
    const { getHostHTMLElement } = render(<AlertBannerComponent disablePortal message="重要訊息" severity="error" />);
    const element = getHostHTMLElement();

    expect(element.getAttribute('role')).toBe('status');
    expect(element.getAttribute('aria-live')).toBe('polite');
  });

  describe('prop: severity', () => {
    const severities: AlertBannerSeverity[] = ['info', 'warning', 'error'];

    severities.forEach((severity) => {
      it(`should append severity class when severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(
          <AlertBannerComponent disablePortal message="狀態通知" severity={severity} />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-alert-banner--${severity}`),
        ).toBeTruthy();
      });

      it(`should render default icon for severity="${severity}"`, () => {
        const { getHostHTMLElement } = render(
          <AlertBannerComponent disablePortal message="狀態通知" severity={severity} />,
        );
        const element = getHostHTMLElement();
        const iconElement = element.querySelector('.mzn-alert-banner__icon');

        expect(iconElement).toBeTruthy();
      });
    });
  });

  describe('prop: icon', () => {
    it('should render custom icon when provided', () => {
      const { getHostHTMLElement } = render(
        <AlertBannerComponent
          disablePortal
          icon={InfoFilledIcon}
          message="自訂圖示"
          severity="info"
        />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-alert-banner__icon');

      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        InfoFilledIcon.name,
      );
    });
  });

  describe('prop: actions', () => {
    it('should render actions container when actions provided', () => {
      const { getHostHTMLElement, getByText } = render(
        <AlertBannerComponent
          actions={[
            {
              content: '了解更多',
              onClick: () => { },
            },
          ]}
          disablePortal
          message="系統更新"
          severity="info"
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.querySelector('.mzn-alert-banner__actions'),
      ).toBeTruthy();
      expect(getByText('了解更多')).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('prop: onClose', () => {
    it('should render close button when onClose provided', () => {
      const { getHostHTMLElement } = render(
        <AlertBannerComponent disablePortal message="可關閉訊息" onClose={() => { }} severity="info" />,
      );
      const element = getHostHTMLElement();
      const closeButton = element.querySelector(
        '.mzn-alert-banner__close',
      ) as HTMLButtonElement | null;

      expect(closeButton).toBeInstanceOf(HTMLButtonElement);
      expect(
        closeButton?.classList.contains('mzn-dismiss-button--variant-inverse'),
      ).toBeTruthy();
    });

    it('should call onClose and hide banner when close button clicked', () => {
      const onClose = jest.fn();
      const { container, getByRole } = render(
        <AlertBannerComponent disablePortal message="可關閉訊息" onClose={onClose} severity="info" />,
      );

      fireEvent.click(getByRole('button', { name: 'Close' }));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(container.querySelector('.mzn-alert-banner')).toBeNull();
    });
  });

  describe('sorting logic', () => {
    const getAlertContainer = () => {
      const containers = document.querySelectorAll('#mzn-alert-container');

      return containers[containers.length - 1] as HTMLElement | null;
    };

    const getBannersInOrder = () => {
      const alertContainer = getAlertContainer();
      const group = alertContainer?.querySelector('.mzn-alert-banner-group');

      if (!group) {
        return [];
      }

      return Array.from(group.querySelectorAll('.mzn-alert-banner'));
    };

    const getBannerSeverity = (banner: Element) => {
      if (banner.classList.contains('mzn-alert-banner--error')) {
        return 'error';
      }

      if (banner.classList.contains('mzn-alert-banner--warning')) {
        return 'warning';
      }

      if (banner.classList.contains('mzn-alert-banner--info')) {
        return 'info';
      }

      return null;
    };

    it('should prioritize error and warning over info', async () => {
      act(() => {
        AlertBanner.info('Info message');
      });

      await waitFor(() => {
        const banners = getBannersInOrder();

        expect(banners.length).toBe(1);
      });

      act(() => {
        AlertBanner.error('Error message');
      });

      await waitFor(() => {
        const banners = getBannersInOrder();

        expect(banners.length).toBe(2);
      });

      const banners = getBannersInOrder();

      // Error should come before info
      expect(getBannerSeverity(banners[0])).toBe('error');
      expect(getBannerSeverity(banners[1])).toBe('info');
    });

    it('should sort same priority notifiers by createdAt (newest first)', async () => {
      const baseTime = Date.now();

      act(() => {
        AlertBanner.add({
          message: 'Error 1',
          severity: 'error',
          createdAt: baseTime,
        });
      });

      await waitFor(() => {
        const banners = getBannersInOrder();

        expect(banners.length).toBe(1);
      });

      act(() => {
        AlertBanner.add({
          message: 'Error 2',
          severity: 'error',
          createdAt: baseTime + 100,
        });
      });

      await waitFor(() => {
        const banners = getBannersInOrder();

        expect(banners.length).toBe(2);
      });

      const banners = getBannersInOrder();

      // Newer error should come first
      expect(banners[0].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
        'Error 2',
      );
      expect(banners[1].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
        'Error 1',
      );
    });

    describe('step-by-step scenarios', () => {
      it('step 1: should display info banner when info is added', async () => {
        act(() => {
          AlertBanner.info('Info message');
        });

        await waitFor(() => {
          const banners = getBannersInOrder();

          expect(banners.length).toBe(1);
        });

        const banners = getBannersInOrder();

        expect(getBannerSeverity(banners[0])).toBe('info');
        expect(banners[0].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
          'Info message',
        );
      });

      it('step 2: error should appear before info when added after info', async () => {
        act(() => {
          AlertBanner.info('Info message');
        });

        await waitFor(() => {
          const banners = getBannersInOrder();

          expect(banners.length).toBe(1);
        });

        act(() => {
          AlertBanner.error('Error message');
        });

        await waitFor(() => {
          const banners = getBannersInOrder();

          expect(banners.length).toBe(2);
        });

        const banners = getBannersInOrder();

        // Error should be first, info second
        expect(getBannerSeverity(banners[0])).toBe('error');
        expect(getBannerSeverity(banners[1])).toBe('info');
      });

      it('step 3: warning should appear before error and info when added', async () => {
        act(() => {
          AlertBanner.info('Info message');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(1);
        });

        act(() => {
          AlertBanner.error('Error message');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(2);
        });

        act(() => {
          AlertBanner.warning('Warning message');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(3);
        });

        const banners = getBannersInOrder();

        // Order should be: warning, error, info
        expect(getBannerSeverity(banners[0])).toBe('warning');
        expect(getBannerSeverity(banners[1])).toBe('error');
        expect(getBannerSeverity(banners[2])).toBe('info');
      });

      it('step 4: new error should appear before older warning and error', async () => {
        act(() => {
          AlertBanner.info('Info message');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(1);
        });

        act(() => {
          AlertBanner.error('Error message 1');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(2);
        });

        act(() => {
          AlertBanner.warning('Warning message');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(3);
        });

        act(() => {
          AlertBanner.error('Error message 2');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(4);
        });

        const banners = getBannersInOrder();

        // Order should be: error (new), warning, error (old), info
        expect(getBannerSeverity(banners[0])).toBe('error');
        expect(banners[0].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
          'Error message 2',
        );
        expect(getBannerSeverity(banners[1])).toBe('warning');
        expect(getBannerSeverity(banners[2])).toBe('error');
        expect(banners[2].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
          'Error message 1',
        );
        expect(getBannerSeverity(banners[3])).toBe('info');
      });

      it('step 5: new info should appear after all error/warning but before old info', async () => {
        act(() => {
          AlertBanner.info('Info message 1');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(1);
        });

        act(() => {
          AlertBanner.error('Error message 1');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(2);
        });

        act(() => {
          AlertBanner.warning('Warning message');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(3);
        });

        act(() => {
          AlertBanner.error('Error message 2');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(4);
        });

        act(() => {
          AlertBanner.info('Info message 2');
        });

        await waitFor(() => {
          const alertContainer = getAlertContainer();
          const group = alertContainer?.querySelector('.mzn-alert-banner-group');
          const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

          expect(banners.length).toBe(5);
        });

        const banners = getBannersInOrder();

        // Order should be: error, warning, error, info (new), info (old)
        expect(getBannerSeverity(banners[0])).toBe('error');
        expect(banners[0].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
          'Error message 2',
        );
        expect(getBannerSeverity(banners[1])).toBe('warning');
        expect(getBannerSeverity(banners[2])).toBe('error');
        expect(banners[2].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
          'Error message 1',
        );
        expect(getBannerSeverity(banners[3])).toBe('info');
        expect(banners[3].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
          'Info message 2',
        );
        expect(getBannerSeverity(banners[4])).toBe('info');
        expect(banners[4].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
          'Info message 1',
        );
      });
    });

    it('should maintain priority when multiple banners of same type are added', async () => {
      act(() => {
        AlertBanner.info('Info 1', { key: 'info-1' });
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const group = alertContainer?.querySelector('.mzn-alert-banner-group');
        const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

        expect(banners.length).toBe(1);
      });

      act(() => {
        AlertBanner.info('Info 2', { key: 'info-2' });
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const group = alertContainer?.querySelector('.mzn-alert-banner-group');
        const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

        expect(banners.length).toBe(2);
      });

      act(() => {
        AlertBanner.info('Info 3', { key: 'info-3' });
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const group = alertContainer?.querySelector('.mzn-alert-banner-group');
        const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

        expect(banners.length).toBe(3);
      });

      act(() => {
        AlertBanner.error('Error 1', { key: 'error-1' });
      });

      await waitFor(() => {
        const alertContainer = getAlertContainer();
        const group = alertContainer?.querySelector('.mzn-alert-banner-group');
        const banners = group?.querySelectorAll('.mzn-alert-banner') || [];

        expect(banners.length).toBe(4);
      });

      const banners = getBannersInOrder();

      // Error should be first, then all info banners (newest first)
      expect(getBannerSeverity(banners[0])).toBe('error');
      expect(getBannerSeverity(banners[1])).toBe('info');
      expect(banners[1].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
        'Info 3',
      );
      expect(getBannerSeverity(banners[2])).toBe('info');
      expect(banners[2].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
        'Info 2',
      );
      expect(getBannerSeverity(banners[3])).toBe('info');
      expect(banners[3].querySelector('.mzn-alert-banner__message')?.textContent).toBe(
        'Info 1',
      );
    });
  });
});


