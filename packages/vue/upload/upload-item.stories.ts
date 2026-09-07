import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { action } from 'storybook/actions';
import MznUploadItem from './upload-item.vue';
import type { UploadItemProps } from './upload-item.types';

export default {
  title: 'Data Entry/Upload/UploadItem',
  component: MznUploadItem,
} satisfies Meta<typeof MznUploadItem>;

/**
 * React's props carry the callbacks, so its story documents them as argTypes;
 * the same rows are declared here so the two Controls panels match.
 */
type PlaygroundArgs = UploadItemProps & {
  onDelete?: (event: MouseEvent) => void;
};

type Story = StoryObj<PlaygroundArgs>;

const createMockFile = (
  name: string,
  type: string = 'application/pdf',
  sizeInBytes: number = 1024,
): File => new File([new Uint8Array(sizeInBytes)], name, { type });

export const Playground: Story = {
  args: {
    file: new File([''], 'example.jpg', { type: 'image/jpeg' }),
    size: 'main',
    status: 'done',
    onDelete: action('onDelete'),
    type: 'icon',
    errorMessage: '',
    errorIcon: undefined,
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
      description: 'The size of the upload item',
      table: {
        type: { summary: 'UploadItemSize' },
        defaultValue: { summary: 'main' },
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['icon', 'thumbnail'],
      },
      description:
        'The type of the item. "icon" shows a file icon, "thumbnail" shows a preview for images or a file icon for non-images.',
      table: {
        type: { summary: 'UploadItemType' },
        defaultValue: { summary: 'icon' },
      },
    },
    status: {
      control: {
        type: 'select',
        options: ['loading', 'done', 'error'],
      },
      description: 'The upload status of the item',
      table: {
        type: { summary: 'UploadItemStatus' },
        defaultValue: { summary: 'loading' },
      },
    },
    icon: {
      control: false,
      description: 'Custom icon for the item',
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
    errorMessage: {
      control: {
        type: 'text',
      },
      description: 'The error message to display when status is "error"',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    errorIcon: {
      control: false,
      description: 'The error icon to display when status is "error"',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
};

export const Type: Story = {
  render: () => ({
    components: { MznUploadItem },
    setup: () => ({
      imageFile: createMockFile('example.jpg', 'image/jpeg', 15360),
      onDelete: action('onDelete'),
      onReload: action('onReload'),
      pdfFile: createMockFile('document.pdf', 'application/pdf', 2048),
      textFile: createMockFile('example.txt', 'text/plain', 512),
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 400px">
        <div>
          <h3>Type: icon</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px">
            <li>
              <MznUploadItem :file="pdfFile" status="loading" type="icon" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="pdfFile" status="done" type="icon" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem
                :file="pdfFile"
                status="error"
                type="icon"
                @delete="onDelete"
                @reload="onReload"
              />
            </li>
            <li>
              <MznUploadItem :file="pdfFile" status="done" type="icon" disabled @delete="onDelete" />
            </li>
          </ul>
        </div>

        <div>
          <h3>Type: thumbnail (image)</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px">
            <li>
              <MznUploadItem :file="imageFile" status="loading" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="imageFile" status="done" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem
                :file="imageFile"
                status="error"
                type="thumbnail"
                @delete="onDelete"
                @reload="onReload"
              />
            </li>
            <li>
              <MznUploadItem
                :file="imageFile"
                status="done"
                type="thumbnail"
                disabled
                @delete="onDelete"
              />
            </li>
          </ul>
        </div>

        <div>
          <h3>Type: thumbnail (file)</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px">
            Non-image files show a file icon in thumbnail mode
          </p>
          <ul style="display: flex; flex-direction: column; gap: 8px">
            <li>
              <MznUploadItem :file="pdfFile" status="loading" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="pdfFile" status="done" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="textFile" status="done" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem
                :file="pdfFile"
                status="error"
                type="thumbnail"
                @delete="onDelete"
                @reload="onReload"
              />
            </li>
            <li>
              <MznUploadItem
                :file="pdfFile"
                status="done"
                type="thumbnail"
                disabled
                @delete="onDelete"
              />
            </li>
          </ul>
        </div>
      </div>
    `,
  }),
};

export const Status: Story = {
  render: () => ({
    components: { MznUploadItem },
    setup: () => ({
      imageFile: createMockFile('example.jpg', 'image/jpeg', 15360),
      onDelete: action('onDelete'),
      onReload: action('onReload'),
      pdfFile: createMockFile('document.pdf', 'application/pdf', 2048),
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; width: 400px">
        <!-- Loading Status -->
        <div>
          <h3>Status: loading</h3>
          <div style="display: flex; flex-direction: column; gap: 16px">
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal">Type: icon (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px">
                <li>
                  <MznUploadItem :file="pdfFile" status="loading" type="icon" size="main" @delete="onDelete" />
                </li>
                <li>
                  <MznUploadItem :file="pdfFile" status="loading" type="icon" size="sub" @delete="onDelete" />
                </li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal">Type: image thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px">
                <li>
                  <MznUploadItem :file="imageFile" status="loading" type="thumbnail" size="main" @delete="onDelete" />
                </li>
                <li>
                  <MznUploadItem :file="imageFile" status="loading" type="thumbnail" size="sub" @delete="onDelete" />
                </li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal">Type: file thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px">
                <li>
                  <MznUploadItem :file="pdfFile" status="loading" type="thumbnail" size="main" @delete="onDelete" />
                </li>
                <li>
                  <MznUploadItem :file="pdfFile" status="loading" type="thumbnail" size="sub" @delete="onDelete" />
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Done Status -->
        <div>
          <h3>Status: done</h3>
          <div style="display: flex; flex-direction: column; gap: 16px">
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal">Type: icon (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px">
                <li>
                  <MznUploadItem :file="pdfFile" status="done" type="icon" size="main" @delete="onDelete" />
                </li>
                <li>
                  <MznUploadItem :file="pdfFile" status="done" type="icon" size="sub" @delete="onDelete" />
                </li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal">Type: image thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px">
                <li>
                  <MznUploadItem :file="imageFile" status="done" type="thumbnail" size="main" @delete="onDelete" />
                </li>
                <li>
                  <MznUploadItem :file="imageFile" status="done" type="thumbnail" size="sub" @delete="onDelete" />
                </li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal">Type: file thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px">
                <li>
                  <MznUploadItem :file="pdfFile" status="done" type="thumbnail" size="main" @delete="onDelete" />
                </li>
                <li>
                  <MznUploadItem :file="pdfFile" status="done" type="thumbnail" size="sub" @delete="onDelete" />
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Error Status -->
        <div>
          <h3>Status: error</h3>
          <div style="display: flex; flex-direction: column; gap: 16px">
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal">Type: icon (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px">
                <li>
                  <MznUploadItem
                    :file="pdfFile"
                    status="error"
                    type="icon"
                    size="main"
                    errorMessage="上傳失敗，請重試"
                    @delete="onDelete"
                    @reload="onReload"
                  />
                </li>
                <li>
                  <MznUploadItem
                    :file="pdfFile"
                    status="error"
                    type="icon"
                    size="sub"
                    errorMessage="上傳失敗，請重試"
                    @delete="onDelete"
                    @reload="onReload"
                  />
                </li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal">Type: image thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px">
                <li>
                  <MznUploadItem
                    :file="imageFile"
                    status="error"
                    type="thumbnail"
                    size="main"
                    errorMessage="上傳失敗，請重試"
                    @delete="onDelete"
                    @reload="onReload"
                  />
                </li>
                <li>
                  <MznUploadItem
                    :file="imageFile"
                    status="error"
                    type="thumbnail"
                    size="sub"
                    errorMessage="上傳失敗，請重試"
                    @delete="onDelete"
                    @reload="onReload"
                  />
                </li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal">Type: file thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px">
                <li>
                  <MznUploadItem
                    :file="pdfFile"
                    status="error"
                    type="thumbnail"
                    size="main"
                    errorMessage="上傳失敗，請重試"
                    @delete="onDelete"
                    @reload="onReload"
                  />
                </li>
                <li>
                  <MznUploadItem
                    :file="pdfFile"
                    status="error"
                    type="thumbnail"
                    size="sub"
                    errorMessage="上傳失敗，請重試"
                    @delete="onDelete"
                    @reload="onReload"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Size: Story = {
  render: () => ({
    components: { MznUploadItem },
    setup: () => ({
      doneFile: createMockFile('example.jpg', 'image/jpeg', 15360),
      errorFile: createMockFile('failed-upload.txt', 'text/plain', 512),
      loadingFile: createMockFile(
        'document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf',
        'application/pdf',
        2048,
      ),
      onDelete: action('onDelete'),
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 400px">
        <div>
          <h3>Icon Type - Main</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px">
            <li>
              <MznUploadItem :file="loadingFile" status="loading" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="doneFile" status="done" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="errorFile" status="error" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="loadingFile" status="done" disabled />
            </li>
          </ul>
        </div>

        <div>
          <h3>Icon Type - Sub</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px">
            <li>
              <MznUploadItem :file="loadingFile" size="sub" status="loading" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="doneFile" size="sub" status="done" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="errorFile" size="sub" status="error" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="loadingFile" size="sub" status="done" disabled />
            </li>
          </ul>
        </div>

        <div>
          <h3>Thumbnail Type - Main</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px">
            <li>
              <MznUploadItem :file="loadingFile" status="loading" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="doneFile" status="done" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="errorFile" status="error" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="loadingFile" status="done" type="thumbnail" disabled />
            </li>
          </ul>
        </div>

        <div>
          <h3>Thumbnail Type - Sub</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px">
            <li>
              <MznUploadItem :file="loadingFile" size="sub" status="loading" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="doneFile" size="sub" status="done" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="errorFile" size="sub" status="error" type="thumbnail" @delete="onDelete" />
            </li>
            <li>
              <MznUploadItem :file="loadingFile" size="sub" status="done" type="thumbnail" disabled />
            </li>
          </ul>
        </div>
      </div>
    `,
  }),
};
