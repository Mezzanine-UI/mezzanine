import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznBaseCard } from './base-card.component';
import { MznCardGroup } from './card-group.component';
import { MznQuickActionCard } from './quick-action-card.component';
import { MznSingleThumbnailCard } from '@mezzanine-ui/ng/single-thumbnail-card';
import { MznFourThumbnailCard } from '@mezzanine-ui/ng/four-thumbnail-card';
import { MznThumbnail } from '@mezzanine-ui/ng/thumbnail';
import { CalendarIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Data Display/Card/CardGroup',
  decorators: [
    moduleMetadata({
      imports: [
        MznBaseCard,
        MznCardGroup,
        MznQuickActionCard,
        MznSingleThumbnailCard,
        MznFourThumbnailCard,
        MznThumbnail,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const LoadingBaseCard: Story = {
  name: 'Loading Type: base',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4 style="margin: 0 0 16px 0;">Loading State (3 skeletons)</h4>
          <mzn-card-group [loading]="true" [loadingCount]="3" cardType="base">
            <mzn-base-card description="A simple card" title="Card 1">
              Content for card 1
            </mzn-base-card>
          </mzn-card-group>
        </div>
      </div>
    `,
  }),
};

export const LoadingQuickActionCard: Story = {
  name: 'Loading Type: quick action',
  render: () => ({
    props: { calendarIcon: CalendarIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4 style="margin: 0 0 16px 0;">Loading State (3 skeletons)</h4>
          <mzn-card-group [loading]="true" [loadingCount]="3" cardType="quick-action">
            <mzn-quick-action-card
              [icon]="calendarIcon"
              subtitle="Set up a new meeting"
              title="Schedule Meeting"
            />
          </mzn-card-group>
        </div>
      </div>
    `,
  }),
};

export const LoadingSingleThumbnailCard: Story = {
  name: 'Loading Type: single thumbnail',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4 style="margin: 0 0 16px 0;">Loading State (3 skeletons)</h4>
          <mzn-card-group
            [loading]="true"
            [loadingCount]="3"
            cardType="single-thumbnail"
            [loadingThumbnailWidth]="360"
            loadingThumbnailAspectRatio="360/240"
          >
            <mzn-single-thumbnail-card
              subtitle="Uploaded yesterday"
              title="Product Image 1"
            >
              <img
                alt="Sample thumbnail 1"
                src="https://picsum.photos/seed/1/360/240"
                style="display: block; height: 100%; object-fit: cover; width: 100%;"
              />
            </mzn-single-thumbnail-card>
          </mzn-card-group>
        </div>
      </div>
    `,
  }),
};

export const LoadingFourThumbnailCard: Story = {
  name: 'Loading Type: four thumbnail',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h4 style="margin: 0 0 16px 0;">Loading State (3 skeletons)</h4>
          <mzn-card-group
            [loading]="true"
            [loadingCount]="3"
            cardType="four-thumbnail"
            [loadingThumbnailWidth]="160"
          >
            <mzn-four-thumbnail-card
              subtitle="4 items"
              title="Photo Album A"
            >
              <mzn-thumbnail>
                <img alt="Album A - Item 1" src="https://picsum.photos/seed/a1/160/160" />
              </mzn-thumbnail>
              <mzn-thumbnail>
                <img alt="Album A - Item 2" src="https://picsum.photos/seed/a2/160/160" />
              </mzn-thumbnail>
              <mzn-thumbnail>
                <img alt="Album A - Item 3" src="https://picsum.photos/seed/a3/160/160" />
              </mzn-thumbnail>
              <mzn-thumbnail>
                <img alt="Album A - Item 4" src="https://picsum.photos/seed/a4/160/160" />
              </mzn-thumbnail>
            </mzn-four-thumbnail-card>
          </mzn-card-group>
        </div>
      </div>
    `,
  }),
};

export const LoadingCountVariations: Story = {
  name: 'Loading Count Variations',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h4 style="margin: 0 0 16px 0;">loadingCount: 1</h4>
          <mzn-card-group [loading]="true" [loadingCount]="1" cardType="quick-action" />
        </div>
        <div>
          <h4 style="margin: 0 0 16px 0;">loadingCount: 3 (default)</h4>
          <mzn-card-group [loading]="true" [loadingCount]="3" cardType="quick-action" />
        </div>
        <div>
          <h4 style="margin: 0 0 16px 0;">loadingCount: 6</h4>
          <mzn-card-group [loading]="true" [loadingCount]="6" cardType="quick-action" />
        </div>
      </div>
    `,
  }),
};

export const CustomThumbnailSkeletonSize: Story = {
  name: 'Custom Thumbnail Skeleton Size',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h4 style="margin: 0 0 16px 0;">SingleThumbnail: Custom width (160px) and aspect ratio (4/3)</h4>
          <mzn-card-group
            [loading]="true"
            [loadingCount]="2"
            loadingThumbnailAspectRatio="4/3"
            [loadingThumbnailWidth]="160"
            cardType="single-thumbnail"
          />
        </div>
        <div>
          <h4 style="margin: 0 0 16px 0;">FourThumbnail: Custom width (100px)</h4>
          <mzn-card-group
            [loading]="true"
            [loadingCount]="2"
            [loadingThumbnailWidth]="100"
            cardType="four-thumbnail"
          />
        </div>
      </div>
    `,
  }),
};
