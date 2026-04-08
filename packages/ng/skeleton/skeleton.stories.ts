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
            <div mznSkeleton variant="h1" ></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="flex-shrink: 0;">variant: h2</span>
            <div mznSkeleton variant="h2" ></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="flex-shrink: 0;">variant: body</span>
            <div mznSkeleton variant="body" ></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="flex-shrink: 0;">variant: label-primary</span>
            <div mznSkeleton variant="label-primary" ></div>
          </div>
        </div>
        <span>Type Circle</span>
        <div style="width: 32px;">
          <div mznSkeleton [circle]="true" ></div>
        </div>
        <div mznSkeleton [circle]="true" [width]="48" ></div>
        <span>Type Square</span>
        <div style="width: 120px; height: 80px;">
          <div mznSkeleton ></div>
        </div>
        <div mznSkeleton [width]="120" [height]="120" ></div>
        <span>Group Example</span>
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
