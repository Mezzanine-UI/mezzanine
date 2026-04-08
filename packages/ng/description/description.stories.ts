import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import { MznBadge } from '@mezzanine-ui/ng/badge';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznProgress } from '@mezzanine-ui/ng/progress';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznDescription } from './description.component';
import { MznDescriptionContent } from './description-content.component';
import { MznDescriptionGroup } from './description-group.component';

export default {
  title: 'Data Display/Description/Description',
  decorators: [
    moduleMetadata({
      imports: [
        MznDescription,
        MznDescriptionContent,
        MznDescriptionGroup,
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
    props: { questionOutlineIcon: QuestionOutlineIcon },
    template: `
      <div style="width: 280px; display: flex; flex-direction: column; gap: 32px;">
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Normal</p>
          <mzn-description title="訂購日期" widthType="narrow">
            <mzn-description-content>2025-11-03</mzn-description-content>
          </mzn-description>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Badge</p>
          <mzn-description size="main" title="訂單狀態" widthType="narrow">
            <mzn-badge variant="dot-success" text="已訂購" />
          </mzn-description>
          <mzn-description size="sub" title="訂單狀態" widthType="narrow">
            <mzn-badge variant="dot-success" text="已訂購" />
          </mzn-description>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Button</p>
          <mzn-description title="訂單連結" widthType="narrow">
            <button mznButton variant="base-text-link" size="sub">連結</button>
          </mzn-description>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Progress</p>
          <mzn-description title="訂單進度" widthType="narrow">
            <div mznProgress [percent]="80" type="percent" ></div>
          </mzn-description>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Tags</p>
          <mzn-description title="訂單標籤" widthType="narrow">
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              <span mznTag label="快速" ></span>
              <span mznTag label="冷藏" ></span>
              <span mznTag label="特價" ></span>
            </div>
          </mzn-description>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Vertical</p>
          <mzn-description
            orientation="vertical"
            title="訂購日期"
            [icon]="questionOutlineIcon"
            tooltip="tooltip"
            tooltipPlacement="top-start"
          >
            <mzn-description-content>2025-11-03</mzn-description-content>
          </mzn-description>
        </div>
      </div>
    `,
  }),
};
