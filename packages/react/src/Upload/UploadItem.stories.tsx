import { Meta, StoryObj } from '@storybook/react-webpack5';
import { action } from 'storybook/actions';
import type { UploadItemProps } from '.';
import { UploadItem } from '.';

export default {
  title: 'Data Entry/Upload/UploadItem',
  component: UploadItem,
} satisfies Meta<typeof UploadItem>;

type Story = StoryObj<UploadItemProps>;

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
      description: 'The type of the item. "icon" shows a file icon, "thumbnail" shows a preview for images or a file icon for non-images.',
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
  render: () => {
    const createMockFile = (
      name: string,
      type: string = 'application/pdf',
      sizeInBytes: number = 1024,
    ) => {
      const content = new Uint8Array(sizeInBytes);
      return new File([content], name, { type });
    };

    const imageFile = createMockFile('example.jpg', 'image/jpeg', 15360);
    const pdfFile = createMockFile('document.pdf', 'application/pdf', 2048);
    const textFile = createMockFile('example.txt', 'text/plain', 512);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: 400,
        }}
      >
        <div>
          <h3>Type: icon</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <UploadItem
                file={pdfFile}
                status="loading"
                type="icon"
                onDelete={action('onDelete')}
              />
            </li>
            <li>
              <UploadItem
                file={pdfFile}
                status="done"
                type="icon"
                onDelete={action('onDelete')}
              />
            </li>
            <li>
              <UploadItem
                file={pdfFile}
                status="error"
                type="icon"
                onDelete={action('onDelete')}
                onReload={action('onReload')}
              />
            </li>
            <li>
              <UploadItem
                file={pdfFile}
                status="done"
                type="icon"
                disabled
                onDelete={action('onDelete')}
              />
            </li>
          </ul>
        </div>

        <div>
          <h3>Type: thumbnail (image)</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <UploadItem
                file={imageFile}
                status="loading"
                type="thumbnail"
                onDelete={action('onDelete')}
              />
            </li>
            <li>
              <UploadItem
                file={imageFile}
                status="done"
                type="thumbnail"
                onDelete={action('onDelete')}
              />
            </li>
            <li>
              <UploadItem
                file={imageFile}
                status="error"
                type="thumbnail"
                onDelete={action('onDelete')}
                onReload={action('onReload')}
              />
            </li>
            <li>
              <UploadItem
                file={imageFile}
                status="done"
                type="thumbnail"
                disabled
                onDelete={action('onDelete')}
              />
            </li>
          </ul>
        </div>

        <div>
          <h3>Type: thumbnail (file)</h3>
          <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
            Non-image files show a file icon in thumbnail mode
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <UploadItem
                file={pdfFile}
                status="loading"
                type="thumbnail"
                onDelete={action('onDelete')}
              />
            </li>
            <li>
              <UploadItem
                file={pdfFile}
                status="done"
                type="thumbnail"
                onDelete={action('onDelete')}
              />
            </li>
            <li>
              <UploadItem
                file={textFile}
                status="done"
                type="thumbnail"
                onDelete={action('onDelete')}
              />
            </li>
            <li>
              <UploadItem
                file={pdfFile}
                status="error"
                type="thumbnail"
                onDelete={action('onDelete')}
                onReload={action('onReload')}
              />
            </li>
            <li>
              <UploadItem
                file={pdfFile}
                status="done"
                type="thumbnail"
                disabled
                onDelete={action('onDelete')}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  },
};

export const Status: Story = {
  render: () => {
    const createMockFile = (
      name: string,
      type: string = 'application/pdf',
      sizeInBytes: number = 1024,
    ) => {
      const content = new Uint8Array(sizeInBytes);
      return new File([content], name, { type });
    };

    const imageFile = createMockFile('example.jpg', 'image/jpeg', 15360);
    const pdfFile = createMockFile('document.pdf', 'application/pdf', 2048);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          width: 400,
        }}
      >
        {/* Loading Status */}
        <div>
          <h3>Status: loading</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'normal' }}>Type: icon (main, sub)</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="loading"
                    type="icon"
                    size="main"
                    onDelete={action('onDelete')}
                  />
                </li>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="loading"
                    type="icon"
                    size="sub"
                    onDelete={action('onDelete')}
                  />
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'normal' }}>Type: image thumbnail (main, sub)</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <UploadItem
                    file={imageFile}
                    status="loading"
                    type="thumbnail"
                    size="main"
                    onDelete={action('onDelete')}
                  />
                </li>
                <li>
                  <UploadItem
                    file={imageFile}
                    status="loading"
                    type="thumbnail"
                    size="sub"
                    onDelete={action('onDelete')}
                  />
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'normal' }}>Type: file thumbnail (main, sub)</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="loading"
                    type="thumbnail"
                    size="main"
                    onDelete={action('onDelete')}
                  />
                </li>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="loading"
                    type="thumbnail"
                    size="sub"
                    onDelete={action('onDelete')}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Done Status */}
        <div>
          <h3>Status: done</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'normal' }}>Type: icon (main, sub)</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="done"
                    type="icon"
                    size="main"
                    onDelete={action('onDelete')}
                  />
                </li>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="done"
                    type="icon"
                    size="sub"
                    onDelete={action('onDelete')}
                  />
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'normal' }}>Type: image thumbnail (main, sub)</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <UploadItem
                    file={imageFile}
                    status="done"
                    type="thumbnail"
                    size="main"
                    onDelete={action('onDelete')}
                  />
                </li>
                <li>
                  <UploadItem
                    file={imageFile}
                    status="done"
                    type="thumbnail"
                    size="sub"
                    onDelete={action('onDelete')}
                  />
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'normal' }}>Type: file thumbnail (main, sub)</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="done"
                    type="thumbnail"
                    size="main"
                    onDelete={action('onDelete')}
                  />
                </li>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="done"
                    type="thumbnail"
                    size="sub"
                    onDelete={action('onDelete')}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Status */}
        <div>
          <h3>Status: error</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'normal' }}>Type: icon (main, sub)</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="error"
                    type="icon"
                    size="main"
                    errorMessage="上傳失敗，請重試"
                    onDelete={action('onDelete')}
                    onReload={action('onReload')}
                  />
                </li>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="error"
                    type="icon"
                    size="sub"
                    errorMessage="上傳失敗，請重試"
                    onDelete={action('onDelete')}
                    onReload={action('onReload')}
                  />
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'normal' }}>Type: image thumbnail (main, sub)</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <UploadItem
                    file={imageFile}
                    status="error"
                    type="thumbnail"
                    size="main"
                    errorMessage="上傳失敗，請重試"
                    onDelete={action('onDelete')}
                    onReload={action('onReload')}
                  />
                </li>
                <li>
                  <UploadItem
                    file={imageFile}
                    status="error"
                    type="thumbnail"
                    size="sub"
                    errorMessage="上傳失敗，請重試"
                    onDelete={action('onDelete')}
                    onReload={action('onReload')}
                  />
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'normal' }}>Type: file thumbnail (main, sub)</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="error"
                    type="thumbnail"
                    size="main"
                    errorMessage="上傳失敗，請重試"
                    onDelete={action('onDelete')}
                    onReload={action('onReload')}
                  />
                </li>
                <li>
                  <UploadItem
                    file={pdfFile}
                    status="error"
                    type="thumbnail"
                    size="sub"
                    errorMessage="上傳失敗，請重試"
                    onDelete={action('onDelete')}
                    onReload={action('onReload')}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const Size: Story = {
  render: () => {
    const createMockFile = (
      name: string,
      type: string = 'application/pdf',
      sizeInBytes: number = 1024,
    ) => {
      const content = new Uint8Array(sizeInBytes);
      return new File([content], name, { type });
    };

    // Create a file with exactly 100 characters filename to test ellipsis behavior
    const longFileName = 'document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf';
    const loadingFile = createMockFile(longFileName, 'application/pdf', 2048);
    const doneFile = createMockFile('example.jpg', 'image/jpeg', 15360);
    const errorFile = createMockFile('failed-upload.txt', 'text/plain', 512);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: 400,
        }}
      >
        <div>
          <h3>Icon Type - Main</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <UploadItem file={loadingFile} status="loading" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={doneFile} status="done" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={errorFile} status="error" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={loadingFile} status="done" disabled />
            </li>
          </ul>
        </div>

        <div>
          <h3>Icon Type - Sub</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <UploadItem file={loadingFile} size="sub" status="loading" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={doneFile} size="sub" status="done" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={errorFile} size="sub" status="error" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={loadingFile} size="sub" status="done" disabled />
            </li>
          </ul>
        </div>

        <div>
          <h3>Thumbnail Type - Main</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <UploadItem file={loadingFile} status="loading" type="thumbnail" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={doneFile} status="done" type="thumbnail" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={errorFile} status="error" type="thumbnail" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={loadingFile} status="done" type="thumbnail" disabled />
            </li>
          </ul>
        </div>

        <div>
          <h3>Thumbnail Type - Sub</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <UploadItem file={loadingFile} size="sub" status="loading" type="thumbnail" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={doneFile} size="sub" status="done" type="thumbnail" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={errorFile} size="sub" status="error" type="thumbnail" onDelete={action('onDelete')} />
            </li>
            <li>
              <UploadItem file={loadingFile} size="sub" status="done" type="thumbnail" disabled />
            </li>
          </ul>
        </div>
      </div>
    );
  },
};

