import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import { MznFourThumbnailCard } from './four-thumbnail-card.component';
import { MznThumbnail } from '@mezzanine-ui/ng/thumbnail';
import { MznCardGroup } from '@mezzanine-ui/ng/card';

const createSampleImage = (seed: number) =>
  `<img alt="Sample thumbnail ${seed}" src="https://picsum.photos/seed/${seed}/160/120" style="display: block; object-fit: cover; width: 100%; height: 100%;" />`;

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
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
      },
    },
    personalActionActive: {
      control: { type: 'boolean' },
      description: 'Whether the personal action is in active state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    personalActionIcon: {
      control: false,
      description: 'Icon for the personal action button.',
      table: {
        type: { summary: 'IconDefinition' },
        defaultValue: { summary: '-' },
      },
    },
    personalActionActiveIcon: {
      control: false,
      description: 'Icon shown when personal action is active.',
      table: {
        type: { summary: 'IconDefinition' },
        defaultValue: { summary: '-' },
      },
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Subtitle text shown in the info section.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
      },
    },
    tag: {
      control: { type: 'text' },
      description: 'Optional tag label shown on top of the thumbnail grid.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
      },
    },
    title: {
      control: { type: 'text' },
      description: 'Title text shown in the info section.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
      },
    },
  },
  args: {
    personalActionActive: false,
    subtitle: '4 items',
    tag: 'Album',
    title: 'Photo Collection',
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
          [title]="title"
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
  selector: 'story-four-thumbnail-card-type-action',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  template: `
    <div style="width: 320px;">
      <div
        mznFourThumbnailCard
        [actionOptions]="actionOptions()"
        filetype="png"
        subtitle="4 images"
        title="Design Assets"
      >
        <div mznThumbnail title="Logo">${createSampleImage(20)}</div>
        <div mznThumbnail title="Banner">${createSampleImage(21)}</div>
        <div mznThumbnail title="Icon">${createSampleImage(22)}</div>
        <div mznThumbnail title="Background">${createSampleImage(23)}</div>
      </div>
    </div>
  `,
})
class FourThumbnailCardTypeActionComponent {
  readonly actionOptions = signal({
    type: 'action' as const,
    actionName: 'View All',
  });
}

export const TypeAction: Story = {
  name: 'Type: Action',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardTypeActionComponent],
    }),
  ],
  render: () => ({
    template: `<story-four-thumbnail-card-type-action />`,
  }),
};

@Component({
  selector: 'story-four-thumbnail-card-type-overflow',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  template: `
    <div style="width: 320px;">
      <div
        mznFourThumbnailCard
        [actionOptions]="actionOptions()"
        filetype="zip"
        subtitle="4 files"
        title="Project Archive"
      >
        <div mznThumbnail title="File 1">${createSampleImage(30)}</div>
        <div mznThumbnail title="File 2">${createSampleImage(31)}</div>
        <div mznThumbnail title="File 3">${createSampleImage(32)}</div>
        <div mznThumbnail title="File 4">${createSampleImage(33)}</div>
      </div>
    </div>
  `,
})
class FourThumbnailCardTypeOverflowComponent {
  readonly actionOptions = signal({
    type: 'overflow' as const,
    options: [
      { id: 'download', name: 'Download All' },
      { id: 'share', name: 'Share' },
      { id: 'delete', name: 'Delete' },
    ] as const,
  });
}

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardTypeOverflowComponent],
    }),
  ],
  render: () => ({
    template: `<story-four-thumbnail-card-type-overflow />`,
  }),
};

export const WithTag: Story = {
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
  selector: 'story-four-thumbnail-card-with-personal-action',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  template: `
    <div style="width: 320px;">
      <div
        mznFourThumbnailCard
        [personalActionActive]="isFavorite()"
        [personalActionIcon]="starOutlineIcon"
        [personalActionActiveIcon]="starFilledIcon"
        (personalActionClick)="onPersonalActionClick($event)"
        subtitle="4 artworks"
        title="Art Collection"
      >
        <div mznThumbnail title="Painting 1">${createSampleImage(50)}</div>
        <div mznThumbnail title="Painting 2">${createSampleImage(51)}</div>
        <div mznThumbnail title="Painting 3">${createSampleImage(52)}</div>
        <div mznThumbnail title="Painting 4">${createSampleImage(53)}</div>
      </div>
    </div>
  `,
})
class FourThumbnailCardWithPersonalActionComponent {
  readonly starOutlineIcon = StarOutlineIcon;
  readonly starFilledIcon = StarFilledIcon;
  readonly isFavorite = signal(false);

  onPersonalActionClick(_event: { event: MouseEvent; active: boolean }): void {
    this.isFavorite.update((v) => !v);
  }
}

export const WithPersonalAction: Story = {
  name: 'With Personal Action',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardWithPersonalActionComponent],
    }),
  ],
  render: () => ({
    template: `<story-four-thumbnail-card-with-personal-action />`,
  }),
};

@Component({
  selector: 'story-four-thumbnail-card-less-thumbnails',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
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
})
class FourThumbnailCardLessThumbnailsComponent {}

export const WithLessThanFourThumbnails: Story = {
  name: 'With Less Than 4 Thumbnails',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardLessThumbnailsComponent],
    }),
  ],
  render: () => ({
    template: `<story-four-thumbnail-card-less-thumbnails />`,
  }),
};

export const FiletypeVariants: Story = {
  name: 'Filetype Variants',
  render: () => ({
    props: {
      items: [
        {
          filetype: 'jpg',
          subtitle: 'Image',
          title: 'Photos Album',
          images: [100, 101, 102, 103].map(createSampleImage),
        },
        {
          filetype: 'mp4',
          subtitle: 'Media',
          title: 'Video Album',
          images: [110, 111, 112, 113].map(createSampleImage),
        },
        {
          filetype: 'docx',
          subtitle: 'Document',
          title: 'Documents',
          images: [120, 121, 122, 123].map(createSampleImage),
        },
        {
          filetype: 'zip',
          subtitle: 'Archive',
          title: 'Archives',
          images: [130, 131, 132, 133].map(createSampleImage),
        },
      ],
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        @for (item of items; track item.title) {
          <div style="width: 300px;">
            <div mznFourThumbnailCard
              [filetype]="item.filetype"
              [subtitle]="item.subtitle"
              [title]="item.title"
            >
              @for (image of item.images; track image) {
                <div mznThumbnail [innerHTML]="image" ></div>
              }
            </div>
          </div>
        }
      </div>
    `,
  }),
};

@Component({
  selector: 'story-four-thumbnail-card-full-featured',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  template: `
    <div style="width: 320px;">
      <div
        mznFourThumbnailCard
        [actionOptions]="actionOptions()"
        [personalActionActive]="isFavorite()"
        [personalActionIcon]="starOutlineIcon"
        [personalActionActiveIcon]="starFilledIcon"
        (personalActionClick)="onPersonalActionClick($event)"
        filetype="jpg"
        subtitle="Updated: 2024/01/15 • 4 items"
        tag="Important"
        title="Q4 2024 Marketing Assets"
      >
        <div
          mznThumbnail
          hostComponent="a"
          href="https://rytass.com/about"
          target="_blank"
          title="Link 1"
        >
          ${createSampleImage(200)}
        </div>
        <div
          mznThumbnail
          hostComponent="a"
          href="https://rytass.com/projects/NTCH"
          target="_blank"
          title="Link 2"
        >
          ${createSampleImage(201)}
        </div>
        <div
          mznThumbnail
          hostComponent="a"
          href="https://rytass.com/projects/TASA"
          target="_blank"
          title="Link 3"
        >
          ${createSampleImage(202)}
        </div>
        <div
          mznThumbnail
          hostComponent="a"
          href="https://rytass.com/projects/ICC"
          target="_blank"
          title="Link 4"
        >
          ${createSampleImage(203)}
        </div>
      </div>
    </div>
  `,
})
class FourThumbnailCardFullFeaturedComponent {
  readonly starOutlineIcon = StarOutlineIcon;
  readonly starFilledIcon = StarFilledIcon;
  readonly isFavorite = signal(false);

  readonly actionOptions = signal({
    type: 'action' as const,
    actionName: 'View Details',
  });

  onPersonalActionClick(_event: { event: MouseEvent; active: boolean }): void {
    this.isFavorite.update((v) => !v);
  }
}

export const FullFeatured: Story = {
  name: 'Full Featured',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardFullFeaturedComponent],
    }),
  ],
  render: () => ({
    template: `<story-four-thumbnail-card-full-featured />`,
  }),
};

export const InCardGroup: Story = {
  name: 'In Card Group',
  render: () => ({
    template: `
      <div mznCardGroup>
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
          <div mznThumbnail hostComponent="a" href="https://rytass.com/projects/TASA" target="_blank" title="Link 1">
            ${createSampleImage(400)}
          </div>
          <div mznThumbnail hostComponent="a" href="https://rytass.com" target="_blank" title="Link 2">
            ${createSampleImage(401)}
          </div>
          <div mznThumbnail hostComponent="a" href="https://rytass.com" target="_blank" title="Link 3">
            ${createSampleImage(402)}
          </div>
          <div mznThumbnail hostComponent="a" href="https://rytass.com" target="_blank" title="Link 4">
            ${createSampleImage(403)}
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-four-thumbnail-card-thumbnail-as-button',
  standalone: true,
  imports: [MznFourThumbnailCard, MznThumbnail],
  template: `
    <div style="width: 320px;">
      <div
        mznFourThumbnailCard
        filetype="jpg"
        subtitle="Click each thumbnail"
        title="Button Thumbnails"
      >
        <div
          mznThumbnail
          hostComponent="button"
          (clicked)="onClicked(1, $event)"
          title="Button 1"
        >
          ${createSampleImage(500)}
        </div>
        <div
          mznThumbnail
          hostComponent="button"
          (clicked)="onClicked(2, $event)"
          title="Button 2"
        >
          ${createSampleImage(501)}
        </div>
        <div
          mznThumbnail
          hostComponent="button"
          (clicked)="onClicked(3, $event)"
          title="Button 3"
        >
          ${createSampleImage(502)}
        </div>
        <div
          mznThumbnail
          hostComponent="button"
          (clicked)="onClicked(4, $event)"
          title="Button 4"
        >
          ${createSampleImage(503)}
        </div>
      </div>
    </div>
  `,
})
class FourThumbnailCardThumbnailAsButtonComponent {
  onClicked(index: number, _event: MouseEvent): void {
    alert(`Clicked thumbnail ${index}`);
  }
}

export const ThumbnailAsButton: Story = {
  name: 'Thumbnail As Button',
  decorators: [
    moduleMetadata({
      imports: [FourThumbnailCardThumbnailAsButtonComponent],
    }),
  ],
  render: () => ({
    template: `<story-four-thumbnail-card-thumbnail-as-button />`,
  }),
};

export const CardAsLink: Story = {
  name: 'Card As Link, Thumbnail As Button',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="width: 320px;">
          <div mznFourThumbnailCard
            filetype="jpg"
            subtitle="Click the card"
            title="External Link Card"
          >
            <div mznThumbnail hostComponent="a" href="https://rytass.com/" target="_blank" title="Photo 1">
              ${createSampleImage(600)}
            </div>
            <div mznThumbnail hostComponent="a" href="https://rytass.com/" target="_blank" title="Photo 2">
              ${createSampleImage(601)}
            </div>
            <div mznThumbnail hostComponent="a" href="https://rytass.com/" target="_blank" title="Photo 3">
              ${createSampleImage(602)}
            </div>
            <div mznThumbnail hostComponent="a" href="https://rytass.com/" target="_blank" title="Photo 4">
              ${createSampleImage(603)}
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
