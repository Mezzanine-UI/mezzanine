import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, ref } from 'vue';
import { StarFilledIcon, StarOutlineIcon } from '@mezzanine-ui/icons';
import MznCardGroup from './card-group.vue';
import MznFourThumbnailCard from './four-thumbnail-card.vue';
import MznThumbnail from './thumbnail.vue';

export default {
  title: 'Data Display/Card/FourThumbnailCard',
  component: MznFourThumbnailCard,
} satisfies Meta<typeof MznFourThumbnailCard>;

type Story = StoryObj<typeof MznFourThumbnailCard>;

/** React's `createSampleImage`, as a component so the template can repeat it. */
const SampleImage = defineComponent({
  name: 'SampleImage',
  props: { seed: { type: Number, required: true } },
  setup: () => ({
    imageStyle: {
      display: 'block',
      objectFit: 'cover',
      width: '160px',
      height: '120px',
    },
  }),
  template: `
    <img
      :alt="'Sample thumbnail ' + seed"
      :src="'https://picsum.photos/seed/' + seed + '/320/240'"
      :style="imageStyle"
    />
  `,
});

const STORY_COMPONENTS = {
  MznCardGroup,
  MznFourThumbnailCard,
  MznThumbnail,
  SampleImage,
};

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
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => ({ StarFilledIcon, StarOutlineIcon, args }),
    template: `
      <div style="width: 320px">
        <MznFourThumbnailCard
          v-bind="args"
          :personal-action-active-icon="StarFilledIcon"
          :personal-action-icon="StarOutlineIcon"
          :title="args.title || ''"
        >
          <MznThumbnail title="Photo 1"><SampleImage :seed="1" /></MznThumbnail>
          <MznThumbnail title="Photo 2"><SampleImage :seed="2" /></MznThumbnail>
          <MznThumbnail title="Photo 3"><SampleImage :seed="3" /></MznThumbnail>
          <MznThumbnail title="Photo 4"><SampleImage :seed="4" /></MznThumbnail>
        </MznFourThumbnailCard>
      </div>
    `,
  }),
};

export const TypeDefault: Story = {
  name: 'Type: Default',
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="width: 320px">
        <MznFourThumbnailCard
          filetype="jpg"
          subtitle="4 photos"
          title="Vacation Photos"
        >
          <MznThumbnail title="Beach"><SampleImage :seed="10" /></MznThumbnail>
          <MznThumbnail title="Mountain"><SampleImage :seed="11" /></MznThumbnail>
          <MznThumbnail title="City"><SampleImage :seed="12" /></MznThumbnail>
          <MznThumbnail title="Forest"><SampleImage :seed="13" /></MznThumbnail>
        </MznFourThumbnailCard>
      </div>
    `,
  }),
};

export const TypeAction: Story = {
  name: 'Type: Action',
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      onActionClick: (): void => {
        alert('View all clicked');
      },
    }),
    template: `
      <div style="width: 320px">
        <MznFourThumbnailCard
          action-name="View All"
          filetype="png"
          subtitle="4 images"
          title="Design Assets"
          type="action"
          @action-click="onActionClick"
        >
          <MznThumbnail title="Logo"><SampleImage :seed="20" /></MznThumbnail>
          <MznThumbnail title="Banner"><SampleImage :seed="21" /></MznThumbnail>
          <MznThumbnail title="Icon"><SampleImage :seed="22" /></MznThumbnail>
          <MznThumbnail title="Background"><SampleImage :seed="23" /></MznThumbnail>
        </MznFourThumbnailCard>
      </div>
    `,
  }),
};

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      onOptionSelect: (option: { name: string }): void => {
        alert(`Selected: ${option.name}`);
      },
      options: [
        { id: 'download', name: 'Download All' },
        { id: 'share', name: 'Share' },
        { id: 'delete', name: 'Delete' },
      ],
    }),
    template: `
      <div style="width: 320px">
        <MznFourThumbnailCard
          filetype="zip"
          :options="options"
          subtitle="4 files"
          title="Project Archive"
          type="overflow"
          @option-select="onOptionSelect"
        >
          <MznThumbnail title="File 1"><SampleImage :seed="30" /></MznThumbnail>
          <MznThumbnail title="File 2"><SampleImage :seed="31" /></MznThumbnail>
          <MznThumbnail title="File 3"><SampleImage :seed="32" /></MznThumbnail>
          <MznThumbnail title="File 4"><SampleImage :seed="33" /></MznThumbnail>
        </MznFourThumbnailCard>
      </div>
    `,
  }),
};

export const WithTag: Story = {
  name: 'With Tag',
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="width: 320px">
        <MznFourThumbnailCard subtitle="4 videos" tag="Featured" title="Video Album">
          <MznThumbnail title="Intro"><SampleImage :seed="40" /></MznThumbnail>
          <MznThumbnail title="Main"><SampleImage :seed="41" /></MznThumbnail>
          <MznThumbnail title="Outro"><SampleImage :seed="42" /></MznThumbnail>
          <MznThumbnail title="Bonus"><SampleImage :seed="43" /></MznThumbnail>
        </MznFourThumbnailCard>
      </div>
    `,
  }),
};

export const WithPersonalAction: Story = {
  name: 'With Personal Action',
  render: () => ({
    components: STORY_COMPONENTS,
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
        <MznFourThumbnailCard
          :personal-action-active="isFavorite"
          :personal-action-active-icon="StarFilledIcon"
          :personal-action-icon="StarOutlineIcon"
          :personal-action-on-click="onPersonalActionClick"
          subtitle="4 artworks"
          title="Art Collection"
        >
          <MznThumbnail title="Painting 1"><SampleImage :seed="50" /></MznThumbnail>
          <MznThumbnail title="Painting 2"><SampleImage :seed="51" /></MznThumbnail>
          <MznThumbnail title="Painting 3"><SampleImage :seed="52" /></MznThumbnail>
          <MznThumbnail title="Painting 4"><SampleImage :seed="53" /></MznThumbnail>
        </MznFourThumbnailCard>
      </div>
    `,
  }),
};

export const WithLessThanFourThumbnails: Story = {
  name: 'With Less Than 4 Thumbnails',
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div style="width: 320px">
          <h4 style="margin-bottom: 8px">3 Thumbnails</h4>
          <MznFourThumbnailCard subtitle="3 photos" title="Three Photos">
            <MznThumbnail title="Photo 1"><SampleImage :seed="60" /></MznThumbnail>
            <MznThumbnail title="Photo 2"><SampleImage :seed="61" /></MznThumbnail>
            <MznThumbnail title="Photo 3"><SampleImage :seed="62" /></MznThumbnail>
          </MznFourThumbnailCard>
        </div>
        <div style="width: 320px">
          <h4 style="margin-bottom: 8px">2 Thumbnails</h4>
          <MznFourThumbnailCard subtitle="2 photos" title="Two Photos">
            <MznThumbnail title="Photo 1"><SampleImage :seed="70" /></MznThumbnail>
            <MznThumbnail title="Photo 2"><SampleImage :seed="71" /></MznThumbnail>
          </MznFourThumbnailCard>
        </div>
        <div style="width: 320px">
          <h4 style="margin-bottom: 8px">1 Thumbnail</h4>
          <MznFourThumbnailCard subtitle="1 photo" title="One Photo">
            <MznThumbnail title="Photo 1"><SampleImage :seed="80" /></MznThumbnail>
          </MznFourThumbnailCard>
        </div>
      </div>
    `,
  }),
};

export const FiletypeVariants: Story = {
  name: 'Filetype Variants',
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px">
        <div style="width: 300px">
          <MznFourThumbnailCard filetype="jpg" subtitle="Image" title="Photos Album">
            <MznThumbnail><SampleImage :seed="100" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="101" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="102" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="103" /></MznThumbnail>
          </MznFourThumbnailCard>
        </div>
        <div style="width: 300px">
          <MznFourThumbnailCard filetype="mp4" subtitle="Media" title="Video Album">
            <MznThumbnail><SampleImage :seed="110" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="111" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="112" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="113" /></MznThumbnail>
          </MznFourThumbnailCard>
        </div>
        <div style="width: 300px">
          <MznFourThumbnailCard
            filetype="docx"
            subtitle="Document"
            title="Documents"
          >
            <MznThumbnail><SampleImage :seed="120" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="121" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="122" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="123" /></MznThumbnail>
          </MznFourThumbnailCard>
        </div>
        <div style="width: 300px">
          <MznFourThumbnailCard filetype="zip" subtitle="Archive" title="Archives">
            <MznThumbnail><SampleImage :seed="130" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="131" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="132" /></MznThumbnail>
            <MznThumbnail><SampleImage :seed="133" /></MznThumbnail>
          </MznFourThumbnailCard>
        </div>
      </div>
    `,
  }),
};

export const FullFeatured: Story = {
  name: 'Full Featured',
  render: () => ({
    components: STORY_COMPONENTS,
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
        <MznFourThumbnailCard
          action-name="View Details"
          filetype="jpg"
          :personal-action-active="isFavorite"
          :personal-action-active-icon="StarFilledIcon"
          :personal-action-icon="StarOutlineIcon"
          :personal-action-on-click="onPersonalActionClick"
          subtitle="Updated: 2024/01/15 • 4 items"
          tag="Important"
          title="Q4 2024 Marketing Assets"
          type="action"
          @action-click="onActionClick"
        >
          <MznThumbnail
            component="a"
            href="https://rytass.com/about"
            target="_blank"
            title="Link 1"
          ><SampleImage :seed="200" /></MznThumbnail>
          <MznThumbnail
            component="a"
            href="https://rytass.com/projects/NTCH"
            target="_blank"
            title="Link 2"
          ><SampleImage :seed="201" /></MznThumbnail>
          <MznThumbnail
            component="a"
            href="https://rytass.com/projects/TASA"
            target="_blank"
            title="Link 3"
          ><SampleImage :seed="202" /></MznThumbnail>
          <MznThumbnail
            component="a"
            href="https://rytass.com/projects/ICC"
            target="_blank"
            title="Link 4"
          ><SampleImage :seed="203" /></MznThumbnail>
        </MznFourThumbnailCard>
      </div>
    `,
  }),
};

export const InCardGroup: Story = {
  name: 'In Card Group',
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <MznCardGroup>
        <MznFourThumbnailCard filetype="jpg" subtitle="4 photos" title="Album 1">
          <MznThumbnail title="Photo 1"><SampleImage :seed="300" /></MznThumbnail>
          <MznThumbnail title="Photo 2"><SampleImage :seed="301" /></MznThumbnail>
          <MznThumbnail title="Photo 3"><SampleImage :seed="302" /></MznThumbnail>
          <MznThumbnail title="Photo 4"><SampleImage :seed="303" /></MznThumbnail>
        </MznFourThumbnailCard>
        <MznFourThumbnailCard filetype="png" subtitle="4 images" title="Album 2">
          <MznThumbnail title="Image 1"><SampleImage :seed="310" /></MznThumbnail>
          <MznThumbnail title="Image 2"><SampleImage :seed="311" /></MznThumbnail>
          <MznThumbnail title="Image 3"><SampleImage :seed="312" /></MznThumbnail>
          <MznThumbnail title="Image 4"><SampleImage :seed="313" /></MznThumbnail>
        </MznFourThumbnailCard>
        <MznFourThumbnailCard filetype="gif" subtitle="4 gifs" title="Album 3">
          <MznThumbnail title="GIF 1"><SampleImage :seed="320" /></MznThumbnail>
          <MznThumbnail title="GIF 2"><SampleImage :seed="321" /></MznThumbnail>
          <MznThumbnail title="GIF 3"><SampleImage :seed="322" /></MznThumbnail>
          <MznThumbnail title="GIF 4"><SampleImage :seed="323" /></MznThumbnail>
        </MznFourThumbnailCard>
      </MznCardGroup>
    `,
  }),
};

export const ThumbnailAsLink: Story = {
  name: 'Thumbnail As Link',
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="width: 320px">
        <MznFourThumbnailCard
          filetype="jpg"
          subtitle="Click each thumbnail"
          title="Clickable Thumbnails"
        >
          <MznThumbnail
            component="a"
            href="https://rytass.com/projects/TASA"
            target="_blank"
            title="Link 1"
          ><SampleImage :seed="400" /></MznThumbnail>
          <MznThumbnail
            component="a"
            href="https://rytass.com"
            target="_blank"
            title="Link 2"
          ><SampleImage :seed="401" /></MznThumbnail>
          <MznThumbnail
            component="a"
            href="https://rytass.com"
            target="_blank"
            title="Link 3"
          ><SampleImage :seed="402" /></MznThumbnail>
          <MznThumbnail
            component="a"
            href="https://rytass.com"
            target="_blank"
            title="Link 4"
          ><SampleImage :seed="403" /></MznThumbnail>
        </MznFourThumbnailCard>
      </div>
    `,
  }),
};

export const ThumbnailAsButton: Story = {
  name: 'Thumbnail As Button',
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      onThumbnailClick: (index: number): void => {
        alert(`Clicked thumbnail ${index}`);
      },
    }),
    template: `
      <div style="width: 320px">
        <MznFourThumbnailCard
          filetype="jpg"
          subtitle="Click each thumbnail"
          title="Button Thumbnails"
        >
          <MznThumbnail
            component="button"
            title="Button 1"
            type="button"
            @click="onThumbnailClick(1)"
          ><SampleImage :seed="500" /></MznThumbnail>
          <MznThumbnail
            component="button"
            title="Button 2"
            type="button"
            @click="onThumbnailClick(2)"
          ><SampleImage :seed="501" /></MznThumbnail>
          <MznThumbnail
            component="button"
            title="Button 3"
            type="button"
            @click="onThumbnailClick(3)"
          ><SampleImage :seed="502" /></MznThumbnail>
          <MznThumbnail
            component="button"
            title="Button 4"
            type="button"
            @click="onThumbnailClick(4)"
          ><SampleImage :seed="503" /></MznThumbnail>
        </MznFourThumbnailCard>
      </div>
    `,
  }),
};

export const CardAsLink: Story = {
  name: 'Card As Link, Thumbnail As Button',
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      onPhotoClick: (event: MouseEvent, index: number): void => {
        event.preventDefault();
        event.stopPropagation();
        alert(`Photo ${index} clicked`);
      },
    }),
    template: `
      <div style="display: flex; gap: 16px">
        <div style="width: 320px">
          <MznFourThumbnailCard
            component="a"
            filetype="jpg"
            href="https://rytass.com/"
            subtitle="Click the card"
            target="_blank"
            title="External Link Card"
          >
            <MznThumbnail
              type="button"
              title="Photo 1"
              @click="onPhotoClick($event, 1)"
            ><SampleImage :seed="600" /></MznThumbnail>
            <MznThumbnail
              type="button"
              title="Photo 2"
              @click="onPhotoClick($event, 2)"
            ><SampleImage :seed="601" /></MznThumbnail>
            <MznThumbnail
              type="button"
              title="Photo 3"
              @click="onPhotoClick($event, 3)"
            ><SampleImage :seed="602" /></MznThumbnail>
            <MznThumbnail
              type="button"
              title="Photo 4"
              @click="onPhotoClick($event, 4)"
            ><SampleImage :seed="603" /></MznThumbnail>
          </MznFourThumbnailCard>
        </div>
      </div>
    `,
  }),
};
