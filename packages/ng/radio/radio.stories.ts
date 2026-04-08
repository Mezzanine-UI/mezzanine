import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { LightIcon } from '@mezzanine-ui/icons';
import { MznRadio } from './radio.component';
import { MznRadioGroup, RadioGroupOption } from './radio-group.component';

export default {
  title: 'Data Entry/Radio',
  decorators: [
    moduleMetadata({
      imports: [MznRadio, MznRadioGroup, FormsModule],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

// NOTE: React's Playground shows 4 variants — plain, withInputConfig, hint, and hint + disabled withInputConfig.
// Angular's MznRadio does not support `withInputConfig` (an inline text input alongside the radio label),
// so those 2 variants are omitted here. Only the plain and hint variants are shown.
// NOTE: React's Playground also includes a `defaultChecked` arg. Angular's MznRadio does not support
// `defaultChecked` as a signal input; use `[checked]` for controlled state instead.
export const Playground: Story = {
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    size: {
      options: ['main', 'sub'],
      control: { type: 'select' },
    },
  },
  args: {
    disabled: false,
    error: false,
    size: 'main',
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <mzn-radio value="plain" [disabled]="disabled" [error]="error" [size]="size">Radio Button Label</mzn-radio>
        <mzn-radio value="hint" hint="Support text" [disabled]="disabled" [error]="error" [size]="size">Radio Button Label</mzn-radio>
      </div>
    `,
  }),
};

export const Standalone: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <mzn-radio value="normal">Normal</mzn-radio>
        <mzn-radio value="error" [error]="true">Error</mzn-radio>
        <mzn-radio value="disabled-checked" [disabled]="true" [checked]="true">Disabled Checked</mzn-radio>
        <mzn-radio value="disabled" [disabled]="true">Disabled</mzn-radio>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="width: fit-content; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;">
        <mzn-radio value="sub" size="sub">Sub</mzn-radio>
        <mzn-radio value="main" size="main">Main</mzn-radio>
      </div>
    `,
  }),
};

export const Group: Story = {
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'radio' },
    },
    size: {
      options: ['main', 'sub'],
      control: { type: 'select' },
    },
  },
  args: {
    disabled: false,
    orientation: 'horizontal',
    size: 'main',
  },
  render: (args) => ({
    props: {
      ...args,
      selected: '',
      options: [
        { id: 'option-1', name: 'Option 1' },
        { id: 'option-2', name: 'Option 2', hint: 'option2 support text' },
        { id: 'option-disabled', name: 'Option 3', disabled: true },
        { id: 'option-error', name: 'Option 4', error: true },
      ] as RadioGroupOption[],
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h2 style="margin: 0 0 8px 0;">From children</h2>
          <mzn-radio-group [(ngModel)]="selected" name="group-children" [orientation]="orientation" [size]="size" [disabled]="disabled">
            <mzn-radio value="option-1">Option 1</mzn-radio>
            <mzn-radio value="option-2" hint="option2 support text">Option 2</mzn-radio>
            <mzn-radio value="option-disabled" [disabled]="true">Option 3</mzn-radio>
            <mzn-radio value="option-error" [error]="true">Option 4</mzn-radio>
          </mzn-radio-group>
        </div>
        <div>
          <h2 style="margin: 0 0 8px 0;">From options</h2>
          <mzn-radio-group [(ngModel)]="selected" name="group-options" [options]="options" [orientation]="orientation" [size]="size" [disabled]="disabled" />
        </div>
        <div>
          <h2 style="margin: 0 0 8px 0;">Vertical</h2>
          <mzn-radio-group [(ngModel)]="selected" name="group-vertical" orientation="vertical" [size]="size" [disabled]="disabled" [options]="options" />
        </div>
        <p>selected: {{ selected }}</p>
      </div>
    `,
  }),
};

export const Segmented: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      LightIcon,
      selected: '',
    },
    template: `
      <div style="width: fit-content; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px;">
        <div>
          <h2 style="margin: 0 0 4px 0;">Main</h2>
          <mzn-radio-group [(ngModel)]="selected" name="segment-main" type="segment">
            <mzn-radio value="op1" type="segment" [icon]="LightIcon">Option1</mzn-radio>
            <mzn-radio value="op2" type="segment" [icon]="LightIcon">Option2</mzn-radio>
            <mzn-radio value="op3" type="segment" [icon]="LightIcon">Option3</mzn-radio>
            <mzn-radio value="op4" type="segment" [icon]="LightIcon" [disabled]="true">Option4</mzn-radio>
          </mzn-radio-group>
        </div>
        <div>
          <h2 style="margin: 0 0 4px 0;">Sub</h2>
          <mzn-radio-group [(ngModel)]="selected" name="segment-sub" type="segment" size="sub">
            <mzn-radio value="op1" type="segment">全部</mzn-radio>
            <mzn-radio value="op2" type="segment">已發佈</mzn-radio>
            <mzn-radio value="op3" type="segment">未發佈</mzn-radio>
          </mzn-radio-group>
        </div>
        <div>
          <h2 style="margin: 0 0 4px 0;">Minor</h2>
          <mzn-radio-group [(ngModel)]="selected" name="segment-minor" type="segment" size="minor">
            <mzn-radio value="op1" type="segment">Option1</mzn-radio>
            <mzn-radio value="op2" type="segment">Option2</mzn-radio>
            <mzn-radio value="op3" type="segment">Option3</mzn-radio>
            <mzn-radio value="op4" type="segment" [disabled]="true">Option4</mzn-radio>
          </mzn-radio-group>
        </div>
        <p>selected: {{ selected }}</p>
      </div>
    `,
  }),
};
