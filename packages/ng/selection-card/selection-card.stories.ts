import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznSelectionCard } from './selection-card.component';

export default {
  title: 'Data Entry/SelectionCard',
  decorators: [
    moduleMetadata({
      imports: [MznSelectionCard],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the selection is checked (controlled mode)',
    },
    direction: {
      options: ['horizontal', 'vertical'],
      control: { type: 'inline-radio' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    image: {
      control: { type: 'text' },
      description: 'The image URL of selection',
    },
    imageObjectFit: {
      options: ['contain', 'cover', 'fill', 'none', 'scale-down'],
      control: { type: 'select' },
      description: 'The object fit of selection image',
    },
    name: {
      control: { type: 'text' },
      description: 'The name attribute for form submission',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when the selection card is clicked',
    },
    readonly: {
      control: { type: 'boolean' },
    },
    selector: {
      options: ['radio', 'checkbox'],
      control: { type: 'inline-radio' },
    },
    supportingText: {
      control: { type: 'text' },
    },
    supportingTextMaxWidth: {
      control: { type: 'text' },
      description: 'Max width of the supporting text',
    },
    text: {
      control: { type: 'text' },
      description: 'The accessible text of selection (required)',
    },
    textMaxWidth: {
      control: { type: 'text' },
      description: 'Max width of the text',
    },
    value: {
      control: { type: 'text' },
      description: 'The value of selection for form submission',
    },
  },
  args: {
    checked: undefined,
    direction: 'horizontal',
    disabled: false,
    image: undefined,
    imageObjectFit: 'cover',
    name: undefined,
    readonly: false,
    selector: 'radio',
    supportingText: 'Supporting text',
    text: 'Selection',
    value: undefined,
  },
  render: (args) => ({
    props: args,
    template: `
      <label mznSelectionCard
        [checked]="checked"
        [direction]="direction"
        [disabled]="disabled"
        [image]="image"
        [imageObjectFit]="imageObjectFit"
        [name]="name"
        [readonly]="readonly"
        [selector]="selector"
        [supportingText]="supportingText"
        [supportingTextMaxWidth]="supportingTextMaxWidth"
        [text]="text"
        [textMaxWidth]="textMaxWidth"
        [value]="value"
      ></label>
    `,
  }),
};

export const Horizontal: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h2>State:</h2>
          <div style="display: flex; flex-direction: column; gap: 8px; background-color: #F3F4F6; padding: 32px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <p>Radio:</p>
              <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" name="basic-radio" value="radio-1" ></label>
              <p>Checked:</p>
              <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" name="basic-radio-checked" value="radio-1" [checked]="true" ></label>
              <p>Disabled:</p>
              <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" name="basic-radio" value="radio-1" [disabled]="true" ></label>
              <p>Readonly:</p>
              <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" name="basic-radio" value="radio-1" [readonly]="true" ></label>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
              <p>Unchecked:</p>
              <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="basic-checkbox" value="checkbox-1" ></label>
              <p>Checked:</p>
              <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="basic-checkbox-checked" value="checkbox-1" [checked]="true" ></label>
              <p>Disabled:</p>
              <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="basic-checkbox" value="checkbox-1" [disabled]="true" ></label>
              <p>Readonly:</p>
              <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="basic-checkbox" value="checkbox-1" [readonly]="true" ></label>
            </div>
          </div>
        </div>
        <div>
          <h2>Multiple Items:</h2>
          <div style="display: flex; flex-direction: column; gap: 8px; background-color: #F3F4F6; padding: 32px;">
            <p>Multiple Radios:</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label mznSelectionCard [checked]="true" name="multiple-radio-three" selector="radio" supportingText="First option" text="Radio Option 1" value="radio-1" ></label>
              <label mznSelectionCard name="multiple-radio-three" selector="radio" supportingText="Second option" text="Radio Option 2" value="radio-2" ></label>
              <label mznSelectionCard name="multiple-radio-three" selector="radio" supportingText="Third option" text="Radio Option 3" value="radio-3" ></label>
            </div>
            <p style="margin-top: 16px;">Multiple Checkboxes:</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label mznSelectionCard [checked]="true" name="multiple-checkbox-three" selector="checkbox" supportingText="First checkbox" text="Checkbox Option 1" value="checkbox-1" ></label>
              <label mznSelectionCard name="multiple-checkbox-three" selector="checkbox" supportingText="Second checkbox" text="Checkbox Option 2" value="checkbox-2" ></label>
              <label mznSelectionCard name="multiple-checkbox-three" selector="checkbox" supportingText="Third checkbox" text="Checkbox Option 3" value="checkbox-3" ></label>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h2>State:</h2>
          <div style="display: flex; flex-direction: column; gap: 8px; background-color: #F3F4F6; padding: 32px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <p>Radio:</p>
              <label mznSelectionCard direction="vertical" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-basic-radio" value="radio-1" ></label>
              <p>Checked:</p>
              <label mznSelectionCard [checked]="true" direction="vertical" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-basic-radio" value="radio-1" ></label>
              <p>Disabled:</p>
              <label mznSelectionCard [disabled]="true" direction="vertical" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-basic-radio" value="radio-1" ></label>
              <p>Readonly:</p>
              <label mznSelectionCard [readonly]="true" direction="vertical" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-basic-radio" value="radio-1" ></label>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
              <p>Unchecked:</p>
              <label mznSelectionCard direction="vertical" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1" ></label>
              <p>Checked:</p>
              <label mznSelectionCard [checked]="true" direction="vertical" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-basic-checkbox-checked" value="checkbox-1" ></label>
              <p>Disabled:</p>
              <label mznSelectionCard [disabled]="true" direction="vertical" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1" ></label>
              <p>Readonly:</p>
              <label mznSelectionCard [readonly]="true" direction="vertical" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1" ></label>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const TextMaxWidth: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h2>參照中文字建議:</h2>
          <div style="background-color: #F3F4F6; padding: 32px;">
            <p>短文字（不截斷）:</p>
            <label mznSelectionCard name="text-max-width-zh-short" selector="radio" supportingText="四個字" text="四個字" textMaxWidth="112px" supportingTextMaxWidth="144px" value="short" ></label>
            <p style="margin-top: 12px;">剛好到限制（8字 / 12字）:</p>
            <label mznSelectionCard name="text-max-width-zh-exact" selector="radio" supportingText="適合這個方案選項使用" text="這個選項適合你" textMaxWidth="112px" supportingTextMaxWidth="144px" value="exact" ></label>
            <p style="margin-top: 12px;">超出限制（截斷）:</p>
            <label mznSelectionCard name="text-max-width-zh-overflow" selector="radio" supportingText="這是一段超過十二個中文字的說明文字會被截斷" text="這個選項的文字超過八個字會被截斷" textMaxWidth="112px" supportingTextMaxWidth="144px" value="overflow" ></label>
            <p style="margin-top: 12px;">垂直超出限制（截斷）:</p>
            <label mznSelectionCard name="text-max-width-zh-overflow-vertical" selector="radio" supportingText="這是一段超過十二個中文字的說明文字會被截斷" text="這個選項的文字超過八個字會被截斷" textMaxWidth="112px" direction="vertical" supportingTextMaxWidth="144px" value="overflow-vertical" ></label>
          </div>
        </div>
        <div>
          <h2>參照英文字建議:</h2>
          <div style="background-color: #F3F4F6; padding: 32px;">
            <p>Short text (no truncation):</p>
            <label mznSelectionCard name="text-max-width-en-short" selector="radio" supportingText="Short desc" text="Short label" textMaxWidth="168px" supportingTextMaxWidth="216px" value="short" ></label>
            <p style="margin-top: 12px;">Near limit (24 / 36 letters):</p>
            <label mznSelectionCard name="text-max-width-en-exact" selector="radio" supportingText="Supporting text near limit" text="Label text near limit ok" textMaxWidth="168px" supportingTextMaxWidth="216px" value="exact" ></label>
            <p style="margin-top: 12px;">Overflow (truncated):</p>
            <label mznSelectionCard name="text-max-width-en-overflow" selector="radio" supportingText="This supporting text is way too long and will be truncated with ellipsis" text="This label text is too long and will be truncated" textMaxWidth="168px" supportingTextMaxWidth="216px" value="overflow" ></label>
            <p style="margin-top: 12px;">Overflow Vertical (truncated):</p>
            <label mznSelectionCard name="text-max-width-en-overflow-vertical" selector="radio" supportingText="This supporting text is way too long and will be truncated with ellipsis" text="This label text is too long and will be truncated" textMaxWidth="168px" direction="vertical" supportingTextMaxWidth="216px" value="overflow-vertical" ></label>
          </div>
        </div>
      </div>
    `,
  }),
};

export const SelectionCardGroupBasic: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h2>Radio Group:</h2>
          <div style="background-color: #F3F4F6; padding: 32px;">
            <p>Basic Radio Group:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <label mznSelectionCard [checked]="true" name="plan-selection" selector="radio" supportingText="適合A方案" text="A方案" value="Aplan" ></label>
              <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan" ></label>
              <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合C方案" text="C方案" value="Cplan" ></label>
              <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合D方案" text="D方案" value="Dplan" ></label>
              <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合E方案" text="E方案" value="Eplan" ></label>
            </div>
          </div>
          <div style="background-color: #F3F4F6; padding: 32px; margin-top: 16px;">
            <p>Checkbox Group:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <label mznSelectionCard [checked]="true" name="interest-selection" selector="checkbox" supportingText="適合A方案" text="A方案" value="Aplan" ></label>
              <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合B方案" text="B方案" value="Bplan" ></label>
              <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合C方案" text="C方案" value="Cplan" ></label>
              <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合D方案" text="D方案" value="Dplan" ></label>
              <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合E方案" text="E方案" value="Eplan" ></label>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const SelectionCardGroupWithOptions: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h2>States:</h2>
          <div style="background-color: #F3F4F6; padding: 32px;">
            <p>Required:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <label mznSelectionCard name="required-selection" selector="radio" supportingText="適合A方案" text="A方案" value="Aplan" ></label>
              <label mznSelectionCard name="required-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan" ></label>
            </div>
            <p style="margin-top: 16px;">Disabled:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合A方案" text="選項 1" value="Aplan" [disabled]="true" ></label>
              <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan" [disabled]="true" ></label>
              <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合C方案" text="C方案" value="Cplan" [disabled]="true" ></label>
            </div>
          </div>
        </div>
        <div>
          <h2>Different Sizes:</h2>
          <div style="background-color: #F3F4F6; padding: 32px;">
            <p>Horizontal Base:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合A方案" text="A方案" value="Aplan" ></label>
              <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan" ></label>
              <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合C方案" text="C方案" value="Cplan" ></label>
            </div>
            <p style="margin-top: 16px;">Vertical:</p>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合A方案" text="A方案" value="Aplan" direction="vertical" ></label>
              <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan" direction="vertical" ></label>
              <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合C方案" text="C方案" value="Cplan" direction="vertical" ></label>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
