import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, ref, shallowRef } from 'vue';
import type { CSSProperties } from 'vue';
import MznButton from '../button/button.vue';
import MznUpload from '../upload/upload.vue';
import type { UploadFile } from '../upload/upload.types';
import MznCropper from './cropper.vue';
import { MznCropperModal } from './cropper-modal';
import type {
  CropperModalOpenOptions,
  CropperModalProps,
} from './cropper-modal.types';
import { cropToBlob, cropToDataURL } from './cropper-tools';

const DEFAULT_IMAGE_URL = 'https://rytass.com/logo.png';

const argTypes: Partial<ArgTypes<CropperModalProps>> = {
  cancelText: {
    control: {
      type: 'text',
    },
    description: 'The text for the cancel button',
    table: {
      type: { summary: 'string' },
    },
  },
  confirmText: {
    control: {
      type: 'text',
    },
    description: 'The text for the confirm button',
    table: {
      defaultValue: { summary: "'確認'" },
      type: { summary: 'string' },
    },
  },
  cropperContentClassName: {
    control: {
      type: 'text',
    },
    description: 'Additional className for the cropper content wrapper',
    table: {
      type: { summary: 'string' },
    },
  },
  cropperProps: {
    control: {
      type: 'object',
    },
    description: 'Props for the CropperElement component',
    table: {
      type: { summary: 'CropperPropsBase' },
    },
  },
  disableCloseOnBackdropClick: {
    control: {
      type: 'boolean',
    },
    description:
      'Whether to disable closing the modal when clicking the backdrop',
    table: {
      type: { summary: 'boolean' },
    },
  },
  disableCloseOnEscapeKeyDown: {
    control: {
      type: 'boolean',
    },
    description:
      'Whether to disable closing the modal when pressing the Escape key',
    table: {
      type: { summary: 'boolean' },
    },
  },
  fullScreen: {
    control: {
      type: 'boolean',
    },
    description: 'Whether to display the modal in full screen',
    table: {
      type: { summary: 'boolean' },
    },
  },
  loading: {
    control: {
      type: 'boolean',
    },
    description: 'Whether the modal is in loading state',
    table: {
      type: { summary: 'boolean' },
    },
  },
  onCancel: {
    action: 'onCancel',
    description: 'Callback fired when the cancel button is clicked',
    table: {
      type: { summary: '() => void' },
    },
  },
  onConfirm: {
    action: 'onConfirm',
    description: 'Callback fired when the confirm button is clicked',
    table: {
      type: {
        summary:
          '(context: CropperModalConfirmContext) => void | Promise<void>',
      },
    },
  },
  showModalFooter: {
    control: {
      type: 'boolean',
    },
    description:
      'Whether to show the modal footer with confirm and cancel buttons',
    table: {
      defaultValue: { summary: 'true' },
      type: { summary: 'boolean' },
    },
  },
  showModalHeader: {
    control: {
      type: 'boolean',
    },
    description: 'Whether to show the modal header',
    table: {
      defaultValue: { summary: 'true' },
      type: { summary: 'boolean' },
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
  supportingText: {
    control: {
      type: 'text',
    },
    description: 'Supporting text displayed below the title',
    table: {
      type: { summary: 'string' },
    },
  },
  title: {
    control: {
      type: 'text',
    },
    description: 'The title of the modal header',
    table: {
      defaultValue: { summary: "'圖片裁切'" },
      type: { summary: 'string' },
    },
  },
};

export default {
  argTypes,
  component: MznCropper,
  title: 'Feedback/Cropper',
} satisfies Meta<typeof MznCropper>;

type Story = StoryObj<typeof MznCropper>;

/**
 * `style` is a native attribute rather than a declared prop, so it reaches the
 * modal through the fallthrough — but the imperative options object is the
 * vnode props, and has to name it.
 */
type OpenOptionsWithStyle = CropperModalOpenOptions & { style: CSSProperties };

const UploaderStoryContent = defineComponent({
  components: { MznUpload },
  setup() {
    /**
     * Shallow: the list is always replaced wholesale, and a deep ref would try
     * to unwrap `errorIcon`'s node type all the way down.
     */
    const files = shallowRef<UploadFile[]>([]);
    const processing = ref(false);

    const handleUpload = async (
      selectedFiles: File[],
    ): Promise<UploadFile[]> => {
      const file = selectedFiles[0];

      if (!file) return [];

      processing.value = true;

      let uploadResult: UploadFile[] | null = null;

      const options: OpenOptionsWithStyle = {
        cropperProps: {
          imageSrc: file,
          aspectRatio: 1,
        },
        onCancel: () => {
          files.value = [];
        },
        size: 'wide',
        style: { width: '640px', maxWidth: '640px' },
        title: '裁切頁首圖片',
        supportingText: '建議上傳尺寸為 2100 × 900 像素，以獲得最佳顯示效果。',
      };

      const result = await MznCropperModal.open(options);

      // Process after modal is closed (result contains the context)
      if (result && result.canvas && result.cropArea && result.imageSrc) {
        const blob = await cropToBlob({
          canvas: result.canvas,
          cropArea: result.cropArea,
          imageSrc: result.imageSrc,
          format: 'image/png',
          quality: 0.9,
        });
        const dataUrl = await cropToDataURL({
          canvas: result.canvas,
          cropArea: result.cropArea,
          imageSrc: result.imageSrc,
          format: 'image/png',
          quality: 0.9,
        });
        const croppedFile = new File([blob], `cropped-${Date.now()}.png`, {
          type: 'image/png',
        });

        uploadResult = [
          {
            id: `cropped-${Date.now()}`,
            file: croppedFile,
            status: 'done',
            url: dataUrl,
          },
        ];
      }

      processing.value = false;

      if (!uploadResult) {
        return [
          {
            errorMessage: '已取消',
            id: `cancel-${Date.now()}`,
            status: 'error',
          },
        ];
      }

      return uploadResult;
    };

    const handleChange = (nextFiles: UploadFile[]): void => {
      files.value = nextFiles.filter((file) => file.errorMessage !== '已取消');
    };

    return { files, handleChange, handleUpload, processing };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px">
      <MznUpload
        accept="image/*"
        :disabled="processing"
        :files="files"
        :max-files="1"
        mode="cards"
        :on-upload="handleUpload"
        @change="handleChange"
      />
    </div>
  `,
});

const ButtonStoryContent = defineComponent({
  components: { MznButton },
  setup() {
    const previewUrl = ref<string | null>(null);

    const handleOpen = async (): Promise<void> => {
      await MznCropperModal.open({
        cropperProps: {
          imageSrc: DEFAULT_IMAGE_URL,
          aspectRatio: 4 / 3,
        },
        onConfirm: async ({ canvas, cropArea, imageSrc }) => {
          if (!canvas || !cropArea || !imageSrc) return;

          const dataUrl = await cropToDataURL({
            canvas,
            cropArea,
            format: 'image/png',
            imageSrc,
            quality: 0.9,
          });

          previewUrl.value = dataUrl;
        },
        title: '裁切頁首圖片',
        size: 'regular',
        supportingText: '建議上傳尺寸為 2100 × 900 像素，以獲得最佳顯示效果。',
      });
    };

    return { handleOpen, previewUrl };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; width: 600px">
      <MznButton variant="base-primary" @click="handleOpen">開啟裁切</MznButton>
      <img
        v-if="previewUrl"
        alt="Cropped preview"
        :src="previewUrl"
        style="max-width: 100%"
      />
    </div>
  `,
});

export const WithUploader: Story = {
  render: () => ({
    components: { UploaderStoryContent },
    template: '<UploaderStoryContent />',
  }),
};

export const WithButton: Story = {
  render: () => ({
    components: { ButtonStoryContent },
    template: '<ButtonStoryContent />',
  }),
};
