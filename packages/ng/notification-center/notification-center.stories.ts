import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznNotificationCenter } from './notification-center.component';
import { MznNotificationCenterContainer } from './notification-center-container.component';
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
  selector: '[storyNotificationAddMethod]',
  standalone: true,
  imports: [
    MznButton,
    MznTypography,
    MznNotificationCenter,
    MznNotificationCenterContainer,
    MznNotificationCenterDrawer,
  ],
  host: {
    style: 'display: flex; flex-direction: column; gap: 16px;',
  },
  template: `
    <h3 mznTypography variant="h3" style="margin: 0;">
      使用 NotificationCenter.add 方法
    </h3>
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <button mznButton variant="base-primary" (click)="addSuccess()">
        添加成功通知（帶確認/取消）
      </button>
      <button mznButton variant="base-primary" (click)="addError()">
        添加錯誤通知
      </button>
      <button mznButton variant="base-primary" (click)="addWarning()">
        添加警告通知（3秒後自動移除）
      </button>
      <button mznButton variant="base-primary" (click)="addInfo()">
        添加資訊通知（5秒自動關閉）
      </button>
      <button mznButton variant="base-primary" (click)="addMultiple()">
        連續添加多個通知
      </button>
    </div>

    <!--
        Toast stack (top-right, via MznNotificationCenterContainer).
        host gets \`.mzn-notification-center-root\` → position: fixed top/right
        and the floating pointer-events cascade, matching React's auto-created
        root portal. When toasts.length > 3, the container renders a
        「查看更多」 button; (viewAllClicked) clears toasts and opens the drawer.
      -->
    <div
      mznNotificationCenterContainer
      [items]="toasts()"
      (viewAllClicked)="onViewAll()"
    >
      <ng-template #itemTemplate let-item>
        <div
          mznNotificationCenter
          type="notification"
          [severity]="item.severity ?? 'info'"
          [title]="item.title ?? ''"
          [description]="item.description ?? ''"
          [cancelButtonText]="item.cancelButtonText ?? 'Cancel'"
          [confirmButtonText]="item.confirmButtonText ?? 'Confirm'"
          [showConfirmButton]="!!item.confirmButtonText"
          [showCancelButton]="!!item.cancelButtonText"
          [duration]="item._duration ?? false"
          [reference]="item.key ?? ''"
          (confirmed)="remove(item.key)"
          (cancelled)="remove(item.key)"
          (closed)="remove($event)"
        ></div>
      </ng-template>
    </div>

    <!--
        Drawer list — same items, presented as a grouped list.
      -->
    <div
      mznNotificationCenterDrawer
      [open]="drawerOpen()"
      title="通知中心"
      [notificationList]="drawerList()"
      [filterBarShow]="true"
      filterBarAllRadioLabel="全部"
      filterBarReadRadioLabel="已讀"
      filterBarUnreadRadioLabel="未讀"
      [filterBarShowUnreadButton]="true"
      filterBarCustomButtonLabel="全部已讀"
      (closed)="drawerOpen.set(false)"
    ></div>
  `,
})
class AddMethodComponent {
  readonly toasts = signal<ToastItem[]>([]);
  readonly drawerList = signal<NotificationItem[]>([]);
  readonly drawerOpen = signal(false);

  private push(toast: ToastItem, drawer: NotificationItem): void {
    this.toasts.update((prev) => [...prev, toast]);
    this.drawerList.update((prev) => [...prev, drawer]);
  }

  addSuccess(): void {
    const key = `success-${Date.now()}`;
    this.push(
      {
        key,
        severity: 'success',
        title: '操作成功',
        description: '使用 NotificationCenter.add 方法添加的通知',
        cancelButtonText: '取消',
        confirmButtonText: '確認',
      },
      {
        key,
        severity: 'success',
        title: '操作成功',
        description: '使用 NotificationCenter.add 方法添加的通知',
        timeStamp: new Date(),
      },
    );
  }

  addError(): void {
    const key = `error-${Date.now()}`;
    this.push(
      {
        key,
        severity: 'error',
        title: '操作失敗',
        description: '這是一個錯誤通知，使用 add 方法添加',
        // Mirror React `{ onClose: () => NotificationCenter.remove(ref) }` →
        // React's showCancelButton is `cancelButtonText && (onCancel || onClose)`,
        // so a Cancel button surfaces even though onConfirm was not given.
        cancelButtonText: 'Cancel',
      },
      {
        key,
        severity: 'error',
        title: '操作失敗',
        description: '這是一個錯誤通知，使用 add 方法添加',
        timeStamp: new Date(),
      },
    );
  }

  addWarning(): void {
    const key = `warning-${Date.now()}`;
    this.push(
      {
        key,
        severity: 'warning',
        title: '警告',
        description: '這是一個警告通知，可以通過 reference 來控制',
      },
      {
        key,
        severity: 'warning',
        title: '警告',
        description: '這是一個警告通知，可以通過 reference 來控制',
        timeStamp: new Date(),
      },
    );
    // Mirror React's `setTimeout(() => NotificationCenter.remove(ref), 3000)`.
    setTimeout(() => this.remove(key), 3000);
  }

  addInfo(): void {
    const key = `info-${Date.now()}`;
    this.push(
      {
        key,
        severity: 'info',
        title: '資訊通知',
        description: '這是一個資訊通知，展示 add 方法的基本用法',
        _duration: 5000,
      },
      {
        key,
        severity: 'info',
        title: '資訊通知',
        description: '這是一個資訊通知，展示 add 方法的基本用法',
        timeStamp: new Date(),
      },
    );
  }

  addMultiple(): void {
    const severities = ['success', 'warning', 'error', 'info'] as const;
    severities.forEach((severity, index) => {
      setTimeout(() => {
        const key = `${severity}-multi-${Date.now()}-${index}`;
        this.push(
          {
            key,
            severity,
            title: `${severity} 通知`,
            description: `這是第 ${index + 1} 個通知`,
          },
          {
            key,
            severity,
            title: `${severity} 通知`,
            description: `這是第 ${index + 1} 個通知`,
            timeStamp: new Date(),
          },
        );
      }, index * 500);
    });
  }

  remove(key: string | number | undefined): void {
    if (key === undefined) return;
    this.toasts.update((prev) => prev.filter((t) => t.key !== key));
  }

  // Mirror React `handleViewAll` — NotificationCenter.destroy() +
  // setDrawerOpen(true). In Angular, the consumer owns the stack, so we
  // clear `toasts` ourselves (the Container has no singleton to destroy).
  onViewAll(): void {
    this.toasts.set([]);
    this.drawerOpen.set(true);
  }
}

type ToastItem = NotificationItem & { readonly _duration?: number | false };

export const AddMethod: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [AddMethodComponent],
    }),
  ],
  render: () => ({ template: `<div storyNotificationAddMethod></div>` }),
};

const DEFAULT_BADGE_OPTIONS = [
  { id: 'mark', name: '標示已讀' },
  { id: 'delete', name: '刪除已讀' },
  { id: 'deleteMark', name: '刪除通知', validate: 'danger' },
] as const;

const SAMPLE_LIST: readonly NotificationItem[] = [
  {
    key: '1',
    title: '系統更新通知',
    description: '系統已完成更新，您現在可以使用最新版本功能。',
    severity: 'info',
    // 對齊 React story 字串 timestamp（'YYYY-MM-DD HH:mm:ss'），避免 Date 物件在
    // 兩邊被序列化為不同的顯示格式。
    timeStamp: '2025-12-15 10:00:00',
    showBadge: true,
    options: DEFAULT_BADGE_OPTIONS,
  },
  {
    key: '2',
    title: '帳號安全提醒',
    description: '您的登入地點異常，請確認是否為本人操作。',
    severity: 'warning',
    timeStamp: '2025-12-14 10:00:00',
    options: DEFAULT_BADGE_OPTIONS,
  },
  {
    key: '3',
    title: '已上傳完成',
    description: '您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。',
    severity: 'success',
    timeStamp: '2025-12-14 10:00:00',
    options: DEFAULT_BADGE_OPTIONS,
  },
  {
    key: '4',
    title: '上傳失敗',
    description: '您的檔案「月報表.pdf」上傳失敗，請重新上傳。',
    severity: 'error',
    timeStamp: '2025-12-14 10:00:00',
    options: DEFAULT_BADGE_OPTIONS,
  },
  {
    key: '5',
    title: '資料更新通知',
    description:
      '後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。',
    severity: 'info',
    timeStamp: '2025-12-14 10:00:00',
    options: DEFAULT_BADGE_OPTIONS,
  },
];

export const DrawerWithChildren: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      badgeOptions: DEFAULT_BADGE_OPTIONS,
    },
    template: `
      <div>
      <button mznButton variant="base-primary" (click)="open.set(true)">
        開啟通知中心
      </button>
      <div mznNotificationCenterDrawer
        [open]="open()"
        title="通知中心"
        drawerSize="narrow"
        [filterBarShow]="true"
        filterBarAllRadioLabel="全部"
        filterBarReadRadioLabel="已讀"
        filterBarUnreadRadioLabel="未讀"
        [filterBarShowUnreadButton]="true"
        filterBarCustomButtonLabel="全部已讀"
        (closed)="open.set(false)"
      >
        <div mznNotificationCenter type="drawer" severity="info"
          title="系統更新通知" description="系統已完成更新，您現在可以使用最新版本功能。"
          reference="1"
          [showBadge]="true"
          [options]="badgeOptions"
          [timeStamp]="'2025-12-15 10:00:00'"></div>
        <div mznNotificationCenter type="drawer" severity="warning"
          title="帳號安全提醒" description="您的登入地點異常，請確認是否為本人操作。"
          reference="2"
          [options]="badgeOptions"
          [timeStamp]="'2025-12-14 10:00:00'"></div>
        <div mznNotificationCenter type="drawer" severity="success"
          title="已上傳完成" description="您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。"
          reference="3"
          [options]="badgeOptions"
          [timeStamp]="'2025-12-14 10:00:00'"></div>
        <div mznNotificationCenter type="drawer" severity="error"
          title="上傳失敗" description="您的檔案「月報表.pdf」上傳失敗，請重新上傳。"
          reference="4"
          [options]="badgeOptions"
          [timeStamp]="'2025-12-14 10:00:00'"></div>
        <div mznNotificationCenter type="drawer" severity="info"
          title="資料更新通知" description="後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。"
          reference="5"
          [options]="badgeOptions"
          [timeStamp]="'2025-12-14 10:00:00'"></div>
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
        drawerSize="narrow"
        [notificationList]="list"
        [filterBarShow]="true"
        filterBarAllRadioLabel="全部"
        filterBarReadRadioLabel="已讀"
        filterBarUnreadRadioLabel="未讀"
        [filterBarShowUnreadButton]="true"
        filterBarCustomButtonLabel="全部已讀"
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
        drawerSize="narrow"
        [notificationList]="list"
        [filterBarShow]="true"
        filterBarAllRadioLabel="全部"
        filterBarReadRadioLabel="已讀"
        filterBarUnreadRadioLabel="未讀"
        [filterBarShowUnreadButton]="true"
        filterBarCustomButtonLabel="全部已讀"
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

    // 對齊 React `toISOString().replace('T', ' ').slice(0, 19)`
    // 產出 'YYYY-MM-DD HH:mm:ss' 字串。
    const formatTs = (d: Date): string =>
      d.toISOString().replace('T', ' ').slice(0, 19);
    // 僅日期（無時間）— 對齊 React `toISOString().split('T')[0]`。
    const formatDate = (d: Date): string => d.toISOString().split('T')[0];

    const offset = (
      minutesAgo: number,
      hour?: number,
      minute?: number,
    ): Date => {
      const d = new Date(now);
      d.setMinutes(d.getMinutes() - minutesAgo);
      if (hour !== undefined) d.setHours(hour, minute ?? 0, 0, 0);
      return d;
    };

    const today30min = offset(30);
    const today2hours = offset(120);
    const yesterday = offset(0);
    yesterday.setDate(now.getDate() - 1);
    yesterday.setHours(10, 0, 0, 0);
    const twoDaysAgo = offset(0);
    twoDaysAgo.setDate(now.getDate() - 2);
    twoDaysAgo.setHours(14, 30, 0, 0);
    const fourDaysAgo = offset(0);
    fourDaysAgo.setDate(now.getDate() - 4);
    fourDaysAgo.setHours(9, 15, 0, 0);
    const sixDaysAgo = offset(0);
    sixDaysAgo.setDate(now.getDate() - 6);
    sixDaysAgo.setHours(16, 45, 0, 0);
    const eightDaysAgo = offset(0);
    eightDaysAgo.setDate(now.getDate() - 8);
    eightDaysAgo.setHours(20, 8, 0, 0);
    const tenDaysAgo = offset(0);
    tenDaysAgo.setDate(now.getDate() - 10);
    const elevenDaysAgo = offset(0);
    elevenDaysAgo.setDate(now.getDate() - 11);
    elevenDaysAgo.setHours(15, 30, 0, 0);

    return {
      props: {
        open: signal(false),
        // 對齊 React `DrawerTimeStampExample` 的十項資料（含各種時間格式組合）。
        list: [
          {
            key: 'today-30min',
            title: '今天 - 30分鐘前',
            description: '這是30分鐘前的通知，應該顯示「30 分鐘前」',
            severity: 'info',
            timeStamp: formatTs(today30min),
            showBadge: true,
            options: DEFAULT_BADGE_OPTIONS,
          },
          {
            key: 'today-2hours',
            title: '今天 - 2小時前',
            description: '這是2小時前的通知，應該顯示「2 小時前」',
            severity: 'success',
            timeStamp: formatTs(today2hours),
            options: DEFAULT_BADGE_OPTIONS,
          },
          {
            key: 'yesterday',
            title: '昨天',
            description: '這是昨天的通知，應該顯示「1 天前」',
            severity: 'warning',
            timeStamp: formatTs(yesterday),
            options: DEFAULT_BADGE_OPTIONS,
          },
          {
            key: '2days-ago',
            title: '過去7天 - 2天前',
            description: '這是2天前的通知，應該顯示「2 天前」',
            severity: 'info',
            timeStamp: formatTs(twoDaysAgo),
            options: DEFAULT_BADGE_OPTIONS,
          },
          {
            key: '4days-ago',
            title: '過去7天 - 4天前',
            description: '這是4天前的通知，應該顯示「4 天前」',
            severity: 'success',
            timeStamp: formatTs(fourDaysAgo),
            options: DEFAULT_BADGE_OPTIONS,
          },
          {
            key: '6days-ago',
            title: '過去7天 - 6天前',
            description: '這是6天前的通知，應該顯示「6 天前」',
            severity: 'warning',
            timeStamp: formatTs(sixDaysAgo),
            options: DEFAULT_BADGE_OPTIONS,
          },
          {
            key: '8days-ago-with-time',
            title: '超過7天 - 有時間戳',
            description:
              '這是8天前的通知（有時間戳），應該顯示「2025-XX-XX 20:08」格式',
            severity: 'error',
            timeStamp: formatTs(eightDaysAgo),
            options: DEFAULT_BADGE_OPTIONS,
          },
          {
            key: '10days-ago-no-time',
            title: '超過7天 - 無時間戳',
            description:
              '這是10天前的通知（無時間戳），應該顯示「2025-XX-XX」格式',
            severity: 'info',
            timeStamp: formatDate(tenDaysAgo),
            options: DEFAULT_BADGE_OPTIONS,
          },
          {
            key: '11days-ago-with-time',
            title: '超過7天 - 有時間戳（11天前）',
            description:
              '這是11天前的通知（有時間戳），應該顯示「2025-XX-XX 15:30」格式',
            severity: 'success',
            timeStamp: formatTs(elevenDaysAgo),
            options: DEFAULT_BADGE_OPTIONS,
          },
          {
            // 對齊 React story：此筆 key 宣告為 12 天前但 React 原始碼重複使用
            // `elevenDaysAgo` 作為 timeStamp（應是筆誤），完全照搬以保 DOM parity。
            key: '12days-ago-with-time',
            title: '超過7天 - 有時間戳（12天前）',
            description:
              '這是12天前的通知（有時間戳），應該顯示「2025-XX-XX 15:30」格式',
            severity: 'warning',
            timeStamp: formatTs(elevenDaysAgo),
            options: DEFAULT_BADGE_OPTIONS,
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
          title="通知中心 - 時間戳記顯示範例"
          drawerSize="narrow"
          [notificationList]="list"
          [filterBarShow]="true"
          filterBarAllRadioLabel="全部"
          filterBarReadRadioLabel="已讀"
          filterBarUnreadRadioLabel="未讀"
          [filterBarShowUnreadButton]="true"
          filterBarCustomButtonLabel="全部已讀"
          filterBarDefaultValue="all"
          filterBarValue="all"
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
      filter: signal<string>('all'),
      // 對齊 React `DrawerWithFilterOptionsExample`：3 筆（system / account / upload-success）。
      list: SAMPLE_LIST.slice(0, 3),
      // 對齊 React `filterOptions` — 含 showUnderline / validate: 'danger'。
      filterOptions: [
        { id: 'mark-all-read', name: '全部標示已讀' },
        { id: 'delete-read', name: '刪除已讀通知', showUnderline: true },
        { id: 'delete-all', name: '刪除所有通知', validate: 'danger' },
      ],
      // 對齊 React `filterBarOnSelect={(opt) => alert(...)}` 的行為。
      onSelect: (opt: { name: string }): void => {
         
        alert(`已選擇：${opt.name}`);
      },
    },
    template: `
      <div>
      <button mznButton variant="base-primary" (click)="open.set(true)">
        開啟通知中心（含篩選 Dropdown）
      </button>
      <div mznNotificationCenterDrawer
        [open]="open()"
        title="通知中心"
        drawerSize="narrow"
        [notificationList]="list"
        [filterBarShow]="true"
        filterBarAllRadioLabel="全部"
        filterBarReadRadioLabel="已讀"
        filterBarUnreadRadioLabel="未讀"
        [filterBarShowUnreadButton]="true"
        filterBarDefaultValue="all"
        [filterBarValue]="filter()"
        [filterBarOptions]="filterOptions"
        (filterBarOnRadioChange)="filter.set($event)"
        (filterBarOnSelect)="onSelect($event)"
        (closed)="open.set(false)"
      ></div>
      </div>
    `,
  }),
};
