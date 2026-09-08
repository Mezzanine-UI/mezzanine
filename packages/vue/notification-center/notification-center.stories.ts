import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, shallowRef } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { NotificationSeverity } from '@mezzanine-ui/core/notification-center';
import MznButton from '../button/button.vue';
import MznTypography from '../typography/typography.vue';
import MznNotificationCenterDrawer from './notification-center-drawer.vue';
import MznNotificationCenter from './notification-center.vue';
import { notificationCenter } from './notification-center';
import type { NotificationDataForDrawer } from './notification-center-drawer.types';
import type { NotificationCenterDrawerProps } from './notification-center-drawer.types';
import type { NotificationData } from './notification-center.types';

export default {
  title: 'Feedback/Notification Center',
  component: MznNotificationCenter,
} satisfies Meta<NotificationData>;

type Story = StoryObj<NotificationData>;

const severities: NotificationSeverity[] = [
  'success',
  'warning',
  'error',
  'info',
];

const defaultBadgeOptions: DropdownOption[] = [
  { id: 'mark', name: '標示已讀' },
  { id: 'delete', name: '刪除已讀' },
  { id: 'deleteMark', name: '刪除通知', validate: 'danger' },
];

const STORY_COMPONENTS = {
  MznButton,
  MznNotificationCenter,
  MznNotificationCenterDrawer,
  MznTypography,
};

export const Playground: Story = {
  argTypes: {
    severity: {
      options: severities,
      control: {
        type: 'select',
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },
    description: {
      control: {
        type: 'text',
      },
    },
    confirmButtonText: {
      control: {
        type: 'text',
      },
    },
    cancelButtonText: {
      control: {
        type: 'text',
      },
    },
  },
  args: {
    severity: 'info',
    title: 'Notification Title',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  },
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      args,
      onCancel: (): void => {},
      onConfirm: (): void => {},
    }),
    template: `
      <MznNotificationCenter
        v-bind="args"
        reference="notification-playground"
        :onConfirm="onConfirm"
        :onCancel="onCancel"
      />
    `,
  }),
};

export const Severity: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({ severities }),
    template: `
      <div style="display: grid; grid-gap: 16px">
        <MznNotificationCenter
          v-for="(severity, index) in severities"
          :key="severity"
          :severity="severity"
          :title="severity + ' notification'"
          description="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
          :reference="'notification-' + severity + '-' + index"
        />
      </div>
    `,
  }),
};

export const AddMethod: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const drawerOpen = ref(false);
      const notifications = shallowRef<NotificationDataForDrawer[]>([]);

      const handleBadgeSelect = (): void => {};
      const handleViewAll = (): void => {
        drawerOpen.value = true;
      };

      const timeStamp = (): string =>
        new Date().toISOString().replace('T', ' ').slice(0, 19);

      const append = (entry: NotificationDataForDrawer): void => {
        notifications.value = [...notifications.value, entry];
      };

      return {
        drawerOpen,
        handleAddError: (): void => {
          const reference = notificationCenter.add({
            description: '這是一個錯誤通知，使用 add 方法添加',
            onClose: () => {
              notificationCenter.remove(reference);
            },
            onViewAll: handleViewAll,
            severity: 'error',
            title: '操作失敗',
            type: 'notification',
          });

          append({
            description: '這是一個錯誤通知，使用 add 方法添加',
            key: reference,
            onBadgeSelect: handleBadgeSelect,
            options: defaultBadgeOptions,
            severity: 'error',
            showBadge: notifications.value.length === 0,
            timeStamp: timeStamp(),
            title: '操作失敗',
            type: 'drawer',
          });
        },
        handleAddInfo: (): void => {
          const reference = notificationCenter.add({
            description: '這是一個資訊通知，展示 add 方法的基本用法',
            duration: 5000,
            onViewAll: handleViewAll,
            severity: 'info',
            title: '資訊通知',
            type: 'notification',
          });

          append({
            description: '這是一個資訊通知，展示 add 方法的基本用法',
            key: reference,
            onBadgeSelect: handleBadgeSelect,
            options: defaultBadgeOptions,
            severity: 'info',
            showBadge: notifications.value.length === 0,
            timeStamp: timeStamp(),
            title: '資訊通知',
            type: 'drawer',
          });
        },
        handleAddMultiple: (): void => {
          severities.forEach((severity, index) => {
            setTimeout(() => {
              const reference = notificationCenter.add({
                description: `這是第 ${index + 1} 個通知`,
                onViewAll: handleViewAll,
                severity,
                title: `${severity} 通知`,
                type: 'notification',
              });

              append({
                description: `這是第 ${index + 1} 個通知`,
                key: reference,
                onBadgeSelect: handleBadgeSelect,
                options: defaultBadgeOptions,
                severity,
                showBadge: notifications.value.length === 0,
                timeStamp: timeStamp(),
                title: `${severity} 通知`,
                type: 'drawer',
              });
            }, index * 500);
          });
        },
        handleAddSuccess: (): void => {
          const reference = notificationCenter.add({
            cancelButtonText: '取消',
            confirmButtonText: '確認',
            description: '使用 NotificationCenter.add 方法添加的通知',
            onCancel: () => {
              notificationCenter.remove(reference);
            },
            onConfirm: () => {
              notificationCenter.remove(reference);
            },
            onViewAll: handleViewAll,
            severity: 'success',
            title: '操作成功',
            type: 'notification',
          });

          append({
            description: '使用 NotificationCenter.add 方法添加的通知',
            key: reference,
            onBadgeSelect: handleBadgeSelect,
            options: defaultBadgeOptions,
            severity: 'success',
            showBadge: notifications.value.length === 0,
            timeStamp: timeStamp(),
            title: '操作成功',
            type: 'drawer',
          });
        },
        handleAddWarning: (): void => {
          const reference = notificationCenter.add({
            description: '這是一個警告通知，可以通過 reference 來控制',
            onViewAll: handleViewAll,
            severity: 'warning',
            title: '警告',
            type: 'notification',
          });

          setTimeout(() => {
            notificationCenter.remove(reference);
          }, 3000);

          append({
            description: '這是一個警告通知，可以通過 reference 來控制',
            key: reference,
            onBadgeSelect: handleBadgeSelect,
            options: defaultBadgeOptions,
            severity: 'warning',
            showBadge: notifications.value.length === 0,
            timeStamp: timeStamp(),
            title: '警告',
            type: 'drawer',
          });
        },
        noop: (): void => {},
        notifications,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px">
        <MznTypography variant="h3">使用 NotificationCenter.add 方法</MznTypography>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <MznButton variant="base-primary" @click="handleAddSuccess">
            添加成功通知（帶確認/取消）
          </MznButton>
          <MznButton variant="base-primary" @click="handleAddError">
            添加錯誤通知
          </MznButton>
          <MznButton variant="base-primary" @click="handleAddWarning">
            添加警告通知（3秒後自動移除）
          </MznButton>
          <MznButton variant="base-primary" @click="handleAddInfo">
            添加資訊通知（5秒自動關閉）
          </MznButton>
          <MznButton variant="base-primary" @click="handleAddMultiple">
            連續添加多個通知
          </MznButton>
        </div>
        <MznNotificationCenterDrawer
          drawerSize="narrow"
          :notificationList="notifications"
          :open="drawerOpen"
          title="通知中心"
          filterBarAllRadioLabel="全部"
          filterBarCustomButtonLabel="全部已讀"
          filterBarDefaultValue="all"
          :filterBarOnCustomButtonClick="noop"
          :filterBarOnRadioChange="noop"
          filterBarReadRadioLabel="已讀"
          filterBarShow
          filterBarShowUnreadButton
          filterBarUnreadRadioLabel="未讀"
          filterBarValue="all"
          @close="drawerOpen = false"
        />
      </div>
    `,
  }),
};

type DrawerStory = StoryObj<NotificationCenterDrawerProps>;

export const DrawerWithChildren: DrawerStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);

      return {
        defaultBadgeOptions,
        handleBadgeSelect: (): void => {},
        noop: (): void => {},
        open,
      };
    },
    template: `
      <div>
        <MznButton variant="base-primary" @click="open = true">
          開啟通知中心
        </MznButton>
        <MznNotificationCenterDrawer
          filterBarAllRadioLabel="全部"
          filterBarCustomButtonLabel="全部已讀"
          filterBarDefaultValue="all"
          :filterBarOnCustomButtonClick="noop"
          :filterBarOnRadioChange="noop"
          filterBarReadRadioLabel="已讀"
          filterBarShow
          filterBarShowUnreadButton
          filterBarUnreadRadioLabel="未讀"
          filterBarValue="all"
          drawerSize="narrow"
          :open="open"
          title="通知中心"
          @close="open = false"
        >
          <MznNotificationCenter
            description="系統已完成更新，您現在可以使用最新版本功能。"
            :onBadgeSelect="handleBadgeSelect"
            :options="defaultBadgeOptions"
            reference="1"
            severity="info"
            showBadge
            timeStamp="2025-12-15 10:00:00"
            title="系統更新通知"
            type="drawer"
          />
          <MznNotificationCenter
            description="您的登入地點異常，請確認是否為本人操作。"
            :onBadgeSelect="handleBadgeSelect"
            :options="defaultBadgeOptions"
            reference="2"
            severity="warning"
            timeStamp="2025-12-14 10:00:00"
            title="帳號安全提醒"
            type="drawer"
          />
          <MznNotificationCenter
            description="您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。"
            :onBadgeSelect="handleBadgeSelect"
            :options="defaultBadgeOptions"
            reference="3"
            severity="success"
            timeStamp="2025-12-14 10:00:00"
            title="已上傳完成"
            type="drawer"
          />
          <MznNotificationCenter
            description="您的檔案「月報表.pdf」上傳失敗，請重新上傳。"
            :onBadgeSelect="handleBadgeSelect"
            :options="defaultBadgeOptions"
            reference="4"
            severity="error"
            timeStamp="2025-12-14 10:00:00"
            title="上傳失敗"
            type="drawer"
          />
          <MznNotificationCenter
            description="後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。"
            :onBadgeSelect="handleBadgeSelect"
            :options="defaultBadgeOptions"
            reference="5"
            severity="info"
            timeStamp="2025-12-14 10:00:00"
            title="資料更新通知"
            type="drawer"
          />
        </MznNotificationCenterDrawer>
      </div>
    `,
  }),
};

const sampleNotificationList = (): NotificationDataForDrawer[] => [
  {
    description: '系統已完成更新，您現在可以使用最新版本功能。',
    key: '1',
    onBadgeSelect: () => {},
    options: defaultBadgeOptions,
    severity: 'info',
    showBadge: true,
    timeStamp: '2025-12-15 10:00:00',
    title: '系統更新通知',
    type: 'drawer',
  },
  {
    description: '您的登入地點異常，請確認是否為本人操作。',
    key: '2',
    onBadgeSelect: () => {},
    options: defaultBadgeOptions,
    severity: 'warning',
    timeStamp: '2025-12-14 10:00:00',
    title: '帳號安全提醒',
    type: 'drawer',
  },
  {
    description: '您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。',
    key: '3',
    onBadgeSelect: () => {},
    options: defaultBadgeOptions,
    severity: 'success',
    timeStamp: '2025-12-14 10:00:00',
    title: '已上傳完成',
    type: 'drawer',
  },
  {
    description: '您的檔案「月報表.pdf」上傳失敗，請重新上傳。',
    key: '4',
    onBadgeSelect: () => {},
    options: defaultBadgeOptions,
    severity: 'error',
    timeStamp: '2025-12-14 10:00:00',
    title: '上傳失敗',
    type: 'drawer',
  },
  {
    description:
      '後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。',
    key: '5',
    onBadgeSelect: () => {},
    options: defaultBadgeOptions,
    severity: 'info',
    timeStamp: '2025-12-14 10:00:00',
    title: '資料更新通知',
    type: 'drawer',
  },
];

export const DrawerWithNotificationList: DrawerStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);

      return {
        noop: (): void => {},
        notificationList: sampleNotificationList(),
        open,
      };
    },
    template: `
      <div>
        <MznButton variant="base-primary" @click="open = true">
          開啟通知中心（使用 notificationList）
        </MznButton>
        <MznNotificationCenterDrawer
          drawerSize="narrow"
          :notificationList="notificationList"
          :open="open"
          title="通知中心"
          filterBarAllRadioLabel="全部"
          filterBarCustomButtonLabel="全部已讀"
          filterBarDefaultValue="all"
          :filterBarOnCustomButtonClick="noop"
          :filterBarOnRadioChange="noop"
          filterBarReadRadioLabel="已讀"
          filterBarShow
          filterBarShowUnreadButton
          filterBarUnreadRadioLabel="未讀"
          filterBarValue="all"
          @close="open = false"
        />
      </div>
    `,
  }),
};

export const DrawerEmpty: DrawerStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);

      return { noop: (): void => {}, notificationList: [], open };
    },
    template: `
      <div>
        <MznButton variant="base-primary" @click="open = true">
          開啟通知中心（空狀態）
        </MznButton>
        <MznNotificationCenterDrawer
          drawerSize="narrow"
          :notificationList="notificationList"
          :open="open"
          title="通知中心"
          filterBarAllRadioLabel="全部"
          filterBarCustomButtonLabel="全部已讀"
          filterBarDefaultValue="all"
          :filterBarOnCustomButtonClick="noop"
          :filterBarOnRadioChange="noop"
          filterBarReadRadioLabel="已讀"
          filterBarShow
          filterBarShowUnreadButton
          filterBarUnreadRadioLabel="未讀"
          filterBarValue="all"
          @close="open = false"
        />
      </div>
    `,
  }),
};

export const DrawerTimeStamp: DrawerStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);
      const now = new Date();

      const at = (mutate: (date: Date) => void): string => {
        const date = new Date(now);

        mutate(date);

        return date.toISOString().replace('T', ' ').slice(0, 19);
      };

      const handleBadgeSelect = (): void => {};

      const notificationList: NotificationDataForDrawer[] = [
        {
          description: '這是30分鐘前的通知，應該顯示「30 分鐘前」',
          key: 'today-30min',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'info',
          showBadge: true,
          timeStamp: at((date) => date.setMinutes(now.getMinutes() - 30)),
          title: '今天 - 30分鐘前',
          type: 'drawer',
        },
        {
          description: '這是2小時前的通知，應該顯示「2 小時前」',
          key: 'today-2hours',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'success',
          timeStamp: at((date) => date.setHours(now.getHours() - 2)),
          title: '今天 - 2小時前',
          type: 'drawer',
        },
        {
          description: '這是昨天的通知，應該顯示「1 天前」',
          key: 'yesterday',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'warning',
          timeStamp: at((date) => {
            date.setDate(now.getDate() - 1);
            date.setHours(10, 0, 0);
          }),
          title: '昨天',
          type: 'drawer',
        },
        {
          description: '這是2天前的通知，應該顯示「2 天前」',
          key: '2days-ago',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'info',
          timeStamp: at((date) => {
            date.setDate(now.getDate() - 2);
            date.setHours(14, 30, 0);
          }),
          title: '過去7天 - 2天前',
          type: 'drawer',
        },
        {
          description: '這是4天前的通知，應該顯示「4 天前」',
          key: '4days-ago',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'success',
          timeStamp: at((date) => {
            date.setDate(now.getDate() - 4);
            date.setHours(9, 15, 0);
          }),
          title: '過去7天 - 4天前',
          type: 'drawer',
        },
        {
          description: '這是6天前的通知，應該顯示「6 天前」',
          key: '6days-ago',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'warning',
          timeStamp: at((date) => {
            date.setDate(now.getDate() - 6);
            date.setHours(16, 45, 0);
          }),
          title: '過去7天 - 6天前',
          type: 'drawer',
        },
        {
          description:
            '這是8天前的通知（有時間戳），應該顯示「2025-XX-XX 20:08」格式',
          key: '8days-ago-with-time',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'error',
          timeStamp: at((date) => {
            date.setDate(now.getDate() - 8);
            date.setHours(20, 8, 0);
          }),
          title: '超過7天 - 有時間戳',
          type: 'drawer',
        },
        {
          description:
            '這是10天前的通知（無時間戳），應該顯示「2025-XX-XX」格式',
          key: '10days-ago-no-time',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'info',
          timeStamp: at((date) => date.setDate(now.getDate() - 10)).split(
            ' ',
          )[0],
          title: '超過7天 - 無時間戳',
          type: 'drawer',
        },
        {
          description:
            '這是11天前的通知（有時間戳），應該顯示「2025-XX-XX 15:30」格式',
          key: '11days-ago-with-time',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'success',
          timeStamp: at((date) => {
            date.setDate(now.getDate() - 11);
            date.setHours(15, 30, 0);
          }),
          title: '超過7天 - 有時間戳（11天前）',
          type: 'drawer',
        },
        {
          description:
            '這是12天前的通知（有時間戳），應該顯示「2025-XX-XX 15:30」格式',
          key: '12days-ago-with-time',
          onBadgeSelect: handleBadgeSelect,
          options: defaultBadgeOptions,
          severity: 'warning',
          timeStamp: at((date) => {
            date.setDate(now.getDate() - 11);
            date.setHours(15, 30, 0);
          }),
          title: '超過7天 - 有時間戳（12天前）',
          type: 'drawer',
        },
      ];

      return { noop: (): void => {}, notificationList, open };
    },
    template: `
      <div>
        <MznButton variant="base-primary" @click="open = true">
          開啟通知中心（時間戳記範例）
        </MznButton>
        <MznNotificationCenterDrawer
          drawerSize="narrow"
          :notificationList="notificationList"
          :open="open"
          title="通知中心 - 時間戳記顯示範例"
          filterBarAllRadioLabel="全部"
          filterBarCustomButtonLabel="全部已讀"
          filterBarDefaultValue="all"
          :filterBarOnCustomButtonClick="noop"
          :filterBarOnRadioChange="noop"
          filterBarReadRadioLabel="已讀"
          filterBarShow
          filterBarShowUnreadButton
          filterBarUnreadRadioLabel="未讀"
          filterBarValue="all"
          @close="open = false"
        />
      </div>
    `,
  }),
};

export const DrawerWithFilterOptions: DrawerStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);
      const filter = ref('all');

      return {
        filter,
        filterOptions: [
          { id: 'mark-all-read', name: '全部標示已讀' },
          { id: 'delete-read', name: '刪除已讀通知', showUnderline: true },
          { id: 'delete-all', name: '刪除所有通知', validate: 'danger' },
        ] satisfies DropdownOption[],
        notificationList: sampleNotificationList().slice(0, 3),
        onRadioChange: (event: Event): void => {
          filter.value = (event.target as HTMLInputElement).value;
        },
        onSelect: (option: DropdownOption): void => {
          alert(`已選擇：${option.name}`);
        },
        open,
      };
    },
    template: `
      <div>
        <MznButton variant="base-primary" @click="open = true">
          開啟通知中心（含篩選 Dropdown）
        </MznButton>
        <MznNotificationCenterDrawer
          drawerSize="narrow"
          filterBarAllRadioLabel="全部"
          filterBarDefaultValue="all"
          :filterBarOnRadioChange="onRadioChange"
          :filterBarOnSelect="onSelect"
          :filterBarOptions="filterOptions"
          filterBarReadRadioLabel="已讀"
          filterBarShow
          filterBarShowUnreadButton
          filterBarUnreadRadioLabel="未讀"
          :filterBarValue="filter"
          :notificationList="notificationList"
          :open="open"
          title="通知中心"
          @close="open = false"
        />
      </div>
    `,
  }),
};
