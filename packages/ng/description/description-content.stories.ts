import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CopyIcon } from '@mezzanine-ui/icons';
import { MznBadge } from '@mezzanine-ui/ng/badge';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznProgress } from '@mezzanine-ui/ng/progress';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznDescriptionContent } from './description-content.component';

export default {
  title: 'Data Display/Description/DescriptionContent',
  decorators: [
    moduleMetadata({
      imports: [
        MznDescriptionContent,
        MznBadge,
        MznButton,
        MznProgress,
        MznTag,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  render: () => ({
    props: { copyIcon: CopyIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 160px;">
        <div>
          <p style="font-weight: 600;">Text Only</p>
          <span mznDescriptionContent>rytass.com</span>
        </div>
        <div>
          <p style="font-weight: 600;">Text with Icon</p>
          <span mznDescriptionContent variant="with-icon" [icon]="copyIcon">rytass.com</span>
        </div>
        <div>
          <p style="font-weight: 600;">Text Link Button</p>
          <button mznButton variant="base-text-link" size="sub">rytass.com</button>
        </div>
        <div>
          <p style="font-weight: 600;">Trend-Up</p>
          <span mznDescriptionContent variant="trend-up">88%</span>
        </div>
        <div>
          <p style="font-weight: 600;">Trend-Down</p>
          <span mznDescriptionContent variant="trend-down">88%</span>
        </div>
        <div>
          <p style="font-weight: 600;">State</p>
          <span mznBadge variant="dot-success" text="已審核" ></span>
        </div>
        <div>
          <p style="font-weight: 600;">Statistic</p>
          <span mznDescriptionContent variant="statistic">98,888</span>
        </div>
        <div>
          <p style="font-weight: 600;">Progress</p>
          <div mznProgress [percent]="70" type="percent" ></div>
        </div>
        <div>
          <p style="font-weight: 600;">Tag</p>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            <span mznTag label="Tag" ></span>
            <span mznTag label="Tag" ></span>
            <span mznTag label="Tag" ></span>
            <span mznTag label="Tag" ></span>
            <span mznTag label="Tag" ></span>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: { copyIcon: CopyIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 160px;">
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Text Only</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main">Main Content</span>
            <span mznDescriptionContent size="sub">Sub Content</span>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Text with Icon</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main" variant="with-icon" [icon]="copyIcon">Main Content</span>
            <span mznDescriptionContent size="sub" variant="with-icon" [icon]="copyIcon">Sub Content</span>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Text Link Button</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <button mznButton variant="base-text-link" size="main">Main Link</button>
            <button mznButton variant="base-text-link" size="sub">Sub Link</button>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Trend-Up</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main" variant="trend-up">12.5%</span>
            <span mznDescriptionContent size="sub" variant="trend-up">12.5%</span>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Trend-Down</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main" variant="trend-down">8.3%</span>
            <span mznDescriptionContent size="sub" variant="trend-down">8.3%</span>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">State</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznBadge variant="dot-success" text="已審核（main）" size="main" ></span>
            <span mznBadge variant="dot-success" text="已審核（sub）" size="sub" ></span>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Statistic</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main" variant="statistic">99,000</span>
            <span mznDescriptionContent size="sub" variant="statistic">99,000</span>
          </div>
        </div>
      </div>
    `,
  }),
};
