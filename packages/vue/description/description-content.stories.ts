import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CopyIcon } from '@mezzanine-ui/icons';
import MznBadge from '../badge/badge.vue';
import MznButton from '../button/button.vue';
import MznProgress from '../progress/progress.vue';
import MznTagGroup from '../tag/tag-group.vue';
import MznTag from '../tag/tag.vue';
import MznTypography from '../typography/typography.vue';
import MznDescriptionContent from './description-content.vue';

export default {
  title: 'Data Display/Description/DescriptionContent',
} as Meta;

type ContentStory = StoryObj<typeof MznDescriptionContent>;

const STORY_COMPONENTS = {
  MznBadge,
  MznButton,
  MznDescriptionContent,
  MznProgress,
  MznTag,
  MznTagGroup,
  MznTypography,
};

/** 主要尺寸（Main Size）— 所有 Content Cell 類型 */
export const Playground: ContentStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      CopyIcon,
      onClickIcon: (): void => {
        // eslint-disable-next-line no-console
        console.log('click icon');
      },
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 160px">
        <div>
          <MznTypography variant="h3">Text Only</MznTypography>
          <MznDescriptionContent children="rytass.com" />
        </div>
        <div>
          <MznTypography variant="h3">Text with Icon</MznTypography>
          <MznDescriptionContent
            variant="with-icon"
            :icon="CopyIcon"
            children="rytass.com"
            @click-icon="onClickIcon"
          />
        </div>
        <div>
          <MznTypography variant="h3">Text Link Button</MznTypography>
          <MznButton variant="base-text-link" size="sub">rytass.com</MznButton>
        </div>
        <div>
          <MznTypography variant="h3">Trend-Up</MznTypography>
          <MznDescriptionContent variant="trend-up" children="88%" />
        </div>
        <div>
          <MznTypography variant="h3">Trend-Down</MznTypography>
          <MznDescriptionContent variant="trend-down" children="88%" />
        </div>
        <div>
          <MznTypography variant="h3">State</MznTypography>
          <MznBadge variant="dot-success" text="已審核" />
        </div>
        <div>
          <MznTypography variant="h3">Statistic</MznTypography>
          <MznDescriptionContent variant="statistic" children="98,888" />
        </div>
        <div>
          <MznTypography variant="h3">Progress</MznTypography>
          <MznProgress :percent="70" type="percent" />
        </div>
        <div>
          <MznTypography variant="h3">Tag</MznTypography>
          <MznTagGroup>
            <MznTag label="Tag" />
            <MznTag label="Tag" />
            <MznTag label="Tag" />
            <MznTag label="Tag" />
            <MznTag label="Tag" />
          </MznTagGroup>
        </div>
      </div>
    `,
  }),
};

/** 尺寸對照 — Main（主要）與 Sub（次要）各 7 種 Content Cell 類型 */
export const Sizes: ContentStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({ CopyIcon }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 160px">
        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Text Only
          </MznTypography>
          <div style="display: flex; flex-direction: column; gap: 4px">
            <MznDescriptionContent size="main" children="Main Content" />
            <MznDescriptionContent size="sub" children="Sub Content" />
          </div>
        </div>

        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Text with Icon
          </MznTypography>
          <div style="display: flex; flex-direction: column; gap: 4px">
            <MznDescriptionContent
              size="main"
              variant="with-icon"
              :icon="CopyIcon"
              children="Main Content"
            />
            <MznDescriptionContent
              size="sub"
              variant="with-icon"
              :icon="CopyIcon"
              children="Sub Content"
            />
          </div>
        </div>

        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Text Link Button
          </MznTypography>
          <div style="display: flex; flex-direction: column; gap: 4px">
            <MznButton variant="base-text-link" size="main">Main Link</MznButton>
            <MznButton variant="base-text-link" size="sub">Sub Link</MznButton>
          </div>
        </div>

        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Trend-Up
          </MznTypography>
          <div style="display: flex; flex-direction: column; gap: 4px">
            <MznDescriptionContent size="main" variant="trend-up" children="12.5%" />
            <MznDescriptionContent size="sub" variant="trend-up" children="12.5%" />
          </div>
        </div>

        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Trend-Down
          </MznTypography>
          <div style="display: flex; flex-direction: column; gap: 4px">
            <MznDescriptionContent size="main" variant="trend-down" children="8.3%" />
            <MznDescriptionContent size="sub" variant="trend-down" children="8.3%" />
          </div>
        </div>

        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            State
          </MznTypography>
          <div style="display: flex; flex-direction: column; gap: 4px">
            <MznBadge variant="dot-success" text="已審核（main）" size="main" />
            <MznBadge variant="dot-success" text="已審核（sub）" size="sub" />
          </div>
        </div>

        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Statistic
          </MznTypography>
          <div style="display: flex; flex-direction: column; gap: 4px">
            <MznDescriptionContent size="main" variant="statistic" children="99,000" />
            <MznDescriptionContent size="sub" variant="statistic" children="99,000" />
          </div>
        </div>
      </div>
    `,
  }),
};
