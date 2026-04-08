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
        <div mznRadio value="plain" [disabled]="disabled" [error]="error" [size]="size">Radio Button Label</div>
        <div mznRadio value="hint" hint="Support text" [disabled]="disabled" [error]="error" [size]="size">Radio Button Label</div>
      </div>
    `,
  }),
};

export const Standalone: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div mznRadio value="normal">Normal</div>
        <div mznRadio value="error" [error]="true">Error</div>
        <div mznRadio value="disabled-checked" [disabled]="true" [checked]="true">Disabled Checked</div>
        <div mznRadio value="disabled" [disabled]="true">Disabled</div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="width: fit-content; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;">
        <div mznRadio value="sub" size="sub">Sub</div>
        <div mznRadio value="main" size="main">Main</div>
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
          <div mznRadioGroup [(ngModel)]="selected" name="group-children" [orientation]="orientation" [size]="size" [disabled]="disabled">
            <div mznRadio value="option-1">Option 1</div>
            <div mznRadio value="option-2" hint="option2 support text">Option 2</div>
            <div mznRadio value="option-disabled" [disabled]="true">Option 3</div>
            <div mznRadio value="option-error" [error]="true">Option 4</div>
          </div>
        </div>
        <div>
          <h2 style="margin: 0 0 8px 0;">From options</h2>
          <div mznRadioGroup [(ngModel)]="selected" name="group-options" [options]="options" [orientation]="orientation" [size]="size" [disabled]="disabled" ></div>
        </div>
        <div>
          <h2 style="margin: 0 0 8px 0;">Vertical</h2>
          <div mznRadioGroup [(ngModel)]="selected" name="group-vertical" orientation="vertical" [size]="size" [disabled]="disabled" [options]="options" ></div>
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
          <div mznRadioGroup [(ngModel)]="selected" name="segment-main" type="segment">
            <div mznRadio value="op1" type="segment" [icon]="LightIcon">Option1</div>
            <div mznRadio value="op2" type="segment" [icon]="LightIcon">Option2</div>
            <div mznRadio value="op3" type="segment" [icon]="LightIcon">Option3</div>
            <div mznRadio value="op4" type="segment" [icon]="LightIcon" [disabled]="true">Option4</div>
          </div>
        </div>
        <div>
          <h2 style="margin: 0 0 4px 0;">Sub</h2>
          <div mznRadioGroup [(ngModel)]="selected" name="segment-sub" type="segment" size="sub">
            <div mznRadio value="op1" type="segment">全部</div>
            <div mznRadio value="op2" type="segment">已發佈</div>
            <div mznRadio value="op3" type="segment">未發佈</div>
          </div>
        </div>
        <div>
          <h2 style="margin: 0 0 4px 0;">Minor</h2>
          <div mznRadioGroup [(ngModel)]="selected" name="segment-minor" type="segment" size="minor">
            <div mznRadio value="op1" type="segment">Option1</div>
            <div mznRadio value="op2" type="segment">Option2</div>
            <div mznRadio value="op3" type="segment">Option3</div>
            <div mznRadio value="op4" type="segment" [disabled]="true">Option4</div>
          </div>
        </div>
        <p>selected: {{ selected }}</p>
      </div>
    `,
  }),
};
