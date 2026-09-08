import type { ArgTypes, Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, onMounted, onUnmounted, ref, shallowRef } from 'vue';
import type { PropType } from 'vue';
import { action } from 'storybook/actions';
import MznUpload from './upload.vue';
import type { UploadFile, UploadProps } from './upload.types';

/**
 * React's props carry the callbacks and the input ref, so its story documents
 * them as argTypes; the same rows are declared here so the two Controls panels
 * match.
 */
type UploadArgs = UploadProps & {
  inputRef?: unknown;
  onChange?: (files: UploadFile[]) => void;
  onDelete?: (fileId: string, file: File) => void;
  onDownload?: (fileId: string, file: File) => void;
  onMaxFilesExceeded?: (
    maxFiles: number,
    selectedCount: number,
    currentCount: number,
  ) => void;
  onReload?: (fileId: string, file: File) => void;
  onZoomIn?: (fileId: string, file: File) => void;
};

const argTypes: Partial<ArgTypes<UploadArgs>> = {
  accept: {
    control: {
      type: 'text',
    },
    description: 'The accept attributes of native input element',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
    description: 'Whether the upload is disabled',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  mode: {
    control: {
      type: 'radio',
      options: ['list', 'basic-list', 'button-list', 'cards', 'card-wall'],
    },
    description: 'The display mode for the upload component',
    table: {
      type: {
        summary:
          "'list' | 'basic-list' | 'button-list' | 'cards' | 'card-wall'",
      },
      defaultValue: { summary: "'list'" },
    },
  },
  size: {
    control: {
      type: 'radio',
      options: ['main', 'sub'],
    },
    description: 'The size of the upload component',
    table: {
      type: { summary: 'UploadSize' },
      defaultValue: { summary: "'main'" },
    },
  },
  showFileSize: {
    control: {
      type: 'boolean',
    },
    description: 'Whether to show file size in list mode',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'true' },
    },
  },
  multiple: {
    control: {
      type: 'boolean',
    },
    description: 'Whether can select multiple files to upload',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  maxFiles: {
    control: {
      type: 'number',
    },
    description: 'Maximum number of files allowed to upload',
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: 'undefined' },
    },
  },
  onUpload: {
    control: false,
    description: 'Fired when files are selected for upload',
    table: {
      type: {
        summary:
          '(files: File[], setProgress?: (fileIndex: number, progress: number) => void) => Promise<void> | void',
      },
      defaultValue: { summary: 'undefined' },
    },
  },
  onDelete: {
    control: false,
    description: 'Fired when a file is deleted',
    table: {
      type: { summary: '(fileId: string, file: File) => void' },
      defaultValue: { summary: 'undefined' },
    },
  },
  onReload: {
    control: false,
    description: 'Fired when a file upload is retried (error state)',
    table: {
      type: { summary: '(fileId: string, file: File) => void' },
      defaultValue: { summary: 'undefined' },
    },
  },
  onDownload: {
    control: false,
    description: 'Fired when a file is downloaded (done state)',
    table: {
      type: { summary: '(fileId: string, file: File) => void' },
      defaultValue: { summary: 'undefined' },
    },
  },
  onZoomIn: {
    control: false,
    description: 'Fired when zoom in is clicked on a picture card (done state)',
    table: {
      type: { summary: '(fileId: string, file: File) => void' },
      defaultValue: { summary: 'undefined' },
    },
  },
  onChange: {
    control: false,
    description: 'Fired when files list changes',
    table: {
      type: { summary: '(files: UploadFile[]) => void' },
      defaultValue: { summary: 'undefined' },
    },
  },
  files: {
    control: false,
    description:
      'Controlled file list for the upload component. Provide this along with onChange to fully control the file state.',
    table: {
      type: { summary: 'UploadFile[]' },
      defaultValue: { summary: 'undefined' },
    },
  },
  dropzoneHints: {
    control: 'object',
    description:
      'Hints passed into the Uploader dropzone area. Only visible in dropzone modes (list, card-wall).',
    table: {
      type: { summary: 'UploaderProps["hints"]' },
      defaultValue: { summary: 'undefined' },
    },
  },
  hints: {
    control: 'object',
    description:
      'Array of hints displayed outside the uploader area. Visible in all modes.',
    table: {
      type: { summary: 'UploaderProps["hints"]' },
      defaultValue: { summary: 'undefined' },
    },
  },
  uploaderIcon: {
    control: false,
    description: 'Icon configuration for different actions and states',
    table: {
      type: { summary: 'UploaderProps["icon"]' },
      defaultValue: { summary: 'undefined' },
    },
  },
  id: {
    control: {
      type: 'text',
    },
    description: 'The id of input element',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  inputProps: {
    control: false,
    description:
      'Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element. If you need direct control to the input element, use this prop to provide to it.',
    table: {
      type: { summary: 'UploaderProps["inputProps"]' },
      defaultValue: { summary: 'undefined' },
    },
  },
  inputRef: {
    control: false,
    description: 'The react ref passed to input element',
    table: {
      type: { summary: 'React.Ref<HTMLInputElement>' },
      defaultValue: { summary: 'undefined' },
    },
  },
  name: {
    control: {
      type: 'text',
    },
    description: 'The name attribute of the input element',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  uploaderLabel: {
    control: false,
    description: 'Label configuration for different states',
    table: {
      type: { summary: 'UploaderProps["label"]' },
      defaultValue: { summary: 'undefined' },
    },
  },
  errorMessage: {
    control: {
      type: 'text',
    },
    description:
      "Default error message to display when upload fails. This will be used when a file's status becomes 'error' and no errorMessage is provided.",
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'undefined' },
    },
  },
  errorIcon: {
    control: false,
    description:
      "Default error icon to display when upload fails. This will be used when a file's status becomes 'error' and no errorIcon is provided.",
    table: {
      type: { summary: 'ReactNode' },
      defaultValue: { summary: 'undefined' },
    },
  },
  onMaxFilesExceeded: {
    control: false,
    description: 'Fired when the maximum number of files is exceeded',
    table: {
      type: {
        summary:
          '(maxFiles: number, selectedCount: number, currentCount: number) => void',
      },
      defaultValue: { summary: 'undefined' },
    },
  },
};

const meta = {
  title: 'Data Entry/Upload/Upload',
  component: MznUpload,
  argTypes,
} satisfies Meta<typeof MznUpload>;

export default meta;

type Story = StoryObj<UploadArgs>;

// Helper function to load image from URL and convert to File object
async function createFileFromUrl(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new File([blob], fileName, { type: blob.type || 'image/png' });
}

const storyHandlers = {
  onDelete: action('onDelete'),
  onDownload: action('onDownload'),
  onReload: action('onReload'),
  onZoomIn: action('onZoomIn'),
};

async function simulateUpload(
  files: File[],
  setProgress?: (fileIndex: number, progress: number) => void,
): Promise<void> {
  action('onUpload')(files);

  for (let i = 0; i < files.length; i += 1) {
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress?.(i, progress);
    }
  }
}

function useControlledFiles(onFilesChange?: (files: UploadFile[]) => void) {
  /**
   * Shallow: the list is always replaced wholesale, and a deep ref would try to
   * unwrap `errorIcon`'s node type all the way down.
   */
  const files = shallowRef<UploadFile[]>([]);

  const handleChange = (nextFiles: UploadFile[]): void => {
    files.value = nextFiles;
    onFilesChange?.(nextFiles);
  };

  return { files, handleChange };
}

const UploadWithPreloadedImage = defineComponent({
  components: { MznUpload },
  props: {
    dropzoneHints: {
      default: undefined,
      type: Array as PropType<UploadProps['dropzoneHints']>,
    },
    hints: {
      default: undefined,
      type: Array as PropType<UploadProps['hints']>,
    },
    mode: {
      default: undefined,
      type: String as PropType<UploadProps['mode']>,
    },
    showFileSize: { default: undefined, type: Boolean },
    size: {
      default: undefined,
      type: String as PropType<UploadProps['size']>,
    },
  },
  setup() {
    const isLoading = ref(true);
    const { files, handleChange } = useControlledFiles((next) => {
      action('onChange')(next);
    });

    let mounted = true;

    onMounted(() => {
      createFileFromUrl('https://rytass.com/logo.png', 'logo.png')
        .then((file) => {
          if (!mounted) return;

          handleChange([
            {
              file,
              id: `story-preload-${Date.now()}-${Math.random()}`,
              progress: 100,
              status: 'done',
            },
          ]);
          isLoading.value = false;
        })
        .catch((error) => {
          console.error('Failed to load image:', error);

          if (mounted) isLoading.value = false;
        });
    });

    onUnmounted(() => {
      mounted = false;
    });

    return { files, handleChange, isLoading, simulateUpload, storyHandlers };
  },
  template: `
    <MznUpload
      v-if="!isLoading"
      :dropzoneHints="dropzoneHints"
      :hints="hints"
      :mode="mode"
      :showFileSize="showFileSize"
      :size="size"
      :files="files"
      :onUpload="simulateUpload"
      @change="handleChange"
      @delete="storyHandlers.onDelete"
      @reload="storyHandlers.onReload"
      @download="storyHandlers.onDownload"
      @zoom-in="storyHandlers.onZoomIn"
    />
  `,
});

const UploadWithPreloadedImageFromUrl = defineComponent({
  components: { MznUpload },
  props: {
    hints: {
      default: undefined,
      type: Array as PropType<UploadProps['hints']>,
    },
    mode: {
      default: undefined,
      type: String as PropType<UploadProps['mode']>,
    },
    showFileSize: { default: undefined, type: Boolean },
    size: {
      default: undefined,
      type: String as PropType<UploadProps['size']>,
    },
  },
  setup() {
    const isLoading = ref(true);
    const { files, handleChange } = useControlledFiles((next) => {
      action('onChange')(next);
    });

    let mounted = true;

    onMounted(() => {
      // Simulate loading from backend - use URL instead of File object
      setTimeout(() => {
        if (!mounted) return;

        handleChange([
          {
            id: `story-preload-url-${Date.now()}-${Math.random()}`,
            status: 'done',
            url: 'https://rytass.com/logo.png',
          },
        ]);
        isLoading.value = false;
      }, 500);
    });

    onUnmounted(() => {
      mounted = false;
    });

    return { files, handleChange, isLoading, simulateUpload, storyHandlers };
  },
  template: `
    <MznUpload
      v-if="!isLoading"
      :hints="hints"
      :mode="mode"
      :showFileSize="showFileSize"
      :size="size"
      :files="files"
      :onUpload="simulateUpload"
      @change="handleChange"
      @delete="storyHandlers.onDelete"
      @reload="storyHandlers.onReload"
      @download="storyHandlers.onDownload"
      @zoom-in="storyHandlers.onZoomIn"
    />
  `,
});

export const Playground: Story = {
  render: (args) => ({
    components: { MznUpload },
    setup: () => {
      const isLoading = ref(true);
      const { files, handleChange } = useControlledFiles((next) => {
        action('onChange')(next);
      });

      onMounted(() => {
        createFileFromUrl('https://rytass.com/logo.png', 'logo.png')
          .then((file) => {
            handleChange([
              {
                file,
                id: `story-preload-${Date.now()}`,
                progress: 100,
                status: 'done',
              },
            ]);
            isLoading.value = false;
          })
          .catch((error) => {
            console.error('Failed to load image:', error);
            isLoading.value = false;
          });
      });

      return {
        args,
        files,
        handleChange,
        isLoading,
        simulateUpload,
        storyHandlers,
      };
    },
    template: `
      <div v-if="isLoading">Loading...</div>
      <MznUpload
        v-else
        v-bind="args"
        :files="files"
        :onUpload="simulateUpload"
        @change="handleChange"
        @delete="storyHandlers.onDelete"
        @reload="storyHandlers.onReload"
        @download="storyHandlers.onDownload"
        @zoom-in="storyHandlers.onZoomIn"
      />
    `,
  }),
  parameters: {
    controls: {
      sort: 'none',
    },
  },
  args: {
    accept: 'image/*',
    disabled: false,
    hints: [{ label: '支援 JPG、PNG；單檔上限 500 KB。', type: 'info' }],
    mode: 'list',
    showFileSize: true,
    size: 'main',
    multiple: true,
  },
};

export const Basic: Story = {
  render: () => ({
    components: { UploadWithPreloadedImage },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; width: 800px">
        <div>
          <h3>List Mode:</h3>
          <p>Display files in list format with dropzone. Use <code>dropzoneHints</code> to show hints inside the dropzone, and <code>hints</code> to show hints below the uploader.</p>
          <UploadWithPreloadedImage
            mode="list"
            size="main"
            showFileSize
            :dropzoneHints="[{ label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。' }]"
            :hints="[{ label: '支援 JPG、PNG、PDF；單檔上限 500 KB。', type: 'info' }]"
          />
        </div>

        <div>
          <h3>Basic List Mode:</h3>
          <p>Display files in list format without drag-and-drop (basic uploader).</p>
          <UploadWithPreloadedImage
            mode="basic-list"
            size="main"
            showFileSize
            :hints="[{ label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。', type: 'info' }]"
          />
        </div>

        <div>
          <h3>Button List Mode:</h3>
          <p>Display files in button list format</p>
          <UploadWithPreloadedImage
            mode="button-list"
            size="main"
            :hints="[
              { label: '支援 JPG、PNG、PDF；單檔上限 500 KB。', type: 'info' },
              { label: '最多 5 個檔案。', type: 'info' },
            ]"
          />
        </div>

        <div>
          <h3>Cards Mode:</h3>
          <p>Display files in card format, images use UploadPictureCard, other files use UploadItem</p>
          <UploadWithPreloadedImage
            mode="cards"
            size="main"
            :hints="[
              { label: '支援 JPG、PNG、PDF；單檔上限 500 KB。', type: 'info' },
              { label: '最多 5 個檔案。', type: 'info' },
            ]"
          />
        </div>

        <div>
          <h3>Card Wall Mode:</h3>
          <p>Display files in card wall format, all files use UploadPictureCard</p>
          <UploadWithPreloadedImage
            mode="card-wall"
            size="main"
            :hints="[{ label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。' }]"
          />
        </div>
      </div>
    `,
  }),
};

export const FormBinding: Story = {
  render: () => ({
    components: { MznUpload },
    setup: () => {
      const submittedValue = ref('[]');
      const { files, handleChange } = useControlledFiles();

      return {
        files,
        handleChange,
        handleSubmit: (): void => {
          submittedValue.value = JSON.stringify(
            files.value.map((file) => ({
              id: file.id,
              name: file.file?.name ?? file.url?.split('/').pop() ?? 'Unknown',
              status: file.status,
            })),
            null,
            2,
          );
        },
        simulateUpload,
        storyHandlers,
        submittedValue,
      };
    },
    template: `
      <form
        style="display: flex; flex-direction: column; gap: 16px; width: 600px"
        @submit.prevent="handleSubmit"
      >
        <MznUpload
          :files="files"
          mode="card-wall"
          multiple
          :onUpload="simulateUpload"
          @change="handleChange"
          @delete="storyHandlers.onDelete"
          @reload="storyHandlers.onReload"
          @download="storyHandlers.onDownload"
          @zoom-in="storyHandlers.onZoomIn"
        />
        <button type="submit" style="align-self: flex-start; padding: 8px 16px; cursor: pointer">
          Submit Form
        </button>
        <div>
          <strong>Form Value:</strong>
          <pre style="background: #f7f7f7; padding: 12px; border-radius: 4px; max-height: 200px; overflow: auto">{{ submittedValue }}</pre>
        </div>
      </form>
    `,
  }),
};

export const IdNameBinding: Story = {
  render: () => ({
    components: { MznUpload },
    setup: () => {
      const inputLogs = ref<string[]>([]);
      const { files, handleChange } = useControlledFiles();

      return {
        files,
        handleChange,
        inputLogs,
        onInputChange: (event: Event): void => {
          const target = event.target as HTMLInputElement;

          inputLogs.value = [
            ...inputLogs.value.slice(-3),
            `input(name="${target.name}" id="${target.id}") changed @ ${new Date().toLocaleTimeString()}`,
          ];
        },
        simulateUpload,
        storyHandlers,
        uploadFieldId: 'storybook-upload-field',
        uploadFieldName: 'storybookUpload',
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 600px">
        <label :for="uploadFieldId" style="font-weight: 600">
          Upload Author Cover (via id/name binding)
        </label>
        <MznUpload
          :id="uploadFieldId"
          :name="uploadFieldName"
          :files="files"
          :onUpload="simulateUpload"
          @change="handleChange"
          @delete="storyHandlers.onDelete"
          @reload="storyHandlers.onReload"
          @download="storyHandlers.onDownload"
          @zoom-in="storyHandlers.onZoomIn"
        />
        <div>
          <strong>input change log：</strong>
          <ul>
            <li v-for="log in inputLogs" :key="log">{{ log }}</li>
          </ul>
        </div>
      </div>
    `,
  }),
};

export const PreloadedImageFromUrl: Story = {
  render: () => ({
    components: { UploadWithPreloadedImageFromUrl },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; width: 800px">
        <div>
          <h3>List Mode (Picture Item):</h3>
          <p>Display preloaded image from URL in list format using UploadItem with thumbnail</p>
          <UploadWithPreloadedImageFromUrl
            mode="list"
            size="main"
            showFileSize
            :hints="[{ label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。' }]"
          />
        </div>

        <div>
          <h3>Cards Mode (Picture Card):</h3>
          <p>Display preloaded image from URL in card format using UploadPictureCard</p>
          <UploadWithPreloadedImageFromUrl
            mode="cards"
            size="main"
            :hints="[
              { label: '支援 JPG、PNG、PDF；單檔上限 500 KB。', type: 'info' },
              { label: '最多 5 個檔案。', type: 'info' },
            ]"
          />
        </div>

        <div>
          <h3>Card Wall Mode (Picture Card):</h3>
          <p>Display preloaded image from URL in card wall format using UploadPictureCard</p>
          <UploadWithPreloadedImageFromUrl
            mode="card-wall"
            size="main"
            :hints="[{ label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。' }]"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates loading pre-existing images from backend URLs. This scenario shows how Upload component handles files that are already uploaded to the server (using `url` prop instead of `file` object).',
      },
    },
  },
};

export const SingleFileLimit: Story = {
  render: () => ({
    components: { MznUpload },
    setup: () => {
      const { files, handleChange } = useControlledFiles((next) => {
        action('onChange')(next);
      });

      return {
        ariaLabels: { clickToReplace: 'Replace' },
        files,
        handleChange,
        hints: [{ label: '最多 1 個檔案。', type: 'info' as const }],
        onMaxFilesExceeded: action('onMaxFilesExceeded'),
        simulateUpload,
        storyHandlers,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; width: 800px">
        <div>
          <h3>上傳一張照片的情境</h3>
          <MznUpload
            :files="files"
            :maxFiles="1"
            mode="cards"
            :multiple="false"
            :onUpload="simulateUpload"
            :hints="hints"
            :ariaLabels="ariaLabels"
            @change="handleChange"
            @delete="storyHandlers.onDelete"
            @download="storyHandlers.onDownload"
            @max-files-exceeded="onMaxFilesExceeded"
            @reload="storyHandlers.onReload"
            @zoom-in="storyHandlers.onZoomIn"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates limiting uploads to a single file using `maxFiles={1}`. The uploader disables itself once the limit is reached. Selecting additional files triggers `onMaxFilesExceeded`.',
      },
    },
  },
};
