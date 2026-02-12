'use client';

import { Meta, StoryObj } from '@storybook/react-webpack5';
import { CalendarIcon } from '@mezzanine-ui/icons';

import {
  BaseCardGeneric as BaseCard,
  CardGroup,
  QuickActionCardGeneric as QuickActionCard,
  SingleThumbnailCardGeneric as SingleThumbnailCard,
  FourThumbnailCardGeneric as FourThumbnailCard,
  Thumbnail,
} from '.';
import type { CardGroupProps } from './CardGroup';

export default {
  title: 'Data Display/Card/CardGroup',
  component: CardGroup,
} satisfies Meta<typeof CardGroup>;

type Story = StoryObj<CardGroupProps>;

export const LoadingBaseCard: Story = {
  name: 'Loading Type: base',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loading State (3 skeletons)</h4>
        <CardGroup loading loadingCount={3} loadingType="base">
          <BaseCard description="A simple card" title="Card 1" type="default">
            Content for card 1
          </BaseCard>
        </CardGroup>
      </div>
    </div>
  ),
};

export const LoadingQuickActionCard: Story = {
  name: 'Loading Type: quick action',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loading State (3 skeletons)</h4>
        <CardGroup loading loadingCount={3} loadingType="quick-action">
          <QuickActionCard
            icon={CalendarIcon}
            subtitle="Set up a new meeting"
            title="Schedule Meeting"
          />
        </CardGroup>
      </div>
    </div>
  ),
};

export const LoadingSingleThumbnailCard: Story = {
  name: 'Loading: SingleThumbnailCard',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loading State (3 skeletons)</h4>
        <CardGroup
          loading
          loadingCount={3}
          loadingType="single-thumbnail"
          loadingThumbnailWidth={360}
          loadingThumbnailAspectRatio="360/240"
        >
          <SingleThumbnailCard
            subtitle="Uploaded yesterday"
            title="Product Image 1"
            type="default"
          >
            <img
              alt="Sample thumbnail 1"
              src="https://picsum.photos/seed/1/360/240"
              style={{
                display: 'block',
                height: '100%',
                objectFit: 'cover',
                width: '100%',
              }}
            />
          </SingleThumbnailCard>
        </CardGroup>
      </div>
    </div>
  ),
};

export const LoadingFourThumbnailCard: Story = {
  name: 'Loading: FourThumbnailCard',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loading State (3 skeletons)</h4>
        <CardGroup
          loading
          loadingCount={3}
          loadingType="four-thumbnail"
          loadingThumbnailWidth={160}
        >
          <FourThumbnailCard
            subtitle="4 items"
            title="Photo Album A"
            type="default"
          >
            <Thumbnail>
              <img
                alt="Album A - Item 1"
                src="https://picsum.photos/seed/a1/160/160"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album A - Item 2"
                src="https://picsum.photos/seed/a2/160/160"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album A - Item 3"
                src="https://picsum.photos/seed/a3/160/160"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album A - Item 4"
                src="https://picsum.photos/seed/a4/160/160"
              />
            </Thumbnail>
          </FourThumbnailCard>
        </CardGroup>
      </div>
    </div>
  ),
};

export const LoadingCountVariations: Story = {
  name: 'Loading Count Variations',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>loadingCount: 1</h4>
        <CardGroup loading loadingCount={1} loadingType="quick-action" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>loadingCount: 3 (default)</h4>
        <CardGroup loading loadingCount={3} loadingType="quick-action" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>loadingCount: 6</h4>
        <CardGroup loading loadingCount={6} loadingType="quick-action" />
      </div>
    </div>
  ),
};

export const CustomThumbnailSkeletonSize: Story = {
  name: 'Custom Thumbnail Skeleton Size',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>
          SingleThumbnail: Custom width (160px) and aspect ratio (4/3)
        </h4>
        <CardGroup
          loading
          loadingCount={2}
          loadingThumbnailAspectRatio="4/3"
          loadingThumbnailWidth={160}
          loadingType="single-thumbnail"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>
          FourThumbnail: Custom width (100px)
        </h4>
        <CardGroup
          loading
          loadingCount={2}
          loadingThumbnailWidth={100}
          loadingType="four-thumbnail"
        />
      </div>
    </div>
  ),
};
