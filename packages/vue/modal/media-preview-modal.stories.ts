import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, onBeforeUnmount, ref } from 'vue';
import type { FunctionalComponent } from 'vue';
import MznButton from '../button/button.vue';
import MznMediaPreviewModal from './media-preview-modal.vue';

export default {
  component: MznMediaPreviewModal,
  title: 'Feedback/MediaPreviewModal',
} as Meta<typeof MznMediaPreviewModal>;

type UncontrolledArgs = {
  defaultIndex: number;
  disableCloseOnBackdropClick?: boolean;
  disableCloseOnEscapeKeyDown?: boolean;
  enableCircularNavigation?: boolean;
  showPaginationIndicator?: boolean;
};

const sampleImages = [
  'https://picsum.photos/id/10/2560/1920',
  'https://picsum.photos/id/20/2560/1920',
  'https://picsum.photos/id/30/2560/1920',
  'https://picsum.photos/id/40/2560/1920',
  'https://picsum.photos/id/50/2560/1920',
];

/**
 * React renders `A{value}B` as separate text nodes; a Vue template merges the
 * text and the interpolations into one, so the parts are handed over as an
 * array.
 */
const TextParts: FunctionalComponent<{ parts: (number | string)[] }> = (
  props,
) => props.parts.map((part) => String(part));

export const Playground: StoryObj<UncontrolledArgs> = {
  args: {
    defaultIndex: 0,
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    enableCircularNavigation: false,
    showPaginationIndicator: true,
  },
  render: (args) => ({
    components: { MznButton, MznMediaPreviewModal },
    setup: () => {
      const open = ref(false);

      return { args, open, sampleImages };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">Open Media Preview</MznButton>
      <MznMediaPreviewModal
        :default-index="args.defaultIndex"
        :disable-close-on-backdrop-click="args.disableCloseOnBackdropClick"
        :disable-close-on-escape-key-down="args.disableCloseOnEscapeKeyDown"
        :enable-circular-navigation="args.enableCircularNavigation"
        :media-items="sampleImages"
        :open="open"
        :show-pagination-indicator="args.showPaginationIndicator"
        @close="open = false"
      />
    `,
  }),
};

export const TrackingIndexChanges: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal, TextParts },
    setup: () => {
      const open = ref(false);
      const lastIndex = ref<number | null>(null);

      return { lastIndex, open, sampleImages };
    },
    template: `
      <div style="margin-bottom: 16px">
        <p v-if="lastIndex !== null"><TextParts :parts="['Last viewed index: ', lastIndex]" /></p>
      </div>
      <MznButton variant="base-primary" @click="open = true">Open Gallery (Track Index Changes)</MznButton>
      <MznMediaPreviewModal
        :default-index="2"
        :media-items="sampleImages"
        :open="open"
        @close="open = false"
        @index-change="lastIndex = $event"
      />
    `,
  }),
};

export const SingleImage: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal },
    setup: () => {
      const open = ref(false);

      return { mediaItems: [sampleImages[0]], open };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">Open Single Image</MznButton>
      <MznMediaPreviewModal
        :media-items="mediaItems"
        :open="open"
        @close="open = false"
      />
    `,
  }),
};

export const CircularNavigation: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal },
    setup: () => {
      const open = ref(false);

      return { open, sampleImages };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">Open Gallery (Circular Navigation - Uncontrolled)</MznButton>
      <MznMediaPreviewModal
        enable-circular-navigation
        :media-items="sampleImages"
        :open="open"
        @close="open = false"
      />
    `,
  }),
};

export const ControlledModeWithCircularNavigation: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal, TextParts },
    setup: () => {
      const open = ref(false);
      const currentIndex = ref(0);

      return {
        currentIndex,
        // Implement circular navigation in controlled mode
        handleNext: (): void => {
          currentIndex.value = (currentIndex.value + 1) % sampleImages.length;
        },
        handlePrev: (): void => {
          currentIndex.value =
            (currentIndex.value - 1 + sampleImages.length) %
            sampleImages.length;
        },
        open,
        sampleImages,
      };
    },
    template: `
      <div style="margin-bottom: 16px">
        <p><TextParts :parts="['Current index: ', currentIndex + 1]" /></p>
      </div>
      <MznButton variant="base-primary" @click="open = true">Open Gallery (Circular Navigation - Controlled)</MznButton>
      <MznMediaPreviewModal
        :current-index="currentIndex"
        :media-items="sampleImages"
        :open="open"
        @close="open = false"
        @next="handleNext"
        @prev="handlePrev"
      />
    `,
  }),
};

export const CustomMedia: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal },
    setup: () => {
      const open = ref(false);

      const customMediaItems = [
        h(
          'div',
          {
            key: '1',
            style: {
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              color: '#333',
              display: 'flex',
              fontSize: '24px',
              height: '400px',
              justifyContent: 'center',
              width: '600px',
            },
          },
          'Custom Content 1',
        ),
        h(
          'div',
          {
            key: '2',
            style: {
              alignItems: 'center',
              backgroundColor: '#e0e0e0',
              color: '#333',
              display: 'flex',
              fontSize: '24px',
              height: '400px',
              justifyContent: 'center',
              width: '600px',
            },
          },
          'Custom Content 2',
        ),
        h('video', {
          controls: true,
          key: '3',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          style: {
            maxHeight: '600px',
            maxWidth: '800px',
          },
        }),
      ];

      return { customMediaItems, open };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">Open Custom Media</MznButton>
      <MznMediaPreviewModal
        :media-items="customMediaItems"
        :open="open"
        @close="open = false"
      />
    `,
  }),
};

export const WithPaginationIndicator: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal },
    setup: () => {
      const open = ref(false);

      return { open, sampleImages };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">Open Gallery with Pagination Indicator</MznButton>
      <MznMediaPreviewModal
        :media-items="sampleImages"
        :open="open"
        show-pagination-indicator
        @close="open = false"
      />
    `,
  }),
};

export const HidePaginationIndicator: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal },
    setup: () => {
      const open = ref(false);

      return { open, sampleImages };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">Open Gallery without Pagination Indicator</MznButton>
      <MznMediaPreviewModal
        :media-items="sampleImages"
        :open="open"
        :show-pagination-indicator="false"
        @close="open = false"
      />
    `,
  }),
};

export const MixedOrientations: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal },
    setup: () => {
      const open = ref(false);

      return {
        mixedImages: [
          'https://picsum.photos/id/100/3840/2160',
          'https://picsum.photos/id/200/2160/3840',
          'https://picsum.photos/id/300/2048/2048',
          'https://picsum.photos/id/400/3840/2160',
          'https://picsum.photos/id/500/1920/2880',
        ],
        open,
      };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">Open Mixed Aspect Ratios</MznButton>
      <MznMediaPreviewModal
        :default-index="2"
        :media-items="mixedImages"
        :open="open"
        @close="open = false"
      />
    `,
  }),
};

export const LocalFileUpload: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal, TextParts },
    setup: () => {
      const open = ref(false);
      const blobUrls = ref<string[]>([]);

      const handleFileChange = (event: Event): void => {
        const files = Array.from(
          (event.target as HTMLInputElement).files ?? [],
        );

        blobUrls.value.forEach((url) => URL.revokeObjectURL(url));
        blobUrls.value = files.map((file) => URL.createObjectURL(file));
      };

      onBeforeUnmount(() => {
        blobUrls.value.forEach((url) => URL.revokeObjectURL(url));
      });

      return { blobUrls, handleFileChange, open };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px">
        <input accept="image/*" multiple type="file" @change="handleFileChange" />
        <MznButton
          :disabled="blobUrls.length === 0"
          variant="base-primary"
          @click="open = true"
        ><TextParts :parts="['預覽已上傳圖片（', blobUrls.length, ' 張）']" /></MznButton>
      </div>
      <MznMediaPreviewModal
        enable-circular-navigation
        :media-items="blobUrls"
        :open="open"
        @close="open = false"
      />
    `,
  }),
};

export const WithNextImageComponent: StoryObj = {
  render: () => ({
    components: { MznButton, MznMediaPreviewModal },
    setup: () => {
      const open = ref(false);

      /**
       * Example of using Next.js Image component with MznMediaPreviewModal.
       * In a real Nuxt project you would use NuxtImg the same way: build the
       * nodes yourself and hand them over as `mediaItems`.
       */
      const MockNextImage: FunctionalComponent<{
        alt: string;
        height: number;
        src: string;
        width: number;
      }> = (props) =>
        h('img', {
          alt: props.alt,
          src: props.src,
          style: {
            height: 'auto',
            maxHeight: '90vh',
            maxWidth: '90vw',
            objectFit: 'contain',
            width: 'auto',
          },
          // Next.js Image would handle optimization and responsive loading
          width: props.width,
          height: props.height,
        });

      const mediaItems = [
        h(MockNextImage, {
          key: '1',
          alt: 'Landscape 1',
          height: 1920,
          src: 'https://picsum.photos/id/10/2560/1920',
          width: 2560,
        }),
        h(MockNextImage, {
          key: '2',
          alt: 'Landscape 2',
          height: 1920,
          src: 'https://picsum.photos/id/20/2560/1920',
          width: 2560,
        }),
        h(MockNextImage, {
          key: '3',
          alt: 'Landscape 3',
          height: 1920,
          src: 'https://picsum.photos/id/30/2560/1920',
          width: 2560,
        }),
      ];

      return { mediaItems, open };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">Open with Next/Image (Mock)</MznButton>
      <MznMediaPreviewModal
        :media-items="mediaItems"
        :open="open"
        @close="open = false"
      />
    `,
  }),
};
