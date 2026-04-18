import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, DestroyRef, inject } from '@angular/core';
import { MznMessageService } from './message.service';
import { MznNotifierService } from '../notifier/notifier.service';
import { MznMessage } from './message.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MznButton, MznButtonGroup } from '../button';

function createRandomNumber(): number {
  return Math.floor(Math.random() ** 7 * 1000000);
}

@Component({
  selector: 'mzn-message-basic-demo',
  standalone: true,
  imports: [MznMessage, MznButton, MznButtonGroup],
  template: `
    <div
      style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;"
    >
      訊息上限為 4 筆，每筆訊息預設停留 3 秒鐘。 滑鼠懸停於訊息上可暫停計時器。
      <div mznButtonGroup orientation="vertical">
        <button mznButton variant="base-primary" (click)="handleAdd()">
          Add
        </button>
        <button mznButton variant="base-primary" (click)="handleSuccess()">
          Success
        </button>
        <button mznButton variant="base-primary" (click)="handleWarning()">
          Warning
        </button>
        <button mznButton variant="base-primary" (click)="handleError()">
          Error
        </button>
        <button mznButton variant="base-primary" (click)="handleInfo()">
          Info
        </button>
        <button mznButton variant="base-primary" (click)="handleLoading()">
          Loading (不會自動關閉)
        </button>
      </div>
      <div class="mzn-message__root">
        @for (n of notifier.displayed(); track n.key) {
          <div
            mznMessage
            [messageKey]="n.key"
            [message]="$any(n).message ?? ''"
            [severity]="$any(n).severity"
            [icon]="$any(n).icon"
            [duration]="$any(n).duration ?? 3000"
            (closed)="notifier.remove($event)"
          ></div>
        }
      </div>
    </div>
  `,
})
class MessageBasicDemoComponent {
  protected readonly messageService = inject(MznMessageService);
  protected readonly notifier = inject(MznNotifierService);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.messageService.destroy());
  }

  handleAdd(): void {
    this.messageService.add({ message: `基礎訊息：${createRandomNumber()}` });
  }

  handleSuccess(): void {
    this.messageService.success(`成功訊息：${createRandomNumber()}`);
  }

  handleWarning(): void {
    this.messageService.warning(`警告訊息：${createRandomNumber()}`);
  }

  handleError(): void {
    this.messageService.error(`錯誤訊息：${createRandomNumber()}`);
  }

  handleInfo(): void {
    this.messageService.info(`資訊訊息：${createRandomNumber()}`);
  }

  handleLoading(): void {
    this.messageService.loading('資料載入中...');
  }
}

@Component({
  selector: 'mzn-message-loading-update-demo',
  standalone: true,
  imports: [MznMessage, MznButton, MznButtonGroup],
  template: `
    <div
      style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;"
    >
      <p style="margin: 0;">
        Loading 訊息預設不會自動關閉，可以透過相同的 key 更新為
        success/error/info 等其他狀態。 你可以透過儲存回傳 key 達到同樣效果
        (useState, useRef)
      </p>
      <div mznButtonGroup orientation="vertical">
        <button
          mznButton
          variant="base-primary"
          (click)="handleLoadingSuccess()"
        >
          Loading → Success (2秒後)
        </button>
        <button mznButton variant="base-primary" (click)="handleLoadingError()">
          Loading → Error (2秒後)
        </button>
        <button
          mznButton
          variant="base-primary"
          (click)="handleMultipleSteps()"
        >
          多步驟更新 (Loading → Loading → Success)
        </button>
      </div>
      <div class="mzn-message__root">
        @for (n of notifier.displayed(); track n.key) {
          <div
            mznMessage
            [messageKey]="n.key"
            [message]="$any(n).message ?? ''"
            [severity]="$any(n).severity"
            [icon]="$any(n).icon"
            [duration]="$any(n).duration ?? 3000"
            (closed)="notifier.remove($event)"
          ></div>
        }
      </div>
    </div>
  `,
})
class MessageLoadingUpdateDemoComponent {
  protected readonly messageService = inject(MznMessageService);
  protected readonly notifier = inject(MznNotifierService);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.messageService.destroy());
  }

  handleLoadingSuccess(): void {
    const key = this.messageService.loading('正在加載資料...');

    setTimeout(() => {
      this.messageService.add({
        message: '資料加載成功！',
        severity: 'success',
        key,
      });
    }, 2000);
  }

  handleLoadingError(): void {
    const key = this.messageService.loading('正在處理請求...');

    setTimeout(() => {
      this.messageService.add({
        message: '處理失敗，請稍後再試',
        severity: 'error',
        key,
      });
    }, 2000);
  }

  handleMultipleSteps(): void {
    const key = this.messageService.loading('步驟 1/3：準備資料...');

    setTimeout(() => {
      this.messageService.add({
        message: '步驟 2/3：上傳中...',
        severity: 'loading',
        duration: false,
        key,
      });
    }, 1500);

    setTimeout(() => {
      this.messageService.add({
        message: '步驟 3/3：處理中...',
        severity: 'loading',
        duration: false,
        key,
      });
    }, 3000);

    setTimeout(() => {
      this.messageService.add({
        message: '所有步驟完成！',
        severity: 'success',
        key,
      });
    }, 4500);
  }
}

export default {
  title: 'Feedback/Message',
  decorators: [
    moduleMetadata({
      imports: [
        MessageBasicDemoComponent,
        MessageLoadingUpdateDemoComponent,
        NoopAnimationsModule,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `<mzn-message-basic-demo />`,
  }),
};

export const LoadingUpdate: Story = {
  render: () => ({
    template: `<mzn-message-loading-update-demo />`,
  }),
};
