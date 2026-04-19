import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznNotificationCenter } from './notification-center.component';
import { MznNotificationCenterDrawer } from './notification-center-drawer.component';
import type { NotificationItem } from './notification';

export default {
  title: 'Feedback/Notification Center',
  decorators: [
    moduleMetadata({
      imports: [MznButton, MznNotificationCenter, MznNotificationCenterDrawer],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

const severities = ['success', 'warning', 'error', 'info'] as const;

export const Playground: Story = {
  argTypes: {
    severity: { options: severities, control: { type: 'select' } },
    title: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    confirmButtonText: { control: { type: 'text' } },
    cancelButtonText: { control: { type: 'text' } },
  },
  args: {
    severity: 'info',
    title: 'Notification Title',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznNotificationCenter
        type="notification"
        [severity]="severity"
        [title]="title"
        [description]="description"
        [confirmButtonText]="confirmButtonText"
        [cancelButtonText]="cancelButtonText"
        [showConfirmButton]="true"
        [showCancelButton]="true"
      ></div>
    `,
  }),
};

export const Severity: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: grid; gap: 16px;">
        <div mznNotificationCenter type="notification" severity="success" title="success notification"
          description="Lorem ipsum, dolor sit amet consectetur adipisicing elit."></div>
        <div mznNotificationCenter type="notification" severity="warning" title="warning notification"
          description="Lorem ipsum, dolor sit amet consectetur adipisicing elit."></div>
        <div mznNotificationCenter type="notification" severity="error" title="error notification"
          description="Lorem ipsum, dolor sit amet consectetur adipisicing elit."></div>
        <div mznNotificationCenter type="notification" severity="info" title="info notification"
          description="Lorem ipsum, dolor sit amet consectetur adipisicing elit."></div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-notification-add-method',
  standalone: true,
  imports: [MznButton, MznNotificationCenter],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button mznButton variant="base-primary" (click)="addSuccess()">
          添加成功通知
        </button>
        <button mznButton variant="base-primary" (click)="addError()">
          添加錯誤通知
        </button>
        <button mznButton variant="base-primary" (click)="addWarning()">
          添加警告通知
        </button>
        <button mznButton variant="base-primary" (click)="addInfo()">
          添加資訊通知
        </button>
      </div>
      <div
        style="display: flex; flex-direction: column; align-items: flex-end; gap: 16px;"
      >
        @for (item of items(); track item.key) {
          <div
            mznNotificationCenter
            type="notification"
            [severity]="item.severity ?? 'info'"
            [title]="item.title ?? ''"
            [description]="item.description ?? ''"
            [reference]="item.key ?? ''"
            (closed)="remove($event)"
          ></div>
        }
      </div>
    </div>
  `,
})
class AddMethodComponent {
  readonly items = signal<NotificationItem[]>([]);

  addSuccess(): void {
    this.items.update((prev) => [
      ...prev,
      {
        key: `success-${Date.now()}`,
        title: '操作成功',
        description: '使用 add 方法添加的通知',
        severity: 'success',
      },
    ]);
  }

  addError(): void {
    this.items.update((prev) => [
      ...prev,
      {
        key: `error-${Date.now()}`,
        title: '操作失敗',
        description: '這是一個錯誤通知，使用 add 方法添加',
        severity: 'error',
      },
    ]);
  }

  addWarning(): void {
    this.items.update((prev) => [
      ...prev,
      {
        key: `warning-${Date.now()}`,
        title: '警告',
        description: '這是一個警告通知',
        severity: 'warning',
      },
    ]);
  }

  addInfo(): void {
    this.items.update((prev) => [
      ...prev,
      {
        key: `info-${Date.now()}`,
        title: '資訊通知',
        description: '這是一個資訊通知',
        severity: 'info',
      },
    ]);
  }

  remove(key: string | number | undefined): void {
    if (key === undefined) return;
    this.items.update((prev) => prev.filter((n) => n.key !== key));
  }
}

export const AddMethod: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [AddMethodComponent],
    }),
  ],
  render: () => ({ template: `<story-notification-add-method />` }),
};

const SAMPLE_LIST: readonly NotificationItem[] = [
  {
    key: '1',
    title: '系統更新通知',
    description: '系統已完成更新，您現在可以使用最新版本功能。',
    severity: 'info',
    timeStamp: new Date('2025-12-15T10:00:00'),
  },
  {
    key: '2',
    title: '帳號安全提醒',
    description: '您的登入地點異常，請確認是否為本人操作。',
    severity: 'warning',
    timeStamp: new Date('2025-12-14T10:00:00'),
  },
  {
    key: '3',
    title: '已上傳完成',
    description: '您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。',
    severity: 'success',
    timeStamp: new Date('2025-12-14T10:00:00'),
  },
  {
    key: '4',
    title: '上傳失敗',
    description: '您的檔案「月報表.pdf」上傳失敗，請重新上傳。',
    severity: 'error',
    timeStamp: new Date('2025-12-14T10:00:00'),
  },
  {
    key: '5',
    title: '資料更新通知',
    description:
      '後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。',
    severity: 'info',
    timeStamp: new Date('2025-12-14T10:00:00'),
  },
];

export const DrawerWithChildren: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { open: signal(false) },
    template: `
      <div>
      <button mznButton variant="base-primary" (click)="open.set(true)">
        開啟通知中心
      </button>
      <div mznNotificationCenterDrawer
        [open]="open()"
        title="通知中心"
        (closed)="open.set(false)"
      >
        <div mznNotificationCenter type="drawer" severity="info"
          title="系統更新通知" description="系統已完成更新，您現在可以使用最新版本功能。"
          [timeStamp]="'2025-12-15T10:00:00'"></div>
        <div mznNotificationCenter type="drawer" severity="warning"
          title="帳號安全提醒" description="您的登入地點異常，請確認是否為本人操作。"
          [timeStamp]="'2025-12-14T10:00:00'"></div>
        <div mznNotificationCenter type="drawer" severity="success"
          title="已上傳完成" description="您的檔案「月報表.pdf」已成功上傳。"
          [timeStamp]="'2025-12-14T10:00:00'"></div>
      </div>
      </div>
    `,
  }),
};

export const DrawerWithNotificationList: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { open: signal(false), list: SAMPLE_LIST },
    template: `
      <div>
      <button mznButton variant="base-primary" (click)="open.set(true)">
        開啟通知中心（使用 notificationList）
      </button>
      <div mznNotificationCenterDrawer
        [open]="open()"
        title="通知中心"
        [notificationList]="list"
        (closed)="open.set(false)"
      ></div>
      </div>
    `,
  }),
};

export const DrawerEmpty: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { open: signal(false), list: [] as NotificationItem[] },
    template: `
      <div>
      <button mznButton variant="base-primary" (click)="open.set(true)">
        開啟通知中心（空狀態）
      </button>
      <div mznNotificationCenterDrawer
        [open]="open()"
        title="通知中心"
        [notificationList]="list"
        (closed)="open.set(false)"
      ></div>
      </div>
    `,
  }),
};

export const DrawerTimeStamp: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const now = new Date();
    const mk = (minutesAgo: number) => {
      const d = new Date(now);
      d.setMinutes(d.getMinutes() - minutesAgo);
      return d;
    };
    return {
      props: {
        open: signal(false),
        list: [
          {
            key: '30m',
            title: '今天 - 30 分鐘前',
            description: '這是 30 分鐘前的通知',
            severity: 'info',
            timeStamp: mk(30),
          },
          {
            key: '2h',
            title: '今天 - 2 小時前',
            description: '這是 2 小時前的通知',
            severity: 'success',
            timeStamp: mk(120),
          },
          {
            key: 'yd',
            title: '昨天',
            description: '這是昨天的通知',
            severity: 'warning',
            timeStamp: mk(60 * 24),
          },
          {
            key: '2d',
            title: '2 天前',
            description: '這是 2 天前的通知',
            severity: 'info',
            timeStamp: mk(60 * 24 * 2),
          },
        ] as NotificationItem[],
      },
      template: `
        <div>
        <button mznButton variant="base-primary" (click)="open.set(true)">
          開啟通知中心（時間戳記範例）
        </button>
        <div mznNotificationCenterDrawer
          [open]="open()"
          title="通知中心 - 時間戳記"
          [notificationList]="list"
          (closed)="open.set(false)"
        ></div>
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
      list: SAMPLE_LIST,
      options: [
        { id: 'mark', name: '標示已讀' },
        { id: 'delete', name: '刪除已讀' },
      ],
    },
    template: `
      <div>
      <button mznButton variant="base-primary" (click)="open.set(true)">
        開啟通知中心（含篩選 Dropdown）
      </button>
      <div mznNotificationCenterDrawer
        [open]="open()"
        title="通知中心"
        [notificationList]="list"
        [filterBarShow]="true"
        filterBarAllRadioLabel="全部"
        filterBarReadRadioLabel="已讀"
        filterBarUnreadRadioLabel="未讀"
        [filterBarShowUnreadButton]="true"
        [filterBarOptions]="options"
        (closed)="open.set(false)"
      ></div>
      </div>
    `,
  }),
};
