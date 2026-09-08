import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import MznButton from '../button/button.vue';
import MznTypography from '../typography/typography.vue';
import MznEmpty from './empty.vue';
import type { EmptyProps } from './empty.types';

export default {
  title: 'Feedback/Empty',
} as Meta;

type Story = StoryObj<typeof MznEmpty>;

type PlaygroundArgs = Required<
  Pick<EmptyProps, 'description' | 'title' | 'type'>
>;

const demoImage = h('div', {
  style: {
    width: '64px',
    height: '64px',
    marginBottom: '4px',
    backgroundImage:
      'radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a)',
    borderRadius: '100%',
  },
});

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

const secondaryOnly = { secondaryButton: actionProps.secondaryButton };
const singleButton = { secondaryButton: { children: 'Button 1' } };
const twoButtons = {
  secondaryButton: { children: 'Button 1' },
  primaryButton: { children: 'Button 2' },
};

export const AllTypes: Story = {
  render: () => ({
    components: { MznEmpty },
    setup: () => ({ actionProps }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px">
        <MznEmpty
          description="Here is some additional information about this state."
          size="main"
          title="Initial Data"
          type="initial-data"
          :actions="actionProps"
        />
        <MznEmpty
          description="Your operation has been completed successfully."
          size="main"
          title="Result"
          type="result"
          :actions="actionProps"
        />
        <MznEmpty
          description="Need assistance? Click the button below to get help."
          size="main"
          title="System"
          type="system"
          :actions="actionProps"
        />
        <MznEmpty
          description="Please review the notification message before proceeding."
          size="main"
          title="Notification"
          type="notification"
          :actions="actionProps"
        />
        <MznEmpty
          description="Here is some additional information about this state."
          size="sub"
          title="Initial Data"
          type="initial-data"
          :actions="actionProps"
        />
        <MznEmpty
          description="Your operation has been completed successfully."
          size="sub"
          title="Result"
          type="result"
          :actions="actionProps"
        />
        <MznEmpty
          description="Need assistance? Click the button below to get help."
          size="sub"
          title="System"
          type="system"
          :actions="actionProps"
        />
        <MznEmpty
          description="Please review the notification message before proceeding."
          size="sub"
          title="Notification"
          type="notification"
          :actions="actionProps"
        />
        <MznEmpty size="minor" title="Initial Data" type="initial-data" />
        <MznEmpty size="minor" title="Result" type="result" />
        <MznEmpty size="minor" title="System" type="system" />
        <MznEmpty size="minor" title="Notification" type="notification" />
      </div>
    `,
  }),
};

export const WithButtons: Story = {
  render: () => ({
    components: { MznEmpty },
    setup: () => ({ actionProps, secondaryOnly }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px">
        <MznEmpty
          description="secondaryButtonProps and primaryButtonProps"
          size="main"
          title="System"
          type="system"
          :actions="actionProps"
        />
        <MznEmpty
          description="only secondaryButtonProps"
          size="main"
          title="System"
          type="system"
          :actions="secondaryOnly"
        />
        <MznEmpty
          description="no actions"
          size="main"
          title="System"
          type="system"
        />
      </div>
    `,
  }),
};

export const ActionProp: Story = {
  render: () => ({
    components: { MznButton, MznEmpty },
    setup: () => ({ singleButton, twoButtons }),
    template: `
      <div>
        <MznEmpty
          description="Using ButtonProps object with children property"
          size="main"
          title="ButtonProps - Single Button"
          type="initial-data"
          :actions="singleButton"
        />

        <MznEmpty
          description="Using ButtonProps objects for both primary and secondary buttons"
          size="main"
          title="ButtonProps - Two Buttons"
          type="initial-data"
          :actions="twoButtons"
        />

        <MznEmpty
          description="Using ReactElement directly as children"
          size="main"
          title="ReactElement - Single Button"
          type="initial-data"
        >
          <MznButton>Button 1</MznButton>
        </MznEmpty>

        <MznEmpty
          description="Using ReactElements for both primary and secondary buttons"
          size="main"
          title="ReactElement - Two Buttons"
          type="initial-data"
        >
          <MznButton>Button 1</MznButton>
          <MznButton>Button 2</MznButton>
        </MznEmpty>
      </div>
    `,
  }),
};

export const Playground: StoryObj<PlaygroundArgs> = {
  render: (args) => ({
    components: { MznEmpty, MznTypography },
    setup: () => ({ args, demoImage }),
    template: `
      <MznTypography variant="h3">main</MznTypography>
      <div style="width: 100%; height: 270px; margin: 0 0 24px 0; background-color: #F3F4F6">
        <MznEmpty
          v-if="args.type === 'custom'"
          :type="args.type"
          size="main"
          :title="args.title"
          :pictogram="demoImage"
          :description="args.description"
        />
        <MznEmpty
          v-else
          :type="args.type"
          size="main"
          :title="args.title"
          :description="args.description"
        />
      </div>
      <MznTypography variant="h3">sub</MznTypography>
      <div style="width: 100%; height: 200px; margin: 0 0 24px 0; background-color: #F3F4F6">
        <MznEmpty
          v-if="args.type === 'custom'"
          :type="args.type"
          size="sub"
          :title="args.title"
          :pictogram="demoImage"
          :description="args.description"
        />
        <MznEmpty
          v-else
          :type="args.type"
          size="sub"
          :title="args.title"
          :description="args.description"
        />
      </div>
      <MznTypography variant="h3">minor</MznTypography>
      <div style="width: 100%; height: 80px; background-color: #F3F4F6">
        <MznEmpty
          :type="args.type"
          size="minor"
          :title="args.title"
          :description="undefined"
        />
      </div>
    `,
  }),
  args: {
    description: '找不到符合條件的資料',
    title: '查無資料',
    type: 'initial-data',
  },
  argTypes: {
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
  },
};
