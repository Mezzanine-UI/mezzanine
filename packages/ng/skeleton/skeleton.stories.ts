import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznSkeleton } from './skeleton.component';

const meta: Meta<MznSkeleton> = {
  title: 'Feedback/Skeleton',
  component: MznSkeleton,
  decorators: [moduleMetadata({ imports: [MznSkeleton, MznTypography] })],
};

export default meta;
type Story = StoryObj<MznSkeleton>;

export const Basic: Story = {
  render: () => ({
    template: `
      <div style="display: inline-grid; gap: 16px; align-items: center; background-color: #ffffff;">
        <p mznTypography>Type Strip</p>
        <div style="width: 480px; gap: 8px; display: grid;">
          <div style="display: flex; gap: 8px;">
            <h1 mznTypography variant="h1" style="flex-shrink: 0;">variant: h1</h1>
            <div mznSkeleton variant="h1" ></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <h2 mznTypography variant="h2" style="flex-shrink: 0;">variant: h2</h2>
            <div mznSkeleton variant="h2" ></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <p mznTypography variant="body" style="flex-shrink: 0;">variant: body</p>
            <div mznSkeleton variant="body" ></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <p mznTypography variant="label-primary" style="flex-shrink: 0;">variant: label-primary</p>
            <div mznSkeleton variant="label-primary" ></div>
          </div>
        </div>
        <p mznTypography>Type Circle</p>
        <div style="width: 32px;">
          <div mznSkeleton [circle]="true" ></div>
        </div>
        <div mznSkeleton [circle]="true" [width]="48" ></div>
        <p mznTypography>Type Square</p>
        <div style="width: 120px; height: 80px;">
          <div mznSkeleton ></div>
        </div>
        <div mznSkeleton [width]="120" [height]="120" ></div>
        <p mznTypography>Group Example</p>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div mznSkeleton [circle]="true" [width]="36" ></div>
          <div mznSkeleton variant="body" ></div>
        </div>
        <div style="display: grid;">
          <div mznSkeleton variant="body" ></div>
          <div mznSkeleton variant="body" ></div>
          <div mznSkeleton variant="body" ></div>
        </div>
      </div>
    `,
  }),
};
