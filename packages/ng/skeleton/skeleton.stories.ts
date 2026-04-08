import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznSkeleton } from './skeleton.component';

const meta: Meta<MznSkeleton> = {
  title: 'Feedback/Skeleton',
  component: MznSkeleton,
  decorators: [moduleMetadata({ imports: [MznSkeleton] })],
};

export default meta;
type Story = StoryObj<MznSkeleton>;

export const Basic: Story = {
  render: () => ({
    template: `
      <div style="display: inline-grid; gap: 16px; align-items: center; background-color: #ffffff;">
        <span>Type Strip</span>
        <div style="width: 480px; gap: 8px; display: grid;">
          <div style="display: flex; gap: 8px;">
            <span style="flex-shrink: 0;">variant: h1</span>
            <mzn-skeleton variant="h1" />
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="flex-shrink: 0;">variant: h2</span>
            <mzn-skeleton variant="h2" />
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="flex-shrink: 0;">variant: body</span>
            <mzn-skeleton variant="body" />
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="flex-shrink: 0;">variant: label-primary</span>
            <mzn-skeleton variant="label-primary" />
          </div>
        </div>
        <span>Type Circle</span>
        <div style="width: 32px;">
          <mzn-skeleton [circle]="true" />
        </div>
        <mzn-skeleton [circle]="true" [width]="48" />
        <span>Type Square</span>
        <div style="width: 120px; height: 80px;">
          <mzn-skeleton />
        </div>
        <mzn-skeleton [width]="120" [height]="120" />
        <span>Group Example</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <mzn-skeleton [circle]="true" [width]="36" />
          <mzn-skeleton variant="body" />
        </div>
        <div style="display: grid;">
          <mzn-skeleton variant="body" />
          <mzn-skeleton variant="body" />
          <mzn-skeleton variant="body" />
        </div>
      </div>
    `,
  }),
};
