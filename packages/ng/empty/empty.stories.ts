import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznEmpty } from './empty.component';
import { MznButton } from '../button/button.directive';

export default {
  title: 'Feedback/Empty',
  decorators: [
    moduleMetadata({
      imports: [MznEmpty, MznButton],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <div mznEmpty description="Here is some additional information about this state." size="main" title="Initial Data" type="initial-data">
          <button mznButton variant="base-secondary" actions>Secondary</button>
          <button mznButton variant="base-primary" actions>Primary</button>
        </div>
        <div mznEmpty description="Your operation has been completed successfully." size="main" title="Result" type="result">
          <button mznButton variant="base-secondary" actions>Secondary</button>
          <button mznButton variant="base-primary" actions>Primary</button>
        </div>
        <div mznEmpty description="Need assistance? Click the button below to get help." size="main" title="System" type="system">
          <button mznButton variant="base-secondary" actions>Secondary</button>
          <button mznButton variant="base-primary" actions>Primary</button>
        </div>
        <div mznEmpty description="Please review the notification message before proceeding." size="main" title="Notification" type="notification">
          <button mznButton variant="base-secondary" actions>Secondary</button>
          <button mznButton variant="base-primary" actions>Primary</button>
        </div>
        <div mznEmpty description="Here is some additional information about this state." size="sub" title="Initial Data" type="initial-data">
          <button mznButton variant="base-secondary" actions>Secondary</button>
          <button mznButton variant="base-primary" actions>Primary</button>
        </div>
        <div mznEmpty description="Your operation has been completed successfully." size="sub" title="Result" type="result">
          <button mznButton variant="base-secondary" actions>Secondary</button>
          <button mznButton variant="base-primary" actions>Primary</button>
        </div>
        <div mznEmpty description="Need assistance? Click the button below to get help." size="sub" title="System" type="system">
          <button mznButton variant="base-secondary" actions>Secondary</button>
          <button mznButton variant="base-primary" actions>Primary</button>
        </div>
        <div mznEmpty description="Please review the notification message before proceeding." size="sub" title="Notification" type="notification">
          <button mznButton variant="base-secondary" actions>Secondary</button>
          <button mznButton variant="base-primary" actions>Primary</button>
        </div>
        <div mznEmpty size="minor" title="Initial Data" type="initial-data" ></div>
        <div mznEmpty size="minor" title="Result" type="result" ></div>
        <div mznEmpty size="minor" title="System" type="system" ></div>
        <div mznEmpty size="minor" title="Notification" type="notification" ></div>
      </div>
    `,
  }),
};

export const WithButtons: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <div mznEmpty description="secondaryButtonProps and primaryButtonProps" size="main" title="System" type="system">
          <button mznButton variant="base-secondary" actions>Secondary</button>
          <button mznButton variant="base-primary" actions>Primary</button>
        </div>
        <div mznEmpty description="only secondaryButtonProps" size="main" title="System" type="system">
          <button mznButton variant="base-secondary" actions>Secondary</button>
        </div>
        <div mznEmpty description="no actions" size="main" title="System" type="system" ></div>
      </div>
    `,
  }),
};

export const ActionProp: Story = {
  render: () => ({
    template: `
      <div>
        <div mznEmpty
          description="Using ButtonProps object with children property"
          size="main"
          title="ButtonProps - Single Button"
          type="initial-data"
        ></div>
        <div mznEmpty
          description="Using ButtonProps objects for both primary and secondary buttons"
          size="main"
          title="ButtonProps - Two Buttons"
          type="initial-data"
        ></div>
        <div mznEmpty
          description="Using ng-content directly as actions"
          size="main"
          title="NgContent - Single Button"
          type="initial-data"
        >
          <button mznButton actions>Button 1</button>
        </div>
        <div mznEmpty
          description="Using ng-content for both primary and secondary buttons"
          size="main"
          title="NgContent - Two Buttons"
          type="initial-data"
        >
          <button mznButton actions>Button 1</button>
          <button mznButton actions>Button 2</button>
        </div>
      </div>
    `,
  }),
};

export const Playground: Story = {
  argTypes: {
    type: {
      options: ['initial-data', 'result', 'system', 'notification', 'custom'],
      control: { type: 'select' },
    },
    size: {
      options: ['main', 'sub', 'minor'],
      control: { type: 'select' },
    },
    description: {
      control: { type: 'text' },
    },
    title: {
      control: { type: 'text' },
    },
  },
  args: {
    title: '查無資料',
    type: 'initial-data',
    size: 'main',
    description: '找不到符合條件的資料',
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznEmpty
        [title]="title"
        [type]="type"
        [size]="size"
        [description]="description"
      ></div>
    `,
  }),
};
