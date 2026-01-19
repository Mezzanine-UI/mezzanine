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
} satisfies Meta<typeof NotificationCenter>;

type Story = StoryObj<NotificationData & { reference?: string }>;

const severities: NotificationSeverity[] = ['success', 'warning', 'error', 'info'];

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

      const onConfirm = () => {
        console.log('onConfirm');
      };
      const onCancel = () => {
        console.log('onCancel');
      };

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
    () => severities.map((severity, index) => `notification-${severity}-${index}`),
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
  reference: Key;
  type: 'drawer';
};

function AddMethodExample() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationDataForDrawer[]>([]);

  const handleViewAll = () => {
    setDrawerOpen(true);
  };

  const handleAddSuccess = () => {
    const reference = NotificationCenter.add({
      severity: 'success',
      title: '操作成功',
      description: '使用 NotificationCenter.add 方法添加的通知',
      type: 'notification',
      onConfirm: () => {
        NotificationCenter.remove(reference);
      },
      onCancel: () => {
        NotificationCenter.remove(reference);
      },
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      onViewAll: handleViewAll,
    });

    setNotifications([
      ...notifications,
      {
        reference: reference,
        type: 'drawer' as const,
        severity: 'success',
        title: '操作成功',
        description: '使用 NotificationCenter.add 方法添加的通知',
        timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        prependTips: '今天',
      },
    ]);
  };

  const handleAddError = () => {
    const reference = NotificationCenter.add({
      severity: 'error',
      title: '操作失敗',
      description: '這是一個錯誤通知，使用 add 方法添加',
      type: 'notification',
      onClose: () => {
        NotificationCenter.remove(reference);
      },
      onViewAll: handleViewAll,
    });

    setNotifications([
      ...notifications,
      {
        reference: reference,
        type: 'drawer' as const,
        severity: 'error',
        title: '操作失敗',
        description: '這是一個錯誤通知，使用 add 方法添加',
        timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        prependTips: '今天',
      },
    ]);
  };

  const handleAddWarning = () => {
    const reference = NotificationCenter.add({
      severity: 'warning',
      title: '警告',
      description: '這是一個警告通知，可以通過 reference 來控制',
      type: 'notification',
      onViewAll: handleViewAll,
    });

    setTimeout(() => {
      NotificationCenter.remove(reference);
    }, 3000);

    setNotifications([
      ...notifications,
      {
        reference: reference,
        type: 'drawer' as const,
        severity: 'warning',
        title: '警告',
        description: '這是一個警告通知，可以通過 reference 來控制',
        timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        prependTips: '今天',
      },
    ]);
  };

  const handleAddInfo = () => {
    const reference = NotificationCenter.add({
      severity: 'info',
      title: '資訊通知',
      description: '這是一個資訊通知，展示 add 方法的基本用法',
      type: 'notification',
      duration: 5000,
      onViewAll: handleViewAll,
    });

    setNotifications([
      ...notifications,
      {
        reference: reference,
        type: 'drawer' as const,
        severity: 'info',
        title: '資訊通知',
        description: '這是一個資訊通知，展示 add 方法的基本用法',
        timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        prependTips: '今天',
      },
    ]);
  };

  const handleAddMultiple = () => {
    severities.forEach((severity, index) => {
      setTimeout(() => {
        const reference = NotificationCenter.add({
          severity,
          title: `${severity} 通知`,
          description: `這是第 ${index + 1} 個通知`,
          type: 'notification',
          onViewAll: handleViewAll,
        });

        setNotifications((prev) => [
          ...prev,
          {
            reference: reference,
            type: 'drawer' as const,
            severity: severity as NotificationSeverity,
            title: `${severity} 通知`,
            description: `這是第 ${index + 1} 個通知`,
            timeStamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            prependTips: '今天',
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
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="通知中心"
        drawerSize="narrow"
        showToolbar
        allRadioLabel="全部"
        readRadioLabel="已讀"
        unreadRadioLabel="未讀"
        defaultValue="all"
        value="all"
        onRadioChange={(e) => console.log(e.target.value)}
        notificationList={notifications}
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

  const badgeOptions = useMemo<DropdownOption[]>(
    () => [
      {
        name: '標示已讀',
        id: 'mark',
      },
      {
        name: '刪除通知',
        id: 'delete',
      },
    ],
    [],
  );

  const handleBadgeSelect = (option: DropdownOption) => {
    console.log(option);
  };

  return (
    <div>
      <Button variant="base-primary" onClick={() => setOpen(true)}>
        開啟通知中心
      </Button>
      <NotificationCenterDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="通知中心"
        drawerSize="narrow"
        showToolbar
        allRadioLabel="全部"
        readRadioLabel="已讀"
        unreadRadioLabel="未讀"
        defaultValue="all"
        value="all"
        onRadioChange={(e) => console.log(e.target.value)}
      >
        <NotificationCenter
          type="drawer"
          severity="info"
          title="系統更新通知"
          description="系統已完成更新，您現在可以使用最新版本功能。"
          timeStamp="2025-12-15 10:00:00"
          prependTips="今天"
          reference="1"
        />
        <NotificationCenter
          type="drawer"
          severity="warning"
          title="帳號安全提醒"
          description="您的登入地點異常，請確認是否為本人操作。"
          timeStamp="2025-12-14 10:00:00"
          prependTips="昨天"
          reference="2"
        />
        <NotificationCenter
          type="drawer"
          severity="success"
          title="已上傳完成"
          description="您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。"
          timeStamp="2025-12-14 10:00:00"
          reference="3"
        />
        <NotificationCenter
          type="drawer"
          severity="error"
          title="上傳失敗"
          showBadge
          description="您的檔案「月報表.pdf」上傳失敗，請重新上傳。"
          timeStamp="2025-12-14 10:00:00"
          options={badgeOptions}
          onBadgeSelect={handleBadgeSelect}
          reference="4"
        />
        <NotificationCenter
          type="drawer"
          severity="info"
          title="資料更新通知"
          description="後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。"
          timeStamp="2025-12-14 10:00:00"
          reference="5"
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
        reference: '1',
        type: 'drawer' as const,
        severity: 'info' as NotificationSeverity,
        title: '系統更新通知',
        description: '系統已完成更新，您現在可以使用最新版本功能。',
        timeStamp: '2025-12-15 10:00:00',
        prependTips: '今天',
      },
      {
        reference: '2',
        type: 'drawer' as const,
        severity: 'warning' as NotificationSeverity,
        title: '帳號安全提醒',
        description: '您的登入地點異常，請確認是否為本人操作。',
        timeStamp: '2025-12-14 10:00:00',
        prependTips: '昨天',
      },
      {
        reference: '3',
        type: 'drawer' as const,
        severity: 'success' as NotificationSeverity,
        title: '已上傳完成',
        description: '您的檔案「月報表.pdf」已成功上傳，可前往資料庫查看結果。',
        timeStamp: '2025-12-14 10:00:00',
      },
      {
        reference: '4',
        type: 'drawer' as const,
        severity: 'error' as NotificationSeverity,
        title: '上傳失敗',
        showBadge: true,
        description: '您的檔案「月報表.pdf」上傳失敗，請重新上傳。',
        timeStamp: '2025-12-14 10:00:00',
        options: [
          {
            name: '標示已讀',
            id: 'mark',
          },
          {
            name: '刪除通知',
            id: 'delete',
          },
        ] as DropdownOption[],
        onBadgeSelect: (option: DropdownOption) => {
          console.log(option);
        },
      },
      {
        reference: '5',
        type: 'drawer' as const,
        severity: 'info' as NotificationSeverity,
        title: '資料更新通知',
        description:
          '後端資料庫已完成更新，若您在操作中遇到延遲，屬正常現象，稍後即會改善。',
        timeStamp: '2025-12-14 10:00:00',
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
        open={open}
        onClose={() => setOpen(false)}
        title="通知中心"
        drawerSize="narrow"
        showToolbar
        allRadioLabel="全部"
        readRadioLabel="已讀"
        unreadRadioLabel="未讀"
        defaultValue="all"
        value="all"
        onRadioChange={(e) => console.log(e.target.value)}
        notificationList={notificationList}
      />
    </div>
  );
}

export const DrawerWithNotificationList: DrawerStory = {
  render: () => <DrawerWithNotificationListExample />,
};


function DrawerWithCustomToolbarExample() {
  const [open, setOpen] = useState(false);

  const notificationList = useMemo(
    () => [
      {
        reference: '1',
        type: 'drawer' as const,
        severity: 'info' as NotificationSeverity,
        title: '系統更新通知',
        description: '系統已完成更新，您現在可以使用最新版本功能。',
        timeStamp: '2025-12-15 10:00:00',
      },
      {
        reference: '2',
        type: 'drawer' as const,
        severity: 'warning' as NotificationSeverity,
        title: '帳號安全提醒',
        description: '您的登入地點異常，請確認是否為本人操作。',
        timeStamp: '2025-12-14 10:00:00',
      },
    ],
    [],
  );

  return (
    <div>
      <Button variant="base-primary" onClick={() => setOpen(true)}>
        開啟通知中心（自定義工具列）
      </Button>
      <NotificationCenterDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="通知中心"
        drawerSize="narrow"
        showToolbar
        allRadioLabel="全部通知"
        readRadioLabel="已讀"
        unreadRadioLabel="未讀"
        customRadioLabel="全部已讀"
        defaultValue="all"
        value="all"
        onRadioChange={(e) => console.log(e.target.value)}
        onCustomButtonClick={() => console.log('全部已讀')}
        notificationList={notificationList}
      />
    </div>
  );
}

export const DrawerWithCustomToolbar: DrawerStory = {
  render: () => <DrawerWithCustomToolbarExample />,
};


function DrawerEmptyExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="base-primary" onClick={() => setOpen(true)}>
        開啟通知中心（空狀態）
      </Button>
      <NotificationCenterDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="通知中心"
        drawerSize="narrow"
        showToolbar
        allRadioLabel="全部"
        readRadioLabel="已讀"
        unreadRadioLabel="未讀"
        defaultValue="all"
        value="all"
        onRadioChange={(e) => console.log(e.target.value)}
        notificationList={[]}
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
    notifications.push({
      reference: 'today-30min',
      type: 'drawer' as const,
      severity: 'info' as NotificationSeverity,
      title: '今天 - 30分鐘前',
      description: '這是30分鐘前的通知，應該顯示「30 分鐘前」',
      timeStamp: today30minAgo.toISOString().replace('T', ' ').slice(0, 19),
      prependTips: '今天',
    });

    const today2hoursAgo = new Date(now);
    today2hoursAgo.setHours(now.getHours() - 2);
    notifications.push({
      reference: 'today-2hours',
      type: 'drawer' as const,
      severity: 'success' as NotificationSeverity,
      title: '今天 - 2小時前',
      description: '這是2小時前的通知，應該顯示「2 小時前」',
      timeStamp: today2hoursAgo.toISOString().replace('T', ' ').slice(0, 19),
    });

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    yesterday.setHours(10, 0, 0);
    notifications.push({
      reference: 'yesterday',
      type: 'drawer' as const,
      severity: 'warning' as NotificationSeverity,
      title: '昨天',
      description: '這是昨天的通知，應該顯示「1 天前」',
      timeStamp: yesterday.toISOString().replace('T', ' ').slice(0, 19),
      prependTips: '昨天',
    });

    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    twoDaysAgo.setHours(14, 30, 0);
    notifications.push({
      reference: '2days-ago',
      type: 'drawer' as const,
      severity: 'info' as NotificationSeverity,
      title: '過去7天 - 2天前',
      description: '這是2天前的通知，應該顯示「2 天前」',
      timeStamp: twoDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
      prependTips: '過去 7 天',
    });

    const fourDaysAgo = new Date(now);
    fourDaysAgo.setDate(now.getDate() - 4);
    fourDaysAgo.setHours(9, 15, 0);
    notifications.push({
      reference: '4days-ago',
      type: 'drawer' as const,
      severity: 'success' as NotificationSeverity,
      title: '過去7天 - 4天前',
      description: '這是4天前的通知，應該顯示「4 天前」',
      timeStamp: fourDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
    });

    const sixDaysAgo = new Date(now);
    sixDaysAgo.setDate(now.getDate() - 6);
    sixDaysAgo.setHours(16, 45, 0);
    notifications.push({
      reference: '6days-ago',
      type: 'drawer' as const,
      severity: 'warning' as NotificationSeverity,
      title: '過去7天 - 6天前',
      description: '這是6天前的通知，應該顯示「6 天前」',
      timeStamp: sixDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
    });

    const eightDaysAgo = new Date(now);
    eightDaysAgo.setDate(now.getDate() - 8);
    eightDaysAgo.setHours(20, 8, 0);
    notifications.push({
      reference: '8days-ago-with-time',
      type: 'drawer' as const,
      severity: 'error' as NotificationSeverity,
      title: '超過7天 - 有時間戳',
      description: '這是8天前的通知（有時間戳），應該顯示「2025-XX-XX 20:08」格式',
      timeStamp: eightDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
      prependTips: '更早',
    });

    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(now.getDate() - 10);
    notifications.push({
      reference: '10days-ago-no-time',
      type: 'drawer' as const,
      severity: 'info' as NotificationSeverity,
      title: '超過7天 - 無時間戳',
      description: '這是10天前的通知（無時間戳），應該顯示「2025-XX-XX」格式',
      timeStamp: tenDaysAgo.toISOString().split('T')[0],
    });

    const elevenDaysAgo = new Date(now);
    elevenDaysAgo.setDate(now.getDate() - 11);
    elevenDaysAgo.setHours(15, 30, 0);
    notifications.push({
      reference: '11days-ago-with-time',
      type: 'drawer' as const,
      severity: 'success' as NotificationSeverity,
      title: '超過7天 - 有時間戳（11天前）',
      description: '這是11天前的通知（有時間戳），應該顯示「2025-XX-XX 15:30」格式',
      timeStamp: elevenDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
    });

    const twelveDaysAgo = new Date(now);
    twelveDaysAgo.setDate(now.getDate() - 12);
    twelveDaysAgo.setHours(15, 30, 0);
    notifications.push({
      reference: '12days-ago-with-time',
      type: 'drawer' as const,
      severity: 'warning' as NotificationSeverity,
      title: '超過7天 - 有時間戳（12天前）',
      description: '這是12天前的通知（有時間戳），應該顯示「2025-XX-XX 15:30」格式',
      timeStamp: elevenDaysAgo.toISOString().replace('T', ' ').slice(0, 19),
    });

    return notifications;
  }, []);

  return (
    <div>
      <Button variant="base-primary" onClick={() => setOpen(true)}>
        開啟通知中心（時間戳記範例）
      </Button>
      <NotificationCenterDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="通知中心 - 時間戳記顯示範例"
        drawerSize="narrow"
        showToolbar
        allRadioLabel="全部"
        readRadioLabel="已讀"
        unreadRadioLabel="未讀"
        defaultValue="all"
        value="all"
        onRadioChange={(e) => console.log(e.target.value)}
        notificationList={notificationList}
      />
    </div>
  );
}

export const DrawerTimeStamp: DrawerStory = {
  render: () => <DrawerTimeStampExample />,
};
