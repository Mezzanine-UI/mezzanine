import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CalendarIcon } from '@mezzanine-ui/icons';
import MznBaseCard from './base-card.vue';
import MznCardGroup from './card-group.vue';
import MznFourThumbnailCard from './four-thumbnail-card.vue';
import MznQuickActionCard from './quick-action-card.vue';
import MznSingleThumbnailCard from './single-thumbnail-card.vue';
import MznThumbnail from './thumbnail.vue';

export default {
  title: 'Data Display/Card/CardGroup',
  component: MznCardGroup,
} satisfies Meta<typeof MznCardGroup>;

type Story = StoryObj<typeof MznCardGroup>;

const THUMBNAIL_IMAGE_STYLE =
  'display: block; height: 100%; object-fit: cover; width: 100%';

export const LoadingBaseCard: Story = {
  name: 'Loading Type: base',
  render: () => ({
    components: { MznBaseCard, MznCardGroup },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div>
          <h4 style="margin: 0 0 16px 0">Loading State (3 skeletons)</h4>
          <MznCardGroup loading :loading-count="3" loading-type="base">
            <MznBaseCard description="A simple card" title="Card 1" type="default">Content for card 1</MznBaseCard>
          </MznCardGroup>
        </div>
      </div>
    `,
  }),
};

export const LoadingQuickActionCard: Story = {
  name: 'Loading Type: quick action',
  render: () => ({
    components: { MznCardGroup, MznQuickActionCard },
    setup: () => ({ CalendarIcon }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div>
          <h4 style="margin: 0 0 16px 0">Loading State (3 skeletons)</h4>
          <MznCardGroup loading :loading-count="3" loading-type="quick-action">
            <MznQuickActionCard
              :icon="CalendarIcon"
              subtitle="Set up a new meeting"
              title="Schedule Meeting"
            />
          </MznCardGroup>
        </div>
      </div>
    `,
  }),
};

export const LoadingSingleThumbnailCard: Story = {
  name: 'Loading Type: single thumbnail',
  render: () => ({
    components: { MznCardGroup, MznSingleThumbnailCard },
    setup: () => ({ THUMBNAIL_IMAGE_STYLE }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div>
          <h4 style="margin: 0 0 16px 0">Loading State (3 skeletons)</h4>
          <MznCardGroup
            loading
            :loading-count="3"
            loading-type="single-thumbnail"
            :loading-thumbnail-width="360"
            loading-thumbnail-aspect-ratio="360/240"
          >
            <MznSingleThumbnailCard
              subtitle="Uploaded yesterday"
              title="Product Image 1"
              type="default"
            >
              <img
                alt="Sample thumbnail 1"
                src="https://picsum.photos/seed/1/360/240"
                :style="THUMBNAIL_IMAGE_STYLE"
              />
            </MznSingleThumbnailCard>
          </MznCardGroup>
        </div>
      </div>
    `,
  }),
};

export const LoadingFourThumbnailCard: Story = {
  name: 'Loading Type: four thumbnail',
  render: () => ({
    components: { MznCardGroup, MznFourThumbnailCard, MznThumbnail },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div>
          <h4 style="margin: 0 0 16px 0">Loading State (3 skeletons)</h4>
          <MznCardGroup
            loading
            :loading-count="3"
            loading-type="four-thumbnail"
            :loading-thumbnail-width="160"
          >
            <MznFourThumbnailCard
              subtitle="4 items"
              title="Photo Album A"
              type="default"
            >
              <MznThumbnail>
                <img
                  alt="Album A - Item 1"
                  src="https://picsum.photos/seed/a1/160/160"
                />
              </MznThumbnail>
              <MznThumbnail>
                <img
                  alt="Album A - Item 2"
                  src="https://picsum.photos/seed/a2/160/160"
                />
              </MznThumbnail>
              <MznThumbnail>
                <img
                  alt="Album A - Item 3"
                  src="https://picsum.photos/seed/a3/160/160"
                />
              </MznThumbnail>
              <MznThumbnail>
                <img
                  alt="Album A - Item 4"
                  src="https://picsum.photos/seed/a4/160/160"
                />
              </MznThumbnail>
            </MznFourThumbnailCard>
          </MznCardGroup>
        </div>
      </div>
    `,
  }),
};

export const LoadingCountVariations: Story = {
  name: 'Loading Count Variations',
  render: () => ({
    components: { MznCardGroup },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px">
        <div>
          <h4 style="margin: 0 0 16px 0">loadingCount: 1</h4>
          <MznCardGroup loading :loading-count="1" loading-type="quick-action" />
        </div>

        <div>
          <h4 style="margin: 0 0 16px 0">loadingCount: 3 (default)</h4>
          <MznCardGroup loading :loading-count="3" loading-type="quick-action" />
        </div>

        <div>
          <h4 style="margin: 0 0 16px 0">loadingCount: 6</h4>
          <MznCardGroup loading :loading-count="6" loading-type="quick-action" />
        </div>
      </div>
    `,
  }),
};

export const CustomThumbnailSkeletonSize: Story = {
  name: 'Custom Thumbnail Skeleton Size',
  render: () => ({
    components: { MznCardGroup },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px">
        <div>
          <h4 style="margin: 0 0 16px 0">SingleThumbnail: Custom width (160px) and aspect ratio (4/3)</h4>
          <MznCardGroup
            loading
            :loading-count="2"
            loading-thumbnail-aspect-ratio="4/3"
            :loading-thumbnail-width="160"
            loading-type="single-thumbnail"
          />
        </div>

        <div>
          <h4 style="margin: 0 0 16px 0">FourThumbnail: Custom width (100px)</h4>
          <MznCardGroup
            loading
            :loading-count="2"
            :loading-thumbnail-width="100"
            loading-type="four-thumbnail"
          />
        </div>
      </div>
    `,
  }),
};
