import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import {
  DotHorizontalIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
} from '@mezzanine-ui/icons';
import { MznAccordion } from './accordion.component';
import { MznAccordionActions } from './accordion-actions.component';
import { MznAccordionTitle } from './accordion-title.component';
import { MznAccordionContent } from './accordion-content.component';
import { MznAccordionGroup } from './accordion-group.component';
import { MznButton } from '../button/button.directive';
import { MznAutocomplete } from '../autocomplete/autocomplete.component';
import { MznDropdown } from '../dropdown/dropdown.component';
import { MznIcon } from '../icon/icon.component';
import { MznTypography } from '../typography/typography.directive';

const meta: Meta<MznAccordion> = {
  title: 'Data Display/Accordion',
  component: MznAccordion,
  decorators: [
    moduleMetadata({
      imports: [
        MznAccordion,
        MznAccordionTitle,
        MznAccordionContent,
        MznAccordionGroup,
        MznButton,
        MznTypography,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<MznAccordion>;

export const Basic: Story = {
  render: () => ({
    template: `
      <div style="max-width: 680px; width: 100%; display: grid; gap: 32px;">
        <h3 mznTypography variant="h3">Accordion Group - Size Main</h3>
        <div mznAccordionGroup size="main">
          <div mznAccordion title="付款方式" [disabled]="true">
            <div mznAccordionContent>
              目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
              您可以在結帳時選擇最方便的付款選項。
            </div>
          </div>
          <div mznAccordion title="運送政策" [defaultExpanded]="true">
            <div mznAccordionContent>
              訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
              享免運優惠，未滿則需支付 $80 運費。
            </div>
          </div>
          <div mznAccordion title="退換貨須知">
            <div mznAccordionContent>
              商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
              如有瑕疵或寄送錯誤，我們將負擔來回運費。
            </div>
          </div>
        </div>
        <h3 mznTypography variant="h3">Accordion Group - Size Sub</h3>
        <div mznAccordionGroup size="sub">
          <div mznAccordion title="付款方式" [disabled]="true">
            <div mznAccordionContent>
              目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
              您可以在結帳時選擇最方便的付款選項。
            </div>
          </div>
          <div mznAccordion title="運送政策" [defaultExpanded]="true">
            <div mznAccordionContent>
              訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
              享免運優惠，未滿則需支付 $80 運費。
            </div>
          </div>
          <div mznAccordion title="退換貨須知">
            <div mznAccordionContent>
              商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
              如有瑕疵或寄送錯誤，我們將負擔來回運費。
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: '[mznAccordionControlledDemo]',
  standalone: true,
  imports: [
    MznAccordion,
    MznAccordionTitle,
    MznAccordionContent,
    MznAccordionGroup,
  ],
  host: { style: 'max-width: 680px; width: 100%; display: block;' },
  template: `
    <div mznAccordionGroup>
      <div
        mznAccordion
        title="篩選條件"
        [expanded]="activeAccordion() === 0"
        (expandedChange)="setActive(0, $event)"
      >
        <div mznAccordionContent>
          您可以在此更新您的姓名、電子郵件與聯絡電話。 變更將在儲存後立即生效。
        </div>
      </div>
      <div
        mznAccordion
        title="安全性設定"
        [expanded]="activeAccordion() === 1"
        (expandedChange)="setActive(1, $event)"
      >
        <div mznAccordionContent>
          啟用雙重驗證以加強帳號安全，建議定期更換密碼，
          並避免使用與其他網站相同的密碼。
        </div>
      </div>
      <div
        mznAccordion
        title="通知偏好"
        [expanded]="activeAccordion() === 2"
        (expandedChange)="setActive(2, $event)"
      >
        <div mznAccordionContent>
          選擇您希望接收的通知類型，包含訂單更新、促銷活動、
          系統公告等，可隨時調整設定。
        </div>
      </div>
    </div>
  `,
})
class AccordionControlledDemoComponent {
  readonly activeAccordion = signal(-1);

  setActive(index: number, open: boolean): void {
    this.activeAccordion.set(open ? index : -1);
  }
}

export const Controlled: Story = {
  decorators: [
    moduleMetadata({
      imports: [AccordionControlledDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznAccordionControlledDemo></div>`,
  }),
};

export const Exclusive: Story = {
  render: () => ({
    template: `
      <div style="max-width: 680px; width: 100%;">
        <div mznAccordionGroup [exclusive]="true">
          <div mznAccordion title="付款方式">
            <div mznAccordionContent>
              目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
              您可以在結帳時選擇最方便的付款選項。
            </div>
          </div>
          <div mznAccordion title="運送政策">
            <div mznAccordionContent>
              訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
              享免運優惠，未滿則需支付 $80 運費。
            </div>
          </div>
          <div mznAccordion title="退換貨須知">
            <div mznAccordionContent>
              商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
              如有瑕疵或寄送錯誤，我們將負擔來回運費。
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: '[mznAccordionWithActionsDemo]',
  standalone: true,
  imports: [
    MznAccordion,
    MznAccordionActions,
    MznAccordionTitle,
    MznAccordionContent,
    MznAccordionGroup,
    MznAutocomplete,
    MznButton,
    MznDropdown,
    MznIcon,
  ],
  host: { style: 'max-width: 680px; width: 100%; display: block;' },
  template: `
    <div mznAccordionGroup>
      <div mznAccordion>
        <div mznAccordionTitle id="accordion-1">
          篩選條件
          <div actions mznAccordionActions>
            <button mznButton size="main" variant="base-text-link">編輯</button>
            <button
              mznButton
              color="danger"
              size="main"
              variant="destructive-text-link"
              >刪除</button
            >
          </div>
        </div>
        <div
          mznAccordionContent
          style="display: flex; flex-direction: column; gap: 12px;"
        >
          <div
            mznAutocomplete
            [options]="categoryOptions"
            placeholder="選擇產品分類"
          ></div>
          <div
            mznAutocomplete
            [options]="statusOptions"
            placeholder="選擇商品狀態"
          ></div>
        </div>
      </div>
      <div mznAccordion [defaultExpanded]="true">
        <div mznAccordionTitle id="accordion-2">產品說明文件</div>
        <div mznAccordionContent>
          包含產品規格書、使用手冊與保固條款，
          請於購買前詳閱相關文件以了解產品功能與限制。
        </div>
      </div>
      <div mznAccordion>
        <div mznAccordionTitle id="accordion-3">
          產品標籤
          <div actions mznAccordionActions>
            <div class="mzn-dropdown mzn-dropdown--outside">
              <button
                #anchor
                mznButton
                iconType="icon-only"
                size="sub"
                variant="base-text-link"
                (click)="toggleDropdown($event)"
              >
                <i mznIcon [icon]="dotHorizontalIcon" [size]="16"></i>
              </button>
              <div
                mznDropdown
                [anchor]="anchor"
                [open]="dropdownOpen()"
                [options]="dropdownOptions"
                placement="bottom-end"
                (selected)="onDropdownSelect()"
                (closed)="dropdownOpen.set(false)"
              ></div>
            </div>
          </div>
        </div>
        <div mznAccordionContent>
          標籤可協助分類與搜尋產品，您可以為每個產品添加多個標籤，
          例如：熱銷、新品、限時優惠等。
        </div>
      </div>
    </div>
  `,
})
class AccordionWithActionsDemoComponent {
  readonly dotHorizontalIcon = DotHorizontalIcon;
  readonly dropdownOpen = signal(false);
  readonly dropdownOptions: ReadonlyArray<DropdownOption> = [
    { id: 'view', name: '查看' },
    { id: 'edit', name: '編輯', showUnderline: true },
    { id: 'delete', name: '刪除', validate: 'danger' },
  ];
  readonly categoryOptions: ReadonlyArray<DropdownOption> = [
    { id: 'electronics', name: '電子產品' },
    { id: 'clothing', name: '服飾配件' },
    { id: 'food', name: '食品飲料' },
  ];
  readonly statusOptions: ReadonlyArray<DropdownOption> = [
    { id: 'on-sale', name: '上架中' },
    { id: 'off-shelf', name: '已下架' },
    { id: 'out-of-stock', name: '缺貨中' },
  ];

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownOpen.update((prev) => !prev);
  }

  onDropdownSelect(): void {
    this.dropdownOpen.set(false);
  }
}

export const WithActions: Story = {
  decorators: [
    moduleMetadata({
      imports: [AccordionWithActionsDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznAccordionWithActionsDemo></div>`,
  }),
};

@Component({
  selector: '[mznAccordionIconOnlyDemo]',
  standalone: true,
  imports: [
    MznAccordion,
    MznAccordionActions,
    MznAccordionTitle,
    MznAccordionContent,
    MznAccordionGroup,
    MznButton,
    MznIcon,
  ],
  host: { style: 'max-width: 680px; width: 100%; display: block;' },
  template: `
    <div mznAccordionGroup>
      <div mznAccordion>
        <div mznAccordionTitle id="icon-only-1">
          篩選條件
          <div actions mznAccordionActions>
            <button
              mznButton
              iconType="icon-only"
              size="main"
              variant="base-text-link"
              aria-label="編輯篩選條件"
              title="編輯篩選條件"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="editIcon" [size]="16"></i>
            </button>
            <button
              mznButton
              color="danger"
              iconType="icon-only"
              size="main"
              variant="destructive-text-link"
              aria-label="刪除篩選條件"
              title="刪除篩選條件"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="trashIcon" [size]="16"></i>
            </button>
          </div>
        </div>
        <div mznAccordionContent>
          您可以在此設定搜尋篩選條件，包含日期範圍、分類、狀態等篩選選項。
        </div>
      </div>
      <div mznAccordion [defaultExpanded]="true">
        <div mznAccordionTitle id="icon-only-2">
          產品說明文件
          <div actions mznAccordionActions>
            <button
              mznButton
              iconType="icon-only"
              size="main"
              variant="base-text-link"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="editIcon" [size]="16"></i>
            </button>
            <button
              mznButton
              color="danger"
              iconType="icon-only"
              size="main"
              variant="destructive-text-link"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="trashIcon" [size]="16"></i>
            </button>
          </div>
        </div>
        <div mznAccordionContent>
          包含產品規格書、使用手冊與保固條款，
          請於購買前詳閱相關文件以了解產品功能與限制。
        </div>
      </div>
      <div mznAccordion>
        <div mznAccordionTitle id="icon-only-3">
          退換貨須知
          <div actions mznAccordionActions>
            <button
              mznButton
              iconType="icon-only"
              size="main"
              variant="base-text-link"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="editIcon" [size]="16"></i>
            </button>
            <button
              mznButton
              color="danger"
              iconType="icon-only"
              size="main"
              variant="destructive-text-link"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="trashIcon" [size]="16"></i>
            </button>
          </div>
        </div>
        <div mznAccordionContent>
          商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
          如有瑕疵或寄送錯誤，我們將負擔來回運費。
        </div>
      </div>
    </div>
  `,
})
class AccordionIconOnlyDemoComponent {
  readonly editIcon = EditIcon;
  readonly trashIcon = TrashIcon;
}

export const IconOnly: Story = {
  decorators: [
    moduleMetadata({
      imports: [AccordionIconOnlyDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznAccordionIconOnlyDemo></div>`,
  }),
};

@Component({
  selector: '[mznAccordionDisabledWithActionsDemo]',
  standalone: true,
  imports: [
    MznAccordion,
    MznAccordionActions,
    MznAccordionTitle,
    MznAccordionContent,
    MznAccordionGroup,
    MznButton,
    MznIcon,
  ],
  host: { style: 'max-width: 680px; width: 100%; display: block;' },
  template: `
    <div mznAccordionGroup>
      <div mznAccordion [disabled]="true">
        <div mznAccordionTitle id="disabled-1">
          篩選條件
          <div actions mznAccordionActions>
            <button
              mznButton
              [disabled]="true"
              iconType="icon-only"
              size="main"
              variant="base-text-link"
              aria-label="編輯"
              title="編輯"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="editIcon" [size]="16"></i>
            </button>
            <button
              mznButton
              color="danger"
              [disabled]="true"
              iconType="icon-only"
              size="main"
              variant="destructive-text-link"
              aria-label="刪除"
              title="刪除"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="trashIcon" [size]="16"></i>
            </button>
          </div>
        </div>
        <div mznAccordionContent>
          此手風琴目前為停用狀態，無法展開或收合。
        </div>
      </div>
      <div mznAccordion>
        <div mznAccordionTitle id="disabled-2">
          運送政策
          <div actions mznAccordionActions>
            <button
              mznButton
              iconType="icon-only"
              size="main"
              variant="base-text-link"
              aria-label="編輯"
              title="編輯"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="editIcon" [size]="16"></i>
            </button>
            <button
              mznButton
              color="danger"
              iconType="icon-only"
              size="main"
              variant="destructive-text-link"
              aria-label="刪除"
              title="刪除"
              (click)="$event.stopPropagation()"
            >
              <i mznIcon [icon]="trashIcon" [size]="16"></i>
            </button>
          </div>
        </div>
        <div mznAccordionContent>
          訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。
        </div>
      </div>
    </div>
  `,
})
class AccordionDisabledWithActionsDemoComponent {
  readonly editIcon = EditIcon;
  readonly trashIcon = TrashIcon;
}

export const DisabledWithActions: Story = {
  decorators: [
    moduleMetadata({
      imports: [AccordionDisabledWithActionsDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznAccordionDisabledWithActionsDemo></div>`,
  }),
};

@Component({
  selector: '[mznAccordionDeleteTransitionDemo]',
  standalone: true,
  imports: [
    MznAccordion,
    MznAccordionActions,
    MznAccordionTitle,
    MznAccordionContent,
    MznAccordionGroup,
    MznButton,
    MznIcon,
  ],
  host: {
    style: 'display: grid; gap: 16px; max-width: 680px; width: 100%;',
  },
  template: `
    <div mznAccordionGroup>
      @for (item of items(); track item.id) {
        <div
          [style.opacity]="item.visible ? 1 : 0"
          [style.transition]="fadeTransition"
          (transitionend)="handleExited(item.id, $event)"
        >
          <div mznAccordion>
            <div mznAccordionTitle [id]="'delete-transition-' + item.id">
              {{ item.title }}
              <div actions mznAccordionActions>
                <button
                  mznButton
                  color="danger"
                  iconType="icon-only"
                  aria-label="Delete accordion item"
                  size="main"
                  variant="destructive-text-link"
                  (click)="handleDelete(item.id, $event)"
                >
                  <i mznIcon [icon]="trashIcon" [size]="16"></i>
                </button>
              </div>
            </div>
            <div mznAccordionContent>{{ item.content }}</div>
          </div>
        </div>
      }
    </div>
    <div>
      <button mznButton variant="base-secondary" (click)="handleAdd()"
        >新增手風琴</button
      >
    </div>
  `,
})
class AccordionDeleteTransitionDemoComponent {
  readonly trashIcon = TrashIcon;
  readonly plusIcon = PlusIcon;
  readonly fadeTransition = 'opacity 150ms cubic-bezier(0.4, 0.0, 0.2, 1)';
  private nextId = signal(4);

  readonly items = signal<
    ReadonlyArray<{
      content: string;
      id: number;
      title: string;
      visible: boolean;
    }>
  >([
    {
      content: '目前支援信用卡、Line Pay、Apple Pay 等多種付款方式。',
      id: 1,
      title: '付款方式',
      visible: true,
    },
    {
      content: '訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。',
      id: 2,
      title: '運送政策',
      visible: true,
    },
    {
      content: '商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。',
      id: 3,
      title: '退換貨須知',
      visible: true,
    },
  ]);

  handleAdd(): void {
    const id = this.nextId();

    this.items.update((prev) => [
      ...prev,
      {
        content: '這是新增的手風琴內容，可在此填寫詳細說明。',
        id,
        title: `新增項目 ${id}`,
        visible: true,
      },
    ]);
    this.nextId.update((n) => n + 1);
  }

  handleDelete(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.items.update((prev) =>
      prev.map((item) => (item.id === id ? { ...item, visible: false } : item)),
    );
  }

  handleExited(id: number, event: TransitionEvent): void {
    // Only remove when the fade-out on the wrapper itself finishes —
    // inner element transitions bubble up and would otherwise re-trigger removal.
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== 'opacity') return;

    const item = this.items().find((i) => i.id === id);

    if (item && !item.visible) {
      this.items.update((prev) => prev.filter((i) => i.id !== id));
    }
  }
}

export const DeleteTransition: Story = {
  decorators: [
    moduleMetadata({
      imports: [AccordionDeleteTransitionDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznAccordionDeleteTransitionDemo></div>`,
  }),
};
