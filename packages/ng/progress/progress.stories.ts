import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ProgressStatus, ProgressType } from '@mezzanine-ui/core/progress';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznTypography } from '@mezzanine-ui/ng/typography';
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
      <div mznProgress [percent]="percent" [type]="type" [status]="status" [tick]="tick" ></div>
    `,
  }),
};

/**
 * 對齊 React `Progress.stories.tsx` 的 Section / ItemList / SectionItem / ItemContent
 * 組合。React 原版為四個同檔內 presentational helpers，Angular 端以單一 attribute
 * selector 元件承接整份版面，sub-block 以 inline style + Tag / Typography 還原。
 *
 * SectionItem 的內層容器: 當 `direction="row"` 時高度鎖 20px（type section），
 * `direction="column"` 則 auto（variant section），對齊 React 的行內樣式。
 */
@Component({
  selector: '[storyProgressLine]',
  standalone: true,
  imports: [MznProgress, MznTag, MznTypography],
  host: {
    style: 'display: block; padding-bottom: 48px;',
  },
  template: `
    <!-- Section: Type -->
    <div
      style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;"
    >
      <h2 mznTypography variant="h2">Type:</h2>
      <!-- ItemList -->
      <div style="display: flex; gap: 36px; align-items: flex-start;">
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; height: auto; background-color: #F3F4F6; padding: 32px;"
        >
          <div mznTag label="Progress" size="main" type="static"></div>
          <div
            style="display: flex; justify-content: center; align-items: center; height: 20px; flex-direction: row;"
          >
            <div mznProgress [percent]="40"></div>
          </div>
        </div>
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; height: auto; background-color: #F3F4F6; padding: 32px;"
        >
          <div
            mznTag
            label="Without Progress Status"
            size="main"
            type="static"
          ></div>
          <div
            style="display: flex; justify-content: center; align-items: center; height: 20px; flex-direction: row;"
          >
            <div mznProgress [percent]="50" type="percent"></div>
          </div>
        </div>
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; height: auto; background-color: #F3F4F6; padding: 32px;"
        >
          <div mznTag label="With Icon" size="main" type="static"></div>
          <div
            style="display: flex; justify-content: center; align-items: center; height: 20px; flex-direction: row;"
          >
            <div mznProgress [percent]="100" status="success" type="icon"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Variant -->
    <div
      style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px;"
    >
      <h2 mznTypography variant="h2">Variant:</h2>
      <!-- ItemList -->
      <div style="display: flex; gap: 36px; align-items: flex-start;">
        <!-- SectionItem: Enabled (column direction) -->
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; height: auto; background-color: #F3F4F6; padding: 32px;"
        >
          <div mznTag label="Enabled" size="main" type="static"></div>
          <div
            style="display: flex; justify-content: center; align-items: center; height: auto; flex-direction: column;"
          >
            <div
              style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 16px;"
            >
              <span mznTypography>Without Progress Status</span>
              <div
                mznProgress
                [percent]="45"
                status="enabled"
                [tick]="20"
              ></div>
            </div>
            <div
              style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 16px;"
            >
              <span mznTypography>With Percent</span>
              <div
                mznProgress
                [percent]="45"
                status="enabled"
                type="percent"
              ></div>
            </div>
          </div>
        </div>

        <!-- SectionItem: Success (column direction) -->
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; height: auto; background-color: #F3F4F6; padding: 32px;"
        >
          <div mznTag label="Success" size="main" type="static"></div>
          <div
            style="display: flex; justify-content: center; align-items: center; height: auto; flex-direction: column;"
          >
            <div
              style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 16px;"
            >
              <span mznTypography>Without Progress Status</span>
              <div
                mznProgress
                [percent]="100"
                status="success"
                [tick]="90"
              ></div>
            </div>
            <div
              style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 16px;"
            >
              <span mznTypography>With Percent</span>
              <div
                mznProgress
                [percent]="100"
                status="success"
                type="percent"
              ></div>
            </div>
            <div
              style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 16px;"
            >
              <span mznTypography>With Icon</span>
              <div
                mznProgress
                [percent]="100"
                status="success"
                type="icon"
              ></div>
            </div>
          </div>
        </div>

        <!-- SectionItem: Error (column direction) -->
        <div
          style="display: flex; flex-direction: column; gap: 8px; width: 33%; height: auto; background-color: #F3F4F6; padding: 32px;"
        >
          <div mznTag label="Error" size="main" type="static"></div>
          <div
            style="display: flex; justify-content: center; align-items: center; height: auto; flex-direction: column;"
          >
            <div
              style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 16px;"
            >
              <span mznTypography>Without Progress Status</span>
              <div mznProgress [percent]="60" status="error" [tick]="90"></div>
            </div>
            <div
              style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 16px;"
            >
              <span mznTypography>With Percent</span>
              <div
                mznProgress
                [percent]="60"
                status="error"
                type="percent"
              ></div>
            </div>
            <div
              style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 16px;"
            >
              <span mznTypography>With Icon</span>
              <div mznProgress [percent]="60" status="error" type="icon"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class StoryProgressLineComponent {}

export const Line: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [StoryProgressLineComponent],
    }),
  ],
  render: () => ({
    template: `<div storyProgressLine></div>`,
  }),
};
