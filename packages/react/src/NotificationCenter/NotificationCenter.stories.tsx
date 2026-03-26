import { NotificationSeverity } from '@mezzanine-ui/core/notification-center';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useMemo, useState, type Key } from 'react';

import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import Button from '../Button';
import Typography from '../Typography';
import NotificationCenter, { NotificationData } from './NotificationCenter';
import NotificationCenterDrawer, {
  type NotificationCenterDrawerProps,
} from './NotificationCenterDrawer';

export default {
  title: 'Feedback/Notification Center',
  component: NotificationCenter,
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
  render: (props) => {
    function PlaygroundNotification() {
      const reference = useMemo(() => `notification-playground`, []);

      const onConfirm = () => { };
      const onCancel = () => { };

      return (
        <NotificationCenter
          {...props}
          reference={reference}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );
    }

    return <PlaygroundNotification />;
  },
};

function SeverityExample() {
  const references = useMemo(
    () =>
      severities.map((severity, index) => `notification-${severity}-${index}`),
    [],
  );

  return (
    <div
      style={{
        display: 'grid',
        gridGap: 16,
      }}
    >
      {severities.map((severity, index) => (
        <NotificationCenter
          key={severity}
          severity={severity}
          title={`${severity} notification`}
          description="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
          reference={references[index]}
        />
      ))}
    </div>
  );
}

export const Severity: Story = {
  render: () => <SeverityExample />,
};

type NotificationDataForDrawer = NotificationData & {
  key: Key;
  type: 'drawer';
};

function AddMethodExample() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [notifications, setNotifications] = useState<
    NotificationDataForDrawer[]
  >([]);

  const handleBadgeSelect = (_: DropdownOption) => { };
  const handleViewAll = () => {
    setDrawerOpen(true);
  };

  const handleAddSuccess = () => {
    const reference = NotificationCenter.add({
      cancelButtonText: '取消',
      confirmButtonText: '確認',
      description: '使用 NotificationCenter.add 方法添加的通知',
      onCancel: () => {
        NotificationCenter.remove(reference);
      },
      onConfirm: () => {
        NotificationCenter.remove(reference);
      },
      onViewAll: handleViewAll,
      severity: 'success',
      title: '操作成功',
      type: 'notification',
    });

    setNotifications([
      ...notifications,
      {
        description: '使用 NotificationCenter.add 方法添加的通知',
        key: reference,
        onBadgeSelect: handleBadgeSelect,
        options: defaultBadgeOptions,
        severity: 'success',
        showBadge: notifications.length === 0,
        timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        title: '操作成功',
        type: 'drawer' as const,
      },
    ]);
  };

  const handleAddError = () => {
    const reference = NotificationCenter.add({
      description: '這是一個錯誤通知，使用 add 方法添加',
      onClose: () => {
        NotificationCenter.remove(reference);
      },
      onViewAll: handleViewAll,
      severity: 'error',
      title: '操作失敗',
      type: 'notification',
    });

    setNotifications([
      ...notifications,
      {
        description: '這是一個錯誤通知，使用 add 方法添加',
        key: reference,
        onBadgeSelect: handleBadgeSelect,
        options: defaultBadgeOptions,
        severity: 'error',
        showBadge: notifications.length === 0,
        timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        title: '操作失敗',
        type: 'drawer' as const,
      },
    ]);
  };

  const handleAddWarning = () => {
    const reference = NotificationCenter.add({
      description: '這是一個警告通知，可以通過 reference 來控制',
      onViewAll: handleViewAll,
      severity: 'warning',
      title: '警告',
      type: 'notification',
    });

    setTimeout(() => {
      NotificationCenter.remove(reference);
    }, 3000);

    setNotifications([
      ...notifications,
      {
        description: '這是一個警告通知，可以通過 reference 來控制',
        key: reference,
        onBadgeSelect: handleBadgeSelect,
        options: defaultBadgeOptions,
        severity: 'warning',
        showBadge: notifications.length === 0,
        timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        title: '警告',
        type: 'drawer' as const,
      },
    ]);
  };

  const handleAddInfo = () => {
    const reference = NotificationCenter.add({
      description: '這是一個資訊通知，展示 add 方法的基本用法',
      duration: 5000,
      onViewAll: handleViewAll,
      severity: 'info',
      title: '資訊通知',
      type: 'notification',
    });

    setNotifications([
      ...notifications,
      {
        description: '這是一個資訊通知，展示 add 方法的基本用法',
        key: reference,
        onBadgeSelect: handleBadgeSelect,
        options: defaultBadgeOptions,
        severity: 'info',
        showBadge: notifications.length === 0,
        timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        title: '資訊通知',
        type: 'drawer' as const,
      },
    ]);
  };

  const handleAddMultiple = () => {
    severities.forEach((severity, index) => {
      setTimeout(() => {
        const reference = NotificationCenter.add({
          description: `這是第 ${index + 1} 個通知`,
          onViewAll: handleViewAll,
          severity,
          title: `${severity} 通知`,
          type: 'notification',
        });

        setNotifications((prev) => [
          ...prev,
          {
            description: `這是第 ${index + 1} 個通知`,
            key: reference,
            onBadgeSelect: handleBadgeSelect,
            options: defaultBadgeOptions,
            severity: severity as NotificationSeverity,
            showBadge: prev.length === 0,
            timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            title: `${severity} 通知`,
            type: 'drawer' as const,
          },
        ]);
      }, index * 500);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Typography variant="h3">使用 NotificationCenter.add 方法</Typography>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button variant="base-primary" onClick={handleAddSuccess}>
          添加成功通知（帶確認/取消）
        </Button>
        <Button variant="base-primary" onClick={handleAddError}>
          添加錯誤通知
        </Button>
        <Button variant="base-primary" onClick={handleAddWarning}>
          添加警告通知（3秒後自動移除）
        </Button>
        <Button variant="base-primary" onClick={handleAddInfo}>
          添加資訊通知（5秒自動關閉）
        </Button>
        <Button variant="base-primary" onClick={handleAddMultiple}>
          連續添加多個通知
        </Button>
      </div>
      <NotificationCenterDrawer
        drawerSize="narrow"
        notificationList={notifications}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        title="通知中心"
        filterBarAllRadioLabel="全部"
        filterBarCustomButtonLabel="全部已讀"
        filterBarDefaultValue="all"
        filterBarOnCustomButtonClick={() => { }}
        filterBarOnRadioChange={() => { }}
        filterBarReadRadioLabel="已讀"
        filterBarShow
        filterBarShowUnreadButton
        filterBarUnreadRadioLabel="未讀"
        filterBarValue="all"
      />
    </div>
  );
}

export const AddMethod: Story = {
  render: () => <AddMethodExample />,
};

type DrawerStory = StoryObj<NotificationCenterDrawerProps>;

function DrawerWithChildrenExample() {
  const [open, setOpen] = useState(false);

  const handleBadgeSelect = (_: DropdownOption) => { };

  return (
    <div>
      <Button variant="base-primary" onClick={() => setOpen(true)}>
        開啟通知中心
      </Button>
      <NotificationCenterDrawer
        filterBarAllRadioLabel="全部"
        filterBarCustomButtonLabel="全部已讀"
        filterBarDefaultValue="all"
        filterBarOnCustomButtonClick={() => { }}
        filterBarOnRadioChange={() => { }}
        filterBarReadRadioLabel="已讀"
        filterBarShow
        filterBarShowUnreadButton
        filterBarUnreadRadioLabel="未讀"
        filterBarValue="all"
        drawerSize="narrow"
        onClose={() => setOpen(false)}
        open={open}
        title="通知中心"
      >
        <NotificationCenter
          description="系統已完成更新，您現在可以使用最新版本功能。"
          onBadgeSelect={handleBadgeSelect}
          options={defaultBadgeOptions}
          reference="1"
          severity="info"
          showBadge
          timeStamp="2025-12-15 10:00:00"
          title="系統更新通知"
          type="drawer"
        />
        <NotificationCenter
          description="您的登入地點異常，請確認是否為本人操作。"
          onBadgeSelect={handleBadgeSelect}
          options={defaultBadgeOptions}
          reference="2"
          severity="warning"
          timeStamp="2025-12-14 10:00:00"
          title="帳號安全提醒"
          type="drawer"
        />
        <NotificationCenter
          description="您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。"
          onBadgeSelect={handleBadgeSelect}
          options={defaultBadgeOptions}
          reference="3"
          severity="success"
          timeStamp="2025-12-14 10:00:00"
          title="已上傳完成"
          type="drawer"
        />
        <NotificationCenter
          description="您的檔案「月報表.pdf」上傳失敗，請重新上傳。"
          onBadgeSelect={handleBadgeSelect}
          options={defaultBadgeOptions}
          reference="4"
          severity="error"
          timeStamp="2025-12-14 10:00:00"
          title="上傳失敗"
          type="drawer"
        />
        <NotificationCenter
          description="後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。"
          onBadgeSelect={handleBadgeSelect}
          options={defaultBadgeOptions}
          reference="5"
          severity="info"
          timeStamp="2025-12-14 10:00:00"
          title="資料更新通知"
          type="drawer"
        />
      </NotificationCenterDrawer>
    </div>
  );
}

export const DrawerWithChildren: DrawerStory = {
  render: () => <DrawerWithChildrenExample />,
};

function DrawerWithNotificationListExample() {
  const [open, setOpen] = useState(false);

  const notificationList = useMemo(
    () => [
      {
        description: '系統已完成更新，您現在可以使用最新版本功能。',
        key: '1',
        onBadgeSelect: (_: DropdownOption) => { },
        options: defaultBadgeOptions,
        severity: 'info' as NotificationSeverity,
        showBadge: true,
        timeStamp: '2025-12-15 10:00:00',
        title: '系統更新通知',
        type: 'drawer' as const,
      },
      {
        description: '您的登入地點異常，請確認是否為本人操作。',
        key: '2',
        onBadgeSelect: (_: DropdownOption) => { },
        options: defaultBadgeOptions,
        severity: 'warning' as NotificationSeverity,
        timeStamp: '2025-12-14 10:00:00',
        title: '帳號安全提醒',
        type: 'drawer' as const,
      },
      {
        description: '您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。',
        key: '3',
        onBadgeSelect: (_: DropdownOption) => { },
        options: defaultBadgeOptions,
        severity: 'success' as NotificationSeverity,
        timeStamp: '2025-12-14 10:00:00',
        title: '已上傳完成',
        type: 'drawer' as const,
      },
      {
        description: '您的檔案「月報表.pdf」上傳失敗，請重新上傳。',
        key: '4',
        onBadgeSelect: (_: DropdownOption) => { },
        options: defaultBadgeOptions,
        severity: 'error' as NotificationSeverity,
        timeStamp: '2025-12-14 10:00:00',
        title: '上傳失敗',
        type: 'drawer' as const,
      },
      {
        description:
          '後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。',
        key: '5',
        onBadgeSelect: (_: DropdownOption) => { },
        options: defaultBadgeOptions,
        severity: 'info' as NotificationSeverity,
        timeStamp: '2025-12-14 10:00:00',
        title: '資料更新通知',
        type: 'drawer' as const,
      },
    ],
    [],
  );

  return (
    <div>
      <Button variant="base-primary" onClick={() => setOpen(true)}>
        開啟通知中心（使用 notificationList）
      </Button>
      <NotificationCenterDrawer
        drawerSize="narrow"
        notificationList={notificationList}
        onClose={() => setOpen(false)}
        open={open}
        title="通知中心"
        filterBarAllRadioLabel="全部"
        filterBarCustomButtonLabel="全部已讀"
        filterBarDefaultValue="all"
        filterBarOnCustomButtonClick={() => { }}
        filterBarOnRadioChange={() => { }}
        filterBarReadRadioLabel="已讀"
        filterBarShow
        filterBarShowUnreadButton
        filterBarUnreadRadioLabel="未讀"
        filterBarValue="all"
      />
    </div>
  );
}

export const DrawerWithNotificationList: DrawerStory = {
  render: () => <DrawerWithNotificationListExample />,
};

function DrawerEmptyExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="base-primary" onClick={() => setOpen(true)}>
        開啟通知中心（空狀態）
      </Button>
      <NotificationCenterDrawer
        drawerSize="narrow"
        notificationList={[]}
        onClose={() => setOpen(false)}
        open={open}
        title="通知中心"
        filterBarAllRadioLabel="全部"
        filterBarCustomButtonLabel="全部已讀"
        filterBarDefaultValue="all"
        filterBarOnCustomButtonClick={() => { }}
        filterBarOnRadioChange={() => { }}
        filterBarReadRadioLabel="已讀"
        filterBarShow
        filterBarShowUnreadButton
        filterBarUnreadRadioLabel="未讀"
        filterBarValue="all"
      />
    </div>
  );
}

export const DrawerEmpty: DrawerStory = {
  render: () => <DrawerEmptyExample />,
};

function DrawerTimeStampExample() {
  const [open, setOpen] = useState(false);

  const notificationList = useMemo(() => {
    const now = new Date();
    const notifications = [];

    const today30minAgo = new Date(now);
    today30minAgo.setMinutes(now.getMinutes() - 30);
    const handleBadgeSelect = (_: DropdownOption) => { };

    notifications.push({
      description: '這是30分鐘前的通知，應該顯示「30 分鐘前」',
      key: 'today-30min',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'info' as NotificationSeverity,
      showBadge: true,
      timeStamp: today30minAgo.toISOString().replace('T', ' ').slice(0, 19),
      title: '今天 - 30分鐘前',
      type: 'drawer' as const,
    });

    const today2hoursAgo = new Date(now);
    today2hoursAgo.setHours(now.getHours() - 2);
    notifications.push({
      description: '這是2小時前的通知，應該顯示「2 小時前」',
      key: 'today-2hours',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'success' as NotificationSeverity,
      timeStamp: today2hoursAgo.toISOString().replace('T', ' ').slice(0, 19),
      title: '今天 - 2小時前',
      type: 'drawer' as const,
    });

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    yesterday.setHours(10, 0, 0);
    notifications.push({
      description: '這是昨天的通知，應該顯示「1 天前」',
      key: 'yesterday',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'warning' as NotificationSeverity,
      timeStamp: yesterday.toISOString().replace('T', ' ').slice(0, 19),
      title: '昨天',
      type: 'drawer' as const,
    });

    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    twoDaysAgo.setHours(14, 30, 0);
    notifications.push({
      description: '這是2天前的通知，應該顯示「2 天前」',
      key: '2days-ago',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'info' as NotificationSeverity,
      timeStamp: twoDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
      title: '過去7天 - 2天前',
      type: 'drawer' as const,
    });

    const fourDaysAgo = new Date(now);
    fourDaysAgo.setDate(now.getDate() - 4);
    fourDaysAgo.setHours(9, 15, 0);
    notifications.push({
      description: '這是4天前的通知，應該顯示「4 天前」',
      key: '4days-ago',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'success' as NotificationSeverity,
      timeStamp: fourDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
      title: '過去7天 - 4天前',
      type: 'drawer' as const,
    });

    const sixDaysAgo = new Date(now);
    sixDaysAgo.setDate(now.getDate() - 6);
    sixDaysAgo.setHours(16, 45, 0);
    notifications.push({
      description: '這是6天前的通知，應該顯示「6 天前」',
      key: '6days-ago',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'warning' as NotificationSeverity,
      timeStamp: sixDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
      title: '過去7天 - 6天前',
      type: 'drawer' as const,
    });

    const eightDaysAgo = new Date(now);
    eightDaysAgo.setDate(now.getDate() - 8);
    eightDaysAgo.setHours(20, 8, 0);
    notifications.push({
      description:
        '這是8天前的通知（有時間戳），應該顯示「2025-XX-XX 20:08」格式',
      key: '8days-ago-with-time',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'error' as NotificationSeverity,
      timeStamp: eightDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
      title: '超過7天 - 有時間戳',
      type: 'drawer' as const,
    });

    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(now.getDate() - 10);
    notifications.push({
      description: '這是10天前的通知（無時間戳），應該顯示「2025-XX-XX」格式',
      key: '10days-ago-no-time',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'info' as NotificationSeverity,
      timeStamp: tenDaysAgo.toISOString().split('T')[0],
      title: '超過7天 - 無時間戳',
      type: 'drawer' as const,
    });

    const elevenDaysAgo = new Date(now);
    elevenDaysAgo.setDate(now.getDate() - 11);
    elevenDaysAgo.setHours(15, 30, 0);
    notifications.push({
      description:
        '這是11天前的通知（有時間戳），應該顯示「2025-XX-XX 15:30」格式',
      key: '11days-ago-with-time',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'success' as NotificationSeverity,
      timeStamp: elevenDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
      title: '超過7天 - 有時間戳（11天前）',
      type: 'drawer' as const,
    });

    const twelveDaysAgo = new Date(now);
    twelveDaysAgo.setDate(now.getDate() - 12);
    twelveDaysAgo.setHours(15, 30, 0);
    notifications.push({
      description:
        '這是12天前的通知（有時間戳），應該顯示「2025-XX-XX 15:30」格式',
      key: '12days-ago-with-time',
      onBadgeSelect: handleBadgeSelect,
      options: defaultBadgeOptions,
      severity: 'warning' as NotificationSeverity,
      timeStamp: elevenDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
      title: '超過7天 - 有時間戳（12天前）',
      type: 'drawer' as const,
    });

    return notifications;
  }, []);

  return (
    <div>
      <Button variant="base-primary" onClick={() => setOpen(true)}>
        開啟通知中心（時間戳記範例）
      </Button>
      <NotificationCenterDrawer
        drawerSize="narrow"
        notificationList={notificationList}
        onClose={() => setOpen(false)}
        open={open}
        title="通知中心 - 時間戳記顯示範例"
        filterBarAllRadioLabel="全部"
        filterBarCustomButtonLabel="全部已讀"
        filterBarDefaultValue="all"
        filterBarOnCustomButtonClick={() => { }}
        filterBarOnRadioChange={() => { }}
        filterBarReadRadioLabel="已讀"
        filterBarShow
        filterBarShowUnreadButton
        filterBarUnreadRadioLabel="未讀"
        filterBarValue="all"
      />
    </div>
  );
}

export const DrawerTimeStamp: DrawerStory = {
  render: () => <DrawerTimeStampExample />,
};

function DrawerWithFilterOptionsExample() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const filterOptions: DropdownOption[] = [
    { id: 'mark-all-read', name: '全部標示已讀' },
    { id: 'delete-read', name: '刪除已讀通知', showUnderline: true },
    { id: 'delete-all', name: '刪除所有通知', validate: 'danger' },
  ];

  const notificationList = useMemo(
    () => [
      {
        description: '系統已完成更新，您現在可以使用最新版本功能。',
        key: '1',
        onBadgeSelect: (_: DropdownOption) => {},
        options: defaultBadgeOptions,
        severity: 'info' as NotificationSeverity,
        showBadge: true,
        timeStamp: '2025-12-15 10:00:00',
        title: '系統更新通知',
        type: 'drawer' as const,
      },
      {
        description: '您的登入地點異常，請確認是否為本人操作。',
        key: '2',
        onBadgeSelect: (_: DropdownOption) => {},
        options: defaultBadgeOptions,
        severity: 'warning' as NotificationSeverity,
        timeStamp: '2025-12-14 10:00:00',
        title: '帳號安全提醒',
        type: 'drawer' as const,
      },
      {
        description: '您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。',
        key: '3',
        onBadgeSelect: (_: DropdownOption) => {},
        options: defaultBadgeOptions,
        severity: 'success' as NotificationSeverity,
        timeStamp: '2025-12-14 10:00:00',
        title: '已上傳完成',
        type: 'drawer' as const,
      },
    ],
    [],
  );

  return (
    <div>
      <Button variant="base-primary" onClick={() => setOpen(true)}>
        開啟通知中心（含篩選 Dropdown）
      </Button>
      <NotificationCenterDrawer
        drawerSize="narrow"
        filterBarAllRadioLabel="全部"
        filterBarDefaultValue="all"
        filterBarOnRadioChange={(e) => setFilter(e.target.value)}
        filterBarOnSelect={(opt) => alert(`已選擇：${opt.name}`)}
        filterBarOptions={filterOptions}
        filterBarReadRadioLabel="已讀"
        filterBarShow
        filterBarShowUnreadButton
        filterBarUnreadRadioLabel="未讀"
        filterBarValue={filter}
        notificationList={notificationList}
        onClose={() => setOpen(false)}
        open={open}
        title="通知中心"
      />
    </div>
  );
}

export const DrawerWithFilterOptions: DrawerStory = {
  render: () => <DrawerWithFilterOptionsExample />,
};

