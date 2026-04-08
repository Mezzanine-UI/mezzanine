import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  ResultStateSize,
  ResultStateType,
} from '@mezzanine-ui/core/result-state';
import { MznResultState } from './result-state.component';
import { MznButton } from '@mezzanine-ui/ng/button';

const types: ResultStateType[] = [
  'information',
  'success',
  'help',
  'warning',
  'error',
  'failure',
];
const sizes: ResultStateSize[] = ['main', 'sub'];

const meta: Meta<MznResultState> = {
  title: 'Feedback/ResultState',
  component: MznResultState,
  decorators: [moduleMetadata({ imports: [MznResultState, MznButton] })],
};

export default meta;
type Story = StoryObj<MznResultState>;

export const Playground: Story = {
  argTypes: {
    description: {
      control: { type: 'text' },
      description: 'Description text displayed below the title.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
      description: 'The size of the result state.',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
      },
    },
    title: {
      control: { type: 'text' },
      description: 'The title text of the result state.',
      table: {
        type: { summary: 'string' },
      },
    },
    type: {
      options: types,
      control: { type: 'select' },
      description: 'The result state type, determines the icon and color.',
      table: {
        type: {
          summary:
            "'information' | 'success' | 'help' | 'warning' | 'error' | 'failure'",
        },
        defaultValue: { summary: "'information'" },
      },
    },
  },
  args: {
    title: 'Success',
    description: 'Your operation has been completed successfully.',
    type: 'success',
    size: 'main',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-result-state [type]="type" [title]="title" [description]="description" [size]="size" />
    `,
  }),
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <mzn-result-state description="Here is some additional information about this state." title="Information" type="information" />
        <mzn-result-state description="Your operation has been completed successfully." title="Success" type="success" />
        <mzn-result-state description="Need assistance? Click the button below to get help." title="Help" type="help" />
        <mzn-result-state description="Please review the warning message before proceeding." title="Warning" type="warning" />
        <mzn-result-state description="An error occurred while processing your request." title="Error" type="error" />
        <mzn-result-state description="The operation failed due to an unexpected issue." title="Failure" type="failure" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <div>
          <h3 style="margin-bottom: 24px;">Main Size</h3>
          <mzn-result-state description="This is the main size with larger typography and spacing." size="main" title="Main Size" type="success" />
        </div>
        <div>
          <h3 style="margin-bottom: 24px;">Sub Size</h3>
          <mzn-result-state description="This is the sub size with smaller typography and spacing." size="sub" title="Sub Size" type="information" />
        </div>
      </div>
    `,
  }),
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <mzn-result-state description="Your changes have been saved successfully." size="sub" title="Changes Saved" type="success">
          <button mznButton actions variant="base-secondary">Continue</button>
        </mzn-result-state>
        <mzn-result-state description="The operation failed. You can try again or go back to the previous page." title="Operation Failed" type="error">
          <button mznButton actions variant="base-secondary">Go Back</button>
          <button mznButton actions variant="base-primary">Try Again</button>
        </mzn-result-state>
      </div>
    `,
  }),
};

export const WithoutDescription: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <mzn-result-state title="No Description" type="information" />
        <mzn-result-state size="sub" title="Compact Result" type="success">
          <button mznButton actions variant="base-secondary">Confirm</button>
        </mzn-result-state>
      </div>
    `,
  }),
};
