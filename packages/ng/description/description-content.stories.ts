import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CopyIcon } from '@mezzanine-ui/icons';
import { MznBadge } from '@mezzanine-ui/ng/badge';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznProgress } from '@mezzanine-ui/ng/progress';
import { MznTag, MznTagGroup } from '@mezzanine-ui/ng/tag';
import { MznTypography } from '@mezzanine-ui/ng/typography';
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
        MznTagGroup,
        MznTypography,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 160px;">
        <div>
          <h3 mznTypography variant="h3">Text Only</h3>
          <span mznDescriptionContent>rytass.com</span>
        </div>
        <div>
          <h3 mznTypography variant="h3">Text with Icon</h3>
          <span mznDescriptionContent variant="with-icon" [icon]="copyIcon" (clickIcon)="onCopy()">rytass.com</span>
        </div>
        <div>
          <h3 mznTypography variant="h3">Text Link Button</h3>
          <button mznButton variant="base-text-link" size="sub">rytass.com</button>
        </div>
        <div>
          <h3 mznTypography variant="h3">Trend-Up</h3>
          <span mznDescriptionContent variant="trend-up">88%</span>
        </div>
        <div>
          <h3 mznTypography variant="h3">Trend-Down</h3>
          <span mznDescriptionContent variant="trend-down">88%</span>
        </div>
        <div>
          <h3 mznTypography variant="h3">State</h3>
          <div mznBadge variant="dot-success" text="已審核"></div>
        </div>
        <div>
          <h3 mznTypography variant="h3">Statistic</h3>
          <span mznDescriptionContent variant="statistic">98,888</span>
        </div>
        <div>
          <h3 mznTypography variant="h3">Progress</h3>
          <div mznProgress [percent]="70" type="percent" ></div>
        </div>
        <div>
          <h3 mznTypography variant="h3">Tag</h3>
          <div mznTagGroup>
            <span><span mznTag label="Tag" ></span></span>
            <span><span mznTag label="Tag" ></span></span>
            <span><span mznTag label="Tag" ></span></span>
            <span><span mznTag label="Tag" ></span></span>
            <span><span mznTag label="Tag" ></span></span>
          </div>
        </div>
      </div>
    `,
    props: {
      copyIcon: CopyIcon,
      onCopy: (): void => {
        // eslint-disable-next-line no-console
        console.log('click icon');
      },
    },
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: { copyIcon: CopyIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 160px;">
        <div>
          <h3 mznTypography variant="h3" style="margin-bottom: 8px;">Text Only</h3>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main">Main Content</span>
            <span mznDescriptionContent size="sub">Sub Content</span>
          </div>
        </div>
        <div>
          <h3 mznTypography variant="h3" style="margin-bottom: 8px;">Text with Icon</h3>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main" variant="with-icon" [icon]="copyIcon">Main Content</span>
            <span mznDescriptionContent size="sub" variant="with-icon" [icon]="copyIcon">Sub Content</span>
          </div>
        </div>
        <div>
          <h3 mznTypography variant="h3" style="margin-bottom: 8px;">Text Link Button</h3>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <button mznButton variant="base-text-link" size="main">Main Link</button>
            <button mznButton variant="base-text-link" size="sub">Sub Link</button>
          </div>
        </div>
        <div>
          <h3 mznTypography variant="h3" style="margin-bottom: 8px;">Trend-Up</h3>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main" variant="trend-up">12.5%</span>
            <span mznDescriptionContent size="sub" variant="trend-up">12.5%</span>
          </div>
        </div>
        <div>
          <h3 mznTypography variant="h3" style="margin-bottom: 8px;">Trend-Down</h3>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main" variant="trend-down">8.3%</span>
            <span mznDescriptionContent size="sub" variant="trend-down">8.3%</span>
          </div>
        </div>
        <div>
          <h3 mznTypography variant="h3" style="margin-bottom: 8px;">State</h3>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div mznBadge variant="dot-success" text="已審核（main）" size="main"></div>
            <div mznBadge variant="dot-success" text="已審核（sub）" size="sub"></div>
          </div>
        </div>
        <div>
          <h3 mznTypography variant="h3" style="margin-bottom: 8px;">Statistic</h3>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span mznDescriptionContent size="main" variant="statistic">99,000</span>
            <span mznDescriptionContent size="sub" variant="statistic">99,000</span>
          </div>
        </div>
      </div>
    `,
  }),
};
