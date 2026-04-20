import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { MznButton } from '@mezzanine-ui/ng/button';
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
    withEditInput: {
      control: { type: 'boolean' },
      description:
        'Whether to show an editable input when the checkbox is checked',
    },
  },
  args: {
    description: 'Supporting text',
    disabled: false,
    indeterminate: false,
    mode: 'default',
    severity: 'info',
    size: 'main',
    withEditInput: false,
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <div mznCheckbox
        [description]="description"
        [disabled]="disabled"
        [indeterminate]="indeterminate"
        [mode]="mode"
        [severity]="severity"
        [size]="size"
        [withEditInput]="withEditInput"
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
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">With editable input:</p>
              <div
                mznCheckbox
                [(ngModel)]="mainEditInput"
                name="mainEditInput"
                description="Supporting text"
                [withEditInput]="true"
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
            <div
              style="display: flex; flex-direction: column; width: 100%; margin-bottom: 16px;"
            >
              <p mznTypography variant="body">With editable input:</p>
              <div
                mznCheckbox
                [(ngModel)]="subEditInput"
                name="subEditInput"
                size="sub"
                description="Supporting text"
                [withEditInput]="true"
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
  mainEditInput = false;
  subNormal = false;
  subChecked = true;
  subEditInput = false;
}

export const State: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [StateDemoComponent] })],
  render: () => ({
    template: `<story-checkbox-state />`,
  }),
};

@Component({
  selector: 'story-checkbox-with-form',
  standalone: true,
  imports: [FormsModule, MznButton, MznCheckbox, MznTypography],
  template: `
    <form
      (ngSubmit)="onSubmit()"
      style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 400px;"
    >
      <p mznTypography variant="body">簡單表單範例</p>
      <div
        mznCheckbox
        [(ngModel)]="agreeToTerms"
        label="我同意服務條款"
        name="agreeToTerms"
      ></div>
      <div
        mznCheckbox
        [(ngModel)]="subscribeNewsletter"
        description="訂閱我們的電子報以獲得最新消息"
        label="訂閱電子報"
        name="subscribeNewsletter"
      ></div>
      <button mznButton type="submit" style="margin-top: 8px;"> 提交 </button>
    </form>
  `,
})
class WithFormDemoComponent {
  agreeToTerms = false;
  subscribeNewsletter = false;

  onSubmit(): void {
    // eslint-disable-next-line no-console
    console.log('Form submitted:', {
      agreeToTerms: this.agreeToTerms,
      subscribeNewsletter: this.subscribeNewsletter,
    });
  }
}

export const WithForm: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithFormDemoComponent] })],
  render: () => ({
    template: `<story-checkbox-with-form />`,
  }),
};

@Component({
  selector: 'story-checkbox-editable-form',
  standalone: true,
  imports: [FormsModule, MznButton, MznCheckbox, MznTypography],
  template: `
    <form
      (ngSubmit)="onSubmit()"
      style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 500px;"
    >
      <p mznTypography variant="body">表單整合範例</p>
      <p mznTypography variant="body" color="text-neutral">
        選擇「其他」選項後，需要填寫自訂內容才能提交。
      </p>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div
          mznCheckbox
          [(ngModel)]="option1"
          label="選項 1"
          name="option1"
        ></div>
        <div
          mznCheckbox
          [(ngModel)]="option2"
          label="選項 2"
          name="option2"
        ></div>
        <div
          mznCheckbox
          [(ngModel)]="otherChecked"
          label="其他"
          name="otherChecked"
          [withEditInput]="true"
          [editableInput]="{ value: otherOption }"
          (editableInputChange)="otherOption = $event"
        ></div>
      </div>
      @if (otherChecked && !otherOption) {
        <p mznTypography variant="caption" color="text-error">
          請輸入其他選項的內容
        </p>
      }
      <button
        mznButton
        type="submit"
        [disabled]="otherChecked && !otherOption"
        style="margin-top: 8px;"
      >
        提交
      </button>
    </form>
  `,
})
class WithEditableInputAndFormDemoComponent {
  option1 = false;
  option2 = false;
  otherChecked = false;
  otherOption = '';

  onSubmit(): void {
    // eslint-disable-next-line no-console
    console.log('Form submitted:', {
      option1: this.option1,
      option2: this.option2,
      otherChecked: this.otherChecked,
      otherOption: this.otherOption,
    });
  }
}

export const WithEditableInputAndForm: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [WithEditableInputAndFormDemoComponent] }),
  ],
  render: () => ({
    template: `<story-checkbox-editable-form />`,
  }),
};
