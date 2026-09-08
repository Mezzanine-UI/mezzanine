import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { onMounted, ref } from 'vue';
import { action } from 'storybook/actions';
import MznUploadPictureCard from './upload-picture-card.vue';
import type { UploadPictureCardProps } from './upload-picture-card.types';

export default {
  title: 'Data Entry/Upload/UploadPictureCard',
  component: MznUploadPictureCard,
} satisfies Meta<typeof MznUploadPictureCard>;

/**
 * React's props carry the callbacks, so its story documents them as argTypes;
 * the same rows are declared here so the two Controls panels match.
 */
type PlaygroundArgs = UploadPictureCardProps & {
  onDelete?: (event: MouseEvent) => void;
};

type Story = StoryObj<PlaygroundArgs>;

// Helper function to load image from URL and convert to File object
async function createFileFromUrl(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new File([blob], fileName, { type: blob.type || 'image/png' });
}

/** Loads the shared logo, falling back to a mock file if the fetch fails. */
function useLogoFile(withFallback: boolean) {
  const imageFile = ref<File | null>(null);

  onMounted(() => {
    createFileFromUrl('https://rytass.com/logo.png', 'logo.png')
      .then((file) => {
        imageFile.value = file;
      })
      .catch((error) => {
        console.error('Failed to load image:', error);

        if (withFallback) {
          // use mock file if load image failed
          imageFile.value = new File([''], 'example.jpg', {
            type: 'image/jpeg',
          });
        }
      });
  });

  return imageFile;
}

export const Playground: Story = {
  render: (args) => ({
    components: { MznUploadPictureCard },
    setup: () => ({
      args,
      imageFile: useLogoFile(true),
      onDelete: args.onDelete ?? action('onDelete'),
    }),
    template: `
      <MznUploadPictureCard
        v-if="imageFile"
        v-bind="args"
        :file="imageFile"
        :size="args.size || 'main'"
        :imageFit="args.imageFit || 'cover'"
        @delete="onDelete"
      />
    `,
  }),
  args: {
    file: new File([''], 'example.jpg', { type: 'image/jpeg' }),
    onDelete: action('onDelete'),
    size: 'main',
  },
  argTypes: {
    file: {
      control: false,
      description: 'The file to display',
      table: {
        type: { summary: 'File' },
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['main', 'sub', 'minor'],
      },
      description: 'The size of the upload picture card',
      table: {
        type: { summary: 'UploadPictureCardSize' },
        defaultValue: { summary: 'main' },
      },
    },
    imageFit: {
      control: {
        type: 'select',
        options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      },
      description: 'The image fit of the upload picture card',
      table: {
        type: { summary: 'UploadPictureCardImageFit' },
        defaultValue: { summary: 'cover' },
      },
    },
    errorMessage: {
      control: {
        type: 'text',
      },
      description: 'Error message to display when status is error',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    errorIcon: {
      control: false,
      description: 'Error icon to display when status is error',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onDelete: {
      description: 'When delete icon is clicked, this callback will be fired',
      table: {
        type: { summary: 'MouseEventHandler' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
};

export const Basic: Story = {
  render: () => ({
    components: { MznUploadPictureCard },
    setup: () => ({
      imageFile: useLogoFile(false),
      onDelete: action('onDelete'),
      onDownload: action('onDownload'),
      onReload: action('onReload'),
      onReplace: action('onReplace'),
      onZoomIn: action('onZoomIn'),
      replaceLabels: { clickToReplace: 'Replace' },
    }),
    template: `
      <div
        v-if="imageFile"
        style="display: flex; flex-direction: column; gap: 16px; width: 400px"
      >
        <ul style="display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0">
          <li>
            <p>Uploading:</p>
            <MznUploadPictureCard
              :file="imageFile"
              imageFit="contain"
              @delete="onDelete"
            />
          </li>
          <li>
            <p>Enable & Hover-Multiple Files:</p>
            <MznUploadPictureCard
              :file="imageFile"
              imageFit="contain"
              status="done"
              @delete="onDelete"
              @zoom-in="onZoomIn"
              @download="onDownload"
            />
          </li>
          <li>
            <p>Hover-Limit Single File:</p>
            <MznUploadPictureCard
              :file="imageFile"
              :ariaLabels="replaceLabels"
              status="done"
              @delete="onDelete"
              @replace="onReplace"
            />
          </li>
          <li>
            <p>Error:</p>
            <MznUploadPictureCard
              :file="imageFile"
              imageFit="contain"
              status="error"
              @delete="onDelete"
              @reload="onReload"
            />
          </li>
          <li>
            <p>Disable:</p>
            <MznUploadPictureCard
              :file="imageFile"
              imageFit="contain"
              status="done"
              disabled
              @zoom-in="onZoomIn"
              @download="onDownload"
              @delete="onDelete"
            />
          </li>
          <li>
            <p>Read Only:</p>
            <MznUploadPictureCard
              :file="imageFile"
              imageFit="contain"
              status="done"
              readable
              @zoom-in="onZoomIn"
              @download="onDownload"
              @delete="onDelete"
            />
          </li>
        </ul>
      </div>
    `,
  }),
};

export const NonImageFiles: Story = {
  render: () => ({
    components: { MznUploadPictureCard },
    setup: () => ({
      docFile: new File(['DOC content'], 'document.doc', {
        type: 'application/msword',
      }),
      onDelete: action('onDelete'),
      onDownload: action('onDownload'),
      onReload: action('onReload'),
      onZoomIn: action('onZoomIn'),
      pdfFile: new File(['PDF content'], 'document.pdf', {
        type: 'application/pdf',
      }),
      txtFile: new File(['Text content'], 'document.txt', {
        type: 'text/plain',
      }),
      zipFile: new File(['ZIP content'], 'archive.zip', {
        type: 'application/zip',
      }),
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 400px">
        <h3 style="margin-bottom: 8px; margin-top: 0; font-size: 16px; font-weight: 600">
          Non-Image Files
        </h3>
        <ul style="display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0">
          <li>
            <MznUploadPictureCard :file="pdfFile" status="loading" @delete="onDelete" />
          </li>
          <li>
            <MznUploadPictureCard
              :file="docFile"
              status="done"
              @delete="onDelete"
              @download="onDownload"
              @zoom-in="onZoomIn"
            />
          </li>
          <li>
            <MznUploadPictureCard
              :file="txtFile"
              status="error"
              errorMessage="Upload failed"
              @delete="onDelete"
              @reload="onReload"
            />
          </li>
          <li>
            <MznUploadPictureCard
              :file="zipFile"
              status="done"
              disabled
              @delete="onDelete"
              @download="onDownload"
              @zoom-in="onZoomIn"
            />
          </li>
          <li>
            <MznUploadPictureCard
              :file="pdfFile"
              status="done"
              size="sub"
              @delete="onDelete"
              @download="onDownload"
              @zoom-in="onZoomIn"
            />
          </li>
          <li>
            <MznUploadPictureCard
              :file="docFile"
              status="done"
              size="minor"
              @delete="onDelete"
              @download="onDownload"
              @zoom-in="onZoomIn"
            />
          </li>
        </ul>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of UploadPictureCard displaying non-image files (PDF, DOC, TXT, ZIP, etc.). When a non-image file is provided, the component will display accordingly based on the file type.',
      },
    },
  },
};

export const ReplaceMode: Story = {
  render: () => ({
    components: { MznUploadPictureCard },
    setup: () => ({
      onDelete: action('onDelete'),
      onReplace: action('onReplace'),
      pdfFile: new File(['PDF content'], 'report.pdf', {
        type: 'application/pdf',
      }),
      replaceLabels: { clickToReplace: 'Replace' },
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 400px">
        <h3 style="margin-bottom: 8px; margin-top: 0; font-size: 16px; font-weight: 600">
          Replace Mode (hover to see overlay)
        </h3>
        <ul style="display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0">
          <li>
            <MznUploadPictureCard
              :file="pdfFile"
              status="done"
              :ariaLabels="replaceLabels"
              @delete="onDelete"
              @replace="onReplace"
            />
          </li>
          <li>
            <MznUploadPictureCard
              :file="pdfFile"
              status="done"
              size="sub"
              :ariaLabels="replaceLabels"
              @delete="onDelete"
              @replace="onReplace"
            />
          </li>
        </ul>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'When `onReplace` is provided and status is `done`, the card becomes a replacement trigger. Hover to reveal the "Click to Replace" overlay label. The trash button remains visible on hover; zoom and download buttons are omitted when not passed.',
      },
    },
  },
};
