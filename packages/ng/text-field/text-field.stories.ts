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

/**
 * 外部型別,將 `MznTextField` component 與透過 `hostDirectives` 掛上的
 * `MznTextFieldHost` directive 的 inputs 合併,讓 Storybook 的 argTypes
 * 能同時看到兩邊的屬性(`disabled` / `error` / `readOnly` 等由 directive 暴露)。
 */
type MznTextFieldArgs = MznTextField & {
  disabled: boolean;
  error: boolean;
  readonly: boolean;
  size: TextFieldSize;
};

const meta: Meta<MznTextFieldArgs> = {
  title: 'Internal/TextField',
  component: MznTextField,
  decorators: [moduleMetadata({ imports: [MznTextField, MznIcon] })],
};

export default meta;
type Story = StoryObj<MznTextFieldArgs>;

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
      <div mznTextField [size]="size" [error]="error" [clearable]="clearable" [disabled]="disabled" [readonly]="readonly">
        <input placeholder="Enter text..." [disabled]="disabled" [readOnly]="readonly" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <div mznTextField size="main">
          <input placeholder="Main size" />
        </div>
        <div mznTextField size="sub">
          <input placeholder="Sub size" />
        </div>
      </div>
    `,
  }),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <div mznTextField>
          <input type="text" placeholder="Default state" />
        </div>
        <div mznTextField [readonly]="true">
          <input type="text" value="Readonly state" [readOnly]="true" />
        </div>
        <div mznTextField [disabled]="true">
          <input type="text" value="Disabled state" [disabled]="true" />
        </div>
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
        <div mznTextField [error]="true">
          <input type="email" placeholder="Error default" value="invalid@" />
        </div>
        <div mznTextField [error]="true" [hasSuffix]="true">
          <input type="email" placeholder="Error with icon" />
          <i mznIcon suffix [icon]="WarningFilledIcon" ></i>
        </div>
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
        <div mznTextField [hasPrefix]="true">
          <i mznIcon prefix [icon]="SearchIcon" ></i>
          <input type="text" placeholder="Prefix icon" />
        </div>
        <div mznTextField [hasSuffix]="true">
          <input type="text" placeholder="Suffix icon" />
          <i mznIcon suffix [icon]="InfoFilledIcon" ></i>
        </div>
        <div mznTextField [hasSuffix]="true">
          <input type="password" placeholder="Password with toggle visibility" value="secret123" />
          <i mznIcon suffix [icon]="EyeInvisibleIcon" ></i>
        </div>
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
        <div mznTextField [clearable]="true">
          <input type="text" placeholder="Clearable (hover/focus to see)" value="Clearable text" />
        </div>
        <div mznTextField [clearable]="true" [hasPrefix]="true">
          <i mznIcon prefix [icon]="SearchIcon" ></i>
          <input type="text" placeholder="Clearable with prefix" value="With prefix icon" />
        </div>
      </div>
    `,
  }),
};

export const ComponentsExample: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div
        style="display: inline-grid; grid-template-columns: 1fr; gap: 32px; min-width: 320px;"
      >
        <!--
          Textarea (with resize):對齊 React 的 children-as-function pattern
          (TextField.stories.tsx:297-307)。[noPadding]="true" 把 host 的
          padding 清掉,改掛在 <textarea> 上(mzn-text-field__input-padding
          + --main 尺寸變體)。這樣 resize handle 能碰到 host 邊界,不會被
          host 的內建 padding 裁切。
        -->
        <div>
          <h3 style="margin-top: 0; margin-bottom: 8px;">
            Textarea (with resize)
          </h3>
          <div mznTextField [noPadding]="true">
            <textarea
              class="mzn-text-field__input-padding mzn-text-field__input-padding--main"
              placeholder="Textarea with text-field padding"
              rows="4"
            ></textarea>
          </div>
        </div>
        <div>
          <h3 style="margin-top: 0; margin-bottom: 8px;">
            Select-like Component
          </h3>
          <div mznTextField>
            <div style="width: 100%;">Select an option...</div>
          </div>
        </div>
        <div>
          <h3 style="margin-top: 0; margin-bottom: 8px;">
            AutoComplete-like Component
          </h3>
          <div mznTextField [hasPrefix]="true">
            <i mznIcon prefix [icon]="SearchIcon"></i>
            <input type="text" placeholder="Type to search..." />
          </div>
        </div>
      </div>
    `,
    props: { SearchIcon },
  }),
};
