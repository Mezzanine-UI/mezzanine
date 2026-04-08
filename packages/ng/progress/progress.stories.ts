import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ProgressStatus, ProgressType } from '@mezzanine-ui/core/progress';
import { MznProgress } from './progress.component';

const types: ProgressType[] = ['progress', 'percent', 'icon'];
const statuses: ProgressStatus[] = ['enabled', 'success', 'error'];

const meta: Meta<MznProgress> = {
  title: 'Feedback/Progress',
  component: MznProgress,
  decorators: [moduleMetadata({ imports: [MznProgress] })],
};

export default meta;
type Story = StoryObj<MznProgress>;

export const Playground: Story = {
  argTypes: {
    percent: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'The progress percent (0~100).',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    status: {
      options: [...statuses],
      control: { type: 'select' },
      description:
        'Force mark the progress status. automatically set if not defined. (enabled(0~99) or success(100) depending on percent)',
      table: {
        type: { summary: "'enabled' | 'success' | 'error' | undefined" },
      },
    },
    tick: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'The tick of progress (0~100). Only shows when tick < 100.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    type: {
      options: types,
      control: { type: 'select' },
      description: 'The type of progress display.',
      table: {
        type: { summary: "'progress' | 'percent' | 'icon'" },
        defaultValue: { summary: "'progress'" },
      },
    },
    icons: {
      control: false,
      table: {
        disable: true,
      },
    },
    percentProps: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  args: {
    percent: 50,
    type: 'progress',
    status: 'enabled',
    tick: undefined,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 400px;">
        <div mznProgress [percent]="percent" [type]="type" [status]="status" [tick]="tick" ></div>
      </div>
    `,
  }),
};

export const Line: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Type:</p>
          <div style="display: flex; gap: 36px; align-items: flex-start;">
            <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; background-color: #F3F4F6; padding: 32px;">
              <span>Progress</span>
              <div mznProgress [percent]="40" ></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; background-color: #F3F4F6; padding: 32px;">
              <span>Without Progress Status</span>
              <div mznProgress [percent]="50" type="percent" ></div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; background-color: #F3F4F6; padding: 32px;">
              <span>With Icon</span>
              <div mznProgress [percent]="100" status="success" type="icon" ></div>
            </div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Variant:</p>
          <div style="display: flex; gap: 36px; align-items: flex-start;">
            <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; background-color: #F3F4F6; padding: 32px;">
              <span>Enabled</span>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                  <p>Without Progress Status</p>
                  <div mznProgress [percent]="45" status="enabled" [tick]="20" ></div>
                </div>
                <div>
                  <p>With Percent</p>
                  <div mznProgress [percent]="45" status="enabled" type="percent" ></div>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; background-color: #F3F4F6; padding: 32px;">
              <span>Success</span>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                  <p>Without Progress Status</p>
                  <div mznProgress [percent]="100" status="success" [tick]="90" ></div>
                </div>
                <div>
                  <p>With Percent</p>
                  <div mznProgress [percent]="100" status="success" type="percent" ></div>
                </div>
                <div>
                  <p>With Icon</p>
                  <div mznProgress [percent]="100" status="success" type="icon" ></div>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; width: 33%; background-color: #F3F4F6; padding: 32px;">
              <span>Error</span>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                  <p>Without Progress Status</p>
                  <div mznProgress [percent]="60" status="error" [tick]="90" ></div>
                </div>
                <div>
                  <p>With Percent</p>
                  <div mznProgress [percent]="60" status="error" type="percent" ></div>
                </div>
                <div>
                  <p>With Icon</p>
                  <div mznProgress [percent]="60" status="error" type="icon" ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
