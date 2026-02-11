'use client';

import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import {
  CalendarIcon,
  FileIcon,
  FolderIcon,
  UserIcon,
} from '@mezzanine-ui/icons';

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

export const Playground: Story = {
  argTypes: {
    loading: {
      control: { type: 'boolean' },
    },
    loadingCount: {
      control: { type: 'number' },
    },
    loadingType: {
      options: ['base', 'quick-action', 'single-thumbnail', 'four-thumbnail'],
      control: { type: 'select' },
    },
  },
  args: {
    loading: false,
    loadingCount: 3,
    loadingType: 'base',
  },
  render: (props) => (
    <div style={{ width: '100%' }}>
      <CardGroup {...props}>
        <BaseCard description="A simple card" title="Card 1" type="default">
          Content for card 1
        </BaseCard>
        <BaseCard description="Another card" title="Card 2" type="default">
          Content for card 2
        </BaseCard>
      </CardGroup>
    </div>
  ),
};

export const LoadingBaseCard: Story = {
  name: 'Loading: BaseCard',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loading State (3 skeletons)</h4>
        <CardGroup loading loadingCount={3} loadingType="base" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loading State (5 skeletons)</h4>
        <CardGroup loading loadingCount={5} loadingType="base" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loaded Content</h4>
        <CardGroup loadingType="base">
          <BaseCard
            description="Basic settings and preferences"
            title="Settings"
            type="default"
          >
            Manage your account settings.
          </BaseCard>
          <BaseCard
            description="User profile information"
            title="Profile"
            type="default"
          >
            View and edit your profile.
          </BaseCard>
          <BaseCard
            description="Security and privacy"
            title="Security"
            type="default"
          >
            Manage security settings.
          </BaseCard>
        </CardGroup>
      </div>
    </div>
  ),
};

export const LoadingQuickActionCard: Story = {
  name: 'Loading: QuickActionCard',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loading State (4 skeletons)</h4>
        <CardGroup loading loadingCount={4} loadingType="quick-action" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loaded Content</h4>
        <CardGroup loadingType="quick-action">
          <QuickActionCard
            icon={CalendarIcon}
            subtitle="View your calendar"
            title="Calendar"
          />
          <QuickActionCard
            icon={FileIcon}
            subtitle="Browse documents"
            title="Files"
          />
          <QuickActionCard
            icon={FolderIcon}
            subtitle="Organize your data"
            title="Folders"
          />
          <QuickActionCard
            icon={UserIcon}
            subtitle="Manage users"
            title="Users"
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
        <CardGroup loading loadingCount={3} loadingType="single-thumbnail" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loaded Content</h4>
        <CardGroup loadingType="single-thumbnail">
          <SingleThumbnailCard
            subtitle="Uploaded yesterday"
            title="Product Image 1"
            type="default"
          >
            <img
              alt="Sample thumbnail 1"
              src="https://picsum.photos/seed/1/400/300"
            />
          </SingleThumbnailCard>
          <SingleThumbnailCard
            subtitle="Uploaded last week"
            title="Product Image 2"
            type="default"
          >
            <img
              alt="Sample thumbnail 2"
              src="https://picsum.photos/seed/2/400/300"
            />
          </SingleThumbnailCard>
          <SingleThumbnailCard
            subtitle="Uploaded today"
            title="Product Image 3"
            type="default"
          >
            <img
              alt="Sample thumbnail 3"
              src="https://picsum.photos/seed/3/400/300"
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
        <CardGroup loading loadingCount={3} loadingType="four-thumbnail" />
      </div>

      <div>
        <h4 style={{ margin: '0 0 16px 0' }}>Loaded Content</h4>
        <CardGroup loadingType="four-thumbnail">
          <FourThumbnailCard
            subtitle="4 items"
            title="Photo Album A"
            type="default"
          >
            <Thumbnail>
              <img
                alt="Album A - Item 1"
                src="https://picsum.photos/seed/a1/200/200"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album A - Item 2"
                src="https://picsum.photos/seed/a2/200/200"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album A - Item 3"
                src="https://picsum.photos/seed/a3/200/200"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album A - Item 4"
                src="https://picsum.photos/seed/a4/200/200"
              />
            </Thumbnail>
          </FourThumbnailCard>
          <FourThumbnailCard
            subtitle="4 items"
            title="Photo Album B"
            type="default"
          >
            <Thumbnail>
              <img
                alt="Album B - Item 1"
                src="https://picsum.photos/seed/b1/200/200"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album B - Item 2"
                src="https://picsum.photos/seed/b2/200/200"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album B - Item 3"
                src="https://picsum.photos/seed/b3/200/200"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album B - Item 4"
                src="https://picsum.photos/seed/b4/200/200"
              />
            </Thumbnail>
          </FourThumbnailCard>
          <FourThumbnailCard
            subtitle="2 items"
            title="Photo Album C"
            type="default"
          >
            <Thumbnail>
              <img
                alt="Album C - Item 1"
                src="https://picsum.photos/seed/c1/200/200"
              />
            </Thumbnail>
            <Thumbnail>
              <img
                alt="Album C - Item 2"
                src="https://picsum.photos/seed/c2/200/200"
              />
            </Thumbnail>
          </FourThumbnailCard>
        </CardGroup>
      </div>
    </div>
  ),
};

export const LoadingWithExistingContent: Story = {
  name: 'Loading with Existing Content',
  render: function LoadingWithContentExample() {
    const [loading, setLoading] = useState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <button
          onClick={() => setLoading(!loading)}
          style={{
            alignSelf: 'flex-start',
            cursor: 'pointer',
            padding: '8px 16px',
          }}
          type="button"
        >
          Toggle Loading ({loading ? 'ON' : 'OFF'})
        </button>

        <div>
          <h4 style={{ margin: '0 0 16px 0' }}>
            Loading appends skeletons after existing content
          </h4>
          <CardGroup loading={loading} loadingCount={2} loadingType="base">
            <BaseCard
              description="This card is already loaded"
              title="Existing Card 1"
              type="default"
            >
              This content was loaded first.
            </BaseCard>
            <BaseCard
              description="Another existing card"
              title="Existing Card 2"
              type="default"
            >
              This content was also loaded.
            </BaseCard>
          </CardGroup>
        </div>
      </div>
    );
  },
};

export const AsyncLoadingSimulation: Story = {
  name: 'Async Loading Simulation',
  render: function AsyncLoadingExample() {
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState<Array<{ id: number; title: string }>>(
      [],
    );

    const loadMoreCards = () => {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        const newCards = [
          { id: Date.now(), title: `Card ${cards.length + 1}` },
          { id: Date.now() + 1, title: `Card ${cards.length + 2}` },
          { id: Date.now() + 2, title: `Card ${cards.length + 3}` },
        ];

        setCards((prev) => [...prev, ...newCards]);
        setLoading(false);
      }, 1500);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <button
          disabled={loading}
          onClick={loadMoreCards}
          style={{
            alignSelf: 'flex-start',
            cursor: loading ? 'not-allowed' : 'pointer',
            padding: '8px 16px',
          }}
          type="button"
        >
          {loading ? 'Loading...' : 'Load More Cards'}
        </button>

        <CardGroup loading={loading} loadingCount={3} loadingType="base">
          {cards.map((card) => (
            <BaseCard
              description={`Card ID: ${card.id}`}
              key={card.id}
              title={card.title}
              type="default"
            >
              Content loaded dynamically.
            </BaseCard>
          ))}
        </CardGroup>
      </div>
    );
  },
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

export const MixedCardTypes: Story = {
  name: 'Mixed Card Types (Not Recommended)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ color: '#666', margin: 0 }}>
        Note: Mixing different card types in a CardGroup is generally not
        recommended as they have different sizes and layouts. The group styling
        will be based on the first card type detected.
      </p>
      <CardGroup>
        <BaseCard
          description="Base card in group"
          title="BaseCard"
          type="default"
        >
          Some content here.
        </BaseCard>
        <BaseCard
          description="Another base card"
          title="BaseCard 2"
          type="default"
        >
          More content.
        </BaseCard>
      </CardGroup>
    </div>
  ),
};
