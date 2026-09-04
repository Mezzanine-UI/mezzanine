import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznButton from '../button/button.vue';
import MznResultState from './result-state.vue';
import type { ResultStateProps } from './result-state.types';

export default {
  title: 'Feedback/ResultState',
  component: MznResultState,
} as Meta<typeof MznResultState>;

type Story = StoryObj<typeof MznResultState>;

type PlaygroundArgs = Required<
  Pick<ResultStateProps, 'description' | 'size' | 'title' | 'type'>
>;

const continueAction = {
  secondaryButton: {
    children: 'Continue',
    onClick: () => alert('Continue clicked'),
  },
};

const retryAction = {
  secondaryButton: {
    children: 'Go Back',
    onClick: () => alert('Secondary action clicked'),
  },
  primaryButton: {
    children: 'Try Again',
    onClick: () => alert('Primary action clicked'),
  },
};

const confirmAction = { secondaryButton: { children: 'Confirm' } };

export const Playground: StoryObj<PlaygroundArgs> = {
  render: (args) => ({
    components: { MznResultState },
    setup: () => ({ args }),
    template: `
      <MznResultState
        :description="args.description"
        :size="args.size"
        :title="args.title"
        :type="args.type"
      />
    `,
  }),
  args: {
    title: 'Success',
    description: 'Your operation has been completed successfully.',
    type: 'success',
    size: 'main',
  },
  argTypes: {
    type: {
      options: [
        'information',
        'success',
        'help',
        'warning',
        'error',
        'failure',
      ],
      control: {
        type: 'select',
      },
    },
    size: {
      options: ['main', 'sub'],
      control: {
        type: 'select',
      },
    },
  },
};

export const AllTypes: Story = {
  render: () => ({
    components: { MznResultState },
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px">
        <MznResultState
          description="Here is some additional information about this state."
          title="Information"
          type="information"
        />
        <MznResultState
          description="Your operation has been completed successfully."
          title="Success"
          type="success"
        />
        <MznResultState
          description="Need assistance? Click the button below to get help."
          title="Help"
          type="help"
        />
        <MznResultState
          description="Please review the warning message before proceeding."
          title="Warning"
          type="warning"
        />
        <MznResultState
          description="An error occurred while processing your request."
          title="Error"
          type="error"
        />
        <MznResultState
          description="The operation failed due to an unexpected issue."
          title="Failure"
          type="failure"
        />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { MznResultState },
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px">
        <div>
          <h3 style="margin-bottom: 24px">Main Size</h3>
          <MznResultState
            description="This is the main size with larger typography and spacing."
            size="main"
            title="Main Size"
            type="success"
          />
        </div>
        <div>
          <h3 style="margin-bottom: 24px">Sub Size</h3>
          <MznResultState
            description="This is the sub size with smaller typography and spacing."
            size="sub"
            title="Sub Size"
            type="information"
          />
        </div>
      </div>
    `,
  }),
};

export const WithActions: Story = {
  render: () => ({
    components: { MznButton, MznResultState },
    setup: () => ({ continueAction, retryAction }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px">
        <MznResultState
          :actions="continueAction"
          description="Your changes have been saved successfully."
          size="sub"
          title="Changes Saved"
          type="success"
        />
        <MznResultState
          :actions="retryAction"
          description="The operation failed. You can try again or go back to the previous page."
          title="Operation Failed"
          type="error"
        />
        <MznResultState
          description="Your changes have been saved successfully."
          size="sub"
          title="Changes Saved"
          type="success"
        >
          <MznButton>Button 1</MznButton>
        </MznResultState>
        <MznResultState
          description="Your changes have been saved successfully."
          size="sub"
          title="Changes Saved"
          type="success"
        >
          <MznButton>Button 1</MznButton>
          <MznButton>Button 2</MznButton>
        </MznResultState>
      </div>
    `,
  }),
};

export const WithoutDescription: Story = {
  render: () => ({
    components: { MznResultState },
    setup: () => ({ confirmAction }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px">
        <MznResultState title="No Description" type="information" />
        <MznResultState
          :actions="confirmAction"
          size="sub"
          title="Compact Result"
          type="success"
        />
      </div>
    `,
  }),
};
