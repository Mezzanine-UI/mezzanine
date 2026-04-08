import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznButton, MznButtonGroup } from '../button';
import { MznPageFooter } from './page-footer.component';

const meta: Meta<MznPageFooter> = {
  title: 'Navigation/PageFooter',
  component: MznPageFooter,
  decorators: [
    moduleMetadata({
      imports: [MznPageFooter, MznButton, MznButtonGroup],
    }),
  ],
  argTypes: {
    annotation: {
      control: 'text',
      description:
        '資訊類型下顯示的純文字說明（僅在 type="information" 時生效）',
    },
    hostClass: {
      control: 'text',
      description: '額外 CSS class',
    },
    supportingActionName: {
      control: 'text',
      description: '支援操作按鈕的文字（僅在 type="standard" 時生效）',
    },
    supportingActionType: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: '支援操作按鈕的 HTML type 屬性',
    },
    supportingActionVariant: {
      control: 'select',
      options: [
        'base-primary',
        'base-secondary',
        'base-tertiary',
        'base-ghost',
        'base-dashed',
        'base-text-link',
      ],
      description: '支援操作按鈕的視覺樣式變體',
    },
    type: {
      control: 'select',
      options: ['standard', 'overflow', 'information'],
      description: 'PageFooter 的版面類型',
    },
    warningMessage: {
      control: 'text',
      description: '中間區域顯示的警示訊息文字',
    },
  },
};

export default meta;
type Story = StoryObj<MznPageFooter>;

export const Basic: Story = {
  render: () => ({
    template: `
      <mzn-page-footer>
        <mzn-button-group actions>
          <button mznButton variant="base-primary">Button</button>
        </mzn-button-group>
      </mzn-page-footer>
    `,
  }),
};

export const StandardType: Story = {
  args: {
    type: 'standard',
    supportingActionName: '查看發佈紀錄',
    supportingActionVariant: 'base-ghost',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-page-footer
        [type]="type"
        [supportingActionName]="supportingActionName"
        [supportingActionVariant]="supportingActionVariant"
      >
        <mzn-button-group actions>
          <button mznButton variant="base-secondary">儲存草稿</button>
          <button mznButton variant="base-primary">發佈</button>
        </mzn-button-group>
      </mzn-page-footer>
    `,
  }),
};

export const WithWarningMessage: Story = {
  args: {
    type: 'standard',
    supportingActionName: '查看發佈紀錄',
    warningMessage: '部分內容未通過驗證，請調整後重試',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-page-footer
        [type]="type"
        [supportingActionName]="supportingActionName"
        [warningMessage]="warningMessage"
      >
        <mzn-button-group actions>
          <button mznButton variant="base-secondary">儲存草稿</button>
          <button mznButton variant="base-primary">發佈</button>
        </mzn-button-group>
      </mzn-page-footer>
    `,
  }),
};

export const OverflowType: Story = {
  args: {
    type: 'overflow',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-page-footer [type]="type">
        <mzn-button-group actions>
          <button mznButton variant="base-secondary">儲存草稿</button>
          <button mznButton variant="base-primary">發佈</button>
        </mzn-button-group>
      </mzn-page-footer>
    `,
  }),
};

export const InformationType: Story = {
  args: {
    type: 'information',
    annotation: '發佈後將無法編輯，請確認內容無誤',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-page-footer [type]="type" [annotation]="annotation">
        <mzn-button-group actions>
          <button mznButton variant="base-secondary">儲存草稿</button>
          <button mznButton variant="base-primary">發佈</button>
        </mzn-button-group>
      </mzn-page-footer>
    `,
  }),
};

export const LoadingState: Story = {
  args: {
    type: 'standard',
    supportingActionName: '查看說明',
    warningMessage: 'Please wait while we save your changes',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-page-footer
        [type]="type"
        [supportingActionName]="supportingActionName"
        [warningMessage]="warningMessage"
      >
        <mzn-button-group actions>
          <button mznButton variant="base-secondary" [disabled]="true">Cancel</button>
          <button mznButton variant="base-primary" [loading]="true">Saving...</button>
        </mzn-button-group>
      </mzn-page-footer>
    `,
  }),
};

export const DangerAction: Story = {
  args: {
    type: 'information',
    annotation: '此操作將永久刪除資料',
    warningMessage: 'This action cannot be undone',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-page-footer
        [type]="type"
        [annotation]="annotation"
        [warningMessage]="warningMessage"
      >
        <mzn-button-group actions>
          <button mznButton variant="base-secondary">Cancel</button>
          <button mznButton variant="destructive-primary">Delete</button>
        </mzn-button-group>
      </mzn-page-footer>
    `,
  }),
};
