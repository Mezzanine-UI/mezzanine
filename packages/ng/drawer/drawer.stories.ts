import { Component, input, signal } from '@angular/core';
import type { ArgTypes } from '@storybook/angular';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import {
  CheckedFilledIcon,
  ChevronLeftIcon,
  ClockIcon,
  CloseIcon,
  DownloadIcon,
  InfoOutlineIcon,
  PlusIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznButtonGroup } from '@mezzanine-ui/ng/button';
import {
  MznModal,
  MznModalFooter,
  MznModalHeader,
} from '@mezzanine-ui/ng/modal';
import { MznDrawer } from './drawer.component';

// Icon mapping for Storybook controls — mirrors React's iconOptions.
const iconOptions = {
  None: undefined,
  Check: CheckedFilledIcon,
  ChevronLeft: ChevronLeftIcon,
  Close: CloseIcon,
  InfoOutline: InfoOutlineIcon,
  Plus: PlusIcon,
};

const argTypes: Partial<ArgTypes> = {
  bottomGhostActionDisabled: {
    control: { type: 'boolean' },
    table: { category: 'Bottom Ghost Action' },
  },
  bottomGhostActionIcon: {
    control: { type: 'select' },
    mapping: iconOptions,
    options: Object.keys(iconOptions),
    table: { category: 'Bottom Ghost Action' },
  },
  bottomGhostActionIconType: {
    control: { type: 'select' },
    options: ['leading', 'trailing', 'icon-only'],
    table: { category: 'Bottom Ghost Action' },
  },
  bottomGhostActionLoading: {
    control: { type: 'boolean' },
    table: { category: 'Bottom Ghost Action' },
  },
  bottomGhostActionSize: {
    control: { type: 'select' },
    options: ['minor', 'main', 'major'],
    table: { category: 'Bottom Ghost Action' },
  },
  bottomGhostActionText: {
    control: { type: 'text' },
    table: { category: 'Bottom Ghost Action' },
  },
  bottomGhostActionVariant: {
    control: { type: 'select' },
    options: ['base-primary', 'base-secondary', 'base-ghost', 'base-text-link'],
    table: { category: 'Bottom Ghost Action' },
  },
  bottomPrimaryActionDisabled: {
    control: { type: 'boolean' },
    table: { category: 'Bottom Primary Action' },
  },
  bottomPrimaryActionIcon: {
    control: { type: 'select' },
    mapping: iconOptions,
    options: Object.keys(iconOptions),
    table: { category: 'Bottom Primary Action' },
  },
  bottomPrimaryActionIconType: {
    control: { type: 'select' },
    options: ['leading', 'trailing', 'icon-only'],
    table: { category: 'Bottom Primary Action' },
  },
  bottomPrimaryActionLoading: {
    control: { type: 'boolean' },
    table: { category: 'Bottom Primary Action' },
  },
  bottomPrimaryActionSize: {
    control: { type: 'select' },
    options: ['minor', 'main', 'major'],
    table: { category: 'Bottom Primary Action' },
  },
  bottomPrimaryActionText: {
    control: { type: 'text' },
    table: { category: 'Bottom Primary Action' },
  },
  bottomPrimaryActionVariant: {
    control: { type: 'select' },
    options: ['base-primary', 'base-secondary', 'base-ghost', 'base-text-link'],
    table: { category: 'Bottom Primary Action' },
  },
  bottomSecondaryActionDisabled: {
    control: { type: 'boolean' },
    table: { category: 'Bottom Secondary Action' },
  },
  bottomSecondaryActionIcon: {
    control: { type: 'select' },
    mapping: iconOptions,
    options: Object.keys(iconOptions),
    table: { category: 'Bottom Secondary Action' },
  },
  bottomSecondaryActionIconType: {
    control: { type: 'select' },
    options: ['leading', 'trailing', 'icon-only'],
    table: { category: 'Bottom Secondary Action' },
  },
  bottomSecondaryActionLoading: {
    control: { type: 'boolean' },
    table: { category: 'Bottom Secondary Action' },
  },
  bottomSecondaryActionSize: {
    control: { type: 'select' },
    options: ['minor', 'main', 'major'],
    table: { category: 'Bottom Secondary Action' },
  },
  bottomSecondaryActionText: {
    control: { type: 'text' },
    table: { category: 'Bottom Secondary Action' },
  },
  bottomSecondaryActionVariant: {
    control: { type: 'select' },
    options: ['base-primary', 'base-secondary', 'base-ghost', 'base-text-link'],
    table: { category: 'Bottom Secondary Action' },
  },
  disableCloseOnBackdropClick: {
    control: { type: 'boolean' },
    table: { category: 'Drawer Settings' },
  },
  disableCloseOnEscapeKeyDown: {
    control: { type: 'boolean' },
    table: { category: 'Drawer Settings' },
  },
  headerTitle: {
    control: { type: 'text' },
    table: { category: 'Drawer Settings' },
  },
  isBottomDisplay: {
    control: { type: 'boolean' },
    table: { category: 'Drawer Settings' },
  },
  isHeaderDisplay: {
    control: { type: 'boolean' },
    table: { category: 'Drawer Settings' },
  },
  size: {
    control: { type: 'radio' },
    options: ['narrow', 'medium', 'wide'],
    table: { category: 'Drawer Settings' },
  },
};

export default {
  argTypes,
  title: 'Feedback/Drawer',
  decorators: [
    moduleMetadata({
      imports: [MznButton, MznDrawer],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

// ─── Playground ──────────────────────────────────────────────────────────

@Component({
  selector: 'story-drawer-playground',
  standalone: true,
  imports: [MznButton, MznDrawer],
  template: `
    <button mznButton variant="base-text-link" (click)="open.set(true)">
      OPEN
    </button>
    <div
      mznDrawer
      [open]="open()"
      [bottomGhostActionDisabled]="args().bottomGhostActionDisabled"
      [bottomGhostActionIcon]="args().bottomGhostActionIcon"
      [bottomGhostActionIconType]="args().bottomGhostActionIconType"
      [bottomGhostActionLoading]="args().bottomGhostActionLoading"
      [bottomGhostActionSize]="args().bottomGhostActionSize"
      [bottomGhostActionText]="args().bottomGhostActionText"
      [bottomGhostActionVariant]="args().bottomGhostActionVariant"
      [bottomPrimaryActionDisabled]="args().bottomPrimaryActionDisabled"
      [bottomPrimaryActionIcon]="args().bottomPrimaryActionIcon"
      [bottomPrimaryActionIconType]="args().bottomPrimaryActionIconType"
      [bottomPrimaryActionLoading]="args().bottomPrimaryActionLoading"
      [bottomPrimaryActionSize]="args().bottomPrimaryActionSize"
      [bottomPrimaryActionText]="args().bottomPrimaryActionText"
      [bottomPrimaryActionVariant]="args().bottomPrimaryActionVariant"
      [bottomSecondaryActionDisabled]="args().bottomSecondaryActionDisabled"
      [bottomSecondaryActionIcon]="args().bottomSecondaryActionIcon"
      [bottomSecondaryActionIconType]="args().bottomSecondaryActionIconType"
      [bottomSecondaryActionLoading]="args().bottomSecondaryActionLoading"
      [bottomSecondaryActionSize]="args().bottomSecondaryActionSize"
      [bottomSecondaryActionText]="args().bottomSecondaryActionText"
      [bottomSecondaryActionVariant]="args().bottomSecondaryActionVariant"
      [contentKey]="items().length"
      [disableCloseOnBackdropClick]="args().disableCloseOnBackdropClick"
      [disableCloseOnEscapeKeyDown]="args().disableCloseOnEscapeKeyDown"
      [headerTitle]="args().headerTitle"
      [isBottomDisplay]="args().isBottomDisplay"
      [isHeaderDisplay]="args().isHeaderDisplay"
      [size]="args().size"
      (bottomGhostActionClick)="close()"
      (bottomPrimaryActionClick)="close()"
      (bottomSecondaryActionClick)="close()"
      (closed)="close()"
    >
      <div>
        @for (item of items(); track item) {
          <div>{{ item }}</div>
        }
      </div>
    </div>
  `,
})
class PlaygroundStoryComponent {
  readonly open = signal(false);
  readonly items = signal<readonly number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  // Receive Storybook-controlled args as a signal input so template reads stay reactive.
  readonly args = input<Record<string, unknown>>({});

  close(): void {
    this.open.set(false);
  }

  constructor() {
    // Mirror React's setTimeout that trims the list to demonstrate
    // `contentKey` forcing remount when the key (items.length) changes.
    setTimeout(() => {
      this.items.update((prev) => prev.slice(0, 4));
    }, 2000);
  }
}

export const Playground: Story = {
  args: {
    bottomGhostActionDisabled: false,
    bottomGhostActionIcon: undefined,
    bottomGhostActionIconType: undefined,
    bottomGhostActionLoading: false,
    bottomGhostActionSize: undefined,
    bottomGhostActionText: '更多選項',
    bottomGhostActionVariant: 'base-ghost',
    bottomPrimaryActionDisabled: false,
    bottomPrimaryActionIcon: undefined,
    bottomPrimaryActionIconType: undefined,
    bottomPrimaryActionLoading: false,
    bottomPrimaryActionSize: undefined,
    bottomPrimaryActionText: '儲存變更',
    bottomPrimaryActionVariant: 'base-primary',
    bottomSecondaryActionDisabled: false,
    bottomSecondaryActionIcon: undefined,
    bottomSecondaryActionIconType: undefined,
    bottomSecondaryActionLoading: false,
    bottomSecondaryActionSize: undefined,
    bottomSecondaryActionText: '取消',
    bottomSecondaryActionVariant: 'base-secondary',
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    headerTitle: 'Drawer Title',
    isBottomDisplay: true,
    isHeaderDisplay: true,
    size: 'medium',
  },
  decorators: [moduleMetadata({ imports: [PlaygroundStoryComponent] })],
  render: (args) => ({
    props: { args },
    template: `<story-drawer-playground [args]="args" />`,
  }),
};

// ─── WithControlBar ──────────────────────────────────────────────────────

@Component({
  selector: 'story-drawer-with-control-bar',
  standalone: true,
  imports: [MznButton, MznDrawer],
  template: `
    <button mznButton variant="base-text-link" (click)="open.set(true)">
      開啟 Drawer (預設控制列)
    </button>
    <div
      mznDrawer
      [open]="open()"
      headerTitle="內容篩選器"
      isHeaderDisplay
      size="narrow"
      filterAreaShow
      filterAreaShowUnreadButton
      filterAreaAllRadioLabel="全部"
      filterAreaReadRadioLabel="進行中"
      filterAreaUnreadRadioLabel="已完成"
      filterAreaCustomButtonLabel="清除"
      filterAreaDefaultValue="all"
      [filterAreaValue]="filter()"
      (filterAreaRadioChange)="filter.set($event)"
      (filterAreaCustomButtonClick)="onClear()"
      (closed)="open.set(false)"
    >
      <div style="padding: 16px;">
        <p
          >當前篩選:
          {{
            filter() === 'all'
              ? '全部'
              : filter() === 'read'
                ? '進行中'
                : '已完成'
          }}</p
        >
        <p style="margin-top: 16px;">這是 Drawer 的內容區域</p>
      </div>
    </div>
  `,
})
class WithControlBarStoryComponent {
  readonly open = signal(false);
  readonly filter = signal('all');
  onClear(): void {
    alert('清除篩選');
  }
}

export const WithControlBar: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithControlBarStoryComponent] })],
  render: () => ({ template: `<story-drawer-with-control-bar />` }),
};

// ─── WithControlBarButtonOnly ────────────────────────────────────────────

@Component({
  selector: 'story-drawer-with-control-bar-button-only',
  standalone: true,
  imports: [MznButton, MznDrawer],
  template: `
    <button mznButton variant="base-text-link" (click)="open.set(true)">
      開啟 Drawer (僅控制列按鈕)
    </button>
    <div
      mznDrawer
      [open]="open()"
      headerTitle="設定"
      isHeaderDisplay
      size="narrow"
      filterAreaShow
      filterAreaCustomButtonLabel="重置全部"
      (filterAreaCustomButtonClick)="onReset()"
      (closed)="open.set(false)"
    >
      <div style="padding: 16px;">
        <p>這個 Drawer 的控制列只有按鈕，沒有 Radio Group</p>
      </div>
    </div>
  `,
})
class WithControlBarButtonOnlyStoryComponent {
  readonly open = signal(false);
  onReset(): void {
    alert('重置');
  }
}

export const WithControlBarButtonOnly: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [WithControlBarButtonOnlyStoryComponent] }),
  ],
  render: () => ({ template: `<story-drawer-with-control-bar-button-only />` }),
};

// ─── WithBottomActionStates ──────────────────────────────────────────────

@Component({
  selector: 'story-drawer-with-bottom-action-states',
  standalone: true,
  imports: [MznButton, MznDrawer],
  template: `
    <button mznButton variant="base-text-link" (click)="open.set(true)">
      開啟 Drawer (按鈕狀態控制)
    </button>
    <div
      mznDrawer
      [open]="open()"
      headerTitle="表單提交"
      isHeaderDisplay
      isBottomDisplay
      size="medium"
      bottomGhostActionText="取消"
      bottomSecondaryActionText="返回上一步"
      [bottomSecondaryActionDisabled]="loading()"
      bottomPrimaryActionText="提交"
      [bottomPrimaryActionDisabled]="loading()"
      [bottomPrimaryActionLoading]="loading()"
      (bottomGhostActionClick)="close()"
      (bottomSecondaryActionClick)="onBack()"
      (bottomPrimaryActionClick)="submit()"
      (closed)="close()"
    >
      <div style="padding: 16px;">
        <p
          >此範例展示如何使用 disabled 和 loading
          狀態來控制按鈕的行為和外觀。</p
        >
        <p style="margin-top: 16px;"
          >點擊「提交」按鈕會顯示 loading 狀態，並在 2 秒後關閉 Drawer。</p
        >
      </div>
    </div>
  `,
})
class WithBottomActionStatesStoryComponent {
  readonly open = signal(false);
  readonly loading = signal(false);
  close(): void {
    this.open.set(false);
  }
  onBack(): void {
    alert('返回上一步');
  }
  submit(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.close();
    }, 2000);
  }
}

export const WithBottomActionStates: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [WithBottomActionStatesStoryComponent] }),
  ],
  render: () => ({ template: `<story-drawer-with-bottom-action-states />` }),
};

// ─── WithCustomButtonVariants ────────────────────────────────────────────

@Component({
  selector: 'story-drawer-with-custom-button-variants',
  standalone: true,
  imports: [MznButton, MznDrawer],
  template: `
    <button mznButton variant="base-text-link" (click)="open.set(true)">
      開啟 Drawer (自訂按鈕樣式)
    </button>
    <div
      mznDrawer
      [open]="open()"
      headerTitle="自訂按鈕"
      isHeaderDisplay
      isBottomDisplay
      size="medium"
      bottomGhostActionText="關閉"
      bottomGhostActionVariant="base-text-link"
      [bottomGhostActionIcon]="closeIcon"
      bottomGhostActionIconType="leading"
      bottomSecondaryActionText="返回"
      bottomSecondaryActionSize="minor"
      [bottomSecondaryActionIcon]="chevronLeftIcon"
      bottomSecondaryActionIconType="leading"
      bottomPrimaryActionText="確認"
      bottomPrimaryActionSize="minor"
      [bottomPrimaryActionIcon]="checkedIcon"
      bottomPrimaryActionIconType="trailing"
      (bottomGhostActionClick)="close()"
      (bottomSecondaryActionClick)="close()"
      (bottomPrimaryActionClick)="close()"
      (closed)="close()"
    >
      <div style="padding: 16px;">
        <p>此範例展示如何自訂按鈕的 variant、size、icon 和 iconType。</p>
      </div>
    </div>
  `,
})
class WithCustomButtonVariantsStoryComponent {
  readonly open = signal(false);
  readonly closeIcon = CloseIcon;
  readonly chevronLeftIcon = ChevronLeftIcon;
  readonly checkedIcon = CheckedFilledIcon;
  close(): void {
    this.open.set(false);
  }
}

export const WithCustomButtonVariants: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [WithCustomButtonVariantsStoryComponent] }),
  ],
  render: () => ({ template: `<story-drawer-with-custom-button-variants />` }),
};

// ─── WithModalWhileDrawerOpen ────────────────────────────────────────────

@Component({
  selector: 'story-drawer-with-modal-while-drawer-open',
  standalone: true,
  imports: [
    MznButton,
    MznButtonGroup,
    MznDrawer,
    MznModal,
    MznModalFooter,
    MznModalHeader,
  ],
  template: `
    <button mznButton variant="base-text-link" (click)="drawerOpen.set(true)">
      開啟 Drawer (測試 Modal 互動)
    </button>
    <div
      mznDrawer
      [open]="drawerOpen()"
      headerTitle="Drawer 與 Modal 互動測試"
      isHeaderDisplay
      size="medium"
      (closed)="onDrawerClose()"
    >
      <div style="padding: 16px;">
        <p
          >點擊下方按鈕可以在 Drawer 中打開一個
          Modal，用於測試兩者的層級和互動關係。</p
        >
        <div style="margin-top: 16px;">
          <button
            mznButton
            variant="base-primary"
            (click)="modalOpen.set(true)"
          >
            打開 Modal
          </button>
        </div>
      </div>
    </div>
    <div
      mznModal
      [open]="modalOpen()"
      modalType="standard"
      modalStatusType="info"
      size="regular"
      (closed)="modalOpen.set(false)"
    >
      <div mznModalHeader title="基本 Modal"></div>
      <div class="mzn-modal__body-container">
        <p>這是一個從 Drawer 中打開的基本 Modal。</p>
        <p>測試 z-index 和背景遮罩是否正常運作。</p>
      </div>
      <div mznModalFooter>
        <div mznButtonGroup>
          <button
            mznButton
            variant="base-secondary"
            (click)="modalOpen.set(false)"
          >
            取消
          </button>
          <button
            mznButton
            variant="base-primary"
            (click)="modalOpen.set(false)"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  `,
})
class WithModalWhileDrawerOpenStoryComponent {
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
    moduleMetadata({ imports: [WithModalWhileDrawerOpenStoryComponent] }),
  ],
  render: () => ({ template: `<story-drawer-with-modal-while-drawer-open />` }),
};

// ─── WithFilterBarDropdown ───────────────────────────────────────────────

@Component({
  selector: 'story-drawer-with-filter-bar-dropdown',
  standalone: true,
  imports: [MznButton, MznDrawer],
  template: `
    <button mznButton variant="base-text-link" (click)="open.set(true)">
      開啟 Drawer (篩選 Dropdown)
    </button>
    <div
      mznDrawer
      [open]="open()"
      headerTitle="篩選器 Dropdown 示範"
      isHeaderDisplay
      size="narrow"
      filterAreaShow
      filterAreaAllRadioLabel="今日"
      filterAreaReadRadioLabel="本月"
      [filterAreaOptions]="filterOptions"
      (filterAreaSelect)="onSelect($event)"
      (closed)="open.set(false)"
    >
      <div style="padding: 16px;">
        <p>已選擇篩選：{{ selected() || '（尚未選擇）' }}</p>
      </div>
    </div>
  `,
})
class WithFilterBarDropdownStoryComponent {
  readonly open = signal(false);
  readonly selected = signal('');
  readonly filterOptions: readonly DropdownOption[] = [
    { id: 'import', name: '匯入', icon: DownloadIcon },
    { id: 'export', name: '匯出', icon: UploadIcon, showUnderline: true },
    { id: 'past-version', name: '過去版本', icon: ClockIcon },
  ];
  onSelect(option: DropdownOption): void {
    this.selected.set(option.id);
  }
}

export const WithFilterBarDropdown: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [WithFilterBarDropdownStoryComponent] }),
  ],
  render: () => ({ template: `<story-drawer-with-filter-bar-dropdown />` }),
};

// ─── WithFilterAreaOnCustomButton ────────────────────────────────────────

@Component({
  selector: 'story-drawer-with-filter-area-on-custom-button',
  standalone: true,
  imports: [MznButton, MznDrawer],
  template: `
    <button mznButton variant="base-text-link" (click)="open.set(true)">
      開啟 Drawer (篩選 Dropdown)
    </button>
    <div
      mznDrawer
      [open]="open()"
      headerTitle="篩選器 Dropdown 示範"
      isHeaderDisplay
      size="narrow"
      filterAreaShow
      filterAreaAllRadioLabel="今日"
      filterAreaReadRadioLabel="本月"
      (filterAreaCustomButtonClick)="onClear()"
      (closed)="open.set(false)"
    ></div>
  `,
})
class WithFilterAreaOnCustomButtonStoryComponent {
  readonly open = signal(false);
  onClear(): void {
    alert('清除篩選');
  }
}

export const WithFilterAreaOnCustomButton: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [WithFilterAreaOnCustomButtonStoryComponent] }),
  ],
  render: () => ({
    template: `<story-drawer-with-filter-area-on-custom-button />`,
  }),
};

// ─── WithContentKeyAutoFallback ──────────────────────────────────────────

@Component({
  selector: 'story-drawer-with-content-key-auto-fallback',
  standalone: true,
  imports: [MznButton, MznDrawer],
  template: `
    <button mznButton variant="base-text-link" (click)="open.set(true)">
      開啟 Drawer (自動清理機制測試)
    </button>
    <div
      mznDrawer
      [open]="open()"
      headerTitle="自動清理機制測試"
      isHeaderDisplay
      size="medium"
      (closed)="open.set(false)"
    >
      <div style="padding: 16px;">
        <p>目前項目數量: {{ items().length }}</p>
        <p style="margin-top: 8px;"
          >沒有傳入 contentKey，但當 Drawer 重新開啟時會自動清理內容。</p
        >
        <div style="margin-top: 16px; display: flex; gap: 8px;">
          <button
            mznButton
            size="minor"
            variant="base-secondary"
            (click)="reduce()"
            >減少到 3 個項目</button
          >
          <button
            mznButton
            size="minor"
            variant="base-secondary"
            (click)="reset()"
            >重置為 10 個項目</button
          >
        </div>
        <div style="margin-top: 16px;">
          @for (item of items(); track item) {
            <div>{{ item }}</div>
          }
        </div>
        <p style="margin-top: 16px;">
          測試步驟:<br />
          1. 減少到 3 個項目（可能會看到殘留）<br />
          2. 關閉並重新開啟 Drawer（自動清理）<br />
          3. 應該只會看到 3 個項目
        </p>
      </div>
    </div>
  `,
})
class WithContentKeyAutoFallbackStoryComponent {
  readonly open = signal(false);
  readonly items = signal<readonly number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  reduce(): void {
    this.items.update((prev) => prev.slice(0, 3));
  }
  reset(): void {
    this.items.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }
}

export const WithContentKeyAutoFallback: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [WithContentKeyAutoFallbackStoryComponent] }),
  ],
  render: () => ({
    template: `<story-drawer-with-content-key-auto-fallback />`,
  }),
};
