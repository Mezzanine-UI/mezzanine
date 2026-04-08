import { FormsModule } from '@angular/forms';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TextareaResize, TextareaType } from './textarea.component';
import { MznTextarea } from './textarea.component';

const types: TextareaType[] = ['default', 'warning', 'error'];
const resizes: TextareaResize[] = ['none', 'both', 'horizontal', 'vertical'];

const meta: Meta<MznTextarea> = {
  title: 'Data Entry/Textarea',
  component: MznTextarea,
  decorators: [moduleMetadata({ imports: [MznTextarea] })],
};

export default meta;
type Story = StoryObj<MznTextarea>;

export const Playground: Story = {
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description:
        'If true, disables the textarea (only applies when type is "default").',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the textarea.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    readonly: {
      control: { type: 'boolean' },
      description:
        'If true, makes the textarea read-only (only applies when type is "default").',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    resize: {
      options: resizes,
      control: { type: 'inline-radio' },
      description: 'CSS resize behaviour of the textarea.',
      table: {
        type: { summary: "'none' | 'both' | 'horizontal' | 'vertical'" },
        defaultValue: { summary: "'none'" },
      },
    },
    rows: {
      control: { type: 'number' },
      description: 'Number of visible text lines.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    type: {
      options: types,
      control: { type: 'select' },
      description: 'The visual state type of the textarea.',
      table: {
        type: { summary: "'default' | 'warning' | 'error'" },
        defaultValue: { summary: "'default'" },
      },
    },
  },
  args: {
    disabled: false,
    placeholder: '輸入文字...',
    readonly: false,
    resize: 'none',
    rows: 4,
    type: 'default',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 400px;">
        <mzn-textarea
          [disabled]="disabled"
          [placeholder]="placeholder"
          [readonly]="readonly"
          [resize]="resize"
          [rows]="rows"
          [type]="type"
        />
      </div>
    `,
  }),
};

export const Types: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [MznTextarea, FormsModule] })],
  render: () => ({
    props: { filledValue: 'Lorem ipsum dolor sit amet' },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">Default</p>
          <div style="display: flex; gap: 24px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px;">Default</span>
              <mzn-textarea type="default" placeholder="Enter a description..." resize="horizontal" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px;">Filled</span>
              <mzn-textarea type="default" placeholder="輸入文字..." [ngModel]="filledValue" />
            </div>
          </div>
        </div>
        <div>
          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">Warning</p>
          <div style="display: flex; gap: 24px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px;">Default</span>
              <mzn-textarea type="warning" placeholder="Enter a description..." />
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px;">Filled</span>
              <mzn-textarea type="warning" placeholder="輸入文字..." [ngModel]="filledValue" />
            </div>
          </div>
        </div>
        <div>
          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">Error</p>
          <div style="display: flex; gap: 24px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px;">Default</span>
              <mzn-textarea type="error" placeholder="Enter a description..." />
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px;">Filled</span>
              <mzn-textarea type="error" placeholder="輸入文字..." [ngModel]="filledValue" />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
