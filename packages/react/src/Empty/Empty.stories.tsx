import { StoryFn, Meta, StoryObj } from '@storybook/react-webpack5';
import Typography from '../Typography';
import Empty from './Empty';
import { EmptyProps } from './typings';
import Button from '../Button';

export default {
  title: 'Data Display/Empty',
} as Meta;

type Story = StoryObj<typeof Empty>;

type PlaygroundArgs = Required<
  Pick<EmptyProps, 'description' | 'title' | 'type'>
>;

const demoImage = (
  <div
    style={{
      width: '64px',
      height: '64px',
      marginBottom: '4px',
      backgroundImage:
        'radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a)',
      borderRadius: '100%',
    }}
  />
);

const actionProps: EmptyProps['actions'] = {
  secondaryButton: {
    children: 'Secondary',
    onClick: () => alert('Secondary Action Clicked'),
  },
  primaryButton: {
    children: 'Primary',
    onClick: () => alert('Primary Action Clicked'),
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
      <Empty
        description="Here is some additional information about this state."
        size="main"
        title="Initial Data"
        type="initial-data"
        actions={actionProps}
      />
      <Empty
        description="Your operation has been completed successfully."
        size="main"
        title="Result"
        type="result"
        actions={actionProps}
      />
      <Empty
        description="Need assistance? Click the button below to get help."
        size="main"
        title="System"
        type="system"
        actions={actionProps}
      />
      <Empty
        description="Please review the notification message before proceeding."
        size="main"
        title="Notification"
        type="notification"
        pictogram={demoImage}
        actions={actionProps}
      />
      <Empty
        description="Here is some additional information about this state."
        size="sub"
        title="Initial Data"
        type="initial-data"
        actions={actionProps}
      />
      <Empty
        description="Your operation has been completed successfully."
        size="sub"
        title="Result"
        type="result"
        actions={actionProps}
      />
      <Empty
        description="Need assistance? Click the button below to get help."
        size="sub"
        title="System"
        type="system"
        actions={actionProps}
      />
      <Empty
        description="Please review the notification message before proceeding."
        size="sub"
        title="Notification"
        type="notification"
        actions={actionProps}
      />
      <Empty size="minor" title="Initial Data" type="initial-data" />
      <Empty size="minor" title="Result" type="result" />
      <Empty size="minor" title="System" type="system" />
      <Empty size="minor" title="Notification" type="notification" />
    </div>
  ),
};

export const WithButtons: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <Empty
        description="secondaryButtonProps and primaryButtonProps"
        size="main"
        title="System"
        type="system"
        actions={actionProps}
      />
      <Empty
        description="only secondaryButtonProps"
        size="main"
        title="System"
        type="system"
        actions={{ secondaryButton: actionProps.secondaryButton }}
      />
      <Empty
        description="no actions"
        size="main"
        title="System"
        type="system"
      />
    </div>
  ),
};

export const ActionProp: Story = {
  render: () => (
    <>
      <div>
        {/* Style 1: ButtonProps object format */}
        <Empty
          description="Using ButtonProps object with children property"
          size="main"
          title="ButtonProps - Single Button"
          type="initial-data"
          actions={{
            secondaryButton: {
              children: 'Button 1',
            },
          }}
        />

        <Empty
          description="Using ButtonProps objects for both primary and secondary buttons"
          size="main"
          title="ButtonProps - Two Buttons"
          type="initial-data"
          actions={{
            secondaryButton: {
              children: 'Button 1',
            },
            primaryButton: {
              children: 'Button 2',
            },
          }}
        />

        {/* use children */}
        <Empty
          description="Using ReactElement directly as children"
          size="main"
          title="ReactElement - Single Button"
          type="initial-data"
        >
          <Button>Button 1</Button>
        </Empty>

        <Empty
          description="Using ReactElements for both primary and secondary buttons"
          size="main"
          title="ReactElement - Two Buttons"
          type="initial-data"
        >
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </Empty>
      </div>
    </>
  ),
};

export const Playground: StoryFn<PlaygroundArgs> = ({
  title,
  type,
  ...args
}) => (
  <>
    <Typography variant="h3">main</Typography>
    <div
      style={{
        width: '100%',
        height: '270px',
        margin: '0 0 24px 0',
        backgroundColor: '#F3F4F6',
      }}
    >
      {type === 'custom' ? (
        <Empty
          type={type}
          size="main"
          title={title}
          pictogram={demoImage}
          {...args}
        />
      ) : (
        <Empty type={type} size="main" title={title} {...args} />
      )}
    </div>
    <Typography variant="h3">sub</Typography>
    <div
      style={{
        width: '100%',
        height: '200px',
        margin: '0 0 24px 0',
        backgroundColor: '#F3F4F6',
      }}
    >
      {type === 'custom' ? (
        <Empty
          type={type}
          size="sub"
          title={title}
          pictogram={demoImage}
          {...args}
        />
      ) : (
        <Empty type={type} size="sub" title={title} {...args} />
      )}
    </div>
    <Typography variant="h3">minor</Typography>
    <div
      style={{
        width: '100%',
        height: '80px',
        backgroundColor: '#F3F4F6',
      }}
    >
      <Empty
        type={type}
        size="minor"
        title={title}
        {...args}
        description={undefined}
      />
    </div>
  </>
);

Playground.args = {
  description: '找不到符合條件的資料',
  title: '查無資料',
  type: 'initial-data',
};

Playground.argTypes = {
  description: {
    control: {
      type: 'text',
    },
  },
  title: {
    control: {
      type: 'text',
    },
  },
  type: {
    options: ['initial-data', 'result', 'system', 'notification', 'custom'],
    control: {
      type: 'select',
    },
  },
};
