import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';

import { CardGroup, SingleThumbnailCard, SingleThumbnailCardGeneric } from '.';
import type { SingleThumbnailCardComponentProps } from './SingleThumbnailCard';

export default {
  title: 'Data Display/Card/SingleThumbnailCard',
  component: SingleThumbnailCard,
} satisfies Meta<typeof SingleThumbnailCard>;

type Story = StoryObj<SingleThumbnailCardComponentProps>;

const sampleImage = (
  <img
    alt="Sample thumbnail"
    src="https://picsum.photos/320/180"
    style={{
      display: 'block',
      width: '100%',
      aspectRatio: '320/180',
      objectFit: 'cover',
    }}
  />
);

export const Playground: Story = {
  argTypes: {
    filetype: {
      control: { type: 'text' },
    },
    personalActionActive: {
      control: { type: 'boolean' },
    },
    subtitle: {
      control: { type: 'text' },
    },
    tag: {
      control: { type: 'text' },
    },
    title: {
      control: { type: 'text' },
    },
    type: {
      control: { type: 'select' },
      options: ['default', 'action', 'overflow'],
    },
  },
  args: {
    filetype: '',
    personalActionActive: false,
    subtitle: '2024/01/15',
    tag: 'New',
    title: 'Document Title',
    type: 'default',
  },
  render: (props) => (
    <div style={{ width: '320px' }}>
      <SingleThumbnailCard
        {...props}
        title={props.title || ''}
        personalActionActiveIcon={StarFilledIcon}
        personalActionIcon={StarOutlineIcon}
      >
        {sampleImage}
      </SingleThumbnailCard>
    </div>
  ),
};

export const TypeDefault: Story = {
  name: 'Type: Default',
  render: () => (
    <div style={{ width: '320px' }}>
      <SingleThumbnailCard
        filetype="jpg"
        subtitle="1920x1080"
        title="landscape-photo.jpg"
      >
        {sampleImage}
      </SingleThumbnailCard>
    </div>
  ),
};

export const TypeAction: Story = {
  name: 'Type: Action',
  render: () => (
    <div style={{ width: '320px' }}>
      <SingleThumbnailCard
        actionName="Download"
        filetype="pdf"
        onActionClick={() => alert('Download clicked')}
        subtitle="2.4 MB"
        title="report-2024.pdf"
        type="action"
      >
        {sampleImage}
      </SingleThumbnailCard>
    </div>
  ),
};

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  render: () => (
    <div style={{ width: '320px' }}>
      <SingleThumbnailCard
        filetype="zip"
        onOptionSelect={(option) => alert(`Selected: ${option.name}`)}
        options={[
          { id: 'download', name: 'Download' },
          { id: 'share', name: 'Share' },
          { id: 'delete', name: 'Delete' },
        ]}
        subtitle="15.2 MB"
        title="project-files.zip"
        type="overflow"
      >
        {sampleImage}
      </SingleThumbnailCard>
    </div>
  ),
};

export const WithTag: Story = {
  name: 'With Tag',
  render: () => (
    <div style={{ width: '320px' }}>
      <SingleThumbnailCard
        subtitle="Duration: 5:30"
        tag="Featured"
        title="promotional-video.mp4"
      >
        {sampleImage}
      </SingleThumbnailCard>
    </div>
  ),
};

export const WithPersonalAction: Story = {
  name: 'With Personal Action',
  render: function PersonalActionCard() {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
      <div style={{ width: '320px' }}>
        <SingleThumbnailCard
          personalActionActive={isFavorite}
          personalActionActiveIcon={StarFilledIcon}
          personalActionIcon={StarOutlineIcon}
          personalActionOnClick={() => setIsFavorite(!isFavorite)}
          subtitle="800x600"
          title="artwork.png"
        >
          {sampleImage}
        </SingleThumbnailCard>
      </div>
    );
  },
};

export const FiletypeVariants: Story = {
  name: 'Filetype Variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ width: '200px' }}>
        <SingleThumbnailCard filetype="jpg" subtitle="Image" title="photo.jpg">
          {sampleImage}
        </SingleThumbnailCard>
      </div>
      <div style={{ width: '200px' }}>
        <SingleThumbnailCard filetype="mp4" subtitle="Media" title="video.mp4">
          {sampleImage}
        </SingleThumbnailCard>
      </div>
      <div style={{ width: '200px' }}>
        <SingleThumbnailCard
          filetype="docx"
          subtitle="Document"
          title="report.docx"
        >
          {sampleImage}
        </SingleThumbnailCard>
      </div>
      <div style={{ width: '200px' }}>
        <SingleThumbnailCard
          filetype="zip"
          subtitle="Archive"
          title="backup.zip"
        >
          {sampleImage}
        </SingleThumbnailCard>
      </div>
      <div style={{ width: '200px' }}>
        <SingleThumbnailCard filetype="ts" subtitle="Code" title="index.ts">
          {sampleImage}
        </SingleThumbnailCard>
      </div>
      <div style={{ width: '200px' }}>
        <SingleThumbnailCard filetype="ini" subtitle="System" title="setup.ini">
          {sampleImage}
        </SingleThumbnailCard>
      </div>
      <div style={{ width: '200px' }}>
        <SingleThumbnailCard filetype="xyz" subtitle="Unknown" title="file.xyz">
          {sampleImage}
        </SingleThumbnailCard>
      </div>
    </div>
  ),
};

export const FullFeatured: Story = {
  name: 'Full Featured',
  render: function FullFeaturedCard() {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
      <div style={{ width: '320px' }}>
        <SingleThumbnailCard
          actionName="View Details"
          filetype="pdf"
          onActionClick={() => alert('View details clicked')}
          personalActionActive={isFavorite}
          personalActionActiveIcon={StarFilledIcon}
          personalActionIcon={StarOutlineIcon}
          personalActionOnClick={() => setIsFavorite(!isFavorite)}
          subtitle="Updated: 2024/01/15 • 2.4 MB"
          tag="Important"
          title="quarterly-report-q4-2024.pdf"
          type="action"
        >
          {sampleImage}
        </SingleThumbnailCard>
      </div>
    );
  },
};

export const InCardGroup: Story = {
  name: 'In Card Group',
  render: () => (
    <CardGroup>
      <SingleThumbnailCard
        filetype="jpg"
        subtitle="1920x1080"
        title="landscape.jpg"
      >
        {sampleImage}
      </SingleThumbnailCard>
      <SingleThumbnailCard
        filetype="png"
        subtitle={`尺寸: 800x600\n大小: 1.2 MB`}
        title="portrait.png"
      >
        {sampleImage}
      </SingleThumbnailCard>
      <SingleThumbnailCard
        filetype="gif"
        subtitle="400x300"
        title="animation.gif"
      >
        {sampleImage}
      </SingleThumbnailCard>
      <SingleThumbnailCard
        filetype="webp"
        subtitle="1200x800"
        title="optimized.webp"
      >
        {sampleImage}
      </SingleThumbnailCard>
    </CardGroup>
  ),
};

export const AsLink: Story = {
  name: 'As Link',
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{ width: '320px' }}>
        <SingleThumbnailCardGeneric<'a'>
          component="a"
          filetype="pdf"
          href="https://rytass.com/"
          subtitle="Click to open in new tab"
          target="_blank"
          title="external-link.pdf"
        >
          {sampleImage}
        </SingleThumbnailCardGeneric>
      </div>
    </div>
  ),
};
