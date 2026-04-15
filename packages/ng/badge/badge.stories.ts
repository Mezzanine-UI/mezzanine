import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznBadge } from './badge.component';
import { MznIcon } from '../icon/icon.component';
import { MznTypography } from '../typography/typography.directive';
import { NotificationIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Data Display/Badge',
  decorators: [
    moduleMetadata({
      imports: [MznBadge, MznIcon, MznTypography],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

const variants = [
  'dot-success',
  'dot-error',
  'dot-warning',
  'dot-info',
  'dot-inactive',
  'count-alert',
  'count-inactive',
  'count-inverse',
  'count-brand',
  'count-info',
] as const;

export const Playground: Story = {
  argTypes: {
    className: { control: 'text' },
    count: { control: 'number' },
    overflowCount: { control: 'number' },
    text: { control: 'text' },
    variant: {
      control: 'select',
      options: variants,
    },
  },
  args: {
    className: '',
    count: undefined,
    overflowCount: undefined,
    text: '',
    variant: variants[0],
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznBadge
        [className]="className || undefined"
        [count]="count"
        [overflowCount]="overflowCount"
        [text]="text || undefined"
        [variant]="variant"
      ></div>
    `,
  }),
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    props: { NotificationIcon },
    template: `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); row-gap: 32px;">
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2 mznTypography variant="h2">Dot</h2>

          <div style="display: flex; align-items: center;">
            <p mznTypography variant="body">Success</p>
            <div mznBadge variant="dot-success">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16"></i>
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center;">
            <p mznTypography variant="body">Error</p>
            <div mznBadge variant="dot-error">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16"></i>
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center;">
            <p mznTypography variant="body">Warning</p>
            <div mznBadge variant="dot-warning">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16"></i>
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center;">
            <p mznTypography variant="body">Info</p>
            <div mznBadge variant="dot-info">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16"></i>
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center;">
            <p mznTypography variant="body">Inactive</p>
            <div mznBadge variant="dot-inactive">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16"></i>
              </button>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2 mznTypography variant="h2">Dot with text</h2>

          <div style="display: flex; align-items: center; gap: 8px;">
            Success
            <div mznBadge variant="dot-success" text="States" size="main"></div>
            <div mznBadge variant="dot-success" text="States" size="sub"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Error
            <div mznBadge variant="dot-error" text="States" size="main"></div>
            <div mznBadge variant="dot-error" text="States" size="sub"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Warning
            <div mznBadge variant="dot-warning" text="States" size="main"></div>
            <div mznBadge variant="dot-warning" text="States" size="sub"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Info
            <div mznBadge variant="dot-info" text="States" size="main"></div>
            <div mznBadge variant="dot-info" text="States" size="sub"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inactive
            <div mznBadge variant="dot-inactive" text="States" size="main"></div>
            <div mznBadge variant="dot-inactive" text="States" size="sub"></div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2 mznTypography variant="h2">Text only</h2>

          <div style="display: flex; align-items: center; gap: 8px;">
            Success
            <div mznBadge variant="text-success" text="States" size="main"></div>
            <div mznBadge variant="text-success" text="States" size="sub"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Error
            <div mznBadge variant="text-error" text="States" size="main"></div>
            <div mznBadge variant="text-error" text="States" size="sub"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Warning
            <div mznBadge variant="text-warning" text="States" size="main"></div>
            <div mznBadge variant="text-warning" text="States" size="sub"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Info
            <div mznBadge variant="text-info" text="States" size="main"></div>
            <div mznBadge variant="text-info" text="States" size="sub"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inactive
            <div mznBadge variant="text-inactive" text="States" size="main"></div>
            <div mznBadge variant="text-inactive" text="States" size="sub"></div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2 mznTypography variant="h2">Count</h2>

          <div style="display: flex; align-items: center; gap: 8px;">
            Alert
            <div mznBadge variant="count-alert" [count]="5"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inactive
            <div mznBadge variant="count-inactive" [count]="5"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inverse
            <div mznBadge variant="count-inverse" [count]="5"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Brand
            <div mznBadge variant="count-brand" [count]="5"></div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Info
            <div mznBadge variant="count-info" [count]="5"></div>
          </div>
        </div>
      </div>
    `,
  }),
};
