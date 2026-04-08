import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznButton } from '../button/button.directive';
import { MznModal } from '../modal/modal.component';
import { MznModalHeader } from '../modal/modal-header.component';
import { MznModalFooter } from '../modal/modal-footer.component';
import { MznButtonGroup } from '../button/button-group.component';
import { MznDrawer } from './drawer.component';

const meta: Meta<MznDrawer> = {
  title: 'Feedback/Drawer',
  component: MznDrawer,
  decorators: [
    moduleMetadata({
      imports: [MznButton],
    }),
  ],
  argTypes: {
    disableCloseOnBackdropClick: {
      control: { type: 'boolean' },
      description: '是否禁用點擊遮罩關閉',
      table: {
        category: 'Drawer Settings',
        defaultValue: { summary: 'false' },
      },
    },
    disableCloseOnEscapeKeyDown: {
      control: { type: 'boolean' },
      description: '是否禁用 Escape 鍵關閉',
      table: {
        category: 'Drawer Settings',
        defaultValue: { summary: 'false' },
      },
    },
    headerTitle: {
      control: { type: 'text' },
      description: '標題文字',
      table: { category: 'Drawer Settings' },
    },
    isBottomDisplay: {
      control: { type: 'boolean' },
      description: '是否顯示底部操作按鈕區域',
      table: {
        category: 'Drawer Settings',
        defaultValue: { summary: 'false' },
      },
    },
    isHeaderDisplay: {
      control: { type: 'boolean' },
      description: '是否顯示標題列',
      table: {
        category: 'Drawer Settings',
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['narrow', 'medium', 'wide'],
      description: '寬度尺寸',
      table: {
        category: 'Drawer Settings',
        defaultValue: { summary: "'medium'" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<MznDrawer>;

export const Playground: Story = {
  args: {
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    headerTitle: 'Drawer Title',
    isBottomDisplay: true,
    isHeaderDisplay: true,
    size: 'medium',
  },
  render: (args) => ({
    props: {
      ...args,
      open: true,
      ghostAction: { text: '更多選項', variant: 'base-ghost' },
      primaryAction: { text: '儲存變更', variant: 'base-primary' },
      secondaryAction: { text: '取消', variant: 'base-secondary' },
    },
    template: `
      <mzn-drawer
        [open]="open"
        [disableCloseOnBackdropClick]="disableCloseOnBackdropClick"
        [disableCloseOnEscapeKeyDown]="disableCloseOnEscapeKeyDown"
        [headerTitle]="headerTitle"
        [isBottomDisplay]="isBottomDisplay"
        [isHeaderDisplay]="isHeaderDisplay"
        [size]="size"
        [bottomGhostAction]="ghostAction"
        [bottomPrimaryAction]="primaryAction"
        [bottomSecondaryAction]="secondaryAction"
        (bottomGhostActionClick)="open = false"
        (bottomPrimaryActionClick)="open = false"
        (bottomSecondaryActionClick)="open = false"
        (closed)="open = false"
      >
        <p>Drawer content goes here.</p>
      </mzn-drawer>
    `,
  }),
};

export const WithControlBar: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      filter: signal('all'),
    },
    template: `
      <button mznButton variant="base-text-link" (click)="open.set(true)">
        開啟 Drawer (預設控制列)
      </button>
      <mzn-drawer
        [open]="open()"
        headerTitle="內容篩選器"
        size="narrow"
        (closed)="open.set(false)"
      >
        <div mznDrawerFilter style="padding: 8px 16px; border-bottom: 1px solid var(--mzn-color-neutral-20);">
          <p style="margin: 0;">篩選控制項在此。</p>
        </div>
        <div style="padding: 16px;">
          <p>目前篩選: {{ filter() === 'all' ? '全部' : filter() === 'read' ? '進行中' : '已完成' }}</p>
          <p>這是 Drawer 的內容區域</p>
        </div>
        <div mznDrawerBottom style="display: flex; justify-content: flex-end; gap: 8px; padding: 16px;">
          <button mznButton variant="base-secondary" (click)="open.set(false)">取消</button>
          <button mznButton variant="base-primary" (click)="open.set(false)">套用</button>
        </div>
      </mzn-drawer>
    `,
  }),
};

export const WithControlBarButtonOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
    },
    template: `
      <button mznButton variant="base-text-link" (click)="open.set(true)">
        開啟 Drawer (僅控制列按鈕)
      </button>
      <mzn-drawer
        [open]="open()"
        headerTitle="設定"
        size="narrow"
        (closed)="open.set(false)"
      >
        <div mznDrawerFilter style="padding: 8px 16px; display: flex; justify-content: flex-end; border-bottom: 1px solid var(--mzn-color-neutral-20);">
          <button mznButton variant="base-secondary" (click)="onReset()">重置全部</button>
        </div>
        <div style="padding: 16px;">
          <p>這個 Drawer 的控制列只有按鈕，沒有 Radio Group</p>
        </div>
      </mzn-drawer>
    `,
    component: undefined,
  }),
};

export const WithBottomActionStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      loading: signal(false),
    },
    template: `
      <button mznButton variant="base-text-link" (click)="open.set(true)">
        開啟 Drawer (按鈕狀態控制)
      </button>
      <mzn-drawer
        [open]="open()"
        headerTitle="表單提交"
        size="medium"
        (closed)="open.set(false)"
      >
        <div style="padding: 16px;">
          <p>此範例展示如何使用 disabled 和 loading 狀態來控制按鈕的行為和外觀。</p>
          <p>點擊「提交」按鈕會顯示 loading 狀態，並在 2 秒後關閉 Drawer。</p>
        </div>
        <div mznDrawerBottom style="display: flex; justify-content: flex-end; gap: 8px; padding: 16px;">
          <button mznButton variant="base-secondary" [disabled]="loading()" (click)="open.set(false)">返回上一步</button>
          <button mznButton variant="base-ghost" [disabled]="loading()" (click)="open.set(false)">取消</button>
          <button mznButton variant="base-primary" [disabled]="loading()" (click)="open.set(false)">提交</button>
        </div>
      </mzn-drawer>
    `,
  }),
};

export const WithCustomButtonVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
    },
    template: `
      <button mznButton variant="base-text-link" (click)="open.set(true)">
        開啟 Drawer (自訂按鈕樣式)
      </button>
      <mzn-drawer
        [open]="open()"
        headerTitle="自訂按鈕"
        size="medium"
        (closed)="open.set(false)"
      >
        <div style="padding: 16px;">
          <p>此範例展示如何自訂按鈕的 variant、size、icon 和 iconType。</p>
        </div>
        <div mznDrawerBottom style="display: flex; justify-content: flex-end; gap: 8px; padding: 16px;">
          <button mznButton variant="base-text-link" (click)="open.set(false)">關閉</button>
          <button mznButton variant="base-secondary" size="minor" (click)="open.set(false)">返回</button>
          <button mznButton variant="base-primary" size="minor" (click)="open.set(false)">確認</button>
        </div>
      </mzn-drawer>
    `,
  }),
};

@Component({
  selector: 'story-with-modal-while-drawer-open',
  standalone: true,
  imports: [
    MznDrawer,
    MznModal,
    MznModalHeader,
    MznModalFooter,
    MznButton,
    MznButtonGroup,
  ],
  template: `
    <button mznButton variant="base-text-link" (click)="drawerOpen.set(true)">
      開啟 Drawer (測試 Modal 互動)
    </button>
    <mzn-drawer
      [open]="drawerOpen()"
      headerTitle="Drawer 與 Modal 互動測試"
      size="medium"
      (closed)="onDrawerClose()"
    >
      <div style="padding: 16px;">
        <p
          >點擊下方按鈕可以在 Drawer 中打開一個
          Modal，用於測試兩者的層級和互動關係。</p
        >
        <div style="margin-top: 16px;">
          <button mznButton variant="base-primary" (click)="modalOpen.set(true)"
            >打開 Modal</button
          >
        </div>
      </div>
    </mzn-drawer>
    <mzn-modal
      [open]="modalOpen()"
      modalType="standard"
      modalStatusType="info"
      size="regular"
      (closed)="modalOpen.set(false)"
    >
      <mzn-modal-header title="基本 Modal" />
      <div class="mzn-modal__body-container">
        <p>這是一個從 Drawer 中打開的基本 Modal。</p>
        <p>測試 z-index 和背景遮罩是否正常運作。</p>
      </div>
      <mzn-modal-footer>
        <mzn-button-group>
          <button
            mznButton
            variant="base-secondary"
            (click)="modalOpen.set(false)"
            >取消</button
          >
          <button
            mznButton
            variant="base-primary"
            (click)="modalOpen.set(false)"
            >確認</button
          >
        </mzn-button-group>
      </mzn-modal-footer>
    </mzn-modal>
  `,
})
class WithModalWhileDrawerOpenComponent {
  readonly drawerOpen = signal(false);
  readonly modalOpen = signal(false);

  onDrawerClose(): void {
    this.drawerOpen.set(false);
    this.modalOpen.set(false);
  }
}

export const WithModalWhileDrawerOpen: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [WithModalWhileDrawerOpenComponent],
    }),
  ],
  render: () => ({
    template: `<story-with-modal-while-drawer-open />`,
  }),
};

export const WithFilterBarDropdown: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      selected: signal(''),
    },
    template: `
      <button mznButton variant="base-text-link" (click)="open.set(true)">
        開啟 Drawer (篩選 Dropdown)
      </button>
      <mzn-drawer
        [open]="open()"
        headerTitle="篩選器 Dropdown 示範"
        size="narrow"
        (closed)="open.set(false)"
      >
        <div mznDrawerFilter style="padding: 8px 16px; border-bottom: 1px solid var(--mzn-color-neutral-20);">
          <select (change)="selected.set($any($event.target).value)" style="width: 100%; padding: 4px 8px;">
            <option value="">（尚未選擇）</option>
            <option value="import">匯入</option>
            <option value="export">匯出</option>
            <option value="past-version">過去版本</option>
          </select>
        </div>
        <div style="padding: 16px;">
          <p>已選擇篩選：{{ selected() || '（尚未選擇）' }}</p>
        </div>
      </mzn-drawer>
    `,
  }),
};

export const WithFilterAreaOnCustomButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      onClear: (): void => alert('清除篩選'),
    },
    template: `
      <button mznButton variant="base-text-link" (click)="open.set(true)">
        開啟 Drawer (篩選 Dropdown)
      </button>
      <mzn-drawer
        [open]="open()"
        headerTitle="篩選器 Dropdown 示範"
        size="narrow"
        (closed)="open.set(false)"
      >
        <div mznDrawerFilter style="padding: 8px 16px; display: flex; justify-content: flex-end; border-bottom: 1px solid var(--mzn-color-neutral-20);">
          <button mznButton variant="base-secondary" (click)="onClear()">清除篩選</button>
        </div>
      </mzn-drawer>
    `,
  }),
};

export const WithContentKeyAutoFallback: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      items: signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    },
    template: `
      <button mznButton variant="base-text-link" (click)="open.set(true)">
        開啟 Drawer (自動清理機制測試)
      </button>
      <mzn-drawer
        [open]="open()"
        headerTitle="自動清理機制測試"
        size="medium"
        (closed)="open.set(false)"
      >
        <div style="padding: 16px;">
          <p>目前項目數量: {{ items().length }}</p>
          <p>沒有傳入 contentKey，但當 Drawer 重新開啟時會自動清理內容。</p>
          <div style="margin-top: 16px; display: flex; gap: 8px;">
            <button mznButton size="minor" variant="base-secondary" (click)="items.set(items().slice(0, 3))">
              減少到 3 個項目
            </button>
            <button mznButton size="minor" variant="base-secondary" (click)="items.set([1,2,3,4,5,6,7,8,9,10])">
              重置為 10 個項目
            </button>
          </div>
          <div style="margin-top: 16px;">
            @for (item of items(); track item) {
              <div>{{ item }}</div>
            }
          </div>
          <p style="margin-top: 16px;">
            測試步驟:<br/>
            1. 減少到 3 個項目（可能會看到殘留）<br/>
            2. 關閉並重新開啟 Drawer（自動清理）<br/>
            3. 應該只會看到 3 個項目
          </p>
        </div>
      </mzn-drawer>
    `,
  }),
};
