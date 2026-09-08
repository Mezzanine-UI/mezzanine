import { flushPromises, mount } from '@vue/test-utils';
import {
  alertBannerClasses as classes,
  alertBannerGroupClasses,
  alertBannerIcons,
} from '@mezzanine-ui/core/alert-banner';
import type { AlertBannerSeverity } from '@mezzanine-ui/core/alert-banner';
import { PlusIcon } from '@mezzanine-ui/icons';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import { alertBanner } from './alert-banner';
import MznAlertBanner from './alert-banner.vue';
import type { AlertBannerProps } from './alert-banner.types';

const severities: AlertBannerSeverity[] = ['error', 'info', 'warning'];

function mountBanner(props?: Partial<AlertBannerProps>) {
  return mount(MznAlertBanner, {
    attachTo: document.body,
    props: {
      disablePortal: true,
      message: '系統通知',
      severity: 'info' as const,
      ...props,
    },
  });
}

describe('<MznAlertBanner />', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should bind host class', () => {
    const wrapper = mountBanner();

    expect(wrapper.get(`.${classes.host}`).classes()).toContain(
      classes.severity('info'),
    );
  });

  it('should append class name on host element', () => {
    const wrapper = mount(MznAlertBanner, {
      attachTo: document.body,
      attrs: { class: 'foo' },
      props: { disablePortal: true, message: '系統通知', severity: 'info' },
    });
    const host = wrapper.get(`.${classes.host}`);

    expect(host.classes()).toContain('foo');
    expect(host.classes()).toContain(classes.host);
  });

  it('should render message', () => {
    const wrapper = mountBanner({ message: '系統將於今晚維護' });

    expect(wrapper.get(`.${classes.message}`).text()).toBe('系統將於今晚維護');
  });

  it('should provide accessibility attributes', () => {
    const host = mountBanner().get(`.${classes.host}`);

    expect(host.attributes('role')).toBe('status');
    expect(host.attributes('aria-live')).toBe('polite');
  });

  describe('prop: severity', () => {
    it.each(severities)(
      'should append severity class and default icon when severity="%s"',
      (severity) => {
        const host = mountBanner({ severity }).get(`.${classes.host}`);

        expect(host.classes()).toContain(classes.severity(severity));
        expect(host.get(`.${classes.icon}`).attributes('data-icon-name')).toBe(
          alertBannerIcons[severity].name,
        );
      },
    );
  });

  describe('prop: icon', () => {
    it('should render custom icon when provided', () => {
      const wrapper = mountBanner({ icon: PlusIcon });

      expect(wrapper.get(`.${classes.icon}`).attributes('data-icon-name')).toBe(
        PlusIcon.name,
      );
    });
  });

  describe('prop: actions', () => {
    it('should render actions container when actions provided', () => {
      const wrapper = mountBanner({
        actions: [{ content: '了解更多', onClick: () => {} }],
      });
      const actions = wrapper.get(`.${classes.actions}`);

      expect(actions.findAll('button')).toHaveLength(1);
      expect(actions.text()).toBe('了解更多');
    });

    it('should not render actions container when actions are empty', () => {
      const wrapper = mountBanner({ actions: [] });

      expect(wrapper.find(`.${classes.actions}`).exists()).toBe(false);
    });

    it('should render at most 2 actions and warn beyond that', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapper = mountBanner({
        actions: [
          { content: '一', onClick: () => {} },
          { content: '二', onClick: () => {} },
          { content: '三', onClick: () => {} },
        ],
      });

      expect(wrapper.get(`.${classes.actions}`).findAll('button')).toHaveLength(
        2,
      );
      expect(warn).toHaveBeenCalledWith('AlertBanner: actions maximum is 2');

      warn.mockRestore();
    });

    it('should call the action handler on click', async () => {
      const onClick = vi.fn();
      const wrapper = mountBanner({ actions: [{ content: '重試', onClick }] });

      await wrapper.get(`.${classes.actions} button`).trigger('click');

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: closable', () => {
    it('should render an inverse close button by default', () => {
      const close = mountBanner().get(`.${classes.close}`);

      expect(close.classes()).toContain('mzn-clear-actions--variant-inverse');
    });

    it('should not render close button when closable is false', () => {
      const wrapper = mountBanner({ closable: false });

      expect(wrapper.find(`.${classes.close}`).exists()).toBe(false);
    });

    it('should emit close and hide the banner after the exit animation', async () => {
      vi.useFakeTimers();

      const wrapper = mountBanner();

      await wrapper.get(`.${classes.close}`).trigger('click');

      expect(wrapper.emitted('close')).toBeUndefined();

      vi.advanceTimersByTime(300);
      await flushPromises();

      expect(wrapper.emitted('close')).toHaveLength(1);
      expect(wrapper.find(`.${classes.host}`).exists()).toBe(false);

      vi.useRealTimers();
    });
  });
});

describe('alertBanner', () => {
  const banners = (): Element[] =>
    Array.from(
      document.body.querySelectorAll(
        `.${alertBannerGroupClasses.host} .${classes.host}`,
      ),
    );

  const severityOf = (banner: Element): AlertBannerSeverity | null =>
    severities.find((severity) =>
      banner.classList.contains(classes.severity(severity)),
    ) ?? null;

  const messages = (): (string | undefined)[] =>
    banners().map((banner) =>
      banner.querySelector(`.${classes.message}`)?.textContent?.trim(),
    );

  beforeEach(() => {
    alertBanner.destroy();
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    alertBanner.destroy();
    resetPortals();
  });

  it('should render into one shared group container on the alert layer', async () => {
    alertBanner.info('Info message');
    await flushPromises();

    const group = document.body.querySelector(
      `.${alertBannerGroupClasses.host}`,
    );

    expect(group?.closest('.mzn-portal-alert')).not.toBeNull();
    expect(banners()).toHaveLength(1);
  });

  it.each(severities)('should render %s with its icon', async (severity) => {
    alertBanner[severity]('note');
    await flushPromises();

    const banner = banners()[0];

    expect(severityOf(banner)).toBe(severity);
    expect(
      banner.querySelector(`.${classes.icon}`)?.getAttribute('data-icon-name'),
    ).toBe(alertBannerIcons[severity].name);
  });

  it('should prioritize error and warning over info', async () => {
    const baseTime = Date.now();

    // The info banner is the newest, so only the severity priority can put the
    // error above it.
    alertBanner.error('Error message', { createdAt: baseTime });
    await flushPromises();
    alertBanner.info('Info message', { createdAt: baseTime + 100 });
    await flushPromises();

    expect(banners().map(severityOf)).toEqual(['error', 'info']);
    expect(messages()).toEqual(['Error message', 'Info message']);
  });

  it('should sort same priority notifiers by createdAt (newest first)', async () => {
    const baseTime = Date.now();

    alertBanner.add({
      createdAt: baseTime,
      message: 'Error 1',
      severity: 'error',
    });
    await flushPromises();
    alertBanner.add({
      createdAt: baseTime + 100,
      message: 'Error 2',
      severity: 'error',
    });
    await flushPromises();

    expect(messages()).toEqual(['Error 2', 'Error 1']);
  });

  it('should keep warning and error above info regardless of when they arrived', async () => {
    const baseTime = Date.now();

    alertBanner.add({
      createdAt: baseTime + 2,
      message: 'w',
      severity: 'warning',
    });
    await flushPromises();
    alertBanner.add({
      createdAt: baseTime + 3,
      message: 'e',
      severity: 'error',
    });
    await flushPromises();
    // Newest of the three, yet info still sinks below both.
    alertBanner.add({
      createdAt: baseTime + 4,
      message: 'i',
      severity: 'info',
    });
    await flushPromises();

    expect(banners().map(severityOf)).toEqual(['error', 'warning', 'info']);
    expect(messages()).toEqual(['e', 'w', 'i']);
  });

  it('should remove a banner by the key returned from add', async () => {
    const key = alertBanner.info('Info message');

    await flushPromises();
    expect(banners()).toHaveLength(1);

    alertBanner.remove(key);
    await flushPromises();

    expect(banners()).toHaveLength(0);
  });

  it('should call onClose and drop the banner when its close button is clicked', async () => {
    vi.useFakeTimers();

    const onClose = vi.fn();

    alertBanner.info('Info message', { onClose });
    await flushPromises();

    const close = banners()[0].querySelector(
      `.${classes.close}`,
    ) as HTMLButtonElement;

    close.click();
    vi.advanceTimersByTime(300);
    await flushPromises();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(banners()).toHaveLength(0);

    vi.useRealTimers();
  });

  it('should remain usable after destroy', async () => {
    alertBanner.info('first');
    await flushPromises();

    alertBanner.destroy();
    expect(banners()).toHaveLength(0);

    alertBanner.info('second');
    await flushPromises();

    expect(messages()).toEqual(['second']);
  });
});
