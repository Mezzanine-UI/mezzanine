import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import MznCardGroup from './card-group.vue';
import MznSingleThumbnailCard from './single-thumbnail-card.vue';

export default {
  title: 'Data Display/Card/SingleThumbnailCard',
  component: MznSingleThumbnailCard,
} satisfies Meta<typeof MznSingleThumbnailCard>;

type Story = StoryObj<typeof MznSingleThumbnailCard>;

const SAMPLE_IMAGE_STYLE =
  'display: block; width: 100%; aspect-ratio: 320/180; object-fit: cover';

const SAMPLE_IMAGE = `
  <img
    alt="Sample thumbnail"
    src="https://picsum.photos/320/180"
    style="${SAMPLE_IMAGE_STYLE}"
  />
`;

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
  render: (args) => ({
    components: { MznSingleThumbnailCard },
    setup: () => ({ StarFilledIcon, StarOutlineIcon, args }),
    template: `
      <div style="width: 320px">
        <MznSingleThumbnailCard
          v-bind="args"
          :title="args.title || ''"
          :personal-action-active-icon="StarFilledIcon"
          :personal-action-icon="StarOutlineIcon"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
      </div>
    `,
  }),
};

export const TypeDefault: Story = {
  name: 'Type: Default',
  render: () => ({
    components: { MznSingleThumbnailCard },
    template: `
      <div style="width: 320px">
        <MznSingleThumbnailCard
          filetype="jpg"
          subtitle="1920x1080"
          title="landscape-photo.jpg"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
      </div>
    `,
  }),
};

export const TypeAction: Story = {
  name: 'Type: Action',
  render: () => ({
    components: { MznSingleThumbnailCard },
    setup: () => ({
      onActionClick: (): void => {
        alert('Clicked');
      },
    }),
    template: `
      <div style="width: 320px">
        <MznSingleThumbnailCard
          action-name="Click"
          filetype="pdf"
          subtitle="2.4 MB"
          title="report-2024.pdf"
          type="action"
          @action-click="onActionClick"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
      </div>
    `,
  }),
};

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  render: () => ({
    components: { MznSingleThumbnailCard },
    setup: () => ({
      onOptionSelect: (option: { name: string }): void => {
        alert(`Selected: ${option.name}`);
      },
      options: [
        { id: 'download', name: 'Download' },
        { id: 'share', name: 'Share' },
        { id: 'delete', name: 'Delete' },
      ],
    }),
    template: `
      <div style="width: 320px">
        <MznSingleThumbnailCard
          filetype="zip"
          :options="options"
          subtitle="15.2 MB"
          title="project-files.zip"
          type="overflow"
          @option-select="onOptionSelect"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
      </div>
    `,
  }),
};

export const WithTag: Story = {
  name: 'With Tag',
  render: () => ({
    components: { MznSingleThumbnailCard },
    template: `
      <div style="width: 320px">
        <MznSingleThumbnailCard
          subtitle="Duration: 5:30"
          tag="Featured"
          title="promotional-video.mp4"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
      </div>
    `,
  }),
};

export const WithPersonalAction: Story = {
  name: 'With Personal Action',
  render: () => ({
    components: { MznSingleThumbnailCard },
    setup: () => {
      const isFavorite = ref(false);

      return {
        StarFilledIcon,
        StarOutlineIcon,
        isFavorite,
        onPersonalActionClick: (): void => {
          isFavorite.value = !isFavorite.value;
        },
      };
    },
    template: `
      <div style="width: 320px">
        <MznSingleThumbnailCard
          :personal-action-active="isFavorite"
          :personal-action-active-icon="StarFilledIcon"
          :personal-action-icon="StarOutlineIcon"
          :personal-action-on-click="onPersonalActionClick"
          subtitle="800x600"
          title="artwork.png"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
      </div>
    `,
  }),
};

export const FiletypeVariants: Story = {
  name: 'Filetype Variants',
  render: () => ({
    components: { MznSingleThumbnailCard },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px">
        <div style="width: 200px">
          <MznSingleThumbnailCard filetype="jpg" subtitle="Image" title="photo.jpg">${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        </div>
        <div style="width: 200px">
          <MznSingleThumbnailCard filetype="mp4" subtitle="Media" title="video.mp4">${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        </div>
        <div style="width: 200px">
          <MznSingleThumbnailCard
            filetype="docx"
            subtitle="Document"
            title="report.docx"
          >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        </div>
        <div style="width: 200px">
          <MznSingleThumbnailCard
            filetype="zip"
            subtitle="Archive"
            title="backup.zip"
          >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        </div>
        <div style="width: 200px">
          <MznSingleThumbnailCard filetype="ts" subtitle="Code" title="index.ts">${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        </div>
        <div style="width: 200px">
          <MznSingleThumbnailCard filetype="ini" subtitle="System" title="setup.ini">${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        </div>
        <div style="width: 200px">
          <MznSingleThumbnailCard filetype="xyz" subtitle="Unknown" title="file.xyz">${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        </div>
      </div>
    `,
  }),
};

export const FullFeatured: Story = {
  name: 'Full Featured',
  render: () => ({
    components: { MznSingleThumbnailCard },
    setup: () => {
      const isFavorite = ref(false);

      return {
        StarFilledIcon,
        StarOutlineIcon,
        isFavorite,
        onActionClick: (): void => {
          alert('View details clicked');
        },
        onPersonalActionClick: (): void => {
          isFavorite.value = !isFavorite.value;
        },
      };
    },
    template: `
      <div style="width: 320px">
        <MznSingleThumbnailCard
          action-name="View Details"
          filetype="pdf"
          :personal-action-active="isFavorite"
          :personal-action-active-icon="StarFilledIcon"
          :personal-action-icon="StarOutlineIcon"
          :personal-action-on-click="onPersonalActionClick"
          subtitle="Updated: 2024/01/15 • 2.4 MB"
          tag="Important"
          title="quarterly-report-q4-2024.pdf"
          type="action"
          @action-click="onActionClick"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
      </div>
    `,
  }),
};

export const InCardGroup: Story = {
  name: 'In Card Group',
  render: () => ({
    components: { MznCardGroup, MznSingleThumbnailCard },
    setup: () => ({ portraitSubtitle: '尺寸: 800x600\n大小: 1.2 MB' }),
    template: `
      <MznCardGroup>
        <MznSingleThumbnailCard
          filetype="jpg"
          subtitle="1920x1080"
          title="landscape.jpg"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        <MznSingleThumbnailCard
          filetype="png"
          :subtitle="portraitSubtitle"
          title="portrait.png"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        <MznSingleThumbnailCard
          filetype="gif"
          subtitle="400x300"
          title="animation.gif"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        <MznSingleThumbnailCard
          filetype="webp"
          subtitle="1200x800"
          title="optimized.webp"
        >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
      </MznCardGroup>
    `,
  }),
};

export const AsLink: Story = {
  name: 'As Link',
  render: () => ({
    components: { MznSingleThumbnailCard },
    template: `
      <div style="display: flex; gap: 16px">
        <div style="width: 320px">
          <MznSingleThumbnailCard
            component="a"
            filetype="pdf"
            href="https://rytass.com/"
            subtitle="Click to open in new tab"
            target="_blank"
            title="external-link.pdf"
          >${SAMPLE_IMAGE}</MznSingleThumbnailCard>
        </div>
      </div>
    `,
  }),
};
