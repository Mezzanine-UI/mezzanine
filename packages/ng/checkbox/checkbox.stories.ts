import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { MznCheckbox } from './checkbox.component';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznTypography } from '@mezzanine-ui/ng/typography';

export default {
  title: 'Data Entry/Checkbox',
  decorators: [
    moduleMetadata({
      imports: [MznCheckbox, FormsModule, MznTag, MznTypography],
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
      <div mznCheckbox
        [checked]="checked"
        [description]="description"
        [disabled]="disabled"
        [indeterminate]="indeterminate"
        [mode]="mode"
        [severity]="severity"
        [size]="size"
      >
        Checkbox Label
      </div>
    `,
  }),
};

export const Severity: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; gap: 36px; align-items: flex-start;">
        <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;">
          <span mznTag type="static" label="Default mode" size="main"></span>
          <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;">
            <div style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;">
              <p mznTypography variant="body">Info:</p>
              <div mznCheckbox severity="info">Info checkbox</div>
            </div>
            <div style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;">
              <p mznTypography variant="body">Error:</p>
              <div mznCheckbox severity="error">Error checkbox</div>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;">
          <span mznTag type="static" label="Chip mode" size="main"></span>
          <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;">
            <div style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;">
              <p mznTypography variant="body">Info:</p>
              <div mznCheckbox mode="chip" severity="info">Info chip</div>
            </div>
            <div style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;">
              <p mznTypography variant="body">Error:</p>
              <div mznCheckbox mode="chip" severity="error">Error chip</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-checkbox-state',
  standalone: true,
  imports: [FormsModule, MznCheckbox, MznTag, MznTypography],
  template: `
    <div>
      <p>Check</p>
      <div style="display: flex; gap: 36px; align-items: flex-start;">
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;"
        >
          <span mznTag type="static" label="Main" size="main"></span>
          <div
            style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;"
          >
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Normal:</p>
              <div
                mznCheckbox
                [(ngModel)]="mainNormal"
                name="mainNormal"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Checked:</p>
              <div
                mznCheckbox
                [(ngModel)]="mainChecked"
                name="mainChecked"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Indeterminate:</p>
              <div
                mznCheckbox
                [indeterminate]="true"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Disabled:</p>
              <div mznCheckbox [disabled]="true" description="Supporting text"
                >Checkbox Label</div
              >
            </div>
          </div>
        </div>
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;"
        >
          <span mznTag type="static" label="Sub" size="main"></span>
          <div
            style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;"
          >
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Normal:</p>
              <div
                mznCheckbox
                [(ngModel)]="subNormal"
                name="subNormal"
                size="sub"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Checked:</p>
              <div
                mznCheckbox
                [(ngModel)]="subChecked"
                name="subChecked"
                size="sub"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Indeterminate:</p>
              <div
                mznCheckbox
                [indeterminate]="true"
                size="sub"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Disabled:</p>
              <div
                mznCheckbox
                [disabled]="true"
                size="sub"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
          </div>
        </div>
      </div>
      <p>Checkbox in Chip mode</p>
      <div style="display: flex; gap: 36px; align-items: flex-start;">
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;"
        >
          <span mznTag type="static" label="Chip Main" size="main"></span>
          <div
            style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;"
          >
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Normal:</p>
              <div mznCheckbox mode="chip" description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Checked:</p>
              <div
                mznCheckbox
                mode="chip"
                [checked]="true"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Disabled:</p>
              <div
                mznCheckbox
                mode="chip"
                [disabled]="true"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
          </div>
        </div>
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;"
        >
          <span mznTag type="static" label="Chip Sub" size="main"></span>
          <div
            style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;"
          >
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Normal:</p>
              <div
                mznCheckbox
                mode="chip"
                size="sub"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Checked:</p>
              <div
                mznCheckbox
                mode="chip"
                size="sub"
                [checked]="true"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Disabled:</p>
              <div
                mznCheckbox
                mode="chip"
                size="sub"
                [disabled]="true"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
          </div>
        </div>
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; padding: 32px; background-color: #F3F4F6;"
        >
          <span mznTag type="static" label="Chip Minor" size="main"></span>
          <div
            style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;"
          >
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Normal:</p>
              <div
                mznCheckbox
                mode="chip"
                size="minor"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Checked:</p>
              <div
                mznCheckbox
                mode="chip"
                size="minor"
                [checked]="true"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">Disabled:</p>
              <div
                mznCheckbox
                mode="chip"
                size="minor"
                [disabled]="true"
                description="Supporting text"
                >Checkbox Label</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class StateDemoComponent {
  mainNormal = false;
  mainChecked = true;
  subNormal = false;
  subChecked = true;
}

export const State: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [StateDemoComponent] })],
  render: () => ({
    template: `<story-checkbox-state />`,
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
        <div mznCheckbox [(ngModel)]="agreeToTerms" name="agreeToTerms">我同意服務條款</div>
        <div mznCheckbox [(ngModel)]="subscribeNewsletter" name="subscribeNewsletter">訂閱電子報</div>
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
          <div mznCheckbox [indeterminate]="true">Indeterminate (main)</div>
          <div mznCheckbox [indeterminate]="true" size="sub">Indeterminate (sub)</div>
          <div mznCheckbox [indeterminate]="true" [disabled]="true">Indeterminate (disabled)</div>
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
          <div mznCheckbox [(ngModel)]="option1" name="option1">選項 1</div>
          <div mznCheckbox [(ngModel)]="option2" name="option2">選項 2</div>
          <div mznCheckbox [(ngModel)]="otherChecked" name="otherChecked">其他</div>
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
