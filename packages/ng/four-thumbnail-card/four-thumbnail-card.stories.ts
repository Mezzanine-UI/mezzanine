import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznFourThumbnailCard } from './four-thumbnail-card.component';
import { MznThumbnail } from '@mezzanine-ui/ng/thumbnail';
import { MznCardGroup } from '@mezzanine-ui/ng/card';

const createSampleImage = (seed: number): string =>
  `<img alt="Sample thumbnail ${seed}" src="https://picsum.photos/seed/${seed}/320/240" style="display: block; object-fit: cover; width: 160px; height: 120px;" />`;

export default {
  title: 'Data Display/Card/FourThumbnailCard',
  component: MznFourThumbnailCard,
  decorators: [
    moduleMetadata({
      imports: [MznFourThumbnailCard, MznThumbnail, MznCardGroup],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    filetype: {
      control: { type: 'text' },
      description: 'File extension string for the filetype badge.',
    },
    personalActionActive: {
      control: { type: 'boolean' },
      description: 'Whether the personal action is in active state.',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtitle text shown in the info section.',
    },
    tag: {
      control: { type: 'text' },
      description: 'Optional tag label shown on top of the thumbnail grid.',
    },
    title: {
      control: { type: 'text' },
      description: 'Title text shown in the info section.',
    },
    type: {
      control: { type: 'select' },
      options: ['default', 'action', 'overflow'],
      description: 'Action mode of the info section.',
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
  render: (args) => ({
    props: {
      ...args,
      personalActionIcon: StarOutlineIcon,
      personalActionActiveIcon: StarFilledIcon,
    },
    template: `
      <div style="width: 320px;">
        <div mznFourThumbnailCard
          [filetype]="filetype"
          [personalActionActive]="personalActionActive"
          [personalActionIcon]="personalActionIcon"
          [personalActionActiveIcon]="personalActionActiveIcon"
          [subtitle]="subtitle"
          [tag]="tag"
          [title]="title || ''"
          [type]="type"
        >
          <div mznThumbnail title="Photo 1">${createSampleImage(1)}</div>
          <div mznThumbnail title="Photo 2">${createSampleImage(2)}</div>
          <div mznThumbnail title="Photo 3">${createSampleImage(3)}</div>
          <div mznThumbnail title="Photo 4">${createSampleImage(4)}</div>
        </div>
      </div>
    `,
  }),
};

export const TypeDefault: Story = {
  name: 'Type: Default',
  render: () => ({
    template: `
      <div style="width: 320px;">
        <div mznFourThumbnailCard
          filetype="jpg"
          subtitle="4 photos"
          title="Vacation Photos"
        >
          <div mznThumbnail title="Beach">${createSampleImage(10)}</div>
          <div mznThumbnail title="Mountain">${createSampleImage(11)}</div>
          <div mznThumbnail title="City">${createSampleImage(12)}</div>
          <div mznThumbnail title="Forest">${createSampleImage(13)}</div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: '[mznFourThumbnailCardTypeActionDemo]',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznFourThumbnailCard
      type="action"
      actionName="View All"
      filetype="png"
      subtitle="4 images"
      title="Design Assets"
      (actionClick)="onActionClick()"
    >
      <div mznThumbnail title="Logo">${createSampleImage(20)}</div>
      <div mznThumbnail title="Banner">${createSampleImage(21)}</div>
      <div mznThumbnail title="Icon">${createSampleImage(22)}</div>
      <div mznThumbnail title="Background">${createSampleImage(23)}</div>
    </div>
  `,
})
class FourThumbnailCardTypeActionDemoComponent {
  onActionClick(): void {
    alert('View all clicked');
  }
}

export const TypeAction: Story = {
  name: 'Type: Action',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardTypeActionDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznFourThumbnailCardTypeActionDemo></div>`,
  }),
};

@Component({
  selector: '[mznFourThumbnailCardTypeOverflowDemo]',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznFourThumbnailCard
      type="overflow"
      filetype="zip"
      subtitle="4 files"
      title="Project Archive"
      [options]="options"
      (optionSelect)="onOptionSelect($event)"
    >
      <div mznThumbnail title="File 1">${createSampleImage(30)}</div>
      <div mznThumbnail title="File 2">${createSampleImage(31)}</div>
      <div mznThumbnail title="File 3">${createSampleImage(32)}</div>
      <div mznThumbnail title="File 4">${createSampleImage(33)}</div>
    </div>
  `,
})
class FourThumbnailCardTypeOverflowDemoComponent {
  readonly options: ReadonlyArray<DropdownOption> = [
    { id: 'download', name: 'Download All' },
    { id: 'share', name: 'Share' },
    { id: 'delete', name: 'Delete' },
  ];

  onOptionSelect(option: DropdownOption): void {
    alert(`Selected: ${option.name}`);
  }
}

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardTypeOverflowDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznFourThumbnailCardTypeOverflowDemo></div>`,
  }),
};

export const WithTag: Story = {
  name: 'With Tag',
  render: () => ({
    template: `
      <div style="width: 320px;">
        <div mznFourThumbnailCard
          subtitle="4 videos"
          tag="Featured"
          title="Video Album"
        >
          <div mznThumbnail title="Intro">${createSampleImage(40)}</div>
          <div mznThumbnail title="Main">${createSampleImage(41)}</div>
          <div mznThumbnail title="Outro">${createSampleImage(42)}</div>
          <div mznThumbnail title="Bonus">${createSampleImage(43)}</div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: '[mznFourThumbnailCardWithPersonalActionDemo]',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznFourThumbnailCard
      [personalActionActive]="isFavorite()"
      [personalActionIcon]="starOutlineIcon"
      [personalActionActiveIcon]="starFilledIcon"
      (personalActionClick)="toggleFavorite()"
      subtitle="4 artworks"
      title="Art Collection"
    >
      <div mznThumbnail title="Painting 1">${createSampleImage(50)}</div>
      <div mznThumbnail title="Painting 2">${createSampleImage(51)}</div>
      <div mznThumbnail title="Painting 3">${createSampleImage(52)}</div>
      <div mznThumbnail title="Painting 4">${createSampleImage(53)}</div>
    </div>
  `,
})
class FourThumbnailCardWithPersonalActionDemoComponent {
  readonly starOutlineIcon = StarOutlineIcon;
  readonly starFilledIcon = StarFilledIcon;
  readonly isFavorite = signal(false);

  toggleFavorite(): void {
    this.isFavorite.update((v) => !v);
  }
}

export const WithPersonalAction: Story = {
  name: 'With Personal Action',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardWithPersonalActionDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznFourThumbnailCardWithPersonalActionDemo></div>`,
  }),
};

export const WithLessThanFourThumbnails: Story = {
  name: 'With Less Than 4 Thumbnails',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="width: 320px;">
          <h4 style="margin-bottom: 8px;">3 Thumbnails</h4>
          <div mznFourThumbnailCard subtitle="3 photos" title="Three Photos">
            <div mznThumbnail title="Photo 1">${createSampleImage(60)}</div>
            <div mznThumbnail title="Photo 2">${createSampleImage(61)}</div>
            <div mznThumbnail title="Photo 3">${createSampleImage(62)}</div>
          </div>
        </div>
        <div style="width: 320px;">
          <h4 style="margin-bottom: 8px;">2 Thumbnails</h4>
          <div mznFourThumbnailCard subtitle="2 photos" title="Two Photos">
            <div mznThumbnail title="Photo 1">${createSampleImage(70)}</div>
            <div mznThumbnail title="Photo 2">${createSampleImage(71)}</div>
          </div>
        </div>
        <div style="width: 320px;">
          <h4 style="margin-bottom: 8px;">1 Thumbnail</h4>
          <div mznFourThumbnailCard subtitle="1 photo" title="One Photo">
            <div mznThumbnail title="Photo 1">${createSampleImage(80)}</div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const FiletypeVariants: Story = {
  name: 'Filetype Variants',
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        <div style="width: 300px;">
          <div mznFourThumbnailCard filetype="jpg" subtitle="Image" title="Photos Album">
            <div mznThumbnail>${createSampleImage(100)}</div>
            <div mznThumbnail>${createSampleImage(101)}</div>
            <div mznThumbnail>${createSampleImage(102)}</div>
            <div mznThumbnail>${createSampleImage(103)}</div>
          </div>
        </div>
        <div style="width: 300px;">
          <div mznFourThumbnailCard filetype="mp4" subtitle="Media" title="Video Album">
            <div mznThumbnail>${createSampleImage(110)}</div>
            <div mznThumbnail>${createSampleImage(111)}</div>
            <div mznThumbnail>${createSampleImage(112)}</div>
            <div mznThumbnail>${createSampleImage(113)}</div>
          </div>
        </div>
        <div style="width: 300px;">
          <div mznFourThumbnailCard filetype="docx" subtitle="Document" title="Documents">
            <div mznThumbnail>${createSampleImage(120)}</div>
            <div mznThumbnail>${createSampleImage(121)}</div>
            <div mznThumbnail>${createSampleImage(122)}</div>
            <div mznThumbnail>${createSampleImage(123)}</div>
          </div>
        </div>
        <div style="width: 300px;">
          <div mznFourThumbnailCard filetype="zip" subtitle="Archive" title="Archives">
            <div mznThumbnail>${createSampleImage(130)}</div>
            <div mznThumbnail>${createSampleImage(131)}</div>
            <div mznThumbnail>${createSampleImage(132)}</div>
            <div mznThumbnail>${createSampleImage(133)}</div>
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: '[mznFourThumbnailCardFullFeaturedDemo]',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznFourThumbnailCard
      type="action"
      actionName="View Details"
      filetype="jpg"
      [personalActionActive]="isFavorite()"
      [personalActionIcon]="starOutlineIcon"
      [personalActionActiveIcon]="starFilledIcon"
      (personalActionClick)="toggleFavorite()"
      (actionClick)="onActionClick()"
      subtitle="Updated: 2024/01/15 • 4 items"
      tag="Important"
      title="Q4 2024 Marketing Assets"
    >
      <a
        mznThumbnail
        href="https://rytass.com/about"
        target="_blank"
        title="Link 1"
      >
        ${createSampleImage(200)}
      </a>
      <a
        mznThumbnail
        href="https://rytass.com/projects/NTCH"
        target="_blank"
        title="Link 2"
      >
        ${createSampleImage(201)}
      </a>
      <a
        mznThumbnail
        href="https://rytass.com/projects/TASA"
        target="_blank"
        title="Link 3"
      >
        ${createSampleImage(202)}
      </a>
      <a
        mznThumbnail
        href="https://rytass.com/projects/ICC"
        target="_blank"
        title="Link 4"
      >
        ${createSampleImage(203)}
      </a>
    </div>
  `,
})
class FourThumbnailCardFullFeaturedDemoComponent {
  readonly starOutlineIcon = StarOutlineIcon;
  readonly starFilledIcon = StarFilledIcon;
  readonly isFavorite = signal(false);

  toggleFavorite(): void {
    this.isFavorite.update((v) => !v);
  }

  onActionClick(): void {
    alert('View details clicked');
  }
}

export const FullFeatured: Story = {
  name: 'Full Featured',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardFullFeaturedDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznFourThumbnailCardFullFeaturedDemo></div>`,
  }),
};

export const InCardGroup: Story = {
  name: 'In Card Group',
  render: () => ({
    template: `
      <div mznCardGroup cardType="four-thumbnail">
        <div mznFourThumbnailCard filetype="jpg" subtitle="4 photos" title="Album 1">
          <div mznThumbnail title="Photo 1">${createSampleImage(300)}</div>
          <div mznThumbnail title="Photo 2">${createSampleImage(301)}</div>
          <div mznThumbnail title="Photo 3">${createSampleImage(302)}</div>
          <div mznThumbnail title="Photo 4">${createSampleImage(303)}</div>
        </div>
        <div mznFourThumbnailCard filetype="png" subtitle="4 images" title="Album 2">
          <div mznThumbnail title="Image 1">${createSampleImage(310)}</div>
          <div mznThumbnail title="Image 2">${createSampleImage(311)}</div>
          <div mznThumbnail title="Image 3">${createSampleImage(312)}</div>
          <div mznThumbnail title="Image 4">${createSampleImage(313)}</div>
        </div>
        <div mznFourThumbnailCard filetype="gif" subtitle="4 gifs" title="Album 3">
          <div mznThumbnail title="GIF 1">${createSampleImage(320)}</div>
          <div mznThumbnail title="GIF 2">${createSampleImage(321)}</div>
          <div mznThumbnail title="GIF 3">${createSampleImage(322)}</div>
          <div mznThumbnail title="GIF 4">${createSampleImage(323)}</div>
        </div>
      </div>
    `,
  }),
};

export const ThumbnailAsLink: Story = {
  name: 'Thumbnail As Link',
  render: () => ({
    template: `
      <div style="width: 320px;">
        <div mznFourThumbnailCard
          filetype="jpg"
          subtitle="Click each thumbnail"
          title="Clickable Thumbnails"
        >
          <a mznThumbnail href="https://rytass.com/projects/TASA" target="_blank" title="Link 1">
            ${createSampleImage(400)}
          </a>
          <a mznThumbnail href="https://rytass.com" target="_blank" title="Link 2">
            ${createSampleImage(401)}
          </a>
          <a mznThumbnail href="https://rytass.com" target="_blank" title="Link 3">
            ${createSampleImage(402)}
          </a>
          <a mznThumbnail href="https://rytass.com" target="_blank" title="Link 4">
            ${createSampleImage(403)}
          </a>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: '[mznFourThumbnailCardThumbnailAsButtonDemo]',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznFourThumbnailCard
      filetype="jpg"
      subtitle="Click each thumbnail"
      title="Button Thumbnails"
    >
      <button
        mznThumbnail
        type="button"
        (click)="onClicked(1)"
        title="Button 1"
      >
        ${createSampleImage(500)}
      </button>
      <button
        mznThumbnail
        type="button"
        (click)="onClicked(2)"
        title="Button 2"
      >
        ${createSampleImage(501)}
      </button>
      <button
        mznThumbnail
        type="button"
        (click)="onClicked(3)"
        title="Button 3"
      >
        ${createSampleImage(502)}
      </button>
      <button
        mznThumbnail
        type="button"
        (click)="onClicked(4)"
        title="Button 4"
      >
        ${createSampleImage(503)}
      </button>
    </div>
  `,
})
class FourThumbnailCardThumbnailAsButtonDemoComponent {
  onClicked(index: number): void {
    alert(`Clicked thumbnail ${index}`);
  }
}

export const ThumbnailAsButton: Story = {
  name: 'Thumbnail As Button',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardThumbnailAsButtonDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznFourThumbnailCardThumbnailAsButtonDemo></div>`,
  }),
};

@Component({
  selector: '[mznFourThumbnailCardCardAsLinkDemo]',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  host: { style: 'display: flex; gap: 16px;' },
  template: `
    <div style="width: 320px;">
      <a
        mznFourThumbnailCard
        href="https://rytass.com/"
        target="_blank"
        filetype="jpg"
        subtitle="Click the card"
        title="External Link Card"
      >
        <div
          mznThumbnail
          type="button"
          title="Photo 1"
          (click)="onThumbnailClick($event, 1)"
        >
          ${createSampleImage(600)}
        </div>
        <div
          mznThumbnail
          type="button"
          title="Photo 2"
          (click)="onThumbnailClick($event, 2)"
        >
          ${createSampleImage(601)}
        </div>
        <div
          mznThumbnail
          type="button"
          title="Photo 3"
          (click)="onThumbnailClick($event, 3)"
        >
          ${createSampleImage(602)}
        </div>
        <div
          mznThumbnail
          type="button"
          title="Photo 4"
          (click)="onThumbnailClick($event, 4)"
        >
          ${createSampleImage(603)}
        </div>
      </a>
    </div>
  `,
})
class FourThumbnailCardCardAsLinkDemoComponent {
  onThumbnailClick(event: MouseEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    alert(`Photo ${index} clicked`);
  }
}

export const CardAsLink: Story = {
  name: 'Card As Link, Thumbnail As Button',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardCardAsLinkDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznFourThumbnailCardCardAsLinkDemo></div>`,
  }),
};
