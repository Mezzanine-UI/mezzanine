import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznTypography from '../typography/typography.vue';
import MznSkeleton from './skeleton.vue';

export default {
  title: 'Feedback/Skeleton',
} satisfies Meta;

export const Basic: StoryObj = {
  render: () => ({
    components: { MznSkeleton, MznTypography },
    template: `
      <div style="display: inline-grid; gap: 16px; align-items: center; background-color: #ffffff">
        <MznTypography>Type Strip</MznTypography>
        <div style="width: 480px; gap: 8px; display: grid">
          <div style="display: flex; gap: 8px">
            <MznTypography style="flex-shrink: 0" variant="h1">variant: h1</MznTypography>
            <MznSkeleton variant="h1" />
          </div>
          <div style="display: flex; gap: 8px">
            <MznTypography style="flex-shrink: 0" variant="h2">variant: h2</MznTypography>
            <MznSkeleton variant="h2" />
          </div>
          <div style="display: flex; gap: 8px">
            <MznTypography style="flex-shrink: 0" variant="body">variant: body</MznTypography>
            <MznSkeleton variant="body" />
          </div>
          <div style="display: flex; gap: 8px">
            <MznTypography style="flex-shrink: 0" variant="label-primary">variant: label-primary</MznTypography>
            <MznSkeleton variant="label-primary" />
          </div>
        </div>

        <MznTypography>Type Circle</MznTypography>
        <div style="width: 32px">
          <MznSkeleton circle />
        </div>
        <MznSkeleton circle :width="48" />

        <MznTypography>Type Square</MznTypography>
        <div style="width: 120px; height: 80px">
          <MznSkeleton />
        </div>
        <MznSkeleton :width="120" :height="120" />

        <MznTypography>Group Example</MznTypography>
        <div style="display: flex; align-items: center; gap: 8px">
          <MznSkeleton circle :width="36" />
          <MznSkeleton variant="body" />
        </div>
        <div style="display: grid">
          <MznSkeleton variant="body" />
          <MznSkeleton variant="body" />
          <MznSkeleton variant="body" />
        </div>
      </div>
    `,
  }),
};
