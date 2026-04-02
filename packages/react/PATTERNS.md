# Mezzanine UI 常用 UI 模式

> 此檔案為 [`COMPONENTS.md`](./COMPONENTS.md) 的伴隨文件，提供常見 UI 場景的實作範例。
>
> 基於 **v1.0.0**（`@mezzanine-ui/react`）

## 目錄

- [佈局模式（Layout Patterns）](#佈局模式layout-patterns)
- [表單模式（Form Patterns）](#表單模式form-patterns)
- [表格模式（Table Patterns）](#表格模式table-patterns)
- [對話框模式（Dialog Patterns）](#對話框模式dialog-patterns)
- [導航模式（Navigation Patterns）](#導航模式navigation-patterns)
- [載入狀態（Loading States）](#載入狀態loading-states)
- [錯誤處理（Error Handling）](#錯誤處理error-handling)
- [通知提示（Notifications）](#通知提示notifications)

---

## 佈局模式（Layout Patterns）

### 完整頁面佈局 + 右側面板

`Layout` 元件是頂層佈局容器。`Navigation`、`Layout.LeftPanel`、`Layout.Main`、`Layout.RightPanel` 均作為 `Layout` 的直接子元件傳入，順序可任意，`Layout` 會自動排序至正確的 DOM 位置。

```tsx
import { useState } from 'react';
import { Layout, Navigation, NavigationFooter, NavigationHeader, NavigationOption, NavigationOptionCategory, Button, Table } from '@mezzanine-ui/react';
import { HomeIcon, SettingIcon } from '@mezzanine-ui/icons';

function AppWithRightPanel() {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  const handleItemClick = (item: DataItem): void => {
    setSelectedItem(item);
    setRightPanelOpen(true);
  };

  return (
    <Layout>
      <Navigation>
        <NavigationHeader title="品牌名稱" />
        <NavigationOptionCategory title="主選單">
          <NavigationOption icon={HomeIcon} title="首頁" />
          <NavigationOption icon={SettingIcon} title="設定" />
        </NavigationOptionCategory>
        <NavigationFooter />
      </Navigation>

      <Layout.Main>
        <Table
          columns={columns}
          dataSource={data}
          onRow={(record) => ({
            onClick: () => handleItemClick(record),
          })}
        />
      </Layout.Main>

      <Layout.RightPanel defaultWidth={400} open={rightPanelOpen}>
        {selectedItem && (
          <>
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.description}</p>
            <Button onClick={() => setRightPanelOpen(false)}>關閉</Button>
          </>
        )}
      </Layout.RightPanel>
    </Layout>
  );
}
```

### 雙側面板佈局（左 + 右）

```tsx
import { useState } from 'react';
import { Layout, Navigation, NavigationFooter, NavigationHeader, NavigationOption } from '@mezzanine-ui/react';
import { FileIcon, HomeIcon, UserIcon } from '@mezzanine-ui/icons';

function AppWithDualPanels() {
  const [activatedPath, setActivatedPath] = useState(['首頁']);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <Layout>
      <Navigation
        activatedPath={activatedPath}
        onOptionClick={(path) => {
          if (path) setActivatedPath(path);
        }}
      >
        <NavigationHeader title="Mezzanine" />
        <NavigationOption icon={HomeIcon} title="首頁" />
        <NavigationOption icon={FileIcon} title="文件" />
        <NavigationOption icon={UserIcon} title="會員管理" />
        <NavigationFooter />
      </Navigation>

      <Layout.LeftPanel defaultWidth={240} open={leftOpen}>
        <div>
          <h2>左側面板</h2>
          <button onClick={() => setLeftOpen(false)}>關閉</button>
        </div>
      </Layout.LeftPanel>

      <Layout.Main>
        <div>
          <h1>主要內容</h1>
          {!leftOpen && <button onClick={() => setLeftOpen(true)}>開啟左側</button>}
          {!rightOpen && <button onClick={() => setRightOpen(true)}>開啟右側</button>}
        </div>
      </Layout.Main>

      <Layout.RightPanel defaultWidth={320} open={rightOpen}>
        <div>
          <h2>右側面板</h2>
          <button onClick={() => setRightOpen(false)}>關閉</button>
        </div>
      </Layout.RightPanel>
    </Layout>
  );
}
```

> **Props 說明（LayoutRightPanel / LayoutLeftPanel）**
>
> | Prop             | 型別                               | 說明                          |
> | ---------------- | ---------------------------------- | ----------------------------- |
> | `children`       | `ReactNode`                        | 面板內容                      |
> | `className`      | `string`                           | 自訂 class                    |
> | `defaultWidth`   | `number`                           | 初始寬度（px），最小值 240    |
> | `onWidthChange`  | `(width: number) => void`          | 拖曳調整寬度時的回呼          |
> | `open`           | `boolean`                          | 控制面板顯示 / 隱藏           |
> | `scrollbarProps` | `Omit<ScrollbarProps, 'children'>` | 傳遞給內部 Scrollbar 的 props |

---

## 表單模式（Form Patterns）

### 基本表單

```tsx
import { useState } from 'react';
import { Button, FormField, Input, Select } from '@mezzanine-ui/react';

const typeOptions = [
  { id: 'personal', name: '個人' },
  { id: 'business', name: '企業' },
];

function BasicForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<{ id: string; name: string } | null>(null);

  const handleSubmit = () => {
    // 處理表單送出
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="姓名" name="name" required>
        <Input onChange={(e) => setName(e.target.value)} placeholder="請輸入姓名" value={name} />
      </FormField>

      <FormField hintText="我們不會公開您的 Email" label="Email" name="email" required>
        <Input onChange={(e) => setEmail(e.target.value)} placeholder="請輸入 Email" value={email} />
      </FormField>

      <FormField label="類型" name="type">
        <Select onChange={(value) => setType(value)} options={typeOptions} placeholder="請選擇類型" value={type} />
      </FormField>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={() => {}} variant="base-secondary">
          取消
        </Button>
        <Button onClick={handleSubmit} variant="base-primary">
          送出
        </Button>
      </div>
    </form>
  );
}
```

### 表單驗證

```tsx
import { useState } from 'react';
import { FormField, Input } from '@mezzanine-ui/react';
import type { SeverityWithInfo } from '@mezzanine-ui/system/severity';

function FormWithValidation() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setError('Email 為必填');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Email 格式不正確');
      return false;
    }
    setError('');
    return true;
  };

  const severity: SeverityWithInfo = error ? 'error' : 'info';

  return (
    <FormField hintText={error || undefined} label="Email" name="email" required severity={severity}>
      <Input
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        placeholder="請輸入 Email"
        value={email}
      />
    </FormField>
  );
}
```

### 搜尋表單

```tsx
import { useState } from 'react';
import { Button, Input } from '@mezzanine-ui/react';

function SearchForm() {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    // 執行搜尋
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Input clearable onChange={(e) => setKeyword(e.target.value)} placeholder="搜尋..." value={keyword} variant="search" />
      <Button onClick={handleSearch} variant="base-primary">
        搜尋
      </Button>
    </div>
  );
}
```

---

## 表格模式（Table Patterns）

### 基本資料表格

```tsx
import { useState } from 'react';
import { Button, Modal, Table, Tag } from '@mezzanine-ui/react';

function DataTable() {
  const [deleteTarget, setDeleteTarget] = useState<DataItem | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      handleDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '名稱',
    },
    {
      dataIndex: 'status',
      render: (status: string) => <Tag label={status === 'active' ? '啟用' : '停用'} type="static" />,
      title: '狀態',
    },
    {
      dataIndex: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      title: '建立時間',
    },
    {
      render: (_: unknown, record: DataItem) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => handleEdit(record)} size="minor" variant="base-text-link">
            編輯
          </Button>
          <Button onClick={() => setDeleteTarget(record)} size="minor" variant="destructive-text-link">
            刪除
          </Button>
        </div>
      ),
      title: '操作',
    },
  ];

  const data = [
    { createdAt: '2024-01-01', id: '1', name: '項目 1', status: 'active' },
    { createdAt: '2024-01-02', id: '2', name: '項目 2', status: 'inactive' },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} />
      <Modal cancelText="取消" confirmText="刪除" modalType="standard" onCancel={() => setDeleteTarget(null)} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} open={!!deleteTarget} showModalFooter showModalHeader size="narrow" title="確認刪除">
        確定要刪除「{deleteTarget?.name}」嗎？
      </Modal>
    </>
  );
}
```

### 可選取表格

```tsx
import { useState } from 'react';
import { Button, Table } from '@mezzanine-ui/react';
import type { TableRowSelection } from '@mezzanine-ui/react';

function SelectableTable() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const rowSelection: TableRowSelection = {
    onChange: (keys) => setSelectedKeys(keys as string[]),
    selectedRowKeys: selectedKeys,
  };

  const handleBatchDelete = () => {
    // 批次刪除選取項目
  };

  return (
    <div>
      {selectedKeys.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <span>已選取 {selectedKeys.length} 筆</span>
          <Button onClick={handleBatchDelete} size="sub" variant="destructive-secondary">
            批次刪除
          </Button>
        </div>
      )}
      <Table columns={columns} dataSource={data} rowSelection={rowSelection} />
    </div>
  );
}
```

### 分頁表格

```tsx
import { useEffect, useState } from 'react';
import { Pagination, Table, usePagination } from '@mezzanine-ui/react';

function PaginatedTable() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pagination = usePagination({
    current: currentPage,
    onChange: (page) => {
      setCurrentPage(page);
      fetchData(page, 10);
    },
    pageSize: 10,
    total,
  });

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={data} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Pagination {...pagination} />
      </div>
    </div>
  );
}
```

---

## 對話框模式（Dialog Patterns）

### 確認對話框

```tsx
import { Modal } from '@mezzanine-ui/react';

function ConfirmModal({ onClose, onConfirm, open }) {
  return (
    <Modal cancelText="取消" confirmText="刪除" modalType="standard" onCancel={onClose} onClose={onClose} onConfirm={onConfirm} open={open} showModalFooter showModalHeader size="narrow" title="確認刪除">
      確定要刪除此項目嗎？此操作無法復原。
    </Modal>
  );
}
```

### 表單對話框

```tsx
import { useState } from 'react';
import { FormField, Input, Modal } from '@mezzanine-ui/react';

function FormModal({ onClose, onSubmit, open }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ name });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal cancelText="取消" confirmText="確認" loading={loading} modalType="standard" onCancel={onClose} onClose={onClose} onConfirm={handleSubmit} open={open} showModalFooter showModalHeader title="新增項目">
      <FormField label="名稱" name="name" required>
        <Input onChange={(e) => setName(e.target.value)} placeholder="請輸入名稱" value={name} />
      </FormField>
    </Modal>
  );
}
```

### 抽屜詳情頁

```tsx
import { Button, Description, DescriptionContent, DescriptionGroup, Drawer, DrawerBody, DrawerFooter, DrawerHeader } from '@mezzanine-ui/react';

function DetailDrawer({ data, onClose, open }) {
  return (
    <Drawer onClose={onClose} open={open}>
      <DrawerHeader title="項目詳情" />
      <DrawerBody>
        <DescriptionGroup>
          <Description title="名稱">
            <DescriptionContent>{data?.name}</DescriptionContent>
          </Description>
          <Description title="狀態">
            <DescriptionContent>{data?.status}</DescriptionContent>
          </Description>
          <Description title="建立時間">
            <DescriptionContent>{data?.createdAt}</DescriptionContent>
          </Description>
        </DescriptionGroup>
      </DrawerBody>
      <DrawerFooter>
        <Button onClick={onClose} variant="base-secondary">
          取消
        </Button>
        <Button onClick={() => handleEdit(data)} variant="base-primary">
          編輯
        </Button>
      </DrawerFooter>
    </Drawer>
  );
}
```

---

## 導航模式（Navigation Patterns）

### 側邊導航

```tsx
import { useState } from 'react';
import { Navigation, NavigationFooter, NavigationHeader, NavigationOption, NavigationOptionCategory, NavigationUserMenu } from '@mezzanine-ui/react';
import { FileIcon, HomeIcon, SettingIcon } from '@mezzanine-ui/icons';

function SideNavigation() {
  const [activeKey, setActiveKey] = useState('home');

  return (
    <Navigation>
      <NavigationHeader title="品牌名稱" />

      <NavigationOptionCategory title="主選單">
        <NavigationOption active={activeKey === 'home'} icon={HomeIcon} onTriggerClick={() => setActiveKey('home')} title="首頁" />
        <NavigationOption active={activeKey === 'documents'} icon={FileIcon} onTriggerClick={() => setActiveKey('documents')} title="文件" />
      </NavigationOptionCategory>

      <NavigationOptionCategory title="設定">
        <NavigationOption active={activeKey === 'settings'} icon={SettingIcon} onTriggerClick={() => setActiveKey('settings')} title="系統設定" />
      </NavigationOptionCategory>

      <NavigationFooter>
        <NavigationUserMenu imgSrc="/avatar.png" />
      </NavigationFooter>
    </Navigation>
  );
}
```

### 分頁導航（Tab）

```tsx
import { useState } from 'react';
import { Tab, TabItem } from '@mezzanine-ui/react';
import type { Key } from 'react';

function TabNavigation() {
  const [activeKey, setActiveKey] = useState<Key>('overview');

  return (
    <div>
      <Tab activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabItem key="overview">總覽</TabItem>
        <TabItem key="details">詳細資訊</TabItem>
        <TabItem key="history">歷史紀錄</TabItem>
      </Tab>

      {activeKey === 'overview' && <OverviewContent />}
      {activeKey === 'details' && <DetailsContent />}
      {activeKey === 'history' && <HistoryContent />}
    </div>
  );
}
```

---

## 載入狀態（Loading States）

### 頁面載入

```tsx
import { useState } from 'react';
import { Skeleton, Spin } from '@mezzanine-ui/react';

function PageLoading() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin description="載入中..." loading />
      </div>
    );
  }

  return <PageContent data={data} />;
}

// 或使用骨架屏
function PageWithSkeleton() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton height={24} width={200} />
        <Skeleton height={16} style={{ marginTop: 16 }} width="100%" />
        <Skeleton height={16} style={{ marginTop: 8 }} width="100%" />
        <Skeleton height={16} style={{ marginTop: 8 }} width="80%" />
      </div>
    );
  }

  return <PageContent />;
}
```

### 按鈕載入

```tsx
import { useState } from 'react';
import { Button } from '@mezzanine-ui/react';

function SubmitButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await submitData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button loading={loading} onClick={handleClick} variant="base-primary">
      送出
    </Button>
  );
}
```

---

## 錯誤處理（Error Handling）

### 表單錯誤

```tsx
import { FormField, Input, InlineMessageGroup } from '@mezzanine-ui/react';

function FormWithErrors({ errors }) {
  const nameError = errors.find((e) => e.field === 'name');

  return (
    <div>
      {errors.length > 0 && (
        <InlineMessageGroup
          items={errors.map((err) => ({
            content: err.message,
            key: err.field,
            severity: 'error' as const,
          }))}
        />
      )}

      <FormField hintText={nameError?.message} label="名稱" name="name" required severity={nameError ? 'error' : 'info'}>
        <Input placeholder="請輸入名稱" />
      </FormField>
    </div>
  );
}
```

### 空狀態

```tsx
import { Button, Empty } from '@mezzanine-ui/react';

function EmptyState() {
  return (
    <Empty title="尚無資料" type="initial-data">
      <Button onClick={() => handleCreate()}>建立第一筆資料</Button>
    </Empty>
  );
}
```

### 結果狀態頁

```tsx
import { ResultState } from '@mezzanine-ui/react';

function SuccessResult() {
  return (
    <ResultState
      actions={{
        primaryButton: { children: '繼續新增', onClick: () => reset() },
        secondaryButton: { children: '返回列表', onClick: () => navigate('/list') },
      }}
      description="您的變更已成功儲存"
      title="操作成功"
      type="success"
    />
  );
}

function ErrorResult() {
  return (
    <ResultState
      actions={{
        secondaryButton: { children: '重試', onClick: () => retry() },
      }}
      description="發生錯誤，請稍後再試"
      title="操作失敗"
      type="error"
    />
  );
}
```

---

## 通知提示（Notifications）

### Message 訊息提示

```tsx
import { Button, Message } from '@mezzanine-ui/react';

function NotificationExample() {
  const handleSave = async () => {
    try {
      await saveData();
      Message.success('儲存成功');
    } catch (error) {
      Message.error('儲存失敗，請稍後再試');
    }
  };

  return (
    <Button onClick={handleSave} variant="base-primary">
      儲存
    </Button>
  );
}
```

### 通知中心

```tsx
import { Button, NotificationCenter } from '@mezzanine-ui/react';

function NotificationExample() {
  const showNotification = () => {
    NotificationCenter.success({
      description: '您的變更已成功儲存',
      duration: 5000,
      title: '操作成功',
    });
  };

  const showError = () => {
    NotificationCenter.error({
      description: '發生錯誤，請聯絡系統管理員',
      duration: 0, // 不自動關閉
      title: '操作失敗',
    });
  };

  return (
    <div>
      <Button onClick={showNotification}>顯示成功通知</Button>
      <Button onClick={showError}>顯示錯誤通知</Button>
    </div>
  );
}
```

### AlertBanner 警示橫幅

```tsx
import { useState } from 'react';
import { AlertBanner } from '@mezzanine-ui/react';

function PageWithBanner() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div>
      {showBanner && <AlertBanner message="系統將於今晚 22:00 進行維護，預計停機 2 小時。" onClose={() => setShowBanner(false)} severity="warning" />}
      <PageContent />
    </div>
  );
}
```
