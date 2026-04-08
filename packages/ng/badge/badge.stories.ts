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
      <mzn-badge
        [variant]="variant"
        [count]="count"
        [overflowCount]="overflowCount"
        [text]="text || undefined"
      />
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
            <mzn-badge variant="dot-success">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </mzn-badge>
          </div>

          <div style="display: flex; align-items: center;">
            <span>Error</span>
            <mzn-badge variant="dot-error">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </mzn-badge>
          </div>

          <div style="display: flex; align-items: center;">
            <span>Warning</span>
            <mzn-badge variant="dot-warning">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </mzn-badge>
          </div>

          <div style="display: flex; align-items: center;">
            <span>Info</span>
            <mzn-badge variant="dot-info">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </mzn-badge>
          </div>

          <div style="display: flex; align-items: center;">
            <span>Inactive</span>
            <mzn-badge variant="dot-inactive">
              <button type="button" style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent;">
                <i mznIcon [icon]="NotificationIcon" [size]="16" ></i>
              </button>
            </mzn-badge>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2>Dot with text</h2>

          <div style="display: flex; align-items: center; gap: 8px;">
            Success
            <mzn-badge variant="dot-success" text="States" size="main" />
            <mzn-badge variant="dot-success" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Error
            <mzn-badge variant="dot-error" text="States" size="main" />
            <mzn-badge variant="dot-error" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Warning
            <mzn-badge variant="dot-warning" text="States" size="main" />
            <mzn-badge variant="dot-warning" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Info
            <mzn-badge variant="dot-info" text="States" size="main" />
            <mzn-badge variant="dot-info" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inactive
            <mzn-badge variant="dot-inactive" text="States" size="main" />
            <mzn-badge variant="dot-inactive" text="States" size="sub" />
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2>Text only</h2>

          <div style="display: flex; align-items: center; gap: 8px;">
            Success
            <mzn-badge variant="text-success" text="States" size="main" />
            <mzn-badge variant="text-success" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Error
            <mzn-badge variant="text-error" text="States" size="main" />
            <mzn-badge variant="text-error" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Warning
            <mzn-badge variant="text-warning" text="States" size="main" />
            <mzn-badge variant="text-warning" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Info
            <mzn-badge variant="text-info" text="States" size="main" />
            <mzn-badge variant="text-info" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inactive
            <mzn-badge variant="text-inactive" text="States" size="main" />
            <mzn-badge variant="text-inactive" text="States" size="sub" />
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <h2>Count</h2>

          <div style="display: flex; align-items: center; gap: 8px;">
            Alert
            <mzn-badge variant="count-alert" [count]="5" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inactive
            <mzn-badge variant="count-inactive" [count]="5" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Inverse
            <mzn-badge variant="count-inverse" [count]="5" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Brand
            <mzn-badge variant="count-brand" [count]="5" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            Info
            <mzn-badge variant="count-info" [count]="5" />
          </div>
        </div>
      </div>
    `,
  }),
};
