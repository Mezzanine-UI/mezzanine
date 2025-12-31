import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';

import { ClockIcon, DownloadIcon, EditIcon, EyeIcon, TrashIcon, UploadIcon } from '@mezzanine-ui/icons';
import Tag from '../Tag';
import DropdownItem, { DropdownItemProps } from './DropdownItem';

export default {
  title: 'Data Entry/Dropdown/DropdownItem',
  component: DropdownItem,
} satisfies Meta<typeof DropdownItem>;

type Story = StoryObj<DropdownItemProps>;

const actionsOptions: DropdownOption[] = [
  { name: '顯示通知', id: 'notification', checkSite: 'prepend' },
  { name: '電子郵件通知', id: 'email-notification', checkSite: 'prepend' },
  { name: '啟用雙重驗證', id: 'enable-2fa', checkSite: 'prepend' },
  { name: '自動備份', id: 'auto-backup', checkSite: 'prepend' },
  { name: '深色模式', id: 'dark-mode', checkSite: 'prepend' },
  { name: '自動更新', id: 'auto-update', checkSite: 'prepend' },
]

const iconsOptions: DropdownOption[] = [
  { name: '編輯', id: 'edit', icon: EditIcon },
  { name: '檢視', id: 'view', icon: EyeIcon },
  { name: '刪除', id: 'delete', icon: TrashIcon, validate: 'danger', showUnderline: true },
  { name: '匯入', id: 'import', icon: UploadIcon },
  { name: '下載', id: 'download', icon: DownloadIcon, showUnderline: true },
  { name: '過去版本', id: 'past-version', icon: ClockIcon },
]

const groupedOptions: DropdownOption[] = [
  {
    name: '北美洲',
    id: 'north-america',
    children: [
      { name: '美國', id: 'us' },
      { name: '加拿大', id: 'ca' },
    ],
  },
  {
    name: '亞洲',
    id: 'asia',
    children: [
      { name: '台灣', id: 'tw' },
      { name: '日本', id: 'jp' },
    ],
  },
];

const groupedUnderlineOptions: DropdownOption[] = [
  {
    name: '北美洲',
    id: 'north-america',
    children: [
      {
        name: '美國',
        id: 'us'
      },
      {
        name: '加拿大',
        id: 'ca',
        showUnderline: true
      },
    ],
  },
  {
    name: '亞洲',
    id: 'asia',
    children: [
      { name: '台灣', id: 'tw' },
      { name: '日本', id: 'jp' },
    ],
  },
];

const treeOptions: DropdownOption[] = [
  {
    name: 'JavaScript',
    id: 'javascript',
    children: [
      {
        name: 'React',
        id: 'react',
        children: [
          {
            name: 'React.js',
            id: 'reactjs'
          },
          {
            name: 'React Native',
            id: 'react-native'
          },
        ],
      },
      { name: 'Vue', id: 'vue' },
      { name: 'Angular', id: 'angular' },
    ],
  },
];

const treeCheckedOptions: DropdownOption[] = [
  {
    name: 'JavaScript',
    id: 'javascript',
    showCheckbox: true,
    children: [
      {
        name: 'React',
        id: 'react',
        showCheckbox: true,
        children: [
          {
            name: 'React.js',
            id: 'reactjs',
            showCheckbox: true
          },
          {
            name: 'React Native',
            id: 'react-native',
            showCheckbox: true
          },
        ],
      },
      { name: 'Vue', id: 'vue', showCheckbox: true },
      { name: 'Angular', id: 'angular', showCheckbox: true },
    ],
  },
];

const shortcutOptions: DropdownOption[] = [
  {
    name: '新增',
    id: 'new',
    icon: EditIcon,
    shortcutKeys: ['ctrl+n', 'cmd+n'],
    shortcutText: '⌘N / Ctrl+N',
  },
  {
    name: '開啟',
    id: 'open',
    icon: EyeIcon,
    shortcutKeys: ['ctrl+o', 'cmd+o'],
    shortcutText: '⌘O / Ctrl+O',
  },
  {
    name: '儲存',
    id: 'save',
    icon: DownloadIcon,
    shortcutKeys: ['ctrl+s', 'cmd+s'],
    shortcutText: '⌘S / Ctrl+S',
  },
  {
    name: '刪除',
    id: 'delete',
    icon: TrashIcon,
    validate: 'danger',
    showUnderline: true,
    shortcutKeys: ['delete', 'backspace'],
    shortcutText: 'Delete / Backspace',
  },
  {
    name: '快速搜尋',
    id: 'search',
    icon: ClockIcon,
    shortcutKeys: ['k'],
    shortcutText: 'K',
  },
  {
    name: '重新整理',
    id: 'refresh',
    icon: UploadIcon,
    shortcutKeys: ['ctrl+r', 'cmd+r', 'f5'],
    shortcutText: '⌘R / Ctrl+R / F5',
  },
];


export const Playground: Story = {
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    options: treeOptions,
    mode: 'single',
    disabled: false,
    activeIndex: null,
    listboxId: 'dropdown-listbox',
    type: 'tree',
  },
  render: (args) => <DropdownItem {...args} />
};

export const Basic: Story = {
  args: {
    disabled: false,
    activeIndex: null,
    listboxId: 'dropdown-listbox',
    type: 'default',
    mode: 'multiple'
  },
  render: (args) => {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        position: 'relative',
      }}>
        <Tag label="Icons Dropdown" />
        <DropdownItem
          {...args}
          options={iconsOptions}
        />
        <Tag label="Actions Dropdown" />
        <DropdownItem
          {...args}
          options={actionsOptions}
          maxHeight="150px"
          actionConfig={{
            showActions: true,
            showTopBar: true,
            cancelText: '取消',
            confirmText: '套用設定',
            onCancel: () => { },
            onConfirm: () => { },
          }}
        />
      </div>
    );
  }
}

export const Tree: Story = {
  args: {
    disabled: false,
    activeIndex: null,
    listboxId: 'dropdown-listbox',
    type: 'tree',
  },
  render: (args) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      position: 'relative',
    }}>
      <Tag label="Single-Select Dropdown" />
      <DropdownItem
        {...args}
        options={treeOptions}
        mode="single"
      />
      <Tag label="Multi-Select Dropdown" />
      <DropdownItem
        {...args}
        options={treeCheckedOptions}
        mode="multiple"
      />
    </div>
  )
};

export const Grouped: Story = {
  args: {
    disabled: false,
    activeIndex: null,
    listboxId: 'dropdown-listbox',
    type: 'grouped',
  },
  render: (args) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      position: 'relative',
    }}>
      <Tag label="Grouped Dropdown" />
      <DropdownItem {...args} options={groupedOptions} />
      <Tag label="Grouped Underline Dropdown" />
      <DropdownItem {...args} options={groupedUnderlineOptions} />
    </div>
  )
}

export const Shortcuts: Story = {
  args: {
    disabled: false,
    activeIndex: null,
    listboxId: 'dropdown-listbox',
    type: 'default',
    mode: 'single',
  },
  render: (args) => {
    const ShortcutsExample = () => {
      const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          position: 'relative',
        }}>
          <Tag label="Shortcut Keys Dropdown" />
          <div style={{ marginBottom: 8, fontSize: '14px', color: '#666' }}>
            請先點擊下拉選單使其獲得焦點，然後按下快捷鍵測試功能。
            <br />
            支援的快捷鍵：⌘N / Ctrl+N、⌘O / Ctrl+O、⌘S / Ctrl+S、Delete / Backspace、K、⌘R / Ctrl+R / F5
            <br />
            注意：單一按鈕（如 K）需要不按任何修飾鍵才能觸發
          </div>
          <DropdownItem
            {...args}
            options={shortcutOptions}
            value={selectedId}
            onSelect={(option) => {
              setSelectedId(option.id);
            }}
          />
          {selectedId && (
            <div style={{ marginTop: 8, fontSize: '14px', color: '#333' }}>
              已選擇：{shortcutOptions.find((opt) => opt.id === selectedId)?.name}
            </div>
          )}
        </div>
      );
    };

    return <ShortcutsExample />;
  },
};