import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznAccordion } from './accordion.component';
import { MznAccordionTitle } from './accordion-title.component';
import { MznAccordionContent } from './accordion-content.component';
import { MznAccordionGroup } from './accordion-group.component';
import { MznButton } from '../button/button.directive';

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
        <h3>Accordion Group - Size Main</h3>
        <mzn-accordion-group size="main">
          <mzn-accordion title="付款方式" [disabled]="true">
            <mzn-accordion-content>
              目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
              您可以在結帳時選擇最方便的付款選項。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion title="運送政策" [defaultExpanded]="true">
            <mzn-accordion-content>
              訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
              享免運優惠，未滿則需支付 $80 運費。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion title="退換貨須知">
            <mzn-accordion-content>
              商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
              如有瑕疵或寄送錯誤，我們將負擔來回運費。
            </mzn-accordion-content>
          </mzn-accordion>
        </mzn-accordion-group>
        <h3>Accordion Group - Size Sub</h3>
        <mzn-accordion-group size="sub">
          <mzn-accordion title="付款方式" [disabled]="true">
            <mzn-accordion-content>
              目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
              您可以在結帳時選擇最方便的付款選項。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion title="運送政策" [defaultExpanded]="true">
            <mzn-accordion-content>
              訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
              享免運優惠，未滿則需支付 $80 運費。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion title="退換貨須知">
            <mzn-accordion-content>
              商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
              如有瑕疵或寄送錯誤，我們將負擔來回運費。
            </mzn-accordion-content>
          </mzn-accordion>
        </mzn-accordion-group>
      </div>
    `,
  }),
};

@Component({
  selector: 'mzn-accordion-controlled-demo',
  standalone: true,
  imports: [
    MznAccordion,
    MznAccordionTitle,
    MznAccordionContent,
    MznAccordionGroup,
  ],
  template: `
    <div style="max-width: 680px; width: 100%;">
      <mzn-accordion-group>
        <mzn-accordion
          title="篩選條件"
          [expanded]="activeAccordion() === 0"
          (expandedChange)="setActive(0, $event)"
        >
          <mzn-accordion-content>
            您可以在此更新您的姓名、電子郵件與聯絡電話。
            變更將在儲存後立即生效。
          </mzn-accordion-content>
        </mzn-accordion>
        <mzn-accordion
          title="安全性設定"
          [expanded]="activeAccordion() === 1"
          (expandedChange)="setActive(1, $event)"
        >
          <mzn-accordion-content>
            啟用雙重驗證以加強帳號安全，建議定期更換密碼，
            並避免使用與其他網站相同的密碼。
          </mzn-accordion-content>
        </mzn-accordion>
        <mzn-accordion
          title="通知偏好"
          [expanded]="activeAccordion() === 2"
          (expandedChange)="setActive(2, $event)"
        >
          <mzn-accordion-content>
            選擇您希望接收的通知類型，包含訂單更新、促銷活動、
            系統公告等，可隨時調整設定。
          </mzn-accordion-content>
        </mzn-accordion>
      </mzn-accordion-group>
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
    template: `<mzn-accordion-controlled-demo />`,
  }),
};

export const Exclusive: Story = {
  render: () => ({
    template: `
      <div style="max-width: 680px; width: 100%;">
        <mzn-accordion-group [exclusive]="true">
          <mzn-accordion title="付款方式">
            <mzn-accordion-content>
              目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
              您可以在結帳時選擇最方便的付款選項。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion title="運送政策">
            <mzn-accordion-content>
              訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
              享免運優惠，未滿則需支付 $80 運費。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion title="退換貨須知">
            <mzn-accordion-content>
              商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
              如有瑕疵或寄送錯誤，我們將負擔來回運費。
            </mzn-accordion-content>
          </mzn-accordion>
        </mzn-accordion-group>
      </div>
    `,
  }),
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <div style="max-width: 680px; width: 100%;">
        <mzn-accordion-group>
          <mzn-accordion>
            <mzn-accordion-title>
              篩選條件
              <div actions style="display: flex; gap: 4px;">
                <button mznButton size="main" variant="base-text-link">編輯</button>
                <button mznButton color="danger" size="main" variant="destructive-text-link">刪除</button>
              </div>
            </mzn-accordion-title>
            <mzn-accordion-content>
              您可以在此更新您的姓名、電子郵件與聯絡電話。 變更將在儲存後立即生效。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion [defaultExpanded]="true">
            <mzn-accordion-title>產品說明文件</mzn-accordion-title>
            <mzn-accordion-content>
              包含產品規格書、使用手冊與保固條款，
              請於購買前詳閱相關文件以了解產品功能與限制。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion>
            <mzn-accordion-title>
              產品標籤
              <div actions style="display: flex; gap: 4px;">
                <button mznButton size="main" variant="base-text-link">查看</button>
                <button mznButton size="main" variant="base-text-link">編輯</button>
                <button mznButton color="danger" size="main" variant="destructive-text-link">刪除</button>
              </div>
            </mzn-accordion-title>
            <mzn-accordion-content>
              標籤可協助分類與搜尋產品，您可以為每個產品添加多個標籤，
              例如：熱銷、新品、限時優惠等。
            </mzn-accordion-content>
          </mzn-accordion>
        </mzn-accordion-group>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    template: `
      <div style="max-width: 680px; width: 100%;">
        <mzn-accordion-group>
          <mzn-accordion>
            <mzn-accordion-title>
              篩選條件
              <div actions style="display: flex; gap: 4px;">
                <button mznButton iconType="icon-only" aria-label="編輯篩選條件" title="編輯篩選條件" size="main" variant="base-text-link">✎</button>
                <button mznButton color="danger" iconType="icon-only" aria-label="刪除篩選條件" title="刪除篩選條件" size="main" variant="destructive-text-link">🗑</button>
              </div>
            </mzn-accordion-title>
            <mzn-accordion-content>
              您可以在此設定搜尋篩選條件，包含日期範圍、分類、狀態等篩選選項。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion [defaultExpanded]="true">
            <mzn-accordion-title>
              產品說明文件
              <div actions style="display: flex; gap: 4px;">
                <button mznButton iconType="icon-only" size="main" variant="base-text-link">✎</button>
                <button mznButton color="danger" iconType="icon-only" size="main" variant="destructive-text-link">🗑</button>
              </div>
            </mzn-accordion-title>
            <mzn-accordion-content>
              包含產品規格書、使用手冊與保固條款，
              請於購買前詳閱相關文件以了解產品功能與限制。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion>
            <mzn-accordion-title>
              退換貨須知
              <div actions style="display: flex; gap: 4px;">
                <button mznButton iconType="icon-only" size="main" variant="base-text-link">✎</button>
                <button mznButton color="danger" iconType="icon-only" size="main" variant="destructive-text-link">🗑</button>
              </div>
            </mzn-accordion-title>
            <mzn-accordion-content>
              商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
              如有瑕疵或寄送錯誤，我們將負擔來回運費。
            </mzn-accordion-content>
          </mzn-accordion>
        </mzn-accordion-group>
      </div>
    `,
  }),
};

export const DisabledWithActions: Story = {
  render: () => ({
    template: `
      <div style="max-width: 680px; width: 100%;">
        <mzn-accordion-group>
          <mzn-accordion [disabled]="true">
            <mzn-accordion-title>
              篩選條件
              <div actions style="display: flex; gap: 4px;">
                <button mznButton [disabled]="true" iconType="icon-only" aria-label="編輯" title="編輯" size="main" variant="base-text-link">✎</button>
                <button mznButton color="danger" [disabled]="true" iconType="icon-only" aria-label="刪除" title="刪除" size="main" variant="destructive-text-link">🗑</button>
              </div>
            </mzn-accordion-title>
            <mzn-accordion-content>
              此手風琴目前為停用狀態，無法展開或收合。
            </mzn-accordion-content>
          </mzn-accordion>
          <mzn-accordion>
            <mzn-accordion-title>
              運送政策
              <div actions style="display: flex; gap: 4px;">
                <button mznButton iconType="icon-only" aria-label="編輯" title="編輯" size="main" variant="base-text-link">✎</button>
                <button mznButton color="danger" iconType="icon-only" aria-label="刪除" title="刪除" size="main" variant="destructive-text-link">🗑</button>
              </div>
            </mzn-accordion-title>
            <mzn-accordion-content>
              訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。
            </mzn-accordion-content>
          </mzn-accordion>
        </mzn-accordion-group>
      </div>
    `,
  }),
};

@Component({
  selector: 'mzn-accordion-delete-transition-demo',
  standalone: true,
  imports: [
    MznAccordion,
    MznAccordionTitle,
    MznAccordionContent,
    MznAccordionGroup,
    MznButton,
  ],
  template: `
    <div style="display: grid; gap: 16px; max-width: 680px; width: 100%;">
      <mzn-accordion-group>
        @for (item of items(); track item.id) {
          <mzn-accordion>
            <mzn-accordion-title>
              {{ item.title }}
              <div actions style="display: flex; gap: 4px;">
                <button
                  mznButton
                  color="danger"
                  iconType="icon-only"
                  aria-label="Delete accordion item"
                  size="main"
                  variant="destructive-text-link"
                  (click)="handleDelete(item.id, $event)"
                  >🗑</button
                >
              </div>
            </mzn-accordion-title>
            <mzn-accordion-content>{{ item.content }}</mzn-accordion-content>
          </mzn-accordion>
        }
      </mzn-accordion-group>
      <div>
        <button mznButton variant="base-secondary" (click)="handleAdd()"
          >新增手風琴</button
        >
      </div>
    </div>
  `,
})
class AccordionDeleteTransitionDemoComponent {
  private nextId = signal(4);

  readonly items = signal([
    {
      content: '目前支援信用卡、Line Pay、Apple Pay 等多種付款方式。',
      id: 1,
      title: '付款方式',
    },
    {
      content: '訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。',
      id: 2,
      title: '運送政策',
    },
    {
      content: '商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。',
      id: 3,
      title: '退換貨須知',
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
      },
    ]);
    this.nextId.update((n) => n + 1);
  }

  handleDelete(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.items.update((prev) => prev.filter((item) => item.id !== id));
  }
}

export const DeleteTransition: Story = {
  decorators: [
    moduleMetadata({
      imports: [AccordionDeleteTransitionDemoComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-accordion-delete-transition-demo />`,
  }),
};
