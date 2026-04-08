import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznBadge } from './badge.component';
import { MznIcon } from '../icon/icon.component';
import { NotificationIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Data Display/Badge',
  decorators: [
    moduleMetadata({
      imports: [MznBadge, MznIcon],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    variant: {
      options: [
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
      ],
      control: { type: 'select' },
    },
    count: { control: { type: 'number' } },
    overflowCount: { control: { type: 'number' } },
    text: { control: { type: 'text' } },
  },
  args: {
    variant: 'dot-success',
    count: undefined,
    overflowCount: undefined,
    text: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <span mznBadge
        [variant]="variant"
        [count]="count"
        [overflowCount]="overflowCount"
        [text]="text || undefined"
      ></span>
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
          <h2>Dot</h2>

          <div style="display: flex; align-items: center;">
            <span>Success</span>
            <span mznBadge variant="dot-success">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </span>
          </div>

          <div style="display: flex; align-items: center;">
            <span>Error</span>
            <span mznBadge variant="dot-error">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </span>
          </div>

          <div style="display: flex; align-items: center;">
            <span>Warning</span>
            <span mznBadge variant="dot-warning">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </span>
          </div>

          <div style="display: flex; align-items: center;">
            <span>Info</span>
            <span mznBadge variant="dot-info">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </span>
          </div>

          <div style="display: flex; align-items: center;">
            <span>Inactive</span>
            <span mznBadge variant="dot-inactive">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2>Dot with text</h2>

          <div style="display: flex; align-items: center; gap: 8px;">
            Success
            <span mznBadge variant="dot-success" text="States" size="main" ></span>
            <span mznBadge variant="dot-success" text="States" size="sub" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Error
            <span mznBadge variant="dot-error" text="States" size="main" ></span>
            <span mznBadge variant="dot-error" text="States" size="sub" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Warning
            <span mznBadge variant="dot-warning" text="States" size="main" ></span>
            <span mznBadge variant="dot-warning" text="States" size="sub" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Info
            <span mznBadge variant="dot-info" text="States" size="main" ></span>
            <span mznBadge variant="dot-info" text="States" size="sub" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inactive
            <span mznBadge variant="dot-inactive" text="States" size="main" ></span>
            <span mznBadge variant="dot-inactive" text="States" size="sub" ></span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2>Text only</h2>

          <div style="display: flex; align-items: center; gap: 8px;">
            Success
            <span mznBadge variant="text-success" text="States" size="main" ></span>
            <span mznBadge variant="text-success" text="States" size="sub" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Error
            <span mznBadge variant="text-error" text="States" size="main" ></span>
            <span mznBadge variant="text-error" text="States" size="sub" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Warning
            <span mznBadge variant="text-warning" text="States" size="main" ></span>
            <span mznBadge variant="text-warning" text="States" size="sub" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Info
            <span mznBadge variant="text-info" text="States" size="main" ></span>
            <span mznBadge variant="text-info" text="States" size="sub" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inactive
            <span mznBadge variant="text-inactive" text="States" size="main" ></span>
            <span mznBadge variant="text-inactive" text="States" size="sub" ></span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2>Count</h2>

          <div style="display: flex; align-items: center; gap: 8px;">
            Alert
            <span mznBadge variant="count-alert" [count]="5" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inactive
            <span mznBadge variant="count-inactive" [count]="5" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inverse
            <span mznBadge variant="count-inverse" [count]="5" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Brand
            <span mznBadge variant="count-brand" [count]="5" ></span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Info
            <span mznBadge variant="count-info" [count]="5" ></span>
          </div>
        </div>
      </div>
    `,
  }),
};
