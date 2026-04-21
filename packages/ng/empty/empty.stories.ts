import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznEmpty } from './empty.component';
import { MznButton } from '../button/button.directive';
import { MznTypography } from '../typography/typography.directive';
import { EmptyActions } from './typings';

export default {
  title: 'Feedback/Empty',
  decorators: [
    moduleMetadata({
      imports: [MznEmpty, MznButton, MznTypography],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

const actionProps: EmptyActions = {
  secondaryButton: {
    children: 'Secondary',
    onClick: (): void => alert('Secondary Action Clicked'),
  },
  primaryButton: {
    children: 'Primary',
    onClick: (): void => alert('Primary Action Clicked'),
  },
};

export const AllTypes: Story = {
  render: () => ({
    props: { actionProps },
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <div mznEmpty description="Here is some additional information about this state." size="main" title="Initial Data" type="initial-data" [actions]="actionProps"></div>
        <div mznEmpty description="Your operation has been completed successfully." size="main" title="Result" type="result" [actions]="actionProps"></div>
        <div mznEmpty description="Need assistance? Click the button below to get help." size="main" title="System" type="system" [actions]="actionProps"></div>
        <div mznEmpty description="Please review the notification message before proceeding." size="main" title="Notification" type="notification" [actions]="actionProps"></div>
        <div mznEmpty description="Here is some additional information about this state." size="sub" title="Initial Data" type="initial-data" [actions]="actionProps"></div>
        <div mznEmpty description="Your operation has been completed successfully." size="sub" title="Result" type="result" [actions]="actionProps"></div>
        <div mznEmpty description="Need assistance? Click the button below to get help." size="sub" title="System" type="system" [actions]="actionProps"></div>
        <div mznEmpty description="Please review the notification message before proceeding." size="sub" title="Notification" type="notification" [actions]="actionProps"></div>
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
    props: {
      actionProps,
      onlySecondary: {
        secondaryButton: actionProps.secondaryButton,
      } satisfies EmptyActions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <div mznEmpty description="secondaryButtonProps and primaryButtonProps" size="main" title="System" type="system" [actions]="actionProps"></div>
        <div mznEmpty description="only secondaryButtonProps" size="main" title="System" type="system" [actions]="onlySecondary"></div>
        <div mznEmpty description="no actions" size="main" title="System" type="system" ></div>
      </div>
    `,
  }),
};

export const ActionProp: Story = {
  render: () => ({
    props: {
      singleButton: { children: 'Button 1' } satisfies EmptyActions,
      twoButtons: {
        secondaryButton: { children: 'Button 1' },
        primaryButton: { children: 'Button 2' },
      } satisfies EmptyActions,
    },
    template: `
      <div>
        <div mznEmpty
          description="Using ButtonProps object with children property"
          size="main"
          title="ButtonProps - Single Button"
          type="initial-data"
          [actions]="singleButton"
        ></div>
        <div mznEmpty
          description="Using ButtonProps objects for both primary and secondary buttons"
          size="main"
          title="ButtonProps - Two Buttons"
          type="initial-data"
          [actions]="twoButtons"
        ></div>
        <div mznEmpty
          description="Using ng-content directly as actions"
          size="main"
          title="NgContent - Single Button"
          type="initial-data"
        >
          <button mznButton variant="base-secondary" actions>Button 1</button>
        </div>
        <div mznEmpty
          description="Using ng-content for both primary and secondary buttons"
          size="main"
          title="NgContent - Two Buttons"
          type="initial-data"
        >
          <button mznButton variant="base-secondary" actions>Button 1</button>
          <button mznButton variant="base-primary" actions>Button 2</button>
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
    description: '找不到符合條件的資料',
  },
  render: (args) => ({
    props: args,
    template: `
      <ng-template #demoImage>
        <div style="width: 64px; height: 64px; margin-bottom: 4px; background-image: radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a); border-radius: 100%;"></div>
      </ng-template>

      <h3 mznTypography variant="h3">main</h3>
      <div style="width: 100%; height: 270px; margin: 0 0 24px 0; background-color: #F3F4F6;">
        @if (type === 'custom') {
          <div mznEmpty type="custom" size="main" [title]="title" [description]="description" [pictogram]="demoImage"></div>
        } @else {
          <div mznEmpty [type]="type" size="main" [title]="title" [description]="description"></div>
        }
      </div>

      <h3 mznTypography variant="h3">sub</h3>
      <div style="width: 100%; height: 200px; margin: 0 0 24px 0; background-color: #F3F4F6;">
        @if (type === 'custom') {
          <div mznEmpty type="custom" size="sub" [title]="title" [description]="description" [pictogram]="demoImage"></div>
        } @else {
          <div mznEmpty [type]="type" size="sub" [title]="title" [description]="description"></div>
        }
      </div>

      <h3 mznTypography variant="h3">minor</h3>
      <div style="width: 100%; height: 80px; background-color: #F3F4F6;">
        <div mznEmpty [type]="type" size="minor" [title]="title"></div>
      </div>
    `,
  }),
};
