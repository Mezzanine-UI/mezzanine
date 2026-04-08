import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznNotificationCenter } from './notification-center.component';
import { NotificationItem } from './notification';

const SAMPLE_NOTIFICATIONS: readonly NotificationItem[] = [
  {
    id: '1',
    title: 'Build succeeded',
    description: 'Pipeline #42 passed all checks.',
    severity: 'success',
    timestamp: new Date(Date.now() - 3 * 60_000),
    read: false,
  },
  {
    id: '2',
    title: 'Deployment failed',
    description:
      'Staging deploy encountered an error. Please check the logs for details.',
    severity: 'error',
    timestamp: new Date(Date.now() - 15 * 60_000),
    read: false,
  },
  {
    id: '3',
    title: 'Rate limit warning',
    description: 'API usage approaching 80% of quota.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 45 * 60_000),
    read: false,
  },
  {
    id: '4',
    title: 'New team member joined',
    description: 'Alice has been added to the Frontend team.',
    severity: 'info',
    timestamp: new Date(Date.now() - 2 * 3_600_000),
    read: true,
  },
  {
    id: '5',
    title: 'Weekly report ready',
    description: 'Your performance summary for this week is available.',
    severity: 'info',
    timestamp: new Date(Date.now() - 24 * 3_600_000),
    read: true,
  },
];

export default {
  title: 'Feedback/Notification Center',
  decorators: [
    moduleMetadata({
      imports: [MznNotificationCenter],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    open: { control: { type: 'boolean' } },
    title: { control: { type: 'text' } },
  },
  args: {
    open: false,
    title: 'Notifications',
  },
  render: (args) => ({
    props: {
      ...args,
      notifications: SAMPLE_NOTIFICATIONS,
      onOpenChange: (value: boolean): void => {
        args['open'] = value;
      },
      onNotificationClick: (item: NotificationItem): void => {
        console.log('Notification clicked:', item);
      },
    },
    template: `
      <div style="position: relative; display: inline-block;">
        <mzn-notification-center
          [notifications]="notifications"
          [open]="open"
          [title]="title"
          (openChange)="onOpenChange($event); open = $event"
          (notificationClick)="onNotificationClick($event)"
        />
      </div>
    `,
  }),
};

export const Severity: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      successNotifications: [
        {
          id: 's1',
          title: 'success notification',
          description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
          severity: 'success',
          read: false,
        },
      ] as NotificationItem[],
      warningNotifications: [
        {
          id: 'w1',
          title: 'warning notification',
          description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
          severity: 'warning',
          read: false,
        },
      ] as NotificationItem[],
      errorNotifications: [
        {
          id: 'e1',
          title: 'error notification',
          description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
          severity: 'error',
          read: false,
        },
      ] as NotificationItem[],
      infoNotifications: [
        {
          id: 'i1',
          title: 'info notification',
          description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
          severity: 'info',
          read: false,
        },
      ] as NotificationItem[],
      openSuccess: signal(true),
      openWarning: signal(true),
      openError: signal(true),
      openInfo: signal(true),
    },
    template: `
      <div style="display: grid; grid-gap: 16px; grid-template-columns: repeat(4, auto); justify-content: start;">
        <div style="position: relative; display: inline-block;">
          <mzn-notification-center
            [notifications]="successNotifications"
            [open]="openSuccess()"
            title="Success"
            (openChange)="openSuccess.set($event)"
          />
        </div>
        <div style="position: relative; display: inline-block;">
          <mzn-notification-center
            [notifications]="warningNotifications"
            [open]="openWarning()"
            title="Warning"
            (openChange)="openWarning.set($event)"
          />
        </div>
        <div style="position: relative; display: inline-block;">
          <mzn-notification-center
            [notifications]="errorNotifications"
            [open]="openError()"
            title="Error"
            (openChange)="openError.set($event)"
          />
        </div>
        <div style="position: relative; display: inline-block;">
          <mzn-notification-center
            [notifications]="infoNotifications"
            [open]="openInfo()"
            title="Info"
            (openChange)="openInfo.set($event)"
          />
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-add-method',
  standalone: true,
  imports: [MznNotificationCenter],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <h3 style="margin: 0;">使用 add 方法</h3>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button
          (click)="addSuccess()"
          style="padding: 8px 16px; background: #4caf50; color: white; border: none; cursor: pointer; border-radius: 4px;"
        >
          添加成功通知
        </button>
        <button
          (click)="addError()"
          style="padding: 8px 16px; background: #f44336; color: white; border: none; cursor: pointer; border-radius: 4px;"
        >
          添加錯誤通知
        </button>
        <button
          (click)="addWarning()"
          style="padding: 8px 16px; background: #ff9800; color: white; border: none; cursor: pointer; border-radius: 4px;"
        >
          添加警告通知
        </button>
        <button
          (click)="addInfo()"
          style="padding: 8px 16px; background: #2196f3; color: white; border: none; cursor: pointer; border-radius: 4px;"
        >
          添加資訊通知
        </button>
      </div>
      <div style="position: relative; display: inline-block;">
        <mzn-notification-center
          [notifications]="notifications()"
          [open]="open()"
          title="通知中心"
          (openChange)="open.set($event)"
        />
      </div>
    </div>
  `,
})
class AddMethodComponent {
  readonly open = signal(false);
  readonly notifications = signal<NotificationItem[]>([]);

  addSuccess(): void {
    this.notifications.update((prev) => [
      ...prev,
      {
        id: `success-${Date.now()}`,
        title: '操作成功',
        description: '使用 add 方法添加的通知',
        severity: 'success' as const,
        timestamp: new Date(),
        read: false,
      },
    ]);
  }

  addError(): void {
    this.notifications.update((prev) => [
      ...prev,
      {
        id: `error-${Date.now()}`,
        title: '操作失敗',
        description: '這是一個錯誤通知，使用 add 方法添加',
        severity: 'error' as const,
        timestamp: new Date(),
        read: false,
      },
    ]);
  }

  addWarning(): void {
    this.notifications.update((prev) => [
      ...prev,
      {
        id: `warning-${Date.now()}`,
        title: '警告',
        description: '這是一個警告通知',
        severity: 'warning' as const,
        timestamp: new Date(),
        read: false,
      },
    ]);
  }

  addInfo(): void {
    this.notifications.update((prev) => [
      ...prev,
      {
        id: `info-${Date.now()}`,
        title: '資訊通知',
        description: '這是一個資訊通知，展示 add 方法的基本用法',
        severity: 'info' as const,
        timestamp: new Date(),
        read: false,
      },
    ]);
  }
}

export const AddMethod: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [AddMethodComponent],
    }),
  ],
  render: () => ({
    template: `<story-add-method />`,
  }),
};

export const DrawerWithChildren: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      notifications: [
        {
          id: '1',
          title: '系統更新通知',
          description: '系統已完成更新，您現在可以使用最新版本功能。',
          severity: 'info',
          timestamp: new Date('2025-12-15T10:00:00'),
          read: false,
        },
        {
          id: '2',
          title: '帳號安全提醒',
          description: '您的登入地點異常，請確認是否為本人操作。',
          severity: 'warning',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: false,
        },
        {
          id: '3',
          title: '已上傳完成',
          description:
            '您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。',
          severity: 'success',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: true,
        },
        {
          id: '4',
          title: '上傳失敗',
          description: '您的檔案「月報表.pdf」上傳失敗，請重新上傳。',
          severity: 'error',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: true,
        },
        {
          id: '5',
          title: '資料更新通知',
          description:
            '後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。',
          severity: 'info',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: true,
        },
      ] as NotificationItem[],
    },
    template: `
      <div style="position: relative; display: inline-block;">
        <button (click)="open.set(true)" style="padding: 8px 16px; background: #1976d2; color: white; border: none; cursor: pointer; border-radius: 4px;">
          開啟通知中心
        </button>
        <mzn-notification-center
          [notifications]="notifications"
          [open]="open()"
          title="通知中心"
          (openChange)="open.set($event)"
        />
      </div>
    `,
  }),
};

export const DrawerWithNotificationList: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      notificationList: [
        {
          id: '1',
          title: '系統更新通知',
          description: '系統已完成更新，您現在可以使用最新版本功能。',
          severity: 'info',
          timestamp: new Date('2025-12-15T10:00:00'),
          read: false,
        },
        {
          id: '2',
          title: '帳號安全提醒',
          description: '您的登入地點異常，請確認是否為本人操作。',
          severity: 'warning',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: false,
        },
        {
          id: '3',
          title: '已上傳完成',
          description:
            '您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。',
          severity: 'success',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: true,
        },
        {
          id: '4',
          title: '上傳失敗',
          description: '您的檔案「月報表.pdf」上傳失敗，請重新上傳。',
          severity: 'error',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: true,
        },
        {
          id: '5',
          title: '資料更新通知',
          description:
            '後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。',
          severity: 'info',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: true,
        },
      ] as NotificationItem[],
    },
    template: `
      <div style="position: relative; display: inline-block;">
        <button (click)="open.set(true)" style="padding: 8px 16px; background: #1976d2; color: white; border: none; cursor: pointer; border-radius: 4px;">
          開啟通知中心（使用 notificationList）
        </button>
        <mzn-notification-center
          [notifications]="notificationList"
          [open]="open()"
          title="通知中心"
          (openChange)="open.set($event)"
        />
      </div>
    `,
  }),
};

export const DrawerEmpty: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
    },
    template: `
      <div style="position: relative; display: inline-block;">
        <button (click)="open.set(true)" style="padding: 8px 16px; background: #1976d2; color: white; border: none; cursor: pointer; border-radius: 4px;">
          開啟通知中心（空狀態）
        </button>
        <mzn-notification-center
          [notifications]="[]"
          [open]="open()"
          title="通知中心"
          (openChange)="open.set($event)"
        />
      </div>
    `,
  }),
};

export const DrawerTimeStamp: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const now = new Date();

    const today30minAgo = new Date(now);
    today30minAgo.setMinutes(now.getMinutes() - 30);

    const today2hoursAgo = new Date(now);
    today2hoursAgo.setHours(now.getHours() - 2);

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    yesterday.setHours(10, 0, 0);

    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    twoDaysAgo.setHours(14, 30, 0);

    const fourDaysAgo = new Date(now);
    fourDaysAgo.setDate(now.getDate() - 4);
    fourDaysAgo.setHours(9, 15, 0);

    return {
      props: {
        open: signal(false),
        notifications: [
          {
            id: 'today-30min',
            title: '今天 - 30分鐘前',
            description: '這是30分鐘前的通知，應該顯示「30m ago」',
            severity: 'info',
            timestamp: today30minAgo,
            read: false,
          },
          {
            id: 'today-2hours',
            title: '今天 - 2小時前',
            description: '這是2小時前的通知，應該顯示「2h ago」',
            severity: 'success',
            timestamp: today2hoursAgo,
            read: false,
          },
          {
            id: 'yesterday',
            title: '昨天',
            description: '這是昨天的通知，應該顯示「1d ago」',
            severity: 'warning',
            timestamp: yesterday,
            read: true,
          },
          {
            id: '2days-ago',
            title: '過去7天 - 2天前',
            description: '這是2天前的通知，應該顯示「2d ago」',
            severity: 'info',
            timestamp: twoDaysAgo,
            read: true,
          },
          {
            id: '4days-ago',
            title: '過去7天 - 4天前',
            description: '這是4天前的通知，應該顯示「4d ago」',
            severity: 'success',
            timestamp: fourDaysAgo,
            read: true,
          },
        ] as NotificationItem[],
      },
      template: `
        <div style="position: relative; display: inline-block;">
          <button (click)="open.set(true)" style="padding: 8px 16px; background: #1976d2; color: white; border: none; cursor: pointer; border-radius: 4px;">
            開啟通知中心（時間戳記範例）
          </button>
          <mzn-notification-center
            [notifications]="notifications"
            [open]="open()"
            title="通知中心 - 時間戳記顯示範例"
            (openChange)="open.set($event)"
          />
        </div>
      `,
    };
  },
};

export const DrawerWithFilterOptions: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      filter: signal('all'),
      notificationList: [
        {
          id: '1',
          title: '系統更新通知',
          description: '系統已完成更新，您現在可以使用最新版本功能。',
          severity: 'info',
          timestamp: new Date('2025-12-15T10:00:00'),
          read: false,
        },
        {
          id: '2',
          title: '帳號安全提醒',
          description: '您的登入地點異常，請確認是否為本人操作。',
          severity: 'warning',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: false,
        },
        {
          id: '3',
          title: '已上傳完成',
          description:
            '您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。',
          severity: 'success',
          timestamp: new Date('2025-12-14T10:00:00'),
          read: true,
        },
      ] as NotificationItem[],
    },
    template: `
      <div style="position: relative; display: inline-block;">
        <button (click)="open.set(true)" style="padding: 8px 16px; background: #1976d2; color: white; border: none; cursor: pointer; border-radius: 4px;">
          開啟通知中心（含篩選 Dropdown）
        </button>
        <mzn-notification-center
          [notifications]="notificationList"
          [open]="open()"
          title="通知中心"
          (openChange)="open.set($event)"
        />
      </div>
    `,
  }),
};
