import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import {
  ClockIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  TrashIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import MznTag from '../tag/tag.vue';
import MznDropdownItem from './dropdown-item.vue';

export default {
  component: MznDropdownItem,
  title: 'Internal/Dropdown/DropdownItem',
} as Meta;

type Story = StoryObj<typeof MznDropdownItem>;

const actionsOptions: DropdownOption[] = [
  { name: '顯示通知', id: 'notification', checkSite: 'suffix' },
  { name: '電子郵件通知', id: 'email-notification', checkSite: 'suffix' },
  { name: '啟用雙重驗證', id: 'enable-2fa', checkSite: 'suffix' },
  { name: '自動備份', id: 'auto-backup', checkSite: 'suffix' },
  { name: '深色模式', id: 'dark-mode', checkSite: 'suffix' },
  { name: '自動更新', id: 'auto-update', checkSite: 'suffix' },
];

const iconsOptions: DropdownOption[] = [
  { name: '編輯', id: 'edit', icon: EditIcon },
  { name: '檢視', id: 'view', icon: EyeIcon },
  {
    name: '刪除',
    id: 'delete',
    icon: TrashIcon,
    validate: 'danger',
    showUnderline: true,
  },
  { name: '匯入', id: 'import', icon: UploadIcon },
  { name: '下載', id: 'download', icon: DownloadIcon, showUnderline: true },
  { name: '過去版本', id: 'past-version', icon: ClockIcon },
];

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
      { name: '美國', id: 'us' },
      { name: '加拿大', id: 'ca', showUnderline: true },
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
          { name: 'React.js', id: 'reactjs' },
          { name: 'React Native', id: 'react-native' },
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
          { name: 'React.js', id: 'reactjs', showCheckbox: true },
          { name: 'React Native', id: 'react-native', showCheckbox: true },
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
  },
  {
    name: '開啟',
    id: 'open',
    icon: EyeIcon,
    shortcutKeys: ['ctrl+o', 'cmd+o'],
  },
  {
    name: '儲存',
    id: 'save',
    icon: DownloadIcon,
    shortcutKeys: ['ctrl+s', 'cmd+s'],
  },
  {
    name: '刪除',
    id: 'delete',
    icon: TrashIcon,
    validate: 'danger',
    showUnderline: true,
    shortcutKeys: ['delete', 'backspace'],
  },
  {
    name: '快速搜尋',
    id: 'search',
    icon: ClockIcon,
    shortcutKeys: ['k'],
  },
  {
    name: '重新整理',
    id: 'refresh',
    icon: UploadIcon,
    shortcutKeys: ['ctrl+r', 'cmd+r', 'f5'],
  },
  {
    name: '強制刪除',
    id: 'force-delete',
    icon: TrashIcon,
    validate: 'danger',
    shortcutKeys: ['shift+delete', 'shift+backspace'],
  },
  {
    name: '複製格式',
    id: 'copy-format',
    icon: EditIcon,
    shortcutKeys: ['cmd+option+c', 'ctrl+alt+c'],
  },
  {
    name: '貼上格式',
    id: 'paste-format',
    icon: EditIcon,
    shortcutKeys: ['cmd+option+v', 'ctrl+alt+v'],
  },
  {
    name: '全選',
    id: 'select-all',
    icon: EyeIcon,
    shortcutKeys: ['cmd+a', 'ctrl+a'],
  },
  {
    name: '尋找',
    id: 'find',
    icon: ClockIcon,
    shortcutKeys: ['cmd+f', 'ctrl+f'],
  },
  {
    name: '尋找並取代',
    id: 'find-replace',
    icon: ClockIcon,
    shortcutKeys: ['cmd+shift+f', 'ctrl+shift+f'],
  },
  {
    name: '強制重新整理',
    id: 'force-refresh',
    icon: UploadIcon,
    shortcutKeys: ['cmd+shift+r', 'ctrl+shift+r'],
  },
  {
    name: '開發者工具',
    id: 'devtools',
    icon: DownloadIcon,
    shortcutKeys: ['cmd+option+i', 'ctrl+shift+i'],
  },
];

const stackStyle =
  'display: flex; flex-direction: column; gap: 20px; position: relative';

export const Playground: Story = {
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
    },
  },
  args: {
    activeIndex: null,
    disabled: false,
    listboxId: 'dropdown-listbox',
    mode: 'single',
    options: treeOptions,
    type: 'tree',
  },
  render: (args) => ({
    components: { MznDropdownItem },
    setup: () => ({ args }),
    template: '<MznDropdownItem v-bind="args" />',
  }),
};

export const Basic: Story = {
  args: {
    activeIndex: null,
    disabled: false,
    listboxId: 'dropdown-listbox',
    mode: 'multiple',
    type: 'default',
  },
  render: (args) => ({
    components: { MznDropdownItem, MznTag },
    setup: () => ({
      actionConfig: {
        showActions: true,
        showTopBar: true,
        cancelText: '取消',
        confirmText: '套用設定',
        onCancel: () => {},
        onConfirm: () => {},
      },
      actionsOptions,
      args,
      iconsOptions,
      stackStyle,
    }),
    template: `
      <div :style="stackStyle">
        <MznTag label="Icons Dropdown" />
        <MznDropdownItem v-bind="args" :options="iconsOptions" />
        <MznTag label="Actions Dropdown" />
        <MznDropdownItem
          v-bind="args"
          :options="actionsOptions"
          max-height="150px"
          :action-config="actionConfig"
        />
      </div>
    `,
  }),
};

function getLeafIds(option: DropdownOption): string[] {
  if (!option.children || option.children.length === 0) return [option.id];

  return option.children.flatMap(getLeafIds);
}

export const Tree: Story = {
  args: {
    activeIndex: null,
    disabled: false,
    listboxId: 'dropdown-listbox',
    type: 'tree',
  },
  render: (args) => ({
    components: { MznDropdownItem, MznTag },
    setup: () => {
      const singleValue = ref<string | null>(null);
      const multiValue = ref<string[]>([]);

      return {
        args,
        handleMultiSelect: (option: DropdownOption): void => {
          if (option.children && option.children.length > 0) {
            const leafIds = getLeafIds(option);
            const allSelected = leafIds.every((id) =>
              multiValue.value.includes(id),
            );

            multiValue.value = allSelected
              ? multiValue.value.filter((id) => !leafIds.includes(id))
              : [...new Set([...multiValue.value, ...leafIds])];

            return;
          }

          multiValue.value = multiValue.value.includes(option.id)
            ? multiValue.value.filter((id) => id !== option.id)
            : [...multiValue.value, option.id];
        },
        multiValue,
        singleValue,
        stackStyle,
        treeCheckedOptions,
        treeOptions,
      };
    },
    template: `
      <div :style="stackStyle">
        <MznTag label="Single-Select Dropdown" />
        <MznDropdownItem
          v-bind="args"
          mode="single"
          :options="treeOptions"
          :value="singleValue ?? undefined"
          @select="singleValue = $event.id"
        />
        <MznTag label="Multi-Select Dropdown" />
        <MznDropdownItem
          v-bind="args"
          mode="multiple"
          :options="treeCheckedOptions"
          :value="multiValue"
          @select="handleMultiSelect"
        />
      </div>
    `,
  }),
};

export const Grouped: Story = {
  args: {
    activeIndex: null,
    disabled: false,
    listboxId: 'dropdown-listbox',
    type: 'grouped',
  },
  render: (args) => ({
    components: { MznDropdownItem, MznTag },
    setup: () => ({
      args,
      groupedOptions,
      groupedUnderlineOptions,
      stackStyle,
    }),
    template: `
      <div :style="stackStyle">
        <MznTag label="Grouped Dropdown" />
        <MznDropdownItem v-bind="args" :options="groupedOptions" />
        <MznTag label="Grouped Underline Dropdown" />
        <MznDropdownItem v-bind="args" :options="groupedUnderlineOptions" />
      </div>
    `,
  }),
};

export const Shortcuts: Story = {
  args: {
    activeIndex: null,
    disabled: false,
    listboxId: 'dropdown-listbox',
    mode: 'single',
    type: 'default',
  },
  render: (args) => ({
    components: { MznDropdownItem, MznTag },
    setup: () => {
      const selectedId = ref<string | undefined>(undefined);

      return {
        args,
        selectedId,
        selectedName: () =>
          shortcutOptions.find((opt) => opt.id === selectedId.value)?.name,
        shortcutOptions,
        stackStyle,
      };
    },
    template: `
      <div :style="stackStyle">
        <MznTag label="Shortcut Keys Dropdown" />
        <div style="margin-bottom: 8px; font-size: 14px; color: #666">
          請先點擊下拉選單使其獲得焦點，然後按下快捷鍵測試功能。
          <br />
          支援的快捷鍵：⌘N / Ctrl+N、⌘O / Ctrl+O、⌘S / Ctrl+S、Delete /
          Backspace、K、⌘R / Ctrl+R / F5
          <br />
          注意：單一按鈕（如 K）需要不按任何修飾鍵才能觸發
        </div>
        <MznDropdownItem
          v-bind="args"
          :options="shortcutOptions"
          :value="selectedId"
          @select="selectedId = $event.id"
        />
        <div
          v-if="selectedId"
          style="margin-top: 8px; font-size: 14px; color: #333"
        >
          已選擇：{{ selectedName() }}
        </div>
      </div>
    `,
  }),
};
