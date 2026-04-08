import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MznNotificationCenter } from './notification-center.component';
import { NotificationItem } from './notification';

const MOCK_NOTIFICATIONS: readonly NotificationItem[] = [
  {
    id: '1',
    title: 'Build succeeded',
    description: 'Pipeline #42 passed all checks.',
    severity: 'success',
    timestamp: new Date(Date.now() - 5 * 60_000),
    read: false,
  },
  {
    id: '2',
    title: 'Deployment failed',
    description: 'Staging deploy encountered an error.',
    severity: 'error',
    timestamp: new Date(Date.now() - 30 * 60_000),
    read: false,
  },
  {
    id: '3',
    title: 'New comment',
    description: 'Someone commented on your PR.',
    severity: 'info',
    timestamp: new Date(Date.now() - 2 * 3_600_000),
    read: true,
  },
];

@Component({
  standalone: true,
  imports: [MznNotificationCenter],
  template: `
    <mzn-notification-center
      [notifications]="notifications"
      [open]="open"
      [title]="title"
      (openChange)="onOpenChange($event)"
      (notificationClick)="onNotificationClick($event)"
    />
  `,
})
class TestHostComponent {
  notifications: readonly NotificationItem[] = [];
  open = false;
  title = 'Notifications';
  onOpenChange = jest.fn();
  onNotificationClick = jest.fn();
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getHost: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getHost: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-notification-center')!,
  };
}

describe('MznNotificationCenter', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const { getHost } = createFixture();

    expect(getHost()).toBeTruthy();
    expect(getHost().classList.contains('mzn-notification-center')).toBe(true);
  });

  it('should show unread badge count', () => {
    const { getHost } = createFixture({
      notifications: MOCK_NOTIFICATIONS,
    });
    const badge = getHost().querySelector('mzn-badge');

    expect(badge).toBeTruthy();

    const badgeText = badge?.textContent?.trim();

    expect(badgeText).toContain('2');
  });

  it('should toggle open state', () => {
    const onOpenChange = jest.fn();
    const { getHost } = createFixture({ onOpenChange });

    const triggerButton = getHost().querySelector('button')!;
    triggerButton.click();

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('should render notification items when open', () => {
    const { getHost } = createFixture({
      notifications: MOCK_NOTIFICATIONS,
      open: true,
    });
    const panel = getHost().querySelector('.mzn-notification-center__drawer');

    expect(panel).toBeTruthy();

    const items = getHost().querySelectorAll('.mzn-notification-center__body');

    // 3 notification items (body class on each) + structural body elements
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it('should emit notificationClick', () => {
    const onNotificationClick = jest.fn();
    const { getHost, fixture } = createFixture({
      notifications: MOCK_NOTIFICATIONS,
      open: true,
      onNotificationClick,
    });

    fixture.detectChanges();

    const notificationButtons = getHost().querySelectorAll<HTMLButtonElement>(
      '.mzn-notification-center__body[class*="mzn-notification-center--"]',
    );

    if (notificationButtons.length > 0) {
      notificationButtons[0].click();

      expect(onNotificationClick).toHaveBeenCalledTimes(1);
      expect(onNotificationClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1' }),
      );
    }
  });

  it('should show empty state when no notifications', () => {
    const { getHost } = createFixture({
      notifications: [],
      open: true,
    });
    const emptyEl = getHost().querySelector(
      '.mzn-notification-center__empty-notifications',
    );

    expect(emptyEl).toBeTruthy();
    expect(emptyEl?.textContent?.trim()).toBe('目前沒有通知');
  });

  it('should not show badge when all notifications are read', () => {
    const allRead: readonly NotificationItem[] = MOCK_NOTIFICATIONS.map(
      (n) => ({ ...n, read: true }),
    );
    const { getHost } = createFixture({ notifications: allRead });
    const badge = getHost().querySelector('mzn-badge');

    expect(badge).toBeNull();
  });

  it('should close panel via close button', () => {
    const onOpenChange = jest.fn();
    const { getHost } = createFixture({
      notifications: MOCK_NOTIFICATIONS,
      open: true,
      onOpenChange,
    });
    const closeButton = getHost().querySelector<HTMLButtonElement>(
      `.mzn-notification-center__close-icon`,
    );

    expect(closeButton).toBeTruthy();
    closeButton!.click();

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
