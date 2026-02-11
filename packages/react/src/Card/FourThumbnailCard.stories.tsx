import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';

import {
  CardGroup,
  FourThumbnailCardGeneric as FourThumbnailCard,
  ThumbnailGeneric as Thumbnail,
} from '.';
import type { FourThumbnailCardComponentProps } from './FourThumbnailCard';

export default {
  title: 'Data Display/Card/FourThumbnailCard',
  component: FourThumbnailCard,
} satisfies Meta<typeof FourThumbnailCard>;

type Story = StoryObj<FourThumbnailCardComponentProps>;

const createSampleImage = (seed: number) => (
  <img
    alt={`Sample thumbnail ${seed}`}
    src={`https://picsum.photos/seed/${seed}/320/240`}
    style={{
      display: 'block',
      objectFit: 'cover',
      width: '160px',
      height: '120px',
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
    subtitle: '4 items',
    tag: 'Album',
    title: 'Photo Collection',
    type: 'default',
  },
  render: (props) => (
    <div style={{ width: '320px' }}>
      <FourThumbnailCard
        {...props}
        personalActionActiveIcon={StarFilledIcon}
        personalActionIcon={StarOutlineIcon}
        title={props.title || ''}
      >
        <Thumbnail title="Photo 1">{createSampleImage(1)}</Thumbnail>
        <Thumbnail title="Photo 2">{createSampleImage(2)}</Thumbnail>
        <Thumbnail title="Photo 3">{createSampleImage(3)}</Thumbnail>
        <Thumbnail title="Photo 4">{createSampleImage(4)}</Thumbnail>
      </FourThumbnailCard>
    </div>
  ),
};

export const TypeDefault: Story = {
  name: 'Type: Default',
  render: () => (
    <div style={{ width: '320px' }}>
      <FourThumbnailCard
        filetype="jpg"
        subtitle="4 photos"
        title="Vacation Photos"
      >
        <Thumbnail title="Beach">{createSampleImage(10)}</Thumbnail>
        <Thumbnail title="Mountain">{createSampleImage(11)}</Thumbnail>
        <Thumbnail title="City">{createSampleImage(12)}</Thumbnail>
        <Thumbnail title="Forest">{createSampleImage(13)}</Thumbnail>
      </FourThumbnailCard>
    </div>
  ),
};

export const TypeAction: Story = {
  name: 'Type: Action',
  render: () => (
    <div style={{ width: '320px' }}>
      <FourThumbnailCard
        actionName="View All"
        filetype="png"
        onActionClick={() => alert('View all clicked')}
        subtitle="4 images"
        title="Design Assets"
        type="action"
      >
        <Thumbnail title="Logo">{createSampleImage(20)}</Thumbnail>
        <Thumbnail title="Banner">{createSampleImage(21)}</Thumbnail>
        <Thumbnail title="Icon">{createSampleImage(22)}</Thumbnail>
        <Thumbnail title="Background">{createSampleImage(23)}</Thumbnail>
      </FourThumbnailCard>
    </div>
  ),
};

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  render: () => (
    <div style={{ width: '320px' }}>
      <FourThumbnailCard
        filetype="zip"
        onOptionSelect={(option) => alert(`Selected: ${option.name}`)}
        options={[
          { id: 'download', name: 'Download All' },
          { id: 'share', name: 'Share' },
          { id: 'delete', name: 'Delete' },
        ]}
        subtitle="4 files"
        title="Project Archive"
        type="overflow"
      >
        <Thumbnail title="File 1">{createSampleImage(30)}</Thumbnail>
        <Thumbnail title="File 2">{createSampleImage(31)}</Thumbnail>
        <Thumbnail title="File 3">{createSampleImage(32)}</Thumbnail>
        <Thumbnail title="File 4">{createSampleImage(33)}</Thumbnail>
      </FourThumbnailCard>
    </div>
  ),
};

export const WithTag: Story = {
  name: 'With Tag',
  render: () => (
    <div style={{ width: '320px' }}>
      <FourThumbnailCard subtitle="4 videos" tag="Featured" title="Video Album">
        <Thumbnail title="Intro">{createSampleImage(40)}</Thumbnail>
        <Thumbnail title="Main">{createSampleImage(41)}</Thumbnail>
        <Thumbnail title="Outro">{createSampleImage(42)}</Thumbnail>
        <Thumbnail title="Bonus">{createSampleImage(43)}</Thumbnail>
      </FourThumbnailCard>
    </div>
  ),
};

export const WithPersonalAction: Story = {
  name: 'With Personal Action',
  render: function PersonalActionCard() {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
      <div style={{ width: '320px' }}>
        <FourThumbnailCard
          personalActionActive={isFavorite}
          personalActionActiveIcon={StarFilledIcon}
          personalActionIcon={StarOutlineIcon}
          personalActionOnClick={() => setIsFavorite(!isFavorite)}
          subtitle="4 artworks"
          title="Art Collection"
        >
          <Thumbnail title="Painting 1">{createSampleImage(50)}</Thumbnail>
          <Thumbnail title="Painting 2">{createSampleImage(51)}</Thumbnail>
          <Thumbnail title="Painting 3">{createSampleImage(52)}</Thumbnail>
          <Thumbnail title="Painting 4">{createSampleImage(53)}</Thumbnail>
        </FourThumbnailCard>
      </div>
    );
  },
};

export const WithLessThanFourThumbnails: Story = {
  name: 'With Less Than 4 Thumbnails',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ width: '320px' }}>
        <h4 style={{ marginBottom: '8px' }}>3 Thumbnails</h4>
        <FourThumbnailCard subtitle="3 photos" title="Three Photos">
          <Thumbnail title="Photo 1">{createSampleImage(60)}</Thumbnail>
          <Thumbnail title="Photo 2">{createSampleImage(61)}</Thumbnail>
          <Thumbnail title="Photo 3">{createSampleImage(62)}</Thumbnail>
        </FourThumbnailCard>
      </div>
      <div style={{ width: '320px' }}>
        <h4 style={{ marginBottom: '8px' }}>2 Thumbnails</h4>
        <FourThumbnailCard subtitle="2 photos" title="Two Photos">
          <Thumbnail title="Photo 1">{createSampleImage(70)}</Thumbnail>
          <Thumbnail title="Photo 2">{createSampleImage(71)}</Thumbnail>
        </FourThumbnailCard>
      </div>
      <div style={{ width: '320px' }}>
        <h4 style={{ marginBottom: '8px' }}>1 Thumbnail</h4>
        <FourThumbnailCard subtitle="1 photo" title="One Photo">
          <Thumbnail title="Photo 1">{createSampleImage(80)}</Thumbnail>
        </FourThumbnailCard>
      </div>
    </div>
  ),
};

export const FiletypeVariants: Story = {
  name: 'Filetype Variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ width: '300px' }}>
        <FourThumbnailCard filetype="jpg" subtitle="Image" title="Photos Album">
          <Thumbnail>{createSampleImage(100)}</Thumbnail>
          <Thumbnail>{createSampleImage(101)}</Thumbnail>
          <Thumbnail>{createSampleImage(102)}</Thumbnail>
          <Thumbnail>{createSampleImage(103)}</Thumbnail>
        </FourThumbnailCard>
      </div>
      <div style={{ width: '300px' }}>
        <FourThumbnailCard filetype="mp4" subtitle="Media" title="Video Album">
          <Thumbnail>{createSampleImage(110)}</Thumbnail>
          <Thumbnail>{createSampleImage(111)}</Thumbnail>
          <Thumbnail>{createSampleImage(112)}</Thumbnail>
          <Thumbnail>{createSampleImage(113)}</Thumbnail>
        </FourThumbnailCard>
      </div>
      <div style={{ width: '300px' }}>
        <FourThumbnailCard
          filetype="docx"
          subtitle="Document"
          title="Documents"
        >
          <Thumbnail>{createSampleImage(120)}</Thumbnail>
          <Thumbnail>{createSampleImage(121)}</Thumbnail>
          <Thumbnail>{createSampleImage(122)}</Thumbnail>
          <Thumbnail>{createSampleImage(123)}</Thumbnail>
        </FourThumbnailCard>
      </div>
      <div style={{ width: '300px' }}>
        <FourThumbnailCard filetype="zip" subtitle="Archive" title="Archives">
          <Thumbnail>{createSampleImage(130)}</Thumbnail>
          <Thumbnail>{createSampleImage(131)}</Thumbnail>
          <Thumbnail>{createSampleImage(132)}</Thumbnail>
          <Thumbnail>{createSampleImage(133)}</Thumbnail>
        </FourThumbnailCard>
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
        <FourThumbnailCard
          actionName="View Details"
          filetype="jpg"
          onActionClick={() => alert('View details clicked')}
          personalActionActive={isFavorite}
          personalActionActiveIcon={StarFilledIcon}
          personalActionIcon={StarOutlineIcon}
          personalActionOnClick={() => setIsFavorite(!isFavorite)}
          subtitle="Updated: 2024/01/15 • 4 items"
          tag="Important"
          title="Q4 2024 Marketing Assets"
          type="action"
        >
          <Thumbnail<'a'>
            component="a"
            href="https://rytass.com/about"
            target="_blank"
            title="Link 1"
          >
            {createSampleImage(200)}
          </Thumbnail>
          <Thumbnail<'a'>
            component="a"
            href="https://rytass.com/projects/NTCH"
            target="_blank"
            title="Link 2"
          >
            {createSampleImage(201)}
          </Thumbnail>
          <Thumbnail<'a'>
            component="a"
            href="https://rytass.com/projects/TASA"
            target="_blank"
            title="Link 3"
          >
            {createSampleImage(202)}
          </Thumbnail>
          <Thumbnail<'a'>
            component="a"
            href="https://rytass.com/projects/ICC"
            target="_blank"
            title="Link 4"
          >
            {createSampleImage(203)}
          </Thumbnail>
        </FourThumbnailCard>
      </div>
    );
  },
};

export const InCardGroup: Story = {
  name: 'In Card Group',
  render: () => (
    <CardGroup>
      <FourThumbnailCard filetype="jpg" subtitle="4 photos" title="Album 1">
        <Thumbnail title="Photo 1">{createSampleImage(300)}</Thumbnail>
        <Thumbnail title="Photo 2">{createSampleImage(301)}</Thumbnail>
        <Thumbnail title="Photo 3">{createSampleImage(302)}</Thumbnail>
        <Thumbnail title="Photo 4">{createSampleImage(303)}</Thumbnail>
      </FourThumbnailCard>
      <FourThumbnailCard filetype="png" subtitle="4 images" title="Album 2">
        <Thumbnail title="Image 1">{createSampleImage(310)}</Thumbnail>
        <Thumbnail title="Image 2">{createSampleImage(311)}</Thumbnail>
        <Thumbnail title="Image 3">{createSampleImage(312)}</Thumbnail>
        <Thumbnail title="Image 4">{createSampleImage(313)}</Thumbnail>
      </FourThumbnailCard>
      <FourThumbnailCard filetype="gif" subtitle="4 gifs" title="Album 3">
        <Thumbnail title="GIF 1">{createSampleImage(320)}</Thumbnail>
        <Thumbnail title="GIF 2">{createSampleImage(321)}</Thumbnail>
        <Thumbnail title="GIF 3">{createSampleImage(322)}</Thumbnail>
        <Thumbnail title="GIF 4">{createSampleImage(323)}</Thumbnail>
      </FourThumbnailCard>
    </CardGroup>
  ),
};

export const ThumbnailAsLink: Story = {
  name: 'Thumbnail As Link',
  render: () => (
    <div style={{ width: '320px' }}>
      <FourThumbnailCard
        filetype="jpg"
        subtitle="Click each thumbnail"
        title="Clickable Thumbnails"
      >
        <Thumbnail<'a'>
          component="a"
          href="https://rytass.com/projects/TASA"
          target="_blank"
          title="Link 1"
        >
          {createSampleImage(400)}
        </Thumbnail>
        <Thumbnail<'a'>
          component="a"
          href="https://rytass.com"
          target="_blank"
          title="Link 2"
        >
          {createSampleImage(401)}
        </Thumbnail>
        <Thumbnail<'a'>
          component="a"
          href="https://rytass.com"
          target="_blank"
          title="Link 3"
        >
          {createSampleImage(402)}
        </Thumbnail>
        <Thumbnail<'a'>
          component="a"
          href="https://rytass.com"
          target="_blank"
          title="Link 4"
        >
          {createSampleImage(403)}
        </Thumbnail>
      </FourThumbnailCard>
    </div>
  ),
};

export const ThumbnailAsButton: Story = {
  name: 'Thumbnail As Button',
  render: () => (
    <div style={{ width: '320px' }}>
      <FourThumbnailCard
        filetype="jpg"
        subtitle="Click each thumbnail"
        title="Button Thumbnails"
      >
        <Thumbnail<'button'>
          component="button"
          onClick={() => alert('Clicked thumbnail 1')}
          title="Button 1"
          type="button"
        >
          {createSampleImage(500)}
        </Thumbnail>
        <Thumbnail<'button'>
          component="button"
          onClick={() => alert('Clicked thumbnail 2')}
          title="Button 2"
          type="button"
        >
          {createSampleImage(501)}
        </Thumbnail>
        <Thumbnail<'button'>
          component="button"
          onClick={() => alert('Clicked thumbnail 3')}
          title="Button 3"
          type="button"
        >
          {createSampleImage(502)}
        </Thumbnail>
        <Thumbnail<'button'>
          component="button"
          onClick={() => alert('Clicked thumbnail 4')}
          title="Button 4"
          type="button"
        >
          {createSampleImage(503)}
        </Thumbnail>
      </FourThumbnailCard>
    </div>
  ),
};

export const CardAsLink: Story = {
  name: 'Card As Link, Thumbnail As Button',
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{ width: '320px' }}>
        <FourThumbnailCard<'a'>
          component="a"
          filetype="jpg"
          href="https://rytass.com/"
          subtitle="Click the card"
          target="_blank"
          title="External Link Card"
        >
          <Thumbnail<'button'>
            type="button"
            onClick={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              alert('Photo 1 clicked');
            }}
            title="Photo 1"
          >
            {createSampleImage(600)}
          </Thumbnail>
          <Thumbnail<'button'>
            type="button"
            onClick={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              alert('Photo 2 clicked');
            }}
            title="Photo 2"
          >
            {createSampleImage(601)}
          </Thumbnail>
          <Thumbnail<'button'>
            type="button"
            onClick={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              alert('Photo 3 clicked');
            }}
            title="Photo 3"
          >
            {createSampleImage(602)}
          </Thumbnail>
          <Thumbnail<'button'>
            type="button"
            onClick={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              alert('Photo 4 clicked');
            }}
            title="Photo 4"
          >
            {createSampleImage(603)}
          </Thumbnail>
        </FourThumbnailCard>
      </div>
    </div>
  ),
};
