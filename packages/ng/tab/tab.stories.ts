import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FolderIcon } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTabs } from './tabs.component';
import { MznTabItem } from './tab-item.component';

export default {
  title: 'Navigation/Tab',
  decorators: [
    moduleMetadata({
      imports: [MznTabs, MznTabItem],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

/**
 * MznTabs 的 API 文件。
 */
export const TabAPI: Story = {
  tags: ['!dev'],
  argTypes: {
    activeKey: {
      description: "Current TabItem's key (controlled mode).",
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    defaultActiveKey: {
      description:
        "Initial active TabItem's key (uncontrolled mode). Only used when `activeKey` is not set.",
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '0' },
      },
    },
    direction: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
      description: 'The direction of tab.',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
      },
    },
    size: {
      options: ['main', 'sub'],
      control: { type: 'select' },
      description:
        'The size of tab, controls padding around the tab group. `main`: padding-horizontal-spacious + padding-vertical-spacious (top only). `sub`: no padding.',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
      },
    },
    activeKeyChange: {
      description: 'The change event handler of Tab.',
      table: {
        type: { summary: 'EventEmitter<string | number>' },
      },
    },
  },
  args: {
    activeKey: '0',
    direction: 'horizontal',
    size: 'main',
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznTabs [activeKey]="activeKey" [direction]="direction" [size]="size">
        <button mznTabItem key="0">Tab 1</button>
        <button mznTabItem key="1">Tab 2</button>
        <button mznTabItem key="2">Tab 3</button>
      </div>
    `,
  }),
};

/**
 * MznTabItem 的 API 文件。
 */
export const TabItemAPI: Story = {
  tags: ['!dev'],
  argTypes: {
    key: {
      description: 'The unique key of the tab item. **Required.**',
      table: {
        type: { summary: 'string | number' },
      },
    },
    badgeCount: {
      control: { type: 'number' },
      description: 'The badge count to display on the tab item.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the tab item is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the tab item is in error state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      control: false,
      description: 'The icon to display on the tab item.',
      table: {
        type: { summary: 'IconDefinition' },
      },
    },
  },
  args: {
    disabled: false,
    error: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznTabs activeKey="0">
        <button mznTabItem key="0" [disabled]="disabled" [error]="error">Tab 1</button>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-tab-all',
  standalone: true,
  imports: [MznTabs, MznTabItem, MznIcon],
  template: `
    <div style="display: grid; gap: 40px;">
      Basic (Horizontal)
      <div
        mznTabs
        [activeKey]="tabKey()"
        (activeKeyChange)="tabKey.set($event)"
        direction="horizontal"
      >
        <button mznTabItem [key]="'0'">TabItem 1</button>
        <button mznTabItem [key]="'1'">TabItem 2</button>
        <button mznTabItem [key]="'2'">TabItem 3</button>
      </div>
      WithIcon and Badge
      <div
        mznTabs
        [activeKey]="tabKey()"
        (activeKeyChange)="tabKey.set($event)"
        direction="horizontal"
      >
        <button mznTabItem [key]="'0'" [icon]="folderIcon">TabItem 1</button>
        <button mznTabItem [key]="'1'" [icon]="folderIcon">TabItem 2</button>
        <button mznTabItem [key]="'2'" [icon]="folderIcon" [badgeCount]="99"
          >TabItem 3</button
        >
      </div>
      Vertical
      <div
        mznTabs
        [activeKey]="tabKey()"
        (activeKeyChange)="tabKey.set($event)"
        direction="vertical"
      >
        <button mznTabItem [key]="'0'" [icon]="folderIcon">TabItem 1</button>
        <button mznTabItem [key]="'1'" [icon]="folderIcon">TabItem 2</button>
        <button mznTabItem [key]="'2'" [icon]="folderIcon" [badgeCount]="99"
          >TabItem 3</button
        >
        <button mznTabItem [key]="'3'" [icon]="folderIcon" [disabled]="true"
          >Disabled</button
        >
      </div>
      Uncontrolled (defaultActiveKey)
      <div mznTabs [defaultActiveKey]="'1'" direction="vertical">
        <button mznTabItem [key]="'0'" [icon]="folderIcon">TabItem 1</button>
        <button mznTabItem [key]="'1'" [icon]="folderIcon">TabItem 2</button>
        <button mznTabItem [key]="'2'" [icon]="folderIcon">TabItem 3</button>
      </div>
    </div>
  `,
})
class TabAllStoryComponent {
  readonly tabKey = signal<string | number>('0');
  readonly folderIcon = FolderIcon;
}

export const All: Story = {
  decorators: [moduleMetadata({ imports: [TabAllStoryComponent] })],
  render: () => ({
    template: `<story-tab-all />`,
  }),
};

@Component({
  selector: 'story-tab-error',
  standalone: true,
  imports: [MznTabs, MznTabItem, MznIcon],
  template: `
    <div style="display: grid; gap: 40px;">
      Error (Horizontal)
      <div
        mznTabs
        [activeKey]="tabKey()"
        (activeKeyChange)="tabKey.set($event)"
        direction="horizontal"
      >
        <button
          mznTabItem
          [key]="'0'"
          [icon]="folderIcon"
          [badgeCount]="99"
          [error]="true"
          >Tab1</button
        >
        <button mznTabItem [key]="'1'">Tab2</button>
        <button mznTabItem [key]="'2'">Tab3</button>
      </div>
      Error (Vertical)
      <div
        mznTabs
        [activeKey]="tabKey()"
        (activeKeyChange)="tabKey.set($event)"
        direction="vertical"
      >
        <button
          mznTabItem
          [key]="'0'"
          [icon]="folderIcon"
          [badgeCount]="99"
          [error]="true"
          >Tab1</button
        >
        <button mznTabItem [key]="'1'">Tab2</button>
        <button mznTabItem [key]="'2'">Tab3</button>
      </div>
    </div>
  `,
})
class TabErrorStoryComponent {
  readonly tabKey = signal<string | number>('0');
  readonly folderIcon = FolderIcon;
}

export const Error: Story = {
  decorators: [moduleMetadata({ imports: [TabErrorStoryComponent] })],
  render: () => ({
    template: `<story-tab-error />`,
  }),
};

@Component({
  selector: 'story-tab-size',
  standalone: true,
  imports: [MznTabs, MznTabItem],
  template: `
    <div style="display: grid; gap: 48px;">
      分頁列尺寸（Tabs Size） 水平分頁列（Horizontal Tabs）
      <div style="display: grid; gap: 24px;">
        Main
        <div
          mznTabs
          [activeKey]="tabKey()"
          (activeKeyChange)="tabKey.set($event)"
          direction="horizontal"
          size="main"
        >
          @for (t of horizontalTabs; track t) {
            <button mznTabItem [key]="t.key">{{ t.label }}</button>
          }
        </div>
        Sub
        <div
          mznTabs
          [activeKey]="tabKey()"
          (activeKeyChange)="tabKey.set($event)"
          direction="horizontal"
          size="sub"
        >
          @for (t of horizontalTabs; track t) {
            <button mznTabItem [key]="t.key">{{ t.label }}</button>
          }
        </div>
      </div>
      垂直分頁列（Vertical Tabs）
      <div style="display: grid; gap: 24px;">
        Main
        <div
          mznTabs
          [activeKey]="tabKey()"
          (activeKeyChange)="tabKey.set($event)"
          direction="vertical"
          size="main"
        >
          @for (t of verticalTabs; track t) {
            <button mznTabItem [key]="t.key">{{ t.label }}</button>
          }
        </div>
        Sub
        <div
          mznTabs
          [activeKey]="tabKey()"
          (activeKeyChange)="tabKey.set($event)"
          direction="vertical"
          size="sub"
        >
          @for (t of verticalTabs; track t) {
            <button mznTabItem [key]="t.key">{{ t.label }}</button>
          }
        </div>
      </div>
    </div>
  `,
})
class TabSizeStoryComponent {
  readonly tabKey = signal<string | number>('0');

  readonly horizontalTabs = [
    { key: '0', label: 'Tab 1' },
    { key: '1', label: 'Tab 2' },
    { key: '2', label: 'Tab 3' },
    { key: '3', label: 'Tab 4' },
    { key: '4', label: 'Tab 5' },
    { key: '5', label: 'Tab 6' },
    { key: '6', label: 'Tab 7' },
  ];

  readonly verticalTabs = [
    { key: '0', label: 'Tab 1' },
    { key: '1', label: 'Tab 2' },
    { key: '2', label: 'Tab 3' },
    { key: '3', label: 'Tab 4' },
    { key: '4', label: 'Tab 5' },
    { key: '5', label: 'Tab 6' },
    { key: '6', label: 'Tab 7' },
    { key: '7', label: 'Tab 8' },
    { key: '8', label: 'Tab 9' },
    { key: '9', label: 'Tab 10' },
  ];
}

export const TabsSize: Story = {
  decorators: [moduleMetadata({ imports: [TabSizeStoryComponent] })],
  render: () => ({
    template: `<story-tab-size />`,
  }),
};
