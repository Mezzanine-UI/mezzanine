import { Component, input, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznPagination } from './pagination.component';

const meta: Meta = {
  title: 'Navigation/Pagination',
};

export default meta;

type Story = StoryObj;

// ─── Playground ──────────────────────────────────────────────────────────────

@Component({
  selector: 'story-pagination-playground',
  standalone: true,
  imports: [MznPagination],
  template: `
    <nav
      mznPagination
      [boundaryCount]="boundaryCount()"
      [buttonText]="buttonText()"
      [current]="current()"
      [disabled]="disabled()"
      [hintText]="hintText()"
      [inputPlaceholder]="inputPlaceholder()"
      [pageSize]="pageSize()"
      [pageSizeLabel]="pageSizeLabel()"
      [pageSizeOptions]="pageSizeOptions()"
      [renderResultSummary]="showResultSummary() ? resultSummaryFn : undefined"
      [showJumper]="showJumper()"
      [showPageSizeOptions]="showPageSizeOptions()"
      [siblingCount]="siblingCount()"
      [total]="total()"
      (pageChanged)="current.set($event)"
      (pageSizeChanged)="pageSize.set($event)"
    ></nav>
  `,
})
class PaginationPlaygroundComponent {
  readonly boundaryCount = input(1);
  readonly buttonText = input<string | undefined>('確認');
  readonly disabled = input(false);
  readonly hintText = input<string | undefined>('前往');
  readonly inputPlaceholder = input<string | undefined>('1');
  readonly pageSize = input(5);
  readonly pageSizeLabel = input<string | undefined>('每頁顯示：');
  readonly pageSizeOptions = input<readonly number[] | undefined>([
    10, 20, 50, 100,
  ]);
  readonly showJumper = input(false);
  readonly showPageSizeOptions = input(false);
  readonly showResultSummary = input(false);
  readonly siblingCount = input(1);
  readonly total = input(100);

  readonly current = signal(1);

  readonly resultSummaryFn = (
    from: number,
    to: number,
    total: number,
  ): string => `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`;
}

export const Playground: Story = {
  argTypes: {
    boundaryCount: {
      control: 'number',
      description: '首尾始終顯示的頁數。',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    buttonText: {
      control: 'text',
      description: '跳轉按鈕 `button` 的文字內容。',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用所有控制項。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hintText: {
      control: 'text',
      description: '跳轉輸入框 `input` 前方的提示文字。',
      table: { type: { summary: 'string' } },
    },
    inputPlaceholder: {
      control: 'text',
      description: '跳轉輸入框的 placeholder。',
      table: { type: { summary: 'string' } },
    },
    pageSize: {
      control: 'number',
      description: '每頁筆數。',
      table: { type: { summary: 'number' }, defaultValue: { summary: '10' } },
    },
    pageSizeLabel: {
      control: 'text',
      description: '每頁筆數選擇器前方的標籤文字。',
      table: { type: { summary: 'string' } },
    },
    showResultSummary: {
      control: 'boolean',
      description: '是否顯示結果摘要（等效 React `renderResultSummary`）。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showJumper: {
      control: 'boolean',
      description: '是否顯示頁碼跳轉輸入框。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showPageSizeOptions: {
      control: 'boolean',
      description: '是否顯示每頁筆數選擇器。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    siblingCount: {
      control: 'number',
      description: '當前頁兩側顯示的頁數。',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    total: {
      control: 'number',
      description: '總筆數。',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
  },
  args: {
    boundaryCount: 1,
    buttonText: '確認',
    disabled: false,
    hintText: '前往',
    inputPlaceholder: '1',
    pageSize: 5,
    pageSizeLabel: '每頁顯示：',
    showJumper: false,
    showPageSizeOptions: false,
    showResultSummary: false,
    siblingCount: 1,
    total: 100,
  },
  decorators: [moduleMetadata({ imports: [PaginationPlaygroundComponent] })],
  render: (args) => ({
    props: args,
    template: `
      <story-pagination-playground
        [boundaryCount]="boundaryCount"
        [buttonText]="buttonText"
        [disabled]="disabled"
        [hintText]="hintText"
        [inputPlaceholder]="inputPlaceholder"
        [pageSize]="pageSize"
        [pageSizeLabel]="pageSizeLabel"
        [showJumper]="showJumper"
        [showPageSizeOptions]="showPageSizeOptions"
        [showResultSummary]="showResultSummary"
        [siblingCount]="siblingCount"
        [total]="total"
      />
    `,
  }),
};

// ─── All ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'story-pagination-all',
  standalone: true,
  imports: [MznPagination],
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        Basic
        <nav
          mznPagination
          [current]="current()"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[10, 20, 50, 100]"
          [total]="100"
          (pageChanged)="current.set($event)"
          (pageSizeChanged)="pageSize.set($event)"
        ></nav>
      </div>
      <div>
        With Page Size Options
        <nav
          mznPagination
          [showPageSizeOptions]="true"
          [current]="current()"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[10, 20, 50, 100]"
          [pageSizeLabel]="'每頁顯示：'"
          [total]="100"
          (pageChanged)="current.set($event)"
          (pageSizeChanged)="pageSize.set($event)"
        ></nav>
      </div>
      <div>
        With Jumper Options
        <nav
          mznPagination
          [showJumper]="true"
          [current]="current()"
          [pageSize]="pageSize()"
          [total]="100"
          [buttonText]="'確認'"
          [hintText]="'前往'"
          [inputPlaceholder]="'1'"
          (pageChanged)="current.set($event)"
          (pageSizeChanged)="pageSize.set($event)"
        ></nav>
      </div>
      <div>
        Full Featured
        <nav
          mznPagination
          [showPageSizeOptions]="true"
          [showJumper]="true"
          [current]="current()"
          [pageSize]="pageSize()"
          [pageSizeOptions]="[10, 20, 50, 100]"
          [pageSizeLabel]="'每頁顯示：'"
          [buttonText]="'確認'"
          [hintText]="'前往'"
          [inputPlaceholder]="'1'"
          [renderResultSummary]="resultSummaryFn"
          [total]="100"
          (pageChanged)="current.set($event)"
          (pageSizeChanged)="pageSize.set($event)"
        ></nav>
      </div>
      <div>
        Disabled
        <nav
          mznPagination
          [current]="current()"
          [disabled]="true"
          [pageSize]="10"
          [total]="100"
          (pageChanged)="current.set($event)"
        ></nav>
      </div>
    </div>
  `,
})
class PaginationAllStoryComponent {
  readonly current = signal(1);
  readonly pageSize = signal(10);

  readonly resultSummaryFn = (
    from: number,
    to: number,
    total: number,
  ): string => `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`;
}

export const All: Story = {
  decorators: [moduleMetadata({ imports: [PaginationAllStoryComponent] })],
  render: () => ({
    template: `<story-pagination-all />`,
  }),
};

// ─── Docs-only: PaginationItem (hidden from sidebar, used by MDX <Controls>) ─

export const PaginationItemPlayground: Story = {
  tags: ['!dev', '!autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: '是否為目前選中的頁碼。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    page: {
      control: 'number',
      description: '頁碼數字。',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    type: {
      control: 'select',
      options: ['page', 'ellipsis', 'previous', 'next'],
      description: '分頁項目類型。',
      table: {
        type: { summary: "'page' | 'ellipsis' | 'previous' | 'next'" },
        defaultValue: { summary: "'page'" },
      },
    },
  },
  args: { active: false, disabled: false, page: 1, type: 'page' },
  render: () => ({ template: `<div />` }),
};

// ─── Docs-only: PaginationJumper (hidden from sidebar, used by MDX <Controls>)

export const PaginationJumperPlayground: Story = {
  tags: ['!dev', '!autodocs'],
  argTypes: {
    buttonText: {
      control: 'text',
      description: '跳轉按鈕的文字內容。',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用跳轉功能。',
      table: { type: { summary: 'boolean' } },
    },
    hintText: {
      control: 'text',
      description: '跳轉輸入框前方的提示文字。',
      table: { type: { summary: 'string' } },
    },
    inputPlaceholder: {
      control: 'text',
      description: '跳轉輸入框的 placeholder。',
      table: { type: { summary: 'string' } },
    },
    pageSize: {
      control: 'number',
      description: '每頁筆數，用於計算總頁數。',
      table: { type: { summary: 'number' }, defaultValue: { summary: '5' } },
    },
    total: {
      control: 'number',
      description: '總筆數。',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
  },
  args: {
    buttonText: '確認',
    disabled: false,
    hintText: '前往',
    inputPlaceholder: '1',
    pageSize: 5,
    total: 100,
  },
  render: () => ({ template: `<div />` }),
};
