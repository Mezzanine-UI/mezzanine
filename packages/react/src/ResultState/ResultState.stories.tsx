import { Meta, StoryObj } from '@storybook/react';
import ResultState, { ResultStateProps } from './ResultState';

export default {
  title: 'Feedback/ResultState',
  component: ResultState,
} as Meta<typeof ResultState>;

type Story = StoryObj<typeof ResultState>;

type PlaygroundArgs = Required<
  Pick<ResultStateProps, 'description' | 'size' | 'title' | 'type'>
>;

export const Playground: StoryObj<PlaygroundArgs> = {
  render: ({ description, size, title, type, ...args }) => (
    <ResultState
      description={description}
      size={size}
      title={title}
      type={type}
      {...args}
    />
  ),
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
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <ResultState
        description="Here is some additional information about this state."
        title="Information"
        type="information"
      />
      <ResultState
        description="Your operation has been completed successfully."
        title="Success"
        type="success"
      />
      <ResultState
        description="Need assistance? Click the button below to get help."
        title="Help"
        type="help"
      />
      <ResultState
        description="Please review the warning message before proceeding."
        title="Warning"
        type="warning"
      />
      <ResultState
        description="An error occurred while processing your request."
        title="Error"
        type="error"
      />
      <ResultState
        description="The operation failed due to an unexpected issue."
        title="Failure"
        type="failure"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '24px' }}>Main Size</h3>
        <ResultState
          description="This is the main size with larger typography and spacing."
          size="main"
          title="Main Size"
          type="success"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '24px' }}>Sub Size</h3>
        <ResultState
          description="This is the sub size with smaller typography and spacing."
          size="sub"
          title="Sub Size"
          type="information"
        />
      </div>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '24px' }}>Two Buttons - Props</h3>
        <ResultState
          actions={{
            secondaryButton: {
              children: 'Go Back',
              onClick: () => alert('Secondary action clicked'),
            },
            primaryButton: {
              children: 'Try Again',
              onClick: () => alert('Primary action clicked'),
            },
          }}
          description="The operation failed. You can try again or go back to the previous page."
          title="Operation Failed"
          type="error"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '24px' }}>Single Button - Props</h3>
        <ResultState
          actions={{
            secondaryButton: {
              children: 'Continue',
              onClick: () => alert('Continue clicked'),
            },
          }}
          description="Your changes have been saved successfully."
          size="sub"
          title="Changes Saved"
          type="success"
        />
      </div>
    </div>
  ),
};

export const WithoutDescription: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <ResultState title="No Description" type="information" />
      <ResultState
        actions={{
          secondaryButton: {
            children: 'Confirm',
          },
        }}
        size="sub"
        title="Compact Result"
        type="success"
      />
    </div>
  ),
};
