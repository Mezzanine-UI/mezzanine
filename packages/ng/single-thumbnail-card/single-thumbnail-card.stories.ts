import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import { MznSingleThumbnailCard } from './single-thumbnail-card.component';
import { MznCardGroup } from '@mezzanine-ui/ng/card';

const sampleImage = `<img
  alt="Sample thumbnail"
  src="https://picsum.photos/320/180"
  style="display: block; width: 100%; aspect-ratio: 320/180; object-fit: cover;"
/>`;

export default {
  title: 'Data Display/Card/SingleThumbnailCard',
  component: MznSingleThumbnailCard,
  decorators: [
    moduleMetadata({
      imports: [MznSingleThumbnailCard, MznCardGroup],
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
      description: 'Optional tag label shown on top of the thumbnail.',
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
    subtitle: '2024/01/15',
    tag: 'New',
    title: 'Document Title',
  },
  render: (args) => ({
    props: {
      ...args,
      personalActionIcon: StarOutlineIcon,
      personalActionActiveIcon: StarFilledIcon,
    },
    template: `
      <div style="width: 320px;">
        <div mznSingleThumbnailCard
          [filetype]="filetype"
          [personalActionActive]="personalActionActive"
          [personalActionIcon]="personalActionIcon"
          [personalActionActiveIcon]="personalActionActiveIcon"
          [subtitle]="subtitle"
          [tag]="tag"
          [title]="title"
        >
          ${sampleImage}
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
        <div mznSingleThumbnailCard
          filetype="jpg"
          subtitle="1920x1080"
          title="landscape-photo.jpg"
        >
          ${sampleImage}
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-single-thumbnail-card-with-action',
  standalone: true,
  imports: [MznSingleThumbnailCard],
  template: `
    <div style="width: 320px;">
      <div
        mznSingleThumbnailCard
        [actionOptions]="actionOptions()"
        filetype="pdf"
        subtitle="2.4 MB"
        title="report-2024.pdf"
      >
        ${sampleImage}
      </div>
    </div>
  `,
})
class SingleThumbnailCardWithActionComponent {
  readonly actionOptions = signal({
    type: 'action' as const,
    actionName: 'Click',
  });
}

export const TypeAction: Story = {
  name: 'Type: Action',
  decorators: [
    moduleMetadata({
      imports: [SingleThumbnailCardWithActionComponent],
    }),
  ],
  render: () => ({
    template: `<story-single-thumbnail-card-with-action />`,
  }),
};

@Component({
  selector: 'story-single-thumbnail-card-with-overflow',
  standalone: true,
  imports: [MznSingleThumbnailCard],
  template: `
    <div style="width: 320px;">
      <div
        mznSingleThumbnailCard
        [actionOptions]="actionOptions()"
        filetype="zip"
        subtitle="15.2 MB"
        title="project-files.zip"
      >
        ${sampleImage}
      </div>
    </div>
  `,
})
class SingleThumbnailCardWithOverflowComponent {
  readonly actionOptions = signal({
    type: 'overflow' as const,
    actionName: 'Options',
    options: [
      { id: 'download', name: 'Download' },
      { id: 'share', name: 'Share' },
      { id: 'delete', name: 'Delete' },
    ] as const,
  });
}

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  decorators: [
    moduleMetadata({
      imports: [SingleThumbnailCardWithOverflowComponent],
    }),
  ],
  render: () => ({
    template: `<story-single-thumbnail-card-with-overflow />`,
  }),
};

export const WithTag: Story = {
  render: () => ({
    template: `
      <div style="width: 320px;">
        <div mznSingleThumbnailCard
          subtitle="Duration: 5:30"
          tag="Featured"
          title="promotional-video.mp4"
        >
          ${sampleImage}
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-single-thumbnail-card-with-personal-action',
  standalone: true,
  imports: [MznSingleThumbnailCard],
  template: `
    <div style="width: 320px;">
      <div
        mznSingleThumbnailCard
        [personalActionActive]="isFavorite()"
        [personalActionIcon]="starOutlineIcon"
        [personalActionActiveIcon]="starFilledIcon"
        (personalActionClick)="onPersonalActionClick($event)"
        subtitle="800x600"
        title="artwork.png"
      >
        ${sampleImage}
      </div>
    </div>
  `,
})
class SingleThumbnailCardWithPersonalActionComponent {
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
      imports: [SingleThumbnailCardWithPersonalActionComponent],
    }),
  ],
  render: () => ({
    template: `<story-single-thumbnail-card-with-personal-action />`,
  }),
};

export const FiletypeVariants: Story = {
  name: 'Filetype Variants',
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        @for (item of items; track item.filetype) {
          <div style="width: 200px;">
            <div mznSingleThumbnailCard
              [filetype]="item.filetype"
              [subtitle]="item.subtitle"
              [title]="item.title"
            >
              ${sampleImage}
            </div>
          </div>
        }
      </div>
    `,
    props: {
      items: [
        { filetype: 'jpg', subtitle: 'Image', title: 'photo.jpg' },
        { filetype: 'mp4', subtitle: 'Media', title: 'video.mp4' },
        { filetype: 'docx', subtitle: 'Document', title: 'report.docx' },
        { filetype: 'zip', subtitle: 'Archive', title: 'backup.zip' },
        { filetype: 'ts', subtitle: 'Code', title: 'index.ts' },
        { filetype: 'ini', subtitle: 'System', title: 'setup.ini' },
        { filetype: 'xyz', subtitle: 'Unknown', title: 'file.xyz' },
      ],
    },
  }),
};

@Component({
  selector: 'story-single-thumbnail-card-full-featured',
  standalone: true,
  imports: [MznSingleThumbnailCard],
  template: `
    <div style="width: 320px;">
      <div
        mznSingleThumbnailCard
        [actionOptions]="actionOptions()"
        [personalActionActive]="isFavorite()"
        [personalActionIcon]="starOutlineIcon"
        [personalActionActiveIcon]="starFilledIcon"
        (personalActionClick)="onPersonalActionClick($event)"
        filetype="pdf"
        subtitle="Updated: 2024/01/15 • 2.4 MB"
        tag="Important"
        title="quarterly-report-q4-2024.pdf"
      >
        ${sampleImage}
      </div>
    </div>
  `,
})
class SingleThumbnailCardFullFeaturedComponent {
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
      imports: [SingleThumbnailCardFullFeaturedComponent],
    }),
  ],
  render: () => ({
    template: `<story-single-thumbnail-card-full-featured />`,
  }),
};

export const InCardGroup: Story = {
  name: 'In Card Group',
  render: () => ({
    template: `
      <div mznCardGroup>
        <div mznSingleThumbnailCard
          filetype="jpg"
          subtitle="1920x1080"
          title="landscape.jpg"
        >
          ${sampleImage}
        </div>
        <div mznSingleThumbnailCard
          filetype="png"
          subtitle="800x600"
          title="portrait.png"
        >
          ${sampleImage}
        </div>
        <div mznSingleThumbnailCard
          filetype="gif"
          subtitle="400x300"
          title="animation.gif"
        >
          ${sampleImage}
        </div>
        <div mznSingleThumbnailCard
          filetype="webp"
          subtitle="1200x800"
          title="optimized.webp"
        >
          ${sampleImage}
        </div>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  name: 'As Link',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="width: 320px;">
          <div mznSingleThumbnailCard
            filetype="pdf"
            subtitle="Click to open in new tab"
            title="external-link.pdf"
          >
            ${sampleImage}
          </div>
        </div>
      </div>
    `,
  }),
};
