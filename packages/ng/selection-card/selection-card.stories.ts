import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznSelectionCard } from './selection-card.component';

export default {
  title: 'Data Entry/SelectionCard',
  decorators: [
    moduleMetadata({
      imports: [MznSelectionCard, MznTag, MznTypography],
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
      <!-- State -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">State:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Text Only:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: row;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>Radio:</p>
                <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" name="basic-radio" value="radio-1"></label>
                <p mznTypography>Checked:</p>
                <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" name="basic-radio" value="radio-1" [defaultChecked]="true"></label>
                <p mznTypography>Disabled:</p>
                <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" name="basic-radio" value="radio-1" [disabled]="true"></label>
                <p mznTypography>Readonly:</p>
                <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" name="basic-radio" value="radio-1" [readonly]="true"></label>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>Unchecked:</p>
                <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="basic-checkbox" value="checkbox-1"></label>
                <p mznTypography>Checked:</p>
                <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="basic-checkbox" value="checkbox-1" [defaultChecked]="true"></label>
                <p mznTypography>Disabled:</p>
                <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="basic-checkbox" value="checkbox-1" [disabled]="true"></label>
                <p mznTypography>Readonly:</p>
                <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="basic-checkbox" value="checkbox-1" [readonly]="true"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- With Image -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">With Image:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Text Only:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: row;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>Radio:</p>
                <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" image="https://rytass.com/logo.png" name="image-radio" value="radio-1"></label>
                <p mznTypography>Checked:</p>
                <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" image="https://rytass.com/logo.png" name="image-radio-checked" value="radio-1" [defaultChecked]="true"></label>
                <p mznTypography>Disabled:</p>
                <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" image="https://rytass.com/logo.png" name="image-radio" value="radio-1" [disabled]="true"></label>
                <p mznTypography>Readonly:</p>
                <label mznSelectionCard selector="radio" text="Radio Selection" supportingText="This is a radio button" image="https://rytass.com/logo.png" name="image-radio" value="radio-1" [readonly]="true"></label>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>Unchecked:</p>
                <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" image="https://rytass.com/logo.png" name="image-checkbox" value="checkbox-1"></label>
                <p mznTypography>Checked:</p>
                <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" image="https://rytass.com/logo.png" name="image-checkbox-checked" value="checkbox-1" [defaultChecked]="true"></label>
                <p mznTypography>Disabled:</p>
                <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" image="https://rytass.com/logo.png" name="image-checkbox" value="checkbox-1" [disabled]="true"></label>
                <p mznTypography>Readonly:</p>
                <label mznSelectionCard selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" image="https://rytass.com/logo.png" name="image-checkbox" value="checkbox-1" [readonly]="true"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Multiple Items -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">Multiple Items:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Radios:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm); margin-bottom: 16px; width: 100%;">
                <p mznTypography>Multiple Radios:</p>
                <label mznSelectionCard [defaultChecked]="true" name="multiple-radio-three" selector="radio" supportingText="First option" text="Radio Option 1" value="radio-1"></label>
                <label mznSelectionCard name="multiple-radio-three" selector="radio" supportingText="Second option" text="Radio Option 2" value="radio-2"></label>
                <label mznSelectionCard name="multiple-radio-three" selector="radio" supportingText="Third option" text="Radio Option 3" value="radio-3"></label>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Checkboxes:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm); margin-bottom: 16px; width: 100%;">
                <p mznTypography>Multiple Checkboxes:</p>
                <label mznSelectionCard [defaultChecked]="true" name="multiple-checkbox-three" selector="checkbox" supportingText="First checkbox" text="Checkbox Option 1" value="checkbox-1"></label>
                <label mznSelectionCard name="multiple-checkbox-three" selector="checkbox" supportingText="Second checkbox" text="Checkbox Option 2" value="checkbox-2"></label>
                <label mznSelectionCard name="multiple-checkbox-three" selector="checkbox" supportingText="Third checkbox" text="Checkbox Option 3" value="checkbox-3"></label>
              </div>
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
      <!-- State -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">State:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Text Only:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: row;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>Radio:</p>
                <label mznSelectionCard direction="vertical" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-basic-radio" value="radio-1"></label>
                <p mznTypography>Checked:</p>
                <label mznSelectionCard [defaultChecked]="true" direction="vertical" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-basic-radio" value="radio-1"></label>
                <p mznTypography>Disabled:</p>
                <label mznSelectionCard [disabled]="true" direction="vertical" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-basic-radio" value="radio-1"></label>
                <p mznTypography>Readonly:</p>
                <label mznSelectionCard [readonly]="true" direction="vertical" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-basic-radio" value="radio-1"></label>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>Unchecked:</p>
                <label mznSelectionCard direction="vertical" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1"></label>
                <p mznTypography>Checked:</p>
                <label mznSelectionCard [defaultChecked]="true" direction="vertical" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1"></label>
                <p mznTypography>Disabled:</p>
                <label mznSelectionCard [disabled]="true" direction="vertical" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1"></label>
                <p mznTypography>Readonly:</p>
                <label mznSelectionCard [readonly]="true" direction="vertical" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- With Image -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">With Image:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Text Only:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: row;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>Radio:</p>
                <label mznSelectionCard direction="vertical" image="https://rytass.com/logo.png" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-image-radio" value="radio-1"></label>
                <p mznTypography>Checked:</p>
                <label mznSelectionCard [defaultChecked]="true" direction="vertical" image="https://rytass.com/logo.png" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-image-radio" value="radio-1"></label>
                <p mznTypography>Disabled:</p>
                <label mznSelectionCard [disabled]="true" direction="vertical" image="https://rytass.com/logo.png" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-image-radio" value="radio-1"></label>
                <p mznTypography>Readonly:</p>
                <label mznSelectionCard [readonly]="true" direction="vertical" image="https://rytass.com/logo.png" selector="radio" text="Radio Selection" supportingText="This is a radio button" name="vertical-image-radio" value="radio-1"></label>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>Unchecked:</p>
                <label mznSelectionCard direction="vertical" image="https://rytass.com/logo.png" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-image-checkbox" value="checkbox-1"></label>
                <p mznTypography>Checked:</p>
                <label mznSelectionCard [defaultChecked]="true" direction="vertical" image="https://rytass.com/logo.png" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-image-checkbox" value="checkbox-1"></label>
                <p mznTypography>Disabled:</p>
                <label mznSelectionCard [disabled]="true" direction="vertical" image="https://rytass.com/logo.png" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-image-checkbox" value="checkbox-1"></label>
                <p mznTypography>Readonly:</p>
                <label mznSelectionCard [readonly]="true" direction="vertical" image="https://rytass.com/logo.png" selector="checkbox" text="Checkbox Selection" supportingText="This is a checkbox" name="vertical-image-checkbox" value="checkbox-1"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Multiple Items -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">Multiple Items:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Radios:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm); margin-bottom: 16px; width: 100%;">
                <p mznTypography>Multiple Radios:</p>
                <label mznSelectionCard [defaultChecked]="true" direction="vertical" name="vertical-multiple-radio-three" selector="radio" supportingText="First option" text="Radio Option 1" value="radio-1"></label>
                <label mznSelectionCard direction="vertical" name="vertical-multiple-radio-three" selector="radio" supportingText="Second option" text="Radio Option 2" value="radio-2"></label>
                <label mznSelectionCard direction="vertical" name="vertical-multiple-radio-three" selector="radio" supportingText="Third option" text="Radio Option 3" value="radio-3"></label>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Checkboxes:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm); margin-bottom: 16px; width: 100%;">
                <p mznTypography>Multiple Checkboxes:</p>
                <label mznSelectionCard [defaultChecked]="true" direction="vertical" name="vertical-multiple-checkbox-three" selector="checkbox" supportingText="First checkbox" text="Checkbox Option 1" value="checkbox-1"></label>
                <label mznSelectionCard direction="vertical" name="vertical-multiple-checkbox-three" selector="checkbox" supportingText="Second checkbox" text="Checkbox Option 2" value="checkbox-2"></label>
                <label mznSelectionCard direction="vertical" name="vertical-multiple-checkbox-three" selector="checkbox" supportingText="Third checkbox" text="Checkbox Option 3" value="checkbox-3"></label>
              </div>
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
      <!-- 中文 -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">參照中文字建議:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="標題 4-8字，子標題 4-12字，溢出時顯示 &quot;...&quot;" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: row;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>短文字（不截斷）:</p>
                <label mznSelectionCard name="text-max-width-zh-short" selector="radio" supportingText="四個字" text="四個字" textMaxWidth="112px" supportingTextMaxWidth="144px" value="short"></label>
                <p mznTypography>剛好到限制（8字 / 12字）:</p>
                <label mznSelectionCard name="text-max-width-zh-exact" selector="radio" supportingText="適合這個方案選項使用" text="這個選項適合你" textMaxWidth="112px" supportingTextMaxWidth="144px" value="exact"></label>
                <p mznTypography>超出限制（截斷）:</p>
                <label mznSelectionCard name="text-max-width-zh-overflow" selector="radio" supportingText="這是一段超過十二個中文字的說明文字會被截斷" text="這個選項的文字超過八個字會被截斷" textMaxWidth="112px" supportingTextMaxWidth="144px" value="overflow"></label>
                <p mznTypography>垂直超出限制 （截斷）:</p>
                <label mznSelectionCard name="text-max-width-zh-overflow-vertical" selector="radio" supportingText="這是一段超過十二個中文字的說明文字會被截斷" text="這個選項的文字超過八個字會被截斷" textMaxWidth="112px" direction="vertical" supportingTextMaxWidth="144px" value="overflow-vertical"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 英文 -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">參照英文字建議:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="標題 16-24 字，子標題 20-36 個字，溢出時顯示 &quot;...&quot;" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: row;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <p mznTypography>Short text (no truncation):</p>
                <label mznSelectionCard name="text-max-width-en-short" selector="radio" supportingText="Short desc" text="Short label" textMaxWidth="168px" supportingTextMaxWidth="216px" value="short"></label>
                <p mznTypography>Near limit (24 / 36 letters):</p>
                <label mznSelectionCard name="text-max-width-en-exact" selector="radio" supportingText="Supporting text near limit" text="Label text near limit ok" textMaxWidth="168px" supportingTextMaxWidth="216px" value="exact"></label>
                <p mznTypography>Overflow (truncated):</p>
                <label mznSelectionCard name="text-max-width-en-overflow" selector="radio" supportingText="This supporting text is way too long and will be truncated with ellipsis" text="This label text is too long and will be truncated" textMaxWidth="168px" supportingTextMaxWidth="216px" value="overflow"></label>
                <p mznTypography>Overflow Vertical (truncated):</p>
                <label mznSelectionCard name="text-max-width-en-overflow-vertical" selector="radio" supportingText="This supporting text is way too long and will be truncated with ellipsis" text="This label text is too long and will be truncated" textMaxWidth="168px" direction="vertical" supportingTextMaxWidth="216px" value="overflow-vertical"></label>
              </div>
            </div>
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
      <!-- Radio Group -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">Radio Group:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Basic Radio Group:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard [defaultChecked]="true" name="plan-selection" selector="radio" supportingText="適合A方案" text="A方案" value="Aplan"></label>
                  <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan"></label>
                  <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合C方案" text="C方案" value="Cplan"></label>
                  <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合D方案" text="D方案" value="Dplan"></label>
                  <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合E方案" text="E方案" value="Eplan"></label>
                  <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合F方案" text="F方案" value="Fplan"></label>
                  <label mznSelectionCard name="plan-selection" selector="radio" supportingText="適合G方案" text="G方案" value="Gplan"></label>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Checkbox Group:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard [defaultChecked]="true" name="interest-selection" selector="checkbox" supportingText="適合A方案" text="A方案" value="Aplan"></label>
                  <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合B方案" text="B方案" value="Bplan"></label>
                  <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合C方案" text="C方案" value="Cplan"></label>
                  <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合D方案" text="D方案" value="Dplan"></label>
                  <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合E方案" text="E方案" value="Eplan"></label>
                  <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合F方案" text="F方案" value="Fplan"></label>
                  <label mznSelectionCard name="interest-selection" selector="checkbox" supportingText="適合G方案" text="G方案" value="Gplan"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- With Image -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">With Image:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Radio Group with Image:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard [defaultChecked]="true" image="https://rytass.com/logo.png" name="plan-selection-image" selector="radio" supportingText="適合A方案" text="A方案" value="Aplan"></label>
                  <label mznSelectionCard image="https://rytass.com/logo.png" name="plan-selection-image" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan"></label>
                  <label mznSelectionCard image="https://rytass.com/logo.png" name="plan-selection-image" selector="radio" supportingText="適合C方案" text="C方案" value="Cplan"></label>
                  <label mznSelectionCard image="https://rytass.com/logo.png" name="plan-selection-image" selector="radio" supportingText="適合D方案" text="D方案" value="Dplan"></label>
                  <label mznSelectionCard image="https://rytass.com/logo.png" name="plan-selection-image" selector="radio" supportingText="適合E方案" text="E方案" value="Eplan"></label>
                  <label mznSelectionCard image="https://rytass.com/logo.png" name="plan-selection-image" selector="radio" supportingText="適合F方案" text="F方案" value="Fplan"></label>
                  <label mznSelectionCard image="https://rytass.com/logo.png" name="plan-selection-image" selector="radio" supportingText="適合G方案" text="G方案" value="Gplan"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- States -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">States:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Required:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard name="required-selection" selector="radio" supportingText="適合A方案" text="A方案" value="Aplan"></label>
                  <label mznSelectionCard name="required-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan"></label>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Disabled:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合A方案" text="選項 1" value="Aplan" [disabled]="true"></label>
                  <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan" [disabled]="true"></label>
                  <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合C方案" text="C方案" value="Cplan" [disabled]="true"></label>
                  <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合D方案" text="D方案" value="Dplan" [disabled]="true"></label>
                  <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合E方案" text="E方案" value="Eplan" [disabled]="true"></label>
                  <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合F方案" text="F方案" value="Fplan" [disabled]="true"></label>
                  <label mznSelectionCard name="disabled-selection" selector="radio" supportingText="適合G方案" text="G方案" value="Gplan" [disabled]="true"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Different Sizes -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">Different Sizes:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Horizontal Base:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合A方案" text="A方案" value="Aplan"></label>
                  <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan"></label>
                  <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合C方案" text="C方案" value="Cplan"></label>
                  <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合D方案" text="D方案" value="Dplan"></label>
                  <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合E方案" text="E方案" value="Eplan"></label>
                  <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合F方案" text="F方案" value="Fplan"></label>
                  <label mznSelectionCard name="horizontal-base-selection" selector="radio" supportingText="適合G方案" text="G方案" value="Gplan"></label>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Vertical:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合A方案" text="A方案" value="Aplan" direction="vertical"></label>
                  <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合B方案" text="B方案" value="Bplan" direction="vertical"></label>
                  <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合C方案" text="C方案" value="Cplan" direction="vertical"></label>
                  <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合D方案" text="D方案" value="Dplan" direction="vertical"></label>
                  <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合E方案" text="E方案" value="Eplan" direction="vertical"></label>
                  <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合F方案" text="F方案" value="Fplan" direction="vertical"></label>
                  <label mznSelectionCard name="vertical-selection" selector="radio" supportingText="適合G方案" text="G方案" value="Gplan" direction="vertical"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-mixed-states',
  standalone: true,
  imports: [MznSelectionCard],
  template: `
    <div class="mzn-selection-card-group">
      <label
        mznSelectionCard
        [checked]="selectedValue() === 'option-1'"
        [disabled]="true"
        name="mixed-states"
        selector="radio"
        supportingText="已選取但停用"
        text="選項 1"
        value="option-1"
        (onClick)="selectedValue.set('option-1')"
      ></label>
      <label
        mznSelectionCard
        [checked]="selectedValue() === 'option-2'"
        [disabled]="true"
        name="mixed-states"
        selector="radio"
        supportingText="未選取但停用"
        text="選項 2"
        value="option-2"
        (onClick)="selectedValue.set('option-2')"
      ></label>
      <label
        mznSelectionCard
        [checked]="selectedValue() === 'option-3'"
        name="mixed-states"
        selector="radio"
        supportingText="可選取的選項"
        text="選項 3"
        value="option-3"
        (onClick)="selectedValue.set('option-3')"
      ></label>
      <label
        mznSelectionCard
        [checked]="selectedValue() === 'option-4'"
        name="mixed-states"
        selector="radio"
        supportingText="可選取的選項"
        text="選項 4"
        value="option-4"
        (onClick)="selectedValue.set('option-4')"
      ></label>
    </div>
  `,
})
class MixedStatesStoryComponent {
  readonly selectedValue = signal('option-1');
}

export const SelectionCardGroupWithOptions: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [MixedStatesStoryComponent] })],
  render: () => ({
    template: `
      <!-- Using Selections Array -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">Using Selections Array:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Radio Group with Selections:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard [defaultChecked]="true" name="plan-options" selector="radio" supportingText="適合個人使用" text="基本方案" value="basic"></label>
                  <label mznSelectionCard name="plan-options" selector="radio" supportingText="適合小型團隊" text="專業方案" value="professional"></label>
                  <label mznSelectionCard name="plan-options" selector="radio" supportingText="適合大型企業" text="企業方案" value="enterprise"></label>
                  <label mznSelectionCard name="plan-options" selector="radio" supportingText="適合超大型企業" text="旗艦方案" value="enterprise-plus"></label>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Checkbox Group with Selections:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard [defaultChecked]="true" name="interest-options" selector="checkbox" supportingText="閱讀相關內容" text="閱讀" value="reading"></label>
                  <label mznSelectionCard name="interest-options" selector="checkbox" supportingText="程式開發相關" text="程式開發" value="coding"></label>
                  <label mznSelectionCard name="interest-options" selector="checkbox" supportingText="運動健身相關" text="運動" value="sports"></label>
                  <label mznSelectionCard name="interest-options" selector="checkbox" supportingText="音樂相關" text="音樂" value="music"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- With Image -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">With Image:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Radio Group with Image:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard [defaultChecked]="true" image="https://rytass.com/logo.png" name="plan-image-options" selector="radio" supportingText="適合個人使用" text="基本方案" value="basic"></label>
                  <label mznSelectionCard image="https://rytass.com/logo.png" name="plan-image-options" selector="radio" supportingText="適合小型團隊" text="專業方案" value="professional"></label>
                  <label mznSelectionCard image="https://rytass.com/logo.png" name="plan-image-options" selector="radio" supportingText="適合大型企業" text="企業方案" value="enterprise"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- With Different States -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;">
        <h2 mznTypography variant="h2">With Different States:</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start;">
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Mixed States:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <story-mixed-states />
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; background-color: #F3F4F6; padding: 32px;">
            <span mznTag type="static" label="Vertical Direction:" size="main"></span>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; width: 100%;">
                <div class="mzn-selection-card-group">
                  <label mznSelectionCard [defaultChecked]="true" direction="vertical" name="vertical-options" selector="radio" supportingText="垂直排列選項 1" text="選項 1" value="option-1"></label>
                  <label mznSelectionCard direction="vertical" name="vertical-options" selector="radio" supportingText="垂直排列選項 2" text="選項 2" value="option-2"></label>
                  <label mznSelectionCard direction="vertical" name="vertical-options" selector="radio" supportingText="垂直排列選項 3" text="選項 3" value="option-3"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
