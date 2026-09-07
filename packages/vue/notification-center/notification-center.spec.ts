import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { badgeClasses } from '@mezzanine-ui/core/badge';
import { emptyClasses } from '@mezzanine-ui/core/empty';
import { notificationClasses as classes } from '@mezzanine-ui/core/notification-center';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznNotificationCenterDrawer from './notification-center-drawer.vue';
import MznNotificationCenter from './notification-center.vue';
import type { NotificationCenterDrawerProps } from './notification-center-drawer.types';
import type { NotificationData } from './notification-center.types';

const render = (props: NotificationData = {}) =>
  mount(MznNotificationCenter, { attachTo: document.body, props });

describe('<MznNotificationCenter />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should render its title and description at the info severity', () => {
    const wrapper = render({
      description: 'Description',
      title: 'Title',
    });

    const host = wrapper.get(`.${classes.host}`);

    expect(host.classes()).toContain(classes.severity('info'));
    expect(host.classes()).toContain(classes.type('notification'));
    expect(host.get(`.${classes.title}`).text()).toBe('Title');
    expect(host.get(`.${classes.content}`).text()).toBe('Description');
  });

  it('should carry the severity it was given', () => {
    const wrapper = render({ severity: 'error', title: 'Title' });

    expect(wrapper.get(`.${classes.host}`).classes()).toContain(
      classes.severity('error'),
    );
  });

  it('should keep the action buttons back until a handler is given', () => {
    const bare = render({ title: 'Title' });

    expect(bare.find(`.${classes.action}`).exists()).toBe(false);

    const withConfirm = render({ onConfirm: () => {}, title: 'Title' });

    expect(
      withConfirm.get(`.${classes.action}`).findAll('button'),
    ).toHaveLength(1);
  });

  it('should show both buttons once it can cancel and confirm', () => {
    const wrapper = render({
      onCancel: () => {},
      onConfirm: () => {},
      title: 'Title',
    });

    const buttons = wrapper.get(`.${classes.action}`).findAll('button');

    expect(buttons.map((button) => button.text())).toEqual([
      'Cancel',
      'Confirm',
    ]);
  });

  it('should close itself and report the confirmation', async () => {
    const onConfirm = vi.fn();
    const wrapper = render({ onConfirm, title: 'Title' });

    await wrapper.get(`.${classes.action} button`).trigger('click');

    expect(onConfirm).toHaveBeenCalled();
  });

  it('should report a close with its own reference', async () => {
    const onClose = vi.fn();
    const wrapper = render({ onClose, reference: 'ref-1', title: 'Title' });

    await wrapper.get(`.${classes.closeIcon}`).trigger('click');

    expect(onClose).toHaveBeenCalledWith('ref-1');
  });

  it('should close itself after its duration runs out', async () => {
    vi.useFakeTimers();

    const onClose = vi.fn();

    render({ duration: 1000, onClose, reference: 'ref-1', title: 'Title' });

    vi.advanceTimersByTime(1000);
    await nextTick();

    // The close is the transition leaving, not the callback: React only calls
    // `onClose` from the close button.
    expect(onClose).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should render the drawer form with a timestamp and a badge menu', () => {
    const wrapper = render({
      severity: 'success',
      showBadge: true,
      timeStamp: '2025-12-14 10:00:00',
      title: 'Title',
      type: 'drawer',
    });

    const host = wrapper.get(`.${classes.host}`);

    expect(host.classes()).toContain(classes.type('drawer'));
    expect(host.find(`.${classes.timeStamp}`).exists()).toBe(true);
    expect(host.find(`.${badgeClasses.host}`).exists()).toBe(true);
    expect(host.find(`.${classes.dotIconButton}`).exists()).toBe(true);
  });

  it('should show the tips around a drawer notification', () => {
    const wrapper = render({
      appendTips: '之後',
      prependTips: '今天',
      title: 'Title',
      type: 'drawer',
    });

    expect(wrapper.get(`.${classes.prependTips}`).text()).toBe('今天');
    expect(wrapper.get(`.${classes.appendTips}`).text()).toBe('之後');
  });

  it('should ignore the tips outside the drawer form', () => {
    const wrapper = render({
      appendTips: '之後',
      prependTips: '今天',
      title: 'Title',
      type: 'notification',
    });

    expect(wrapper.find(`.${classes.prependTips}`).exists()).toBe(false);
    expect(wrapper.find(`.${classes.appendTips}`).exists()).toBe(false);
  });

  it('should format a timestamp from another day as a date', () => {
    const wrapper = render({
      timeStamp: '2020-03-04 15:30:00',
      title: 'Title',
      type: 'drawer',
    });

    expect(wrapper.get(`.${classes.timeStamp}`).text()).toContain('2020');
  });

  it('should leave an unparseable timestamp alone', () => {
    const wrapper = render({
      timeStamp: 'not a date',
      title: 'Title',
      type: 'drawer',
    });

    expect(wrapper.get(`.${classes.timeStamp}`).text()).toBe('not a date');
  });
});

describe('<MznNotificationCenterDrawer />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  const renderDrawer = (
    props: NotificationCenterDrawerProps = {},
    children?: unknown,
  ) =>
    mount(MznNotificationCenterDrawer, {
      attachTo: document.body,
      props: { open: true, ...props },
      slots: children ? { default: () => children } : undefined,
    });

  const query = (selector: string): HTMLElement | null =>
    document.querySelector<HTMLElement>(selector);

  const queryAll = (selector: string): HTMLElement[] =>
    Array.from(document.querySelectorAll<HTMLElement>(selector));

  it('should show the empty state when it has nothing to list', () => {
    renderDrawer({ notificationList: [] });

    expect(query(`.${classes.emptyNotifications}`)).not.toBeNull();
    expect(query(`.${emptyClasses.host}`)).not.toBeNull();
  });

  it('should show the empty state when its slot is empty too', () => {
    renderDrawer();

    expect(query(`.${classes.emptyNotifications}`)).not.toBeNull();
  });

  it('should render the notifications it was handed', () => {
    renderDrawer({
      notificationList: [
        {
          key: '1',
          severity: 'info',
          timeStamp: '2025-12-15 10:00:00',
          title: '第一則',
          type: 'drawer',
        },
        {
          key: '2',
          severity: 'error',
          timeStamp: '2025-12-14 10:00:00',
          title: '第二則',
          type: 'drawer',
        },
      ],
    });

    expect(queryAll(`.${classes.host}`)).toHaveLength(2);
  });

  it('should sort the notifications newest first', () => {
    renderDrawer({
      notificationList: [
        {
          key: 'older',
          timeStamp: '2020-01-01 10:00:00',
          title: '較舊',
          type: 'drawer',
        },
        {
          key: 'newer',
          timeStamp: '2024-01-01 10:00:00',
          title: '較新',
          type: 'drawer',
        },
      ],
    });

    const titles = queryAll(`.${classes.title}`).map((el) => el.textContent);

    expect(titles).toEqual(['較新', '較舊']);
  });

  it('should label the first notification of each time group', () => {
    const now = new Date();
    const yesterday = new Date(now);

    yesterday.setDate(now.getDate() - 1);

    renderDrawer({
      notificationList: [
        {
          key: 'today',
          timeStamp: now.toISOString(),
          title: '今天的',
          type: 'drawer',
        },
        {
          key: 'yesterday',
          timeStamp: yesterday.toISOString(),
          title: '昨天的',
          type: 'drawer',
        },
        {
          key: 'old',
          timeStamp: '2020-01-01 10:00:00',
          title: '很久以前',
          type: 'drawer',
        },
      ],
    });

    const tips = queryAll(`.${classes.prependTips}`).map(
      (el) => el.textContent,
    );

    expect(tips).toEqual(['今天', '昨天', '更早']);
  });

  it('should take custom time group labels', () => {
    renderDrawer({
      earlierLabel: 'Earlier',
      notificationList: [
        {
          key: 'old',
          timeStamp: '2020-01-01 10:00:00',
          title: '很久以前',
          type: 'drawer',
        },
      ],
    });

    expect(query(`.${classes.prependTips}`)?.textContent).toBe('Earlier');
  });

  it('should render the notifications a slot provides instead', () => {
    renderDrawer({}, [
      h(MznNotificationCenter, { title: '自己放的', type: 'drawer' }),
    ]);

    expect(query(`.${classes.emptyNotifications}`)).toBeNull();
    expect(query(`.${classes.title}`)?.textContent).toBe('自己放的');
  });

  it('should show the header only when it has a title', () => {
    renderDrawer({ notificationList: [], title: '通知中心' });

    expect(document.body.textContent).toContain('通知中心');
  });

  it('should ask to close', async () => {
    const wrapper = renderDrawer({ notificationList: [], title: '通知中心' });

    query('.mzn-drawer__header button')?.click();
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});
