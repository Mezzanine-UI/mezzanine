import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import {
  SearchIcon,
  EyeInvisibleIcon,
  InfoFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTextField } from './text-field.component';

const sizes: TextFieldSize[] = ['main', 'sub'];

const meta: Meta<MznTextField> = {
  title: 'Internal/TextField',
  component: MznTextField,
  decorators: [moduleMetadata({ imports: [MznTextField, MznIcon] })],
};

export default meta;
type Story = StoryObj<MznTextField>;

export const Playground: Story = {
  argTypes: {
    clearable: {
      control: { type: 'boolean' },
      description: 'If true, shows a clear button when the field has a value.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'If true, the field is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: { type: 'boolean' },
      description: 'If true, the field shows an error state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'If true, the field is read-only.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
      description: 'The size of the text field.',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
      },
    },
  },
  args: {
    size: 'main',
    error: false,
    clearable: false,
    disabled: false,
    readonly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-text-field [size]="size" [error]="error" [clearable]="clearable" [disabled]="disabled" [readonly]="readonly">
        <input placeholder="Enter text..." [disabled]="disabled" [readOnly]="readonly" />
      </mzn-text-field>
    `,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <mzn-text-field size="main">
          <input placeholder="Main size" />
        </mzn-text-field>
        <mzn-text-field size="sub">
          <input placeholder="Sub size" />
        </mzn-text-field>
      </div>
    `,
  }),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <mzn-text-field>
          <input type="text" placeholder="Default state" />
        </mzn-text-field>
        <mzn-text-field [readonly]="true">
          <input type="text" value="Readonly state" [readOnly]="true" />
        </mzn-text-field>
        <mzn-text-field [disabled]="true">
          <input type="text" value="Disabled state" [disabled]="true" />
        </mzn-text-field>
      </div>
    `,
  }),
};

export const ErrorState: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { WarningFilledIcon },
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <mzn-text-field [error]="true">
          <input type="email" placeholder="Error default" value="invalid@" />
        </mzn-text-field>
        <mzn-text-field [error]="true" [hasSuffix]="true">
          <input type="email" placeholder="Error with icon" />
          <i mznIcon suffix [icon]="WarningFilledIcon" ></i>
        </mzn-text-field>
      </div>
    `,
  }),
};

export const WithAffix: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      SearchIcon,
      InfoFilledIcon,
      EyeInvisibleIcon,
      showPassword: false,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <mzn-text-field [hasPrefix]="true">
          <i mznIcon prefix [icon]="SearchIcon" ></i>
          <input type="text" placeholder="Prefix icon" />
        </mzn-text-field>
        <mzn-text-field [hasSuffix]="true">
          <input type="text" placeholder="Suffix icon" />
          <i mznIcon suffix [icon]="InfoFilledIcon" ></i>
        </mzn-text-field>
        <mzn-text-field [hasSuffix]="true">
          <input type="password" placeholder="Password with toggle visibility" value="secret123" />
          <i mznIcon suffix [icon]="EyeInvisibleIcon" ></i>
        </mzn-text-field>
      </div>
    `,
  }),
};

export const Clearable: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { SearchIcon },
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <mzn-text-field [clearable]="true">
          <input type="text" placeholder="Clearable (hover/focus to see)" value="Clearable text" />
        </mzn-text-field>
        <mzn-text-field [clearable]="true" [hasPrefix]="true">
          <i mznIcon prefix [icon]="SearchIcon" ></i>
          <input type="text" placeholder="Clearable with prefix" value="With prefix icon" />
        </mzn-text-field>
      </div>
    `,
  }),
};

export const ComponentsExample: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 32px; min-width: 320px;">
        <div>
          <h3 style="margin-top: 0; margin-bottom: 8px;">Textarea (with resize)</h3>
          <mzn-text-field>
            <textarea placeholder="Textarea with text-field padding" rows="4"></textarea>
          </mzn-text-field>
        </div>
        <div>
          <h3 style="margin-top: 0; margin-bottom: 8px;">Select-like Component</h3>
          <mzn-text-field>
            <div style="width: 100%;">Select an option...</div>
          </mzn-text-field>
        </div>
        <div>
          <h3 style="margin-top: 0; margin-bottom: 8px;">AutoComplete-like Component</h3>
          <mzn-text-field>
            <input type="text" placeholder="Type to search..." />
          </mzn-text-field>
        </div>
      </div>
    `,
  }),
};
