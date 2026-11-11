import { FormsModule } from '@angular/forms';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TextareaResize, TextareaType } from './textarea.component';
import { MznTextarea } from './textarea.component';
import { MznTypography } from '../typography/typography.directive';

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
    fullWidth: {
      control: { type: 'boolean' },
      description:
        'Whether the textarea should take the full width of its container.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
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
    fullWidth: true,
    placeholder: '輸入文字...',
    readonly: false,
    resize: 'none',
    type: 'default',
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznTextarea
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [placeholder]="placeholder"
        [readonly]="readonly"
        [resize]="resize"
        [rows]="rows"
        textareaClassName="aa"
        textareaId="test-id-01"
        [type]="type"
      ></div>
    `,
  }),
};

export const Types: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [MznTextarea, MznTypography, FormsModule] }),
  ],
  render: () => ({
    props: { filledValue: 'Lorem ipsum dolor sit amet' },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h2 mznTypography variant="h2">Default</h2>
          <div style="display: flex; gap: 24px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTypography variant="caption">Default</span>
              <div mznTextarea type="default" placeholder="Enter a description..." resize="horizontal" ></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTypography variant="caption">Filled</span>
              <div mznTextarea type="default" placeholder="輸入文字..." [ngModel]="filledValue" ></div>
            </div>
          </div>
        </div>
        <div>
          <h2 mznTypography variant="h2">Warning</h2>
          <div style="display: flex; gap: 24px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTypography variant="caption">Default</span>
              <div mznTextarea type="warning" placeholder="Enter a description..." ></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTypography variant="caption">Filled</span>
              <div mznTextarea type="warning" placeholder="輸入文字..." [ngModel]="filledValue" ></div>
            </div>
          </div>
        </div>
        <div>
          <h2 mznTypography variant="h2">Error</h2>
          <div style="display: flex; gap: 24px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTypography variant="caption">Default</span>
              <div mznTextarea type="error" placeholder="Enter a description..." ></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTypography variant="caption">Filled</span>
              <div mznTextarea type="error" placeholder="輸入文字..." [ngModel]="filledValue" ></div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
