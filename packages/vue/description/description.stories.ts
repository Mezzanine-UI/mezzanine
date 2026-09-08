import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import MznBadge from '../badge/badge.vue';
import MznButton from '../button/button.vue';
import MznProgress from '../progress/progress.vue';
import MznTagGroup from '../tag/tag-group.vue';
import MznTag from '../tag/tag.vue';
import MznTypography from '../typography/typography.vue';
import MznDescriptionContent from './description-content.vue';
import MznDescription from './description.vue';

export default {
  title: 'Data Display/Description/Description',
} as Meta;

type Story = StoryObj<typeof MznDescription>;

export const Playground: Story = {
  render: () => ({
    components: {
      MznBadge,
      MznButton,
      MznDescription,
      MznDescriptionContent,
      MznProgress,
      MznTag,
      MznTagGroup,
      MznTypography,
    },
    setup: () => ({ QuestionOutlineIcon }),
    template: `
      <div style="width: 280px; display: flex; flex-direction: column; gap: 32px">
        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Normal
          </MznTypography>
          <MznDescription title="訂購日期" widthType="narrow">
            <MznDescriptionContent children="2025-11-03" />
          </MznDescription>
        </div>
        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Badge
          </MznTypography>
          <MznDescription size="main" title="訂單狀態" widthType="narrow">
            <MznBadge variant="dot-success" text="已訂購" />
          </MznDescription>

          <MznDescription size="sub" title="訂單狀態" widthType="narrow">
            <MznBadge variant="dot-success" text="已訂購" />
          </MznDescription>
        </div>
        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Button
          </MznTypography>
          <MznDescription title="訂單連結" widthType="narrow">
            <MznButton variant="base-text-link" size="sub">連結</MznButton>
          </MznDescription>
        </div>
        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Progress
          </MznTypography>
          <MznDescription title="訂單進度" widthType="narrow">
            <MznProgress :percent="80" type="percent" />
          </MznDescription>
        </div>
        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Tags
          </MznTypography>
          <MznDescription title="訂單標籤" widthType="narrow">
            <MznTagGroup>
              <MznTag label="快速" />
              <MznTag label="冷藏" />
              <MznTag label="特價" />
            </MznTagGroup>
          </MznDescription>
        </div>
        <div>
          <MznTypography variant="h3" style="margin-bottom: 8px">
            Vertical
          </MznTypography>
          <MznDescription
            orientation="vertical"
            title="訂購日期"
            :icon="QuestionOutlineIcon"
            tooltip="tooltip"
            tooltipPlacement="top-start"
          >
            <MznDescriptionContent children="2025-11-03" />
          </MznDescription>
        </div>
      </div>
    `,
  }),
};
