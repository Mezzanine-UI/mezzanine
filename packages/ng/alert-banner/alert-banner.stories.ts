import { Component, inject } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznAlertBanner } from './alert-banner.component';
import { MznAlertBannerService } from './alert-banner.service';
import { MznNotifierService } from '../notifier/notifier.service';
import { MznButton } from '../button/button.directive';

@Component({
  selector: 'mzn-alert-banner-info-demo',
  standalone: true,
  imports: [MznAlertBanner, MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;"
    >
      <mzn-alert-banner
        severity="info"
        message="傳達一般提示、系統狀態或輔助性資訊。"
        [actions]="actions"
      />
      <button mznButton variant="base-primary" (click)="addBanner()">
        新增 Info AlertBanner
      </button>
    </div>
  `,
})
class AlertBannerInfoDemoComponent {
  private readonly service = inject(MznAlertBannerService);

  readonly actions = [
    {
      content: '了解更多',
      onClick: () => {
        console.warn('on click:了解更多');
      },
    },
  ];

  addBanner(): void {
    this.service.info('傳達一般提示、系統狀態或輔助性資訊。', {
      actions: this.actions,
    });
  }
}

@Component({
  selector: 'mzn-alert-banner-warning-demo',
  standalone: true,
  imports: [MznAlertBanner, MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;"
    >
      <mzn-alert-banner
        severity="warning"
        message="您的帳號即將到期，部分功能將在期限屆滿後暫時停用。為確保服務不中斷，請於到期日前完成續約或更新付款資訊。"
        [actions]="actions"
      />
      <button mznButton variant="base-primary" (click)="addBanner()">
        新增 Warning AlertBanner
      </button>
    </div>
  `,
})
class AlertBannerWarningDemoComponent {
  private readonly service = inject(MznAlertBannerService);

  readonly actions = [
    {
      content: '查看詳情',
      onClick: () => {
        console.warn('on click:查看詳情');
      },
    },
    {
      content: '忽略',
      onClick: () => {
        console.warn('on click:忽略');
      },
    },
  ];

  addBanner(): void {
    this.service.warning('提醒潛在風險或需要注意的情況。', {
      actions: this.actions,
    });
  }
}

@Component({
  selector: 'mzn-alert-banner-error-demo',
  standalone: true,
  imports: [MznAlertBanner, MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;"
    >
      <mzn-alert-banner
        severity="error"
        message="傳達錯誤、失敗或需立即處理的問題。"
        [actions]="actions"
      />
      <button mznButton variant="base-primary" (click)="addBanner()">
        新增 Error AlertBanner
      </button>
    </div>
  `,
})
class AlertBannerErrorDemoComponent {
  private readonly service = inject(MznAlertBannerService);

  readonly actions = [
    {
      content: '重試',
      onClick: () => {
        console.warn('on click:重試');
      },
    },
    {
      content: '取消',
      onClick: () => {
        console.warn('on click:取消');
      },
    },
  ];

  addBanner(): void {
    this.service.error('傳達錯誤、失敗或需立即處理的問題。', {
      actions: this.actions,
    });
  }
}

@Component({
  selector: 'mzn-alert-banner-interactive-demo',
  standalone: true,
  imports: [MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;"
    >
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button mznButton variant="base-primary" (click)="addInfo()"
          >新增 Info AlertBanner</button
        >
        <button mznButton variant="base-primary" (click)="addWarning()"
          >新增 Warning AlertBanner</button
        >
        <button mznButton variant="base-primary" (click)="addError()"
          >新增 Error AlertBanner</button
        >
        <button mznButton variant="base-primary" (click)="destroyAll()"
          >清除所有 AlertBanner</button
        >
      </div>
    </div>
  `,
})
class AlertBannerInteractiveDemoComponent {
  private readonly service = inject(MznAlertBannerService);

  private formatMessage(content: string): string {
    const now = new Date();
    const pad = (v: number): string => v.toString().padStart(2, '0');
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    return `${content} (${date} ${time})`;
  }

  addInfo(): void {
    this.service.info(
      this.formatMessage('傳達一般提示、系統狀態或輔助性資訊。'),
    );
  }

  addWarning(): void {
    this.service.warning(this.formatMessage('提醒潛在風險或需要注意的情況。'));
  }

  addError(): void {
    this.service.error(
      this.formatMessage('傳達錯誤、失敗或需立即處理的問題。'),
    );
  }

  destroyAll(): void {
    this.service.destroy();
  }
}

@Component({
  selector: 'mzn-alert-banner-with-actions-demo',
  standalone: true,
  imports: [MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;"
    >
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button mznButton variant="base-primary" (click)="addInfoWithActions()">
          新增 Info AlertBanner (1 個 action)
        </button>
        <button
          mznButton
          variant="base-primary"
          (click)="addWarningWithActions()"
        >
          新增 Warning AlertBanner (2 個 actions)
        </button>
        <button
          mznButton
          variant="base-primary"
          (click)="addErrorWithActions()"
        >
          新增 Error AlertBanner (2 個 actions)
        </button>
        <button mznButton variant="base-primary" (click)="destroyAll()">
          清除所有 AlertBanner
        </button>
      </div>
    </div>
  `,
})
class AlertBannerWithActionsDemoComponent {
  private readonly service = inject(MznAlertBannerService);

  private formatMessage(content: string): string {
    const now = new Date();
    const pad = (v: number): string => v.toString().padStart(2, '0');
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    return `${content} (${date} ${time})`;
  }

  addInfoWithActions(): void {
    this.service.info(
      this.formatMessage('傳達一般提示、系統狀態或輔助性資訊。'),
      {
        actions: [
          {
            content: '檢視紀錄',
            onClick: () => {
              console.warn('on click:檢視紀錄');
            },
          },
          {
            content: '瞭解更多',
            onClick: () => {
              console.warn('on click:瞭解更多');
            },
          },
        ],
        onClose: () => {
          console.warn('on close: Info AlertBanner');
        },
      },
    );
  }

  addWarningWithActions(): void {
    this.service.warning(this.formatMessage('提醒潛在風險或需要注意的情況。'), {
      actions: [
        {
          content: '查看詳情',
          onClick: () => {
            console.warn('on click:查看詳情');
          },
        },
        {
          content: '忽略',
          onClick: () => {
            console.warn('on click:忽略');
          },
        },
      ],
      onClose: () => {
        console.warn('on close: Warning AlertBanner');
      },
    });
  }

  addErrorWithActions(): void {
    this.service.error(
      this.formatMessage('傳達錯誤、失敗或需立即處理的問題。'),
      {
        actions: [
          {
            content: '重試',
            onClick: () => {
              console.warn('on click:重試');
            },
          },
          {
            content: '取消',
            onClick: () => {
              console.warn('on click:取消');
            },
          },
        ],
        onClose: () => {
          console.warn('on close: Error AlertBanner');
        },
      },
    );
  }

  destroyAll(): void {
    this.service.destroy();
  }
}

export default {
  title: 'Feedback/Alert Banner',
  decorators: [
    moduleMetadata({
      imports: [
        MznAlertBanner,
        AlertBannerInfoDemoComponent,
        AlertBannerWarningDemoComponent,
        AlertBannerErrorDemoComponent,
        AlertBannerInteractiveDemoComponent,
        AlertBannerWithActionsDemoComponent,
      ],
      providers: [MznAlertBannerService, MznNotifierService],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Info: Story = {
  render: () => ({
    template: `<mzn-alert-banner-info-demo />`,
  }),
};

export const Warning: Story = {
  render: () => ({
    template: `<mzn-alert-banner-warning-demo />`,
  }),
};

export const Error: Story = {
  render: () => ({
    template: `<mzn-alert-banner-error-demo />`,
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `<mzn-alert-banner-interactive-demo />`,
  }),
};

export const WithActions: Story = {
  render: () => ({
    template: `<mzn-alert-banner-with-actions-demo />`,
  }),
};
