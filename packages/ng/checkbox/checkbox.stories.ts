import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { MznCheckbox } from './checkbox.component';

export default {
  title: 'Data Entry/Checkbox',
  decorators: [
    moduleMetadata({
      imports: [MznCheckbox, FormsModule],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked',
    },
    description: {
      control: { type: 'text' },
      description: 'The description text displayed below the label',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is in indeterminate state',
    },
    mode: {
      options: ['default', 'chip'],
      control: { type: 'select' },
      description: 'The mode of checkbox',
    },
    severity: {
      options: ['info', 'error'],
      control: { type: 'select' },
      description:
        'Visual severity: info for hint state, error for error state',
    },
    size: {
      options: ['main', 'sub', 'minor'],
      control: { type: 'select' },
      description:
        'The size of checkbox. In chip mode, "minor" is also available.',
    },
  },
  args: {
    checked: false,
    description: 'Supporting text',
    disabled: false,
    indeterminate: false,
    mode: 'default',
    severity: 'info',
    size: 'main',
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <mzn-checkbox
        [checked]="checked"
        [description]="description"
        [disabled]="disabled"
        [indeterminate]="indeterminate"
        [mode]="mode"
        [severity]="severity"
        [size]="size"
      >
        Checkbox Label
      </mzn-checkbox>
    `,
  }),
};

export const Severity: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; gap: 36px; align-items: flex-start;">
        <div style="display: flex; flex-direction: column; gap: 8px; padding: 32px; background-color: #F3F4F6;">
          <span style="font-weight: bold;">Default mode</span>
          <div style="margin-top: 8px;">
            <p>Info:</p>
            <mzn-checkbox severity="info">Info checkbox</mzn-checkbox>
          </div>
          <div>
            <p>Error:</p>
            <mzn-checkbox severity="error">Error checkbox</mzn-checkbox>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; padding: 32px; background-color: #F3F4F6;">
          <span style="font-weight: bold;">Chip mode</span>
          <div style="margin-top: 8px;">
            <p>Info:</p>
            <mzn-checkbox mode="chip" severity="info">Info chip</mzn-checkbox>
          </div>
          <div>
            <p>Error:</p>
            <mzn-checkbox mode="chip" severity="error">Error chip</mzn-checkbox>
          </div>
        </div>
      </div>
    `,
  }),
};

export const State: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      checked: false,
    },
    template: `
      <div>
        <p>Check</p>
        <div style="display: flex; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;">
            <span style="font-weight: bold;">Main</span>
            <div style="margin-top: 8px;">
              <p>Normal:</p>
              <mzn-checkbox>Checkbox Label</mzn-checkbox>
            </div>
            <div>
              <p>Checked:</p>
              <mzn-checkbox [checked]="true">Checkbox Label</mzn-checkbox>
            </div>
            <div>
              <p>Disabled:</p>
              <mzn-checkbox [disabled]="true">Checkbox Label</mzn-checkbox>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;">
            <span style="font-weight: bold;">Sub</span>
            <div style="margin-top: 8px;">
              <p>Normal:</p>
              <mzn-checkbox size="sub">Checkbox Label</mzn-checkbox>
            </div>
            <div>
              <p>Checked:</p>
              <mzn-checkbox size="sub" [checked]="true">Checkbox Label</mzn-checkbox>
            </div>
            <div>
              <p>Disabled:</p>
              <mzn-checkbox size="sub" [disabled]="true">Checkbox Label</mzn-checkbox>
            </div>
          </div>
        </div>
        <p>Checkbox in Chip mode</p>
        <div style="display: flex; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;">
            <span style="font-weight: bold;">Chip Main</span>
            <div style="margin-top: 8px;">
              <p>Normal:</p>
              <mzn-checkbox mode="chip">Checkbox Label</mzn-checkbox>
            </div>
            <div>
              <p>Checked:</p>
              <mzn-checkbox mode="chip" [checked]="true">Checkbox Label</mzn-checkbox>
            </div>
            <div>
              <p>Disabled:</p>
              <mzn-checkbox mode="chip" [disabled]="true">Checkbox Label</mzn-checkbox>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;">
            <span style="font-weight: bold;">Chip Sub</span>
            <div style="margin-top: 8px;">
              <p>Normal:</p>
              <mzn-checkbox mode="chip" size="sub">Checkbox Label</mzn-checkbox>
            </div>
            <div>
              <p>Checked:</p>
              <mzn-checkbox mode="chip" size="sub" [checked]="true">Checkbox Label</mzn-checkbox>
            </div>
            <div>
              <p>Disabled:</p>
              <mzn-checkbox mode="chip" size="sub" [disabled]="true">Checkbox Label</mzn-checkbox>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const WithForm: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      agreeToTerms: false,
      subscribeNewsletter: false,
    },
    template: `
      <form style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 400px;">
        <p style="margin: 0; font-weight: bold;">簡單表單範例</p>
        <mzn-checkbox [(ngModel)]="agreeToTerms" name="agreeToTerms">我同意服務條款</mzn-checkbox>
        <mzn-checkbox [(ngModel)]="subscribeNewsletter" name="subscribeNewsletter">訂閱電子報</mzn-checkbox>
        <button
          type="button"
          style="padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px;"
        >
          提交
        </button>
      </form>
    `,
  }),
};

export const Indeterminate: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px;">
        <p style="margin: 0; font-weight: bold;">Indeterminate State</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <mzn-checkbox [indeterminate]="true">Indeterminate (main)</mzn-checkbox>
          <mzn-checkbox [indeterminate]="true" size="sub">Indeterminate (sub)</mzn-checkbox>
          <mzn-checkbox [indeterminate]="true" [disabled]="true">Indeterminate (disabled)</mzn-checkbox>
        </div>
      </div>
    `,
  }),
};

export const WithEditableInputAndForm: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      option1: false,
      option2: false,
      otherChecked: false,
    },
    template: `
      <form style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 500px;">
        <p style="margin: 0; font-weight: bold;">表單整合範例</p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">選擇「其他」選項後，需要填寫自訂內容才能提交。</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <mzn-checkbox [(ngModel)]="option1" name="option1">選項 1</mzn-checkbox>
          <mzn-checkbox [(ngModel)]="option2" name="option2">選項 2</mzn-checkbox>
          <mzn-checkbox [(ngModel)]="otherChecked" name="otherChecked">其他</mzn-checkbox>
          <input *ngIf="otherChecked" type="text" placeholder="請輸入其他選項內容" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" />
        </div>
        <button
          type="button"
          style="padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px;"
        >
          提交
        </button>
      </form>
    `,
  }),
};
