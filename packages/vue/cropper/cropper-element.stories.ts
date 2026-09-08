import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent, onUnmounted, ref, shallowRef } from 'vue';
import type { FunctionalComponent } from 'vue';
import { action } from 'storybook/actions';
import MznCropperElement from './cropper-element.vue';
import type { CropperElementProps } from './cropper-element.types';
import type { CropArea } from './cropper.types';

const argTypes: Partial<ArgTypes<CropperElementProps>> = {
  aspectRatio: {
    control: {
      type: 'number',
    },
    description: 'Aspect ratio for the crop area (width / height)',
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: 'undefined' },
    },
  },
  minHeight: {
    control: {
      type: 'number',
    },
    description: 'Minimum crop area height in pixels',
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: '50' },
    },
  },
  minWidth: {
    control: {
      type: 'number',
    },
    description: 'Minimum crop area width in pixels',
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: '50' },
    },
  },
  size: {
    control: 'inline-radio',
    description: 'The size of cropper',
    options: ['main', 'sub', 'minor'],
    table: {
      defaultValue: { summary: "'main'" },
      type: { summary: 'CropperSize' },
    },
  },
};

export default {
  argTypes,
  component: MznCropperElement,
  title: 'Feedback/Cropper/CropperElement',
} satisfies Meta<typeof MznCropperElement>;

type Story = StoryObj<CropperElementProps>;

const DEFAULT_IMAGE_URL = 'https://rytass.com/logo.png';

/**
 * React renders `A{value}B` as separate text nodes; a Vue template merges the
 * text and the interpolations into one, so the parts are handed over as an
 * array.
 */
const TextParts: FunctionalComponent<{ parts: (number | string)[] }> = (
  props,
) => props.parts.map((part) => String(part));

const BasicStoryContent = defineComponent({
  components: { MznCropperElement, TextParts },
  setup() {
    const cropArea = shallowRef<CropArea | null>(null);

    const handleCropChange = (area: CropArea): void => {
      cropArea.value = area;
      action('onCropChange')(area);
    };

    return { DEFAULT_IMAGE_URL, cropArea, handleCropChange, Math };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem; width: min(100%, 32rem)">
      <MznCropperElement
        :image-src="DEFAULT_IMAGE_URL"
        :aspect-ratio="1 / 1"
        @crop-change="handleCropChange"
      />
      <div v-if="cropArea" style="font-size: 0.875rem">
        <strong>裁切區域：</strong><TextParts
          :parts="[
            ' x: ',
            Math.round(cropArea.x),
            ', y:',
            ' ',
            Math.round(cropArea.y),
            ', width: ',
            Math.round(cropArea.width),
            ', height:',
            ' ',
            Math.round(cropArea.height),
          ]"
        />
      </div>
    </div>
  `,
});

const AspectRatioStoryContent = defineComponent({
  components: { MznCropperElement, TextParts },
  setup() {
    const aspectRatio = ref<number | undefined>(16 / 9);
    const cropArea = shallowRef<CropArea | null>(null);

    const handleCropChange = (area: CropArea): void => {
      cropArea.value = area;
      action('onCropChange')(area);
    };

    const handleAspectRatioChange = (value: string): void => {
      if (!value) {
        aspectRatio.value = undefined;

        return;
      }

      if (value.includes('/')) {
        const [numerator, denominator] = value
          .split('/')
          .map(Number.parseFloat);

        if (!Number.isNaN(numerator) && !Number.isNaN(denominator)) {
          aspectRatio.value = numerator / denominator;
        }

        return;
      }

      const parsed = Number.parseFloat(value);

      if (!Number.isNaN(parsed)) {
        aspectRatio.value = parsed;
      }
    };

    /**
     * React's controlled `<select value>` sets the DOM property only; a Vue
     * `:value` binding also writes the attribute (vuejs/core#6007), so the
     * selection goes through `v-model`, which sets `option.selected` the way
     * React does.
     */
    const selectValue = computed({
      get: (): string => {
        const value = aspectRatio.value;

        if (value === undefined) return '';
        if (value === 1) return '1';
        if (Math.abs(value - 16 / 9) < 0.001) return '16/9';
        if (Math.abs(value - 4 / 3) < 0.001) return '4/3';
        if (Math.abs(value - 3 / 2) < 0.001) return '3/2';

        return value.toString();
      },
      set: (value: string): void => {
        handleAspectRatioChange(value);
      },
    });

    return {
      DEFAULT_IMAGE_URL,
      aspectRatio,
      cropArea,
      handleCropChange,
      Math,
      selectValue,
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem; width: min(100%, 32rem)">
      <div style="align-items: center; display: flex; gap: 0.5rem">
        <label style="align-items: center; display: flex; gap: 0.5rem">
          <strong>Aspect Ratio:</strong>
          <select
            v-model="selectValue"
            style="min-width: 7.5rem; padding: 0.25rem 0.5rem"
          >
            <option value="">Free</option>
            <option value="1">1:1</option>
            <option value="16/9">16:9</option>
            <option value="4/3">4:3</option>
            <option value="3/2">3:2</option>
          </select>
        </label>
        <span
          v-if="aspectRatio !== undefined"
          style="color: #666; font-size: 0.875rem"
        ><TextParts :parts="['當前比例: ', aspectRatio.toFixed(3)]" /></span>
      </div>
      <MznCropperElement
        :aspect-ratio="aspectRatio"
        :image-src="DEFAULT_IMAGE_URL"
        @crop-change="handleCropChange"
      />
      <div v-if="cropArea" style="font-size: 0.875rem">
        <strong>裁切區域：</strong><TextParts
          :parts="[
            ' x: ',
            Math.round(cropArea.x),
            ', y:',
            ' ',
            Math.round(cropArea.y),
            ', width: ',
            Math.round(cropArea.width),
            ', height:',
            ' ',
            Math.round(cropArea.height),
          ]"
        />
      </div>
    </div>
  `,
});

const FileInputStoryContent = defineComponent({
  components: { MznCropperElement },
  setup() {
    const imageUrl = ref<string | null>(null);

    const handleFileChange = (event: Event): void => {
      const file = (event.target as HTMLInputElement).files?.[0];

      if (!file || !file.type.startsWith('image/')) return;

      if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value);
      }

      imageUrl.value = URL.createObjectURL(file);
    };

    onUnmounted(() => {
      if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value);
      }
    });

    return { handleFileChange, imageUrl, onCropChange: action('onCropChange') };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem; width: min(100%, 32rem)">
      <input accept="image/*" type="file" @change="handleFileChange" />
      <MznCropperElement
        v-if="imageUrl"
        :image-src="imageUrl"
        :aspect-ratio="16 / 9"
        @crop-change="onCropChange"
      />
    </div>
  `,
});

export const Basic: Story = {
  render: () => ({
    components: { BasicStoryContent },
    template: '<BasicStoryContent />',
  }),
};

export const WithAspectRatio: Story = {
  render: () => ({
    components: { AspectRatioStoryContent },
    template: '<AspectRatioStoryContent />',
  }),
};

export const WithFileInput: Story = {
  render: () => ({
    components: { FileInputStoryContent },
    template: '<FileInputStoryContent />',
  }),
};
