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
          <mzn-description-content>rytass.com</mzn-description-content>
        </div>
        <div>
          <p style="font-weight: 600;">Text with Icon</p>
          <mzn-description-content variant="with-icon" [icon]="copyIcon">rytass.com</mzn-description-content>
        </div>
        <div>
          <p style="font-weight: 600;">Text Link Button</p>
          <button mznButton variant="base-text-link" size="sub">rytass.com</button>
        </div>
        <div>
          <p style="font-weight: 600;">Trend-Up</p>
          <mzn-description-content variant="trend-up">88%</mzn-description-content>
        </div>
        <div>
          <p style="font-weight: 600;">Trend-Down</p>
          <mzn-description-content variant="trend-down">88%</mzn-description-content>
        </div>
        <div>
          <p style="font-weight: 600;">State</p>
          <mzn-badge variant="dot-success" text="已審核" />
        </div>
        <div>
          <p style="font-weight: 600;">Statistic</p>
          <mzn-description-content variant="statistic">98,888</mzn-description-content>
        </div>
        <div>
          <p style="font-weight: 600;">Progress</p>
          <mzn-progress [percent]="70" type="percent" />
        </div>
        <div>
          <p style="font-weight: 600;">Tag</p>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            <mzn-tag label="Tag" />
            <mzn-tag label="Tag" />
            <mzn-tag label="Tag" />
            <mzn-tag label="Tag" />
            <mzn-tag label="Tag" />
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
            <mzn-description-content size="main">Main Content</mzn-description-content>
            <mzn-description-content size="sub">Sub Content</mzn-description-content>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Text with Icon</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <mzn-description-content size="main" variant="with-icon" [icon]="copyIcon">Main Content</mzn-description-content>
            <mzn-description-content size="sub" variant="with-icon" [icon]="copyIcon">Sub Content</mzn-description-content>
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
            <mzn-description-content size="main" variant="trend-up">12.5%</mzn-description-content>
            <mzn-description-content size="sub" variant="trend-up">12.5%</mzn-description-content>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Trend-Down</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <mzn-description-content size="main" variant="trend-down">8.3%</mzn-description-content>
            <mzn-description-content size="sub" variant="trend-down">8.3%</mzn-description-content>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">State</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <mzn-badge variant="dot-success" text="已審核（main）" size="main" />
            <mzn-badge variant="dot-success" text="已審核（sub）" size="sub" />
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Statistic</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <mzn-description-content size="main" variant="statistic">99,000</mzn-description-content>
            <mzn-description-content size="sub" variant="statistic">99,000</mzn-description-content>
          </div>
        </div>
      </div>
    `,
  }),
};
