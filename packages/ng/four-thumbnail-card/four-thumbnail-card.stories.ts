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
        <mzn-four-thumbnail-card
          [filetype]="filetype"
          [personalActionActive]="personalActionActive"
          [personalActionIcon]="personalActionIcon"
          [personalActionActiveIcon]="personalActionActiveIcon"
          [subtitle]="subtitle"
          [tag]="tag"
          [title]="title"
        >
          <mzn-thumbnail title="Photo 1">${createSampleImage(1)}</mzn-thumbnail>
          <mzn-thumbnail title="Photo 2">${createSampleImage(2)}</mzn-thumbnail>
          <mzn-thumbnail title="Photo 3">${createSampleImage(3)}</mzn-thumbnail>
          <mzn-thumbnail title="Photo 4">${createSampleImage(4)}</mzn-thumbnail>
        </mzn-four-thumbnail-card>
      </div>
    `,
  }),
};

export const TypeDefault: Story = {
  name: 'Type: Default',
  render: () => ({
    template: `
      <div style="width: 320px;">
        <mzn-four-thumbnail-card
          filetype="jpg"
          subtitle="4 photos"
          title="Vacation Photos"
        >
          <mzn-thumbnail title="Beach">${createSampleImage(10)}</mzn-thumbnail>
          <mzn-thumbnail title="Mountain">${createSampleImage(11)}</mzn-thumbnail>
          <mzn-thumbnail title="City">${createSampleImage(12)}</mzn-thumbnail>
          <mzn-thumbnail title="Forest">${createSampleImage(13)}</mzn-thumbnail>
        </mzn-four-thumbnail-card>
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
      <mzn-four-thumbnail-card
        [actionOptions]="actionOptions()"
        filetype="png"
        subtitle="4 images"
        title="Design Assets"
      >
        <mzn-thumbnail title="Logo">${createSampleImage(20)}</mzn-thumbnail>
        <mzn-thumbnail title="Banner">${createSampleImage(21)}</mzn-thumbnail>
        <mzn-thumbnail title="Icon">${createSampleImage(22)}</mzn-thumbnail>
        <mzn-thumbnail title="Background"
          >${createSampleImage(23)}</mzn-thumbnail
        >
      </mzn-four-thumbnail-card>
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
      <mzn-four-thumbnail-card
        [actionOptions]="actionOptions()"
        filetype="zip"
        subtitle="4 files"
        title="Project Archive"
      >
        <mzn-thumbnail title="File 1">${createSampleImage(30)}</mzn-thumbnail>
        <mzn-thumbnail title="File 2">${createSampleImage(31)}</mzn-thumbnail>
        <mzn-thumbnail title="File 3">${createSampleImage(32)}</mzn-thumbnail>
        <mzn-thumbnail title="File 4">${createSampleImage(33)}</mzn-thumbnail>
      </mzn-four-thumbnail-card>
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
        <mzn-four-thumbnail-card
          subtitle="4 videos"
          tag="Featured"
          title="Video Album"
        >
          <mzn-thumbnail title="Intro">${createSampleImage(40)}</mzn-thumbnail>
          <mzn-thumbnail title="Main">${createSampleImage(41)}</mzn-thumbnail>
          <mzn-thumbnail title="Outro">${createSampleImage(42)}</mzn-thumbnail>
          <mzn-thumbnail title="Bonus">${createSampleImage(43)}</mzn-thumbnail>
        </mzn-four-thumbnail-card>
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
      <mzn-four-thumbnail-card
        [personalActionActive]="isFavorite()"
        [personalActionIcon]="starOutlineIcon"
        [personalActionActiveIcon]="starFilledIcon"
        (personalActionClick)="onPersonalActionClick($event)"
        subtitle="4 artworks"
        title="Art Collection"
      >
        <mzn-thumbnail title="Painting 1"
          >${createSampleImage(50)}</mzn-thumbnail
        >
        <mzn-thumbnail title="Painting 2"
          >${createSampleImage(51)}</mzn-thumbnail
        >
        <mzn-thumbnail title="Painting 3"
          >${createSampleImage(52)}</mzn-thumbnail
        >
        <mzn-thumbnail title="Painting 4"
          >${createSampleImage(53)}</mzn-thumbnail
        >
      </mzn-four-thumbnail-card>
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
        <mzn-four-thumbnail-card subtitle="3 photos" title="Three Photos">
          <mzn-thumbnail title="Photo 1"
            >${createSampleImage(60)}</mzn-thumbnail
          >
          <mzn-thumbnail title="Photo 2"
            >${createSampleImage(61)}</mzn-thumbnail
          >
          <mzn-thumbnail title="Photo 3"
            >${createSampleImage(62)}</mzn-thumbnail
          >
        </mzn-four-thumbnail-card>
      </div>
      <div style="width: 320px;">
        <h4 style="margin-bottom: 8px;">2 Thumbnails</h4>
        <mzn-four-thumbnail-card subtitle="2 photos" title="Two Photos">
          <mzn-thumbnail title="Photo 1"
            >${createSampleImage(70)}</mzn-thumbnail
          >
          <mzn-thumbnail title="Photo 2"
            >${createSampleImage(71)}</mzn-thumbnail
          >
        </mzn-four-thumbnail-card>
      </div>
      <div style="width: 320px;">
        <h4 style="margin-bottom: 8px;">1 Thumbnail</h4>
        <mzn-four-thumbnail-card subtitle="1 photo" title="One Photo">
          <mzn-thumbnail title="Photo 1"
            >${createSampleImage(80)}</mzn-thumbnail
          >
        </mzn-four-thumbnail-card>
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
            <mzn-four-thumbnail-card
              [filetype]="item.filetype"
              [subtitle]="item.subtitle"
              [title]="item.title"
            >
              @for (image of item.images; track image) {
                <mzn-thumbnail [innerHTML]="image" />
              }
            </mzn-four-thumbnail-card>
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
      <mzn-four-thumbnail-card
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
        <mzn-thumbnail
          hostComponent="a"
          href="https://rytass.com/about"
          target="_blank"
          title="Link 1"
        >
          ${createSampleImage(200)}
        </mzn-thumbnail>
        <mzn-thumbnail
          hostComponent="a"
          href="https://rytass.com/projects/NTCH"
          target="_blank"
          title="Link 2"
        >
          ${createSampleImage(201)}
        </mzn-thumbnail>
        <mzn-thumbnail
          hostComponent="a"
          href="https://rytass.com/projects/TASA"
          target="_blank"
          title="Link 3"
        >
          ${createSampleImage(202)}
        </mzn-thumbnail>
        <mzn-thumbnail
          hostComponent="a"
          href="https://rytass.com/projects/ICC"
          target="_blank"
          title="Link 4"
        >
          ${createSampleImage(203)}
        </mzn-thumbnail>
      </mzn-four-thumbnail-card>
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
      <mzn-card-group>
        <mzn-four-thumbnail-card filetype="jpg" subtitle="4 photos" title="Album 1">
          <mzn-thumbnail title="Photo 1">${createSampleImage(300)}</mzn-thumbnail>
          <mzn-thumbnail title="Photo 2">${createSampleImage(301)}</mzn-thumbnail>
          <mzn-thumbnail title="Photo 3">${createSampleImage(302)}</mzn-thumbnail>
          <mzn-thumbnail title="Photo 4">${createSampleImage(303)}</mzn-thumbnail>
        </mzn-four-thumbnail-card>
        <mzn-four-thumbnail-card filetype="png" subtitle="4 images" title="Album 2">
          <mzn-thumbnail title="Image 1">${createSampleImage(310)}</mzn-thumbnail>
          <mzn-thumbnail title="Image 2">${createSampleImage(311)}</mzn-thumbnail>
          <mzn-thumbnail title="Image 3">${createSampleImage(312)}</mzn-thumbnail>
          <mzn-thumbnail title="Image 4">${createSampleImage(313)}</mzn-thumbnail>
        </mzn-four-thumbnail-card>
        <mzn-four-thumbnail-card filetype="gif" subtitle="4 gifs" title="Album 3">
          <mzn-thumbnail title="GIF 1">${createSampleImage(320)}</mzn-thumbnail>
          <mzn-thumbnail title="GIF 2">${createSampleImage(321)}</mzn-thumbnail>
          <mzn-thumbnail title="GIF 3">${createSampleImage(322)}</mzn-thumbnail>
          <mzn-thumbnail title="GIF 4">${createSampleImage(323)}</mzn-thumbnail>
        </mzn-four-thumbnail-card>
      </mzn-card-group>
    `,
  }),
};

export const ThumbnailAsLink: Story = {
  name: 'Thumbnail As Link',
  render: () => ({
    template: `
      <div style="width: 320px;">
        <mzn-four-thumbnail-card
          filetype="jpg"
          subtitle="Click each thumbnail"
          title="Clickable Thumbnails"
        >
          <mzn-thumbnail hostComponent="a" href="https://rytass.com/projects/TASA" target="_blank" title="Link 1">
            ${createSampleImage(400)}
          </mzn-thumbnail>
          <mzn-thumbnail hostComponent="a" href="https://rytass.com" target="_blank" title="Link 2">
            ${createSampleImage(401)}
          </mzn-thumbnail>
          <mzn-thumbnail hostComponent="a" href="https://rytass.com" target="_blank" title="Link 3">
            ${createSampleImage(402)}
          </mzn-thumbnail>
          <mzn-thumbnail hostComponent="a" href="https://rytass.com" target="_blank" title="Link 4">
            ${createSampleImage(403)}
          </mzn-thumbnail>
        </mzn-four-thumbnail-card>
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
      <mzn-four-thumbnail-card
        filetype="jpg"
        subtitle="Click each thumbnail"
        title="Button Thumbnails"
      >
        <mzn-thumbnail
          hostComponent="button"
          (clicked)="onClicked(1, $event)"
          title="Button 1"
        >
          ${createSampleImage(500)}
        </mzn-thumbnail>
        <mzn-thumbnail
          hostComponent="button"
          (clicked)="onClicked(2, $event)"
          title="Button 2"
        >
          ${createSampleImage(501)}
        </mzn-thumbnail>
        <mzn-thumbnail
          hostComponent="button"
          (clicked)="onClicked(3, $event)"
          title="Button 3"
        >
          ${createSampleImage(502)}
        </mzn-thumbnail>
        <mzn-thumbnail
          hostComponent="button"
          (clicked)="onClicked(4, $event)"
          title="Button 4"
        >
          ${createSampleImage(503)}
        </mzn-thumbnail>
      </mzn-four-thumbnail-card>
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
          <mzn-four-thumbnail-card
            filetype="jpg"
            subtitle="Click the card"
            title="External Link Card"
          >
            <mzn-thumbnail hostComponent="a" href="https://rytass.com/" target="_blank" title="Photo 1">
              ${createSampleImage(600)}
            </mzn-thumbnail>
            <mzn-thumbnail hostComponent="a" href="https://rytass.com/" target="_blank" title="Photo 2">
              ${createSampleImage(601)}
            </mzn-thumbnail>
            <mzn-thumbnail hostComponent="a" href="https://rytass.com/" target="_blank" title="Photo 3">
              ${createSampleImage(602)}
            </mzn-thumbnail>
            <mzn-thumbnail hostComponent="a" href="https://rytass.com/" target="_blank" title="Photo 4">
              ${createSampleImage(603)}
            </mzn-thumbnail>
          </mzn-four-thumbnail-card>
        </div>
      </div>
    `,
  }),
};
