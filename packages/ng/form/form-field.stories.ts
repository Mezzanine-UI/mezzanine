import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  CheckedOutlineIcon,
  ErrorOutlineIcon,
  IconDefinition,
  InfoFilledIcon,
  InfoOutlineIcon,
  QuestionOutlineIcon,
  WarningOutlineIcon,
} from '@mezzanine-ui/icons';
import {
  ControlFieldSlotLayout,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
} from '@mezzanine-ui/core/form';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { FormsModule } from '@angular/forms';
import {
  MznCheckAll,
  MznCheckbox,
  MznCheckboxGroup,
} from '@mezzanine-ui/ng/checkbox';
import { MznInput } from '@mezzanine-ui/ng/input';
import { MznRadio, MznRadioGroup } from '@mezzanine-ui/ng/radio';
import { MznTextarea } from '@mezzanine-ui/ng/textarea';
import { MznToggle } from '@mezzanine-ui/ng/toggle';
import { MznFormField } from './form-field.component';
import { MznFormGroup } from './form-group.component';

const hintTextIconOptions: Record<string, IconDefinition | undefined> = {
  none: undefined,
  InfoOutlineIcon,
  InfoFilledIcon,
  WarningOutlineIcon,
  ErrorOutlineIcon,
  CheckedOutlineIcon,
  QuestionOutlineIcon,
};

const meta: Meta = {
  title: 'Data Entry/Form',
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        MznCheckAll,
        MznCheckbox,
        MznCheckboxGroup,
        MznFormField,
        MznFormGroup,
        MznInput,
        MznRadio,
        MznRadioGroup,
        MznTextarea,
        MznToggle,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    clearable: {
      control: 'boolean',
    },
    controlFieldSlotLayout: {
      options: Object.values(ControlFieldSlotLayout),
      control: { type: 'select' },
    },
    counter: {
      control: 'text',
    },
    counterColor: {
      options: Object.values(FormFieldCounterColor),
      control: { type: 'select' },
    },
    density: {
      options: [undefined, ...Object.values(FormFieldDensity)],
      control: { type: 'select' },
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    hintText: {
      control: 'text',
    },
    hintTextIcon: {
      options: Object.keys(hintTextIconOptions),
      control: { type: 'select' },
    },
    label: {
      control: 'text',
    },
    labelInformationText: {
      control: 'text',
    },
    labelSpacing: {
      options: Object.values(FormFieldLabelSpacing),
      control: { type: 'select' },
    },
    layout: {
      options: Object.values(FormFieldLayout),
      control: { type: 'select' },
    },
    name: {
      control: 'text',
    },
    remark: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    severity: {
      options: ['info', 'success', 'warning', 'error'] as SeverityWithInfo[],
      control: { type: 'select' },
    },
    showHintTextIcon: {
      control: 'boolean',
    },
    showRemarkIcon: {
      control: 'boolean',
    },
  },
  args: {
    clearable: false,
    controlFieldSlotLayout: ControlFieldSlotLayout.MAIN,
    counter: '231/232',
    counterColor: FormFieldCounterColor.INFO,
    density: FormFieldDensity.BASE,
    disabled: false,
    fullWidth: false,
    hintText: 'hint text',
    hintTextIcon: 'InfoFilledIcon',
    label: 'label',
    labelInformationText: 'This is information tooltip text',
    labelSpacing: FormFieldLabelSpacing.MAIN,
    layout: FormFieldLayout.VERTICAL,
    name: 'field-name',
    remark: 'remark',
    required: false,
    severity: 'info',
    showHintTextIcon: true,
    showRemarkIcon: false,
  },
  render: (args) => ({
    props: {
      ...args,
      hintTextIconOptions,
      resolvedHintTextIcon: hintTextIconOptions[args['hintTextIcon'] as string],
      resolvedLabelInformationIcon: args['showRemarkIcon']
        ? InfoOutlineIcon
        : undefined,
      checkAllOptions: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3', disabled: true },
      ],
      checkboxGroupValue: ['2'],
    },
    template: `
      <div mznFormField
        [controlFieldSlotLayout]="controlFieldSlotLayout"
        [counter]="counter"
        [counterColor]="counterColor"
        [density]="density"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [hintText]="hintText"
        [hintTextIcon]="resolvedHintTextIcon"
        [label]="label"
        [labelInformationIcon]="resolvedLabelInformationIcon"
        [labelInformationText]="labelInformationText"
        [labelOptionalMarker]="remark"
        [labelSpacing]="labelSpacing"
        [layout]="layout"
        [name]="name"
        [required]="required"
        [severity]="severity"
        [showHintTextIcon]="showHintTextIcon"
      >
        <div mznInput [clearable]="clearable" placeholder="please enter text"></div>
      </div>
      <br /><br />
      <div mznFormField
        [controlFieldSlotLayout]="controlFieldSlotLayout"
        [counter]="counter"
        [counterColor]="counterColor"
        [density]="density"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [hintText]="hintText"
        [hintTextIcon]="resolvedHintTextIcon"
        [label]="label"
        [labelInformationIcon]="resolvedLabelInformationIcon"
        [labelInformationText]="labelInformationText"
        [labelOptionalMarker]="remark"
        [labelSpacing]="labelSpacing"
        [layout]="layout"
        name="textarea-field"
        [required]="required"
        [severity]="severity"
        [showHintTextIcon]="showHintTextIcon"
      >
        <div mznTextarea placeholder="please enter text" [rows]="4"></div>
      </div>
      <br /><br />
      <div mznFormField
        [controlFieldSlotLayout]="controlFieldSlotLayout"
        [counter]="counter"
        [counterColor]="counterColor"
        [density]="density"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [hintText]="hintText"
        [hintTextIcon]="resolvedHintTextIcon"
        [label]="label"
        [labelInformationIcon]="resolvedLabelInformationIcon"
        [labelInformationText]="labelInformationText"
        [labelOptionalMarker]="remark"
        [labelSpacing]="labelSpacing"
        [layout]="layout"
        name="toggle-field"
        [required]="required"
        [severity]="severity"
        [showHintTextIcon]="showHintTextIcon"
      >
        <div mznToggle></div>
      </div>
      <br /><br />
      <div mznFormField
        [controlFieldSlotLayout]="controlFieldSlotLayout"
        [counter]="counter"
        [counterColor]="counterColor"
        [density]="density"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [hintText]="hintText"
        [hintTextIcon]="resolvedHintTextIcon"
        [label]="label"
        [labelInformationIcon]="resolvedLabelInformationIcon"
        [labelInformationText]="labelInformationText"
        [labelOptionalMarker]="remark"
        [labelSpacing]="labelSpacing"
        [layout]="layout"
        name="radio-field"
        [required]="required"
        [severity]="severity"
        [showHintTextIcon]="showHintTextIcon"
      >
        <div mznRadioGroup name="radio-group">
          <div mznRadio value="1">Option 1</div>
          <div mznRadio value="2">Option 2</div>
          <div mznRadio value="3" [disabled]="true">Option 3</div>
        </div>
      </div>
      <br /><br />
      <div mznFormField
        [controlFieldSlotLayout]="controlFieldSlotLayout"
        [counter]="counter"
        [counterColor]="counterColor"
        [density]="density"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [hintText]="hintText"
        [hintTextIcon]="resolvedHintTextIcon"
        [label]="label"
        [labelInformationIcon]="resolvedLabelInformationIcon"
        [labelInformationText]="labelInformationText"
        [labelOptionalMarker]="remark"
        [labelSpacing]="labelSpacing"
        [layout]="layout"
        name="checkbox-field"
        [required]="required"
        [severity]="severity"
        [showHintTextIcon]="showHintTextIcon"
      >
        <div mznCheckboxGroup name="checkbox-group">
          <div mznCheckbox value="1">Option 1</div>
          <div mznCheckbox value="2">Option 2</div>
          <div mznCheckbox value="3" [disabled]="true">Option 3</div>
        </div>
      </div>
      <br /><br />
      <div mznFormField
        [controlFieldSlotLayout]="controlFieldSlotLayout"
        [counter]="counter"
        [counterColor]="counterColor"
        [density]="density"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [hintText]="hintText"
        [hintTextIcon]="resolvedHintTextIcon"
        [label]="label"
        [labelInformationIcon]="resolvedLabelInformationIcon"
        [labelInformationText]="labelInformationText"
        [labelOptionalMarker]="remark"
        [labelSpacing]="labelSpacing"
        [layout]="layout"
        name="checkall-field"
        [required]="required"
        [severity]="severity"
        [showHintTextIcon]="showHintTextIcon"
      >
        <div mznCheckAll [options]="checkAllOptions" label="Check All">
          <div mznCheckboxGroup [(ngModel)]="checkboxGroupValue" name="checkall-group">
            <div mznCheckbox value="1">Option 1</div>
            <div mznCheckbox value="2">Option 2</div>
            <div mznCheckbox value="3" [disabled]="true">Option 3</div>
          </div>
        </div>
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
        [hintTextIcon]="hintTextIcon"
        label="Username"
        layout="${FormFieldLayout.HORIZONTAL}"
        name="username-h-base"
      >
        <div mznInput placeholder="Enter username"></div>
      </div>
    `,
    props: {
      hintTextIcon: InfoFilledIcon,
    },
  }),
};

export const HorizontalTight: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.TIGHT}"
        hintText="Label and input on the same row with tight spacing"
        [hintTextIcon]="hintTextIcon"
        label="Email"
        layout="${FormFieldLayout.HORIZONTAL}"
        name="email-h-tight"
      >
        <div mznInput placeholder="Enter email"></div>
      </div>
    `,
    props: {
      hintTextIcon: InfoFilledIcon,
    },
  }),
};

export const HorizontalNarrow: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.NARROW}"
        hintText="Label and input on the same row with narrow spacing"
        [hintTextIcon]="hintTextIcon"
        label="Phone"
        layout="${FormFieldLayout.HORIZONTAL}"
        name="phone-h-narrow"
      >
        <div mznInput placeholder="Enter phone"></div>
      </div>
    `,
    props: {
      hintTextIcon: InfoFilledIcon,
    },
  }),
};

export const HorizontalWide: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.WIDE}"
        hintText="Label and input on the same row with wide spacing"
        [hintTextIcon]="hintTextIcon"
        label="Address"
        layout="${FormFieldLayout.HORIZONTAL}"
        name="address-h-wide"
      >
        <div mznInput placeholder="Enter address"></div>
      </div>
    `,
    props: {
      hintTextIcon: InfoFilledIcon,
    },
  }),
};

export const StretchTight: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.TIGHT}"
        hintText="Compact vertical spacing between label and input"
        [hintTextIcon]="hintTextIcon"
        label="First Name"
        layout="${FormFieldLayout.STRETCH}"
        name="firstname-s-tight"
      >
        <div mznInput placeholder="Enter first name"></div>
      </div>
    `,
    props: {
      hintTextIcon: InfoFilledIcon,
    },
  }),
};

export const StretchNarrow: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.NARROW}"
        hintText="Standard vertical spacing between label and input"
        [hintTextIcon]="hintTextIcon"
        label="Last Name"
        layout="${FormFieldLayout.STRETCH}"
        name="lastname-s-narrow"
      >
        <div mznInput placeholder="Enter last name"></div>
      </div>
    `,
    props: {
      hintTextIcon: InfoFilledIcon,
    },
  }),
};

export const StretchWide: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        density="${FormFieldDensity.WIDE}"
        hintText="Spacious vertical spacing between label and input"
        [hintTextIcon]="hintTextIcon"
        label="Company"
        layout="${FormFieldLayout.STRETCH}"
        name="company-s-wide"
      >
        <div mznInput placeholder="Enter company name"></div>
      </div>
    `,
    props: {
      hintTextIcon: InfoFilledIcon,
    },
  }),
};

export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormField
        hintText="Default vertical layout with standard spacing"
        [hintTextIcon]="hintTextIcon"
        label="Name"
        layout="${FormFieldLayout.VERTICAL}"
        name="name-vertical"
        [required]="true"
      >
        <div mznInput placeholder="Enter your name"></div>
      </div>
    `,
    props: {
      hintTextIcon: InfoFilledIcon,
    },
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
          <div mznInput placeholder="請輸入姓名"></div>
        </div>
        <div mznFormField
          [controlFieldSlotColumns]="4"
          label="信用卡號："
          layout="${FormFieldLayout.VERTICAL}"
          name="card-number"
        >
          <div mznInput placeholder="0000"></div>
          <div mznInput placeholder="0000"></div>
          <div mznInput placeholder="0000"></div>
          <div mznInput placeholder="0000"></div>
        </div>
        <div mznFormField
          [controlFieldSlotColumns]="2"
          label="信用卡到期日："
          layout="${FormFieldLayout.VERTICAL}"
          name="card-expiry"
        >
          <div mznInput placeholder="mm"></div>
          <div mznInput placeholder="yy"></div>
        </div>
        <div mznFormField
          label="信用卡檢查碼："
          layout="${FormFieldLayout.VERTICAL}"
          name="card-cvv"
        >
          <div mznInput placeholder="請輸入檢查碼"></div>
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
      get nameSeverity(): SeverityWithInfo {
        return this.submitted && !this.name.trim() ? 'error' : 'info';
      },
      get nameHint(): string | undefined {
        return this.submitted && !this.name.trim()
          ? '請輸入持卡人姓名'
          : undefined;
      },
      get cardSeverity(): SeverityWithInfo {
        const complete =
          this.card1.length === 4 &&
          this.card2.length === 4 &&
          this.card3.length === 4 &&
          this.card4.length === 4;

        return this.submitted && !complete ? 'error' : 'info';
      },
      get cardHint(): string | undefined {
        const complete =
          this.card1.length === 4 &&
          this.card2.length === 4 &&
          this.card3.length === 4 &&
          this.card4.length === 4;

        return this.submitted && !complete ? '請輸入完整卡號' : undefined;
      },
      get expireSeverity(): SeverityWithInfo {
        return this.submitted &&
          !(this.month.length === 2 && this.year.length === 2)
          ? 'error'
          : 'info';
      },
      get expireHint(): string | undefined {
        return this.submitted &&
          !(this.month.length === 2 && this.year.length === 2)
          ? '請輸入有效期限'
          : undefined;
      },
      get cvvSeverity(): SeverityWithInfo {
        return this.submitted && this.cvv.length < 3 ? 'error' : 'info';
      },
      get cvvHint(): string | undefined {
        return this.submitted && this.cvv.length < 3 ? '請輸入 CVV' : undefined;
      },
      get allValid(): boolean {
        return (
          this.submitted &&
          this.name.trim().length > 0 &&
          this.card1.length === 4 &&
          this.card2.length === 4 &&
          this.card3.length === 4 &&
          this.card4.length === 4 &&
          this.month.length === 2 &&
          this.year.length === 2 &&
          this.cvv.length >= 3
        );
      },
    },
    template: `
      <div style="max-width: 480px;">
        <div mznFormGroup title="信用卡資訊">
          <div mznFormField
            [hintText]="nameHint"
            label="持卡人姓名："
            layout="${FormFieldLayout.VERTICAL}"
            name="cardholder-name"
            [severity]="nameSeverity"
          >
            <div mznInput [(ngModel)]="name" placeholder="請輸入姓名"></div>
          </div>
          <div mznFormField
            [controlFieldSlotColumns]="4"
            [hintText]="cardHint"
            label="信用卡號："
            layout="${FormFieldLayout.VERTICAL}"
            name="card-number"
            [severity]="cardSeverity"
          >
            <div mznInput [(ngModel)]="card1" placeholder="0000"></div>
            <div mznInput [(ngModel)]="card2" placeholder="0000"></div>
            <div mznInput [(ngModel)]="card3" placeholder="0000"></div>
            <div mznInput [(ngModel)]="card4" placeholder="0000"></div>
          </div>
          <div mznFormField
            [controlFieldSlotColumns]="2"
            [hintText]="expireHint"
            label="有效期限："
            layout="${FormFieldLayout.VERTICAL}"
            name="card-expiry"
            [severity]="expireSeverity"
          >
            <div mznInput [(ngModel)]="month" placeholder="MM"></div>
            <div mznInput [(ngModel)]="year" placeholder="YY"></div>
          </div>
          <div mznFormField
            [hintText]="cvvHint"
            label="檢查碼："
            layout="${FormFieldLayout.VERTICAL}"
            name="card-cvv"
            [severity]="cvvSeverity"
          >
            <div mznInput [(ngModel)]="cvv" placeholder="CVV"></div>
          </div>
        </div>
        <div style="margin-top: 16px;">
          <button (click)="submitted = true" type="button">送出</button>
          @if (allValid) {
            <span style="margin-left: 12px; color: green;">✓ 驗證通過</span>
          }
        </div>
      </div>
    `,
  }),
};
