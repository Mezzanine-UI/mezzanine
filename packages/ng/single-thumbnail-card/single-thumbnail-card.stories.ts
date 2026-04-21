import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
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
    filetype: { control: { type: 'text' } },
    personalActionActive: { control: { type: 'boolean' } },
    subtitle: { control: { type: 'text' } },
    tag: { control: { type: 'text' } },
    title: { control: { type: 'text' } },
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
          [title]="title || ''"
          [type]="type"
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
  selector: '[mznSingleThumbnailCardTypeActionDemo]',
  standalone: true,
  imports: [MznSingleThumbnailCard],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznSingleThumbnailCard
      type="action"
      actionName="Click"
      filetype="pdf"
      subtitle="2.4 MB"
      title="report-2024.pdf"
      (actionClick)="onActionClick()"
    >
      ${sampleImage}
    </div>
  `,
})
class SingleThumbnailCardTypeActionDemoComponent {
  onActionClick(): void {
    alert('Clicked');
  }
}

export const TypeAction: Story = {
  name: 'Type: Action',
  decorators: [
    moduleMetadata({
      imports: [SingleThumbnailCardTypeActionDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznSingleThumbnailCardTypeActionDemo></div>`,
  }),
};

@Component({
  selector: '[mznSingleThumbnailCardTypeOverflowDemo]',
  standalone: true,
  imports: [MznSingleThumbnailCard],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznSingleThumbnailCard
      type="overflow"
      filetype="zip"
      subtitle="15.2 MB"
      title="project-files.zip"
      [options]="options"
      (optionSelect)="onOptionSelect($event)"
    >
      ${sampleImage}
    </div>
  `,
})
class SingleThumbnailCardTypeOverflowDemoComponent {
  readonly options: ReadonlyArray<DropdownOption> = [
    { id: 'download', name: 'Download' },
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
      imports: [SingleThumbnailCardTypeOverflowDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznSingleThumbnailCardTypeOverflowDemo></div>`,
  }),
};

export const WithTag: Story = {
  name: 'With Tag',
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
  selector: '[mznSingleThumbnailCardWithPersonalActionDemo]',
  standalone: true,
  imports: [MznSingleThumbnailCard],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznSingleThumbnailCard
      [personalActionActive]="isFavorite()"
      [personalActionIcon]="starOutlineIcon"
      [personalActionActiveIcon]="starFilledIcon"
      (personalActionClick)="toggleFavorite()"
      subtitle="800x600"
      title="artwork.png"
    >
      ${sampleImage}
    </div>
  `,
})
class SingleThumbnailCardWithPersonalActionDemoComponent {
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
      imports: [SingleThumbnailCardWithPersonalActionDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznSingleThumbnailCardWithPersonalActionDemo></div>`,
  }),
};

export const FiletypeVariants: Story = {
  name: 'Filetype Variants',
  render: () => ({
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
  }),
};

@Component({
  selector: '[mznSingleThumbnailCardFullFeaturedDemo]',
  standalone: true,
  imports: [MznSingleThumbnailCard],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznSingleThumbnailCard
      type="action"
      actionName="View Details"
      filetype="pdf"
      [personalActionActive]="isFavorite()"
      [personalActionIcon]="starOutlineIcon"
      [personalActionActiveIcon]="starFilledIcon"
      (personalActionClick)="toggleFavorite()"
      (actionClick)="onActionClick()"
      subtitle="Updated: 2024/01/15 • 2.4 MB"
      tag="Important"
      title="quarterly-report-q4-2024.pdf"
    >
      ${sampleImage}
    </div>
  `,
})
class SingleThumbnailCardFullFeaturedDemoComponent {
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
      imports: [SingleThumbnailCardFullFeaturedDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznSingleThumbnailCardFullFeaturedDemo></div>`,
  }),
};

export const InCardGroup: Story = {
  name: 'In Card Group',
  render: () => ({
    template: `
      <div mznCardGroup cardType="single-thumbnail">
        <div mznSingleThumbnailCard
          filetype="jpg"
          subtitle="1920x1080"
          title="landscape.jpg"
        >
          ${sampleImage}
        </div>
        <div mznSingleThumbnailCard
          filetype="png"
          subtitle="尺寸: 800x600&#10;大小: 1.2 MB"
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
          <a mznSingleThumbnailCard
            href="https://rytass.com/"
            target="_blank"
            filetype="pdf"
            subtitle="Click to open in new tab"
            title="external-link.pdf"
          >
            ${sampleImage}
          </a>
        </div>
      </div>
    `,
  }),
};
