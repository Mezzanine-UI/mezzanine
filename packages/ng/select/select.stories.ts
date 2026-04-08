import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznSelect } from './select.component';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';

export default {
  title: 'Data Entry/Select',
  decorators: [
    moduleMetadata({
      imports: [FormsModule, MznSelect],
    }),
  ],
  argTypes: {
    clearable: {
      control: { type: 'boolean' },
      description: '是否顯示清除按鈕',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: { type: 'boolean' },
      description: '是否為錯誤狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '是否撐滿父容器寬度',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: { type: 'boolean' },
      description: '是否顯示載入狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    loadingText: {
      control: { type: 'text' },
      description: '載入狀態顯示的文字',
    },
    menuMaxHeight: {
      control: { type: 'number' },
      description: '下拉選單最大高度',
    },
    mode: {
      control: { type: 'select' },
      options: ['single', 'multiple'],
      description: '選擇模式',
      table: { defaultValue: { summary: 'single' } },
    },
    overflowStrategy: {
      control: { type: 'select' },
      options: ['counter', 'wrap'],
      description: '多選時 tag 的溢出策略（僅 multiple 模式有效）',
      table: { defaultValue: { summary: 'counter' } },
    },
    placeholder: {
      control: { type: 'text' },
      description: '未選擇時的提示文字',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: '是否為唯讀狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    required: {
      control: { type: 'boolean' },
      description: '是否為必填',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: { type: 'select' },
      options: ['main', 'sub'],
      description: '輸入框尺寸',
      table: { defaultValue: { summary: 'main' } },
    },
  },
} satisfies Meta;

type Story = StoryObj;

const basicOptions: DropdownOption[] = [
  { id: '1', name: 'item1 has very long description' },
  { id: '2', name: 'item2 has very long description' },
  { id: '3', name: 'item3 has very long description' },
  { id: '4', name: 'item4 has very long description' },
  { id: '5', name: 'item5 has very long description' },
];

const simpleOptions: DropdownOption[] = [
  { id: '1', name: 'item1' },
  { id: '2', name: 'item2' },
  { id: '3', name: 'item3' },
];

const multipleOptions: DropdownOption[] = [
  { id: '1', name: 'item123' },
  { id: '2', name: 'item26666' },
  { id: '3', name: 'item3' },
];

export const Basic: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      simpleOptions,
      basicOptions,
      multipleOptions,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(2, 300px); gap: 16px; align-items: center;">
        <mzn-select
          [clearable]="true"
          [fullWidth]="true"
          [required]="true"
          [options]="basicOptions"
          placeholder="預設文字"
        />
        <mzn-select
          [disabled]="true"
          [fullWidth]="true"
          [options]="simpleOptions"
          placeholder="預設文字"
        />
        <mzn-select
          [error]="true"
          [fullWidth]="true"
          [options]="simpleOptions"
          placeholder="預設文字"
        />
        <mzn-select
          [clearable]="true"
          [fullWidth]="true"
          mode="multiple"
          [options]="multipleOptions"
          placeholder="我是多選"
        />
      </div>
    `,
  }),
};

export const Size: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      options: simpleOptions,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(2, 300px); gap: 16px; align-items: center;">
        <div>
          <p style="margin-bottom: 8px;">size = main (default)</p>
          <mzn-select
            [fullWidth]="true"
            [options]="options"
            placeholder="預設文字"
            size="main"
          />
        </div>
        <div>
          <p style="margin-bottom: 8px;">size = sub</p>
          <mzn-select
            [fullWidth]="true"
            [options]="options"
            placeholder="預設文字"
            size="sub"
          />
        </div>
      </div>
    `,
  }),
};

export const Multiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      options: [
        { id: '1', name: 'item1' },
        { id: '2', name: 'item2' },
        { id: '3', name: 'item3' },
        { id: '4', name: 'item4' },
        { id: '5', name: 'item5' },
        { id: '6', name: 'item6' },
      ] as DropdownOption[],
    },
    template: `
      <div style="max-width: 300px;">
        <mzn-select
          [clearable]="true"
          [fullWidth]="true"
          mode="multiple"
          [options]="options"
          overflowStrategy="wrap"
          placeholder="請選擇多個項目"
        />
      </div>
    `,
  }),
};

export const WithReadOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      options: simpleOptions,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(2, 300px); gap: 16px; align-items: center;">
        <div>
          <p style="margin-bottom: 8px;">readOnly = false (default)</p>
          <mzn-select
            [clearable]="true"
            [fullWidth]="true"
            [options]="options"
            placeholder="預設文字"
          />
        </div>
        <div>
          <p style="margin-bottom: 8px;">readOnly = true</p>
          <mzn-select
            [clearable]="true"
            [fullWidth]="true"
            [options]="options"
            [readOnly]="true"
            placeholder="預設文字"
          />
        </div>
      </div>
    `,
  }),
};

// WithScroll: demonstrates lazy-loading via onReachBottom event
@Component({
  selector: 'story-select-with-scroll',
  standalone: true,
  imports: [MznSelect],
  template: `
    <div style="max-width: 300px;">
      <mzn-select
        [clearable]="true"
        [fullWidth]="true"
        [loading]="loading()"
        loadingText="載入中..."
        [menuMaxHeight]="200"
        [options]="options()"
        placeholder="滾動載入更多"
        (onReachBottom)="loadMore()"
        (onLeaveBottom)="onLeaveBottom()"
      />
    </div>
  `,
})
class SelectWithScrollStoryComponent {
  readonly loading = signal(false);
  readonly options = signal<DropdownOption[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      name: `item${i + 1}`,
    })),
  );

  private isFetching = false;
  private hasReachedBottom = false;

  loadMore(): void {
    if (!this.hasReachedBottom && !this.isFetching) {
      this.hasReachedBottom = true;
      this.isFetching = true;
      this.loading.set(true);

      setTimeout(() => {
        const current = this.options();
        this.options.set([
          ...current,
          ...Array.from({ length: 10 }, (_, i) => ({
            id: String(current.length + i + 1),
            name: `item${current.length + i + 1}`,
          })),
        ]);
        this.loading.set(false);
        this.isFetching = false;
        this.hasReachedBottom = false;
      }, 1000);
    }
  }

  onLeaveBottom(): void {
    this.hasReachedBottom = false;
  }
}

export const WithScroll: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [SelectWithScrollStoryComponent] })],
  render: () => ({
    template: `<story-select-with-scroll />`,
  }),
};

// WithTree: Angular Select does not support nested/tree options (children property).
// The React version renders a multi-level tree using the `children` field on DropdownOption.
// This feature is not implemented in the Angular component.
export const WithTree: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      options: simpleOptions,
    },
    template: `
      <div style="max-width: 300px;">
        <!-- NOTE: Tree/nested options are not yet supported in Angular MznSelect.
             The React version supports a children property on DropdownOption for multi-level
             dropdown rendering. This story shows a flat multiple-select as the closest equivalent. -->
        <mzn-select
          [clearable]="true"
          [fullWidth]="true"
          mode="multiple"
          [options]="options"
          placeholder="請選擇"
        />
      </div>
    `,
  }),
};
