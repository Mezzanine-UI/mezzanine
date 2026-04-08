import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznDropdownItem } from './dropdown-item.component';
import { MznDropdownItemCard } from './dropdown-item-card.component';
import { MznDropdownAction } from './dropdown-action.component';
import {
  EditIcon,
  EyeIcon,
  TrashIcon,
  UploadIcon,
  DownloadIcon,
  ClockIcon,
} from '@mezzanine-ui/icons';

export default {
  title: 'Internal/Dropdown/DropdownItem',
  decorators: [
    moduleMetadata({
      imports: [MznDropdownItem, MznDropdownItemCard, MznDropdownAction],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

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
    shortcutKeys: ['delete', 'backspace'],
  },
  { name: '快速搜尋', id: 'search', icon: ClockIcon, shortcutKeys: ['k'] },
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

export const Playground: Story = {
  argTypes: {
    mode: {
      options: ['single', 'multiple'],
      control: { type: 'select' },
      description: 'The selection mode.',
      table: {
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: "'single'" },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether all options are disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    mode: 'single',
    disabled: false,
  },
  render: (args) => ({
    props: {
      ...args,
      options: treeOptions,
      type: 'tree',
      listboxId: 'dropdown-listbox',
    },
    template: `
      <mzn-dropdown-item
        [options]="options"
        [mode]="mode"
        [disabled]="disabled"
        [type]="type"
        [listboxId]="listboxId"
      />
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: {
      iconsOptions,
      actionsOptions,
      actionConfig: {
        showActions: true,
        showTopBar: true,
        cancelText: '取消',
        confirmText: '套用設定',
      },
      onCancel(): void {
        console.log('cancel');
      },
      onConfirm(): void {
        console.log('confirm');
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; position: relative;">
        <div style="font-size: 13px; font-weight: 600;">Icons Dropdown</div>
        <mzn-dropdown-item
          [options]="iconsOptions"
          mode="multiple"
          type="default"
          listboxId="icons-listbox"
        />
        <div style="font-size: 13px; font-weight: 600;">Actions Dropdown</div>
        <mzn-dropdown-item
          [options]="actionsOptions"
          [actionConfig]="actionConfig"
          mode="multiple"
          type="default"
          listboxId="actions-listbox"
          [maxHeight]="'150px'"
          (actionCancelled)="onCancel()"
          (actionConfirmed)="onConfirm()"
        />
      </div>
    `,
  }),
};

@Component({
  selector: 'story-dropdown-item-tree',
  standalone: true,
  imports: [MznDropdownItem],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 20px; position: relative;"
    >
      <div style="font-size: 13px; font-weight: 600;"
        >Single-Select Dropdown</div
      >
      <mzn-dropdown-item
        [options]="treeOptions"
        mode="single"
        type="tree"
        listboxId="tree-single-listbox"
        [value]="singleValue()"
        (selected)="selectSingle($event)"
      />
      <div style="font-size: 13px; font-weight: 600;"
        >Multi-Select Dropdown</div
      >
      <mzn-dropdown-item
        [options]="treeCheckedOptions"
        mode="multiple"
        type="tree"
        listboxId="tree-multi-listbox"
        [value]="multiValue()"
        (selected)="toggleMulti($event)"
      />
    </div>
  `,
})
class DropdownItemTreeComponent {
  readonly treeOptions = treeOptions;
  readonly treeCheckedOptions = treeCheckedOptions;

  readonly singleValue = signal<string | null>(null);
  readonly multiValue = signal<string[]>([]);

  selectSingle(option: DropdownOption): void {
    this.singleValue.set(option.id);
  }

  toggleMulti(option: DropdownOption): void {
    if (option.children && option.children.length > 0) {
      const leafIds = this.getLeafIds(
        option as {
          id: string;
          children?: { id: string; children?: { id: string }[] }[];
        },
      );
      const allSelected = leafIds.every((id) => this.multiValue().includes(id));

      this.multiValue.update((prev) =>
        allSelected
          ? prev.filter((id) => !leafIds.includes(id))
          : [...new Set([...prev, ...leafIds])],
      );
    } else {
      this.multiValue.update((prev) =>
        prev.includes(option.id)
          ? prev.filter((id) => id !== option.id)
          : [...prev, option.id],
      );
    }
  }

  private getLeafIds(option: {
    id: string;
    children?: { id: string; children?: { id: string }[] }[];
  }): string[] {
    if (!option.children || option.children.length === 0) return [option.id];
    return option.children.flatMap((child) => this.getLeafIds(child));
  }
}

export const Tree: Story = {
  decorators: [moduleMetadata({ imports: [DropdownItemTreeComponent] })],
  render: () => ({
    template: `<story-dropdown-item-tree />`,
  }),
};

export const Grouped: Story = {
  render: () => ({
    props: {
      groupedOptions,
      groupedUnderlineOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; position: relative;">
        <div style="font-size: 13px; font-weight: 600;">Grouped Dropdown</div>
        <mzn-dropdown-item
          [options]="groupedOptions"
          mode="single"
          type="grouped"
          listboxId="grouped-listbox"
        />
        <div style="font-size: 13px; font-weight: 600;">Grouped Underline Dropdown</div>
        <mzn-dropdown-item
          [options]="groupedUnderlineOptions"
          mode="single"
          type="grouped"
          listboxId="grouped-underline-listbox"
        />
      </div>
    `,
  }),
};

@Component({
  selector: 'story-dropdown-item-shortcuts',
  standalone: true,
  imports: [MznDropdownItemCard],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 20px; position: relative;"
    >
      <div style="font-size: 13px; font-weight: 600;"
        >Shortcut Keys Dropdown</div
      >
      <div style="margin-bottom: 8px; font-size: 14px; color: #666;">
        請先點擊下拉選單使其獲得焦點，然後按下快捷鍵測試功能。<br />
        支援的快捷鍵：⌘N / Ctrl+N、⌘O / Ctrl+O、⌘S / Ctrl+S、Delete /
        Backspace、K、⌘R / Ctrl+R / F5
      </div>
      <div style="width: 300px; border: 1px solid #ddd; border-radius: 4px;">
        <ul role="listbox" style="list-style: none; margin: 0; padding: 0;">
          @for (option of shortcutOptions; track option.id) {
            <li
              style="display: flex; align-items: center; justify-content: space-between; padding: 0 4px;"
            >
              <mzn-dropdown-item-card
                [mode]="'single'"
                [label]="option.name"
                [prependIcon]="option.icon"
                [validate]="option.validate || 'default'"
                [checked]="selectedId() === option.id"
                checkSite="suffix"
                style="flex: 1;"
                (clicked)="selectedId.set(option.id)"
              />
              <span
                style="font-size: 12px; color: #888; padding-right: 8px; white-space: nowrap;"
                >{{ option.shortcutKeys[0] }}</span
              >
            </li>
          }
        </ul>
      </div>
      @if (selectedId()) {
        <div style="margin-top: 8px; font-size: 14px; color: #333;">
          已選擇：{{ getSelectedName() }}
        </div>
      }
    </div>
  `,
})
class DropdownItemShortcutsComponent {
  readonly selectedId = signal<string | undefined>(undefined);
  readonly shortcutOptions = shortcutOptions;

  getSelectedName(): string {
    return (
      this.shortcutOptions.find((o) => o.id === this.selectedId())?.name ?? ''
    );
  }
}

export const Shortcuts: Story = {
  decorators: [moduleMetadata({ imports: [DropdownItemShortcutsComponent] })],
  render: () => ({
    template: `<story-dropdown-item-shortcuts />`,
  }),
};
