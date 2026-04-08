import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  ControlFieldSlotLayout,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
} from '@mezzanine-ui/core/form';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { MznFormField } from './form-field.component';

const meta: Meta<MznFormField> = {
  title: 'Data Entry/Form',
  component: MznFormField,
  decorators: [moduleMetadata({ imports: [MznFormField] })],
};

export default meta;
type Story = StoryObj<MznFormField>;

export const Playground: Story = {
  argTypes: {
    controlFieldSlotLayout: {
      options: Object.values(ControlFieldSlotLayout),
      control: { type: 'select' },
      description: '控制欄位插槽的排版變體。',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: `'${ControlFieldSlotLayout.MAIN}'` },
      },
    },
    counterColor: {
      options: Object.values(FormFieldCounterColor),
      control: { type: 'select' },
      description: '計數器文字顏色。',
      table: {
        type: { summary: "'info' | 'warning' | 'error'" },
        defaultValue: { summary: `'${FormFieldCounterColor.INFO}'` },
      },
    },
    density: {
      options: [undefined, ...Object.values(FormFieldDensity)],
      control: { type: 'select' },
      description: '密度變體，僅在水平/延伸排版時生效。',
      table: {
        type: { summary: "'base' | 'tight' | 'narrow' | 'wide'" },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '是否停用。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: '是否全寬。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hintText: {
      control: 'text',
      description: '提示文字。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    label: {
      control: 'text',
      description: '標籤文字。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    labelSpacing: {
      options: Object.values(FormFieldLabelSpacing),
      control: { type: 'select' },
      description: '標籤區域間距。',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: `'${FormFieldLabelSpacing.MAIN}'` },
      },
    },
    layout: {
      options: Object.values(FormFieldLayout),
      control: { type: 'select' },
      description: '排版方式。',
      table: {
        type: { summary: "'horizontal' | 'vertical' | 'stretch'" },
        defaultValue: { summary: `'${FormFieldLayout.HORIZONTAL}'` },
      },
    },
    required: {
      control: 'boolean',
      description: '是否必填。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    severity: {
      options: ['info', 'success', 'warning', 'error'] as SeverityWithInfo[],
      control: { type: 'select' },
      description: '嚴重程度。',
      table: {
        type: { summary: "'info' | 'success' | 'warning' | 'error'" },
        defaultValue: { summary: "'info'" },
      },
    },
    showHintTextIcon: {
      control: 'boolean',
      description: '是否顯示提示文字圖示。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  args: {
    controlFieldSlotLayout: ControlFieldSlotLayout.MAIN,
    counterColor: FormFieldCounterColor.INFO,
    disabled: false,
    fullWidth: false,
    hintText: 'hint text',
    label: 'label',
    labelSpacing: FormFieldLabelSpacing.MAIN,
    layout: FormFieldLayout.VERTICAL,
    required: false,
    severity: 'info',
    showHintTextIcon: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznFormField
        name="playground-field"
        [controlFieldSlotLayout]="controlFieldSlotLayout"
        [counterColor]="counterColor"
        [density]="density"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [hintText]="hintText"
        [label]="label"
        [labelSpacing]="labelSpacing"
        [layout]="layout"
        [required]="required"
        [severity]="severity"
        [showHintTextIcon]="showHintTextIcon"
      >
        <input placeholder="請輸入內容" />
      </div>
    `,
  }),
};

export const HorizontalBase: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.BASE}"
        hintText="Label and input on the same row with base spacing"
        label="Username"
        layout="${FormFieldLayout.HORIZONTAL}"
        name="username-h-base"
      >
        <input placeholder="Enter username" />
      </div>
    `,
  }),
};

export const HorizontalTight: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.TIGHT}"
        hintText="Label and input on the same row with tight spacing"
        label="Email"
        layout="${FormFieldLayout.HORIZONTAL}"
        name="email-h-tight"
      >
        <input placeholder="Enter email" />
      </div>
    `,
  }),
};

export const HorizontalNarrow: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.NARROW}"
        hintText="Label and input on the same row with narrow spacing"
        label="Phone"
        layout="${FormFieldLayout.HORIZONTAL}"
        name="phone-h-narrow"
      >
        <input placeholder="Enter phone" />
      </div>
    `,
  }),
};

export const HorizontalWide: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.WIDE}"
        hintText="Label and input on the same row with wide spacing"
        label="Address"
        layout="${FormFieldLayout.HORIZONTAL}"
        name="address-h-wide"
      >
        <input placeholder="Enter address" />
      </div>
    `,
  }),
};

export const StretchTight: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.TIGHT}"
        hintText="Compact vertical spacing between label and input"
        label="First Name"
        layout="${FormFieldLayout.STRETCH}"
        name="firstname-s-tight"
      >
        <input placeholder="Enter first name" />
      </div>
    `,
  }),
};

export const StretchNarrow: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.NARROW}"
        hintText="Standard vertical spacing between label and input"
        label="Last Name"
        layout="${FormFieldLayout.STRETCH}"
        name="lastname-s-narrow"
      >
        <input placeholder="Enter last name" />
      </div>
    `,
  }),
};

export const StretchWide: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.WIDE}"
        hintText="Spacious vertical spacing between label and input"
        label="Company"
        layout="${FormFieldLayout.STRETCH}"
        name="company-s-wide"
      >
        <input placeholder="Enter company name" />
      </div>
    `,
  }),
};

export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        hintText="Default vertical layout with standard spacing"
        label="Name"
        layout="${FormFieldLayout.VERTICAL}"
        name="name-vertical"
        [required]="true"
      >
        <input placeholder="Enter your name" />
      </div>
    `,
  }),
};

export const ControlFieldSlotColumnsExample: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div mznFormField
          label="持卡人姓名："
          layout="${FormFieldLayout.VERTICAL}"
          name="cardholder-name"
        >
          <input placeholder="請輸入姓名" />
        </div>
        <div mznFormField
          [controlFieldSlotColumns]="4"
          label="信用卡號："
          layout="${FormFieldLayout.VERTICAL}"
          name="card-number"
        >
          <input placeholder="0000" />
          <input placeholder="0000" />
          <input placeholder="0000" />
          <input placeholder="0000" />
        </div>
        <div mznFormField
          [controlFieldSlotColumns]="2"
          label="信用卡到期日："
          layout="${FormFieldLayout.VERTICAL}"
          name="card-expiry"
        >
          <input placeholder="mm" />
          <input placeholder="yy" />
        </div>
        <div mznFormField
          label="信用卡檢查碼："
          layout="${FormFieldLayout.VERTICAL}"
          name="card-cvv"
        >
          <input placeholder="請輸入檢查碼" />
        </div>
      </div>
    `,
  }),
};

export const CreditCardRecipeExample: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      name: '',
      card1: '',
      card2: '',
      card3: '',
      card4: '',
      month: '',
      year: '',
      cvv: '',
      submitted: false,
    },
    template: `
      <div style="max-width: 480px;">
        <div style="margin-bottom: 16px; font-weight: bold; font-size: 16px;">信用卡資訊</div>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div mznFormField
            label="持卡人姓名："
            layout="${FormFieldLayout.VERTICAL}"
            name="cardholder-name"
          >
            <input [(ngModel)]="name" name="name" placeholder="請輸入姓名" />
          </div>
          <div mznFormField
            [controlFieldSlotColumns]="4"
            label="信用卡號："
            layout="${FormFieldLayout.VERTICAL}"
            name="card-number"
          >
            <input [(ngModel)]="card1" name="card1" placeholder="0000" maxlength="4" />
            <input [(ngModel)]="card2" name="card2" placeholder="0000" maxlength="4" />
            <input [(ngModel)]="card3" name="card3" placeholder="0000" maxlength="4" />
            <input [(ngModel)]="card4" name="card4" placeholder="0000" maxlength="4" />
          </div>
          <div mznFormField
            [controlFieldSlotColumns]="2"
            label="有效期限："
            layout="${FormFieldLayout.VERTICAL}"
            name="card-expiry"
          >
            <input [(ngModel)]="month" name="month" placeholder="MM" maxlength="2" />
            <input [(ngModel)]="year" name="year" placeholder="YY" maxlength="2" />
          </div>
          <div mznFormField
            label="檢查碼："
            layout="${FormFieldLayout.VERTICAL}"
            name="card-cvv"
          >
            <input [(ngModel)]="cvv" name="cvv" placeholder="CVV" maxlength="4" />
          </div>
        </div>
        <div style="margin-top: 16px;">
          <button (click)="submitted = true" type="button">送出</button>
        </div>
      </div>
    `,
  }),
};
