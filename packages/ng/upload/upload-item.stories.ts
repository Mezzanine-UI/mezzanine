import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznUploadItem } from './upload-item.component';

export default {
  title: 'Data Entry/Upload/UploadItem',
  component: MznUploadItem,
  decorators: [
    moduleMetadata({
      imports: [MznUploadItem],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

const playgroundFile = new File([''], 'example.jpg', { type: 'image/jpeg' });

export const Playground: Story = {
  args: {
    file: playgroundFile,
    size: 'main',
    status: 'done',
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
      options: ['main', 'sub'],
      control: { type: 'select' },
      description: 'The size of the upload item',
      table: {
        type: { summary: 'UploadItemSize' },
        defaultValue: { summary: 'main' },
      },
    },
    type: {
      options: ['icon', 'thumbnail'],
      control: { type: 'select' },
      description:
        'The type of the item. "icon" shows a file icon, "thumbnail" shows a preview for images or a file icon for non-images.',
      table: {
        type: { summary: 'UploadItemType' },
        defaultValue: { summary: 'icon' },
      },
    },
    status: {
      options: ['loading', 'done', 'error'],
      control: { type: 'select' },
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
        type: { summary: 'IconDefinition' },
        defaultValue: { summary: 'undefined' },
      },
    },
    delete: {
      description: 'When delete icon is clicked, this callback will be fired',
      table: {
        type: { summary: 'EventEmitter<MouseEvent>' },
        defaultValue: { summary: 'undefined' },
      },
    },
    errorMessage: {
      control: { type: 'text' },
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
        type: { summary: 'IconDefinition' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onDelete: (event: MouseEvent): void => {
        console.log('onDelete', event);
      },
    },
    template: `
      <div mznUploadItem
        [file]="file"
        [size]="size"
        [status]="status"
        [type]="type"
        [errorMessage]="errorMessage"
        [errorIcon]="errorIcon"
        (delete)="onDelete($event)"
      ></div>
    `,
  }),
};

function createMockFile(
  name: string,
  type = 'application/pdf',
  sizeInBytes = 1024,
): File {
  const content = new Uint8Array(sizeInBytes);

  return new File([content], name, { type });
}

export const Type: Story = {
  render: () => {
    const imageFile = createMockFile('example.jpg', 'image/jpeg', 15360);
    const pdfFile = createMockFile('document.pdf', 'application/pdf', 2048);
    const textFile = createMockFile('example.txt', 'text/plain', 512);

    return {
      props: {
        imageFile,
        pdfFile,
        textFile,
        onDelete: (event: MouseEvent): void => {
          console.log('onDelete', event);
        },
        onReload: (event: MouseEvent): void => {
          console.log('onReload', event);
        },
      },
      template: `
        <div style="display: flex; flex-direction: column; gap: 24px; width: 400px;">
          <div>
            <h3>Type: icon</h3>
            <ul style="display: flex; flex-direction: column; gap: 8px;">
              <li><div mznUploadItem [file]="pdfFile" status="loading" type="icon" (delete)="onDelete($event)"></div></li>
              <li><div mznUploadItem [file]="pdfFile" status="done" type="icon" (delete)="onDelete($event)"></div></li>
              <li><div mznUploadItem [file]="pdfFile" status="error" type="icon" (delete)="onDelete($event)" (reload)="onReload($event)"></div></li>
              <li><div mznUploadItem [file]="pdfFile" status="done" type="icon" [disabled]="true" (delete)="onDelete($event)"></div></li>
            </ul>
          </div>
          <div>
            <h3>Type: thumbnail (image)</h3>
            <ul style="display: flex; flex-direction: column; gap: 8px;">
              <li><div mznUploadItem [file]="imageFile" status="loading" type="thumbnail" (delete)="onDelete($event)"></div></li>
              <li><div mznUploadItem [file]="imageFile" status="done" type="thumbnail" (delete)="onDelete($event)"></div></li>
              <li><div mznUploadItem [file]="imageFile" status="error" type="thumbnail" (delete)="onDelete($event)" (reload)="onReload($event)"></div></li>
              <li><div mznUploadItem [file]="imageFile" status="done" type="thumbnail" [disabled]="true" (delete)="onDelete($event)"></div></li>
            </ul>
          </div>
          <div>
            <h3>Type: thumbnail (file)</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Non-image files show a file icon in thumbnail mode</p>
            <ul style="display: flex; flex-direction: column; gap: 8px;">
              <li><div mznUploadItem [file]="pdfFile" status="loading" type="thumbnail" (delete)="onDelete($event)"></div></li>
              <li><div mznUploadItem [file]="pdfFile" status="done" type="thumbnail" (delete)="onDelete($event)"></div></li>
              <li><div mznUploadItem [file]="textFile" status="done" type="thumbnail" (delete)="onDelete($event)"></div></li>
              <li><div mznUploadItem [file]="pdfFile" status="error" type="thumbnail" (delete)="onDelete($event)" (reload)="onReload($event)"></div></li>
              <li><div mznUploadItem [file]="pdfFile" status="done" type="thumbnail" [disabled]="true" (delete)="onDelete($event)"></div></li>
            </ul>
          </div>
        </div>
      `,
    };
  },
};

export const Status: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; width: 400px;">
        <div>
          <h3>Status: loading</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: icon (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><div mznUploadItem fileName="document.pdf" status="loading" size="main" ></div></li>
                <li><div mznUploadItem fileName="document.pdf" status="loading" size="sub" ></div></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: image thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><div mznUploadItem fileName="example.jpg" status="loading" size="main" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
                <li><div mznUploadItem fileName="example.jpg" status="loading" size="sub" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: file thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><div mznUploadItem fileName="document.pdf" status="loading" size="main" ></div></li>
                <li><div mznUploadItem fileName="document.pdf" status="loading" size="sub" ></div></li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h3>Status: done</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: icon (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><div mznUploadItem fileName="document.pdf" status="done" size="main" ></div></li>
                <li><div mznUploadItem fileName="document.pdf" status="done" size="sub" ></div></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: image thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><div mznUploadItem fileName="example.jpg" status="done" size="main" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
                <li><div mznUploadItem fileName="example.jpg" status="done" size="sub" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: file thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><div mznUploadItem fileName="document.pdf" status="done" size="main" ></div></li>
                <li><div mznUploadItem fileName="document.pdf" status="done" size="sub" ></div></li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h3>Status: error</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: icon (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><div mznUploadItem fileName="document.pdf" status="error" size="main" errorMessage="上傳失敗，請重試" ></div></li>
                <li><div mznUploadItem fileName="document.pdf" status="error" size="sub" errorMessage="上傳失敗，請重試" ></div></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: image thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><div mznUploadItem fileName="example.jpg" status="error" size="main" thumbnailUrl="https://rytass.com/logo.png" errorMessage="上傳失敗，請重試" ></div></li>
                <li><div mznUploadItem fileName="example.jpg" status="error" size="sub" thumbnailUrl="https://rytass.com/logo.png" errorMessage="上傳失敗，請重試" ></div></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: file thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><div mznUploadItem fileName="document.pdf" status="error" size="main" errorMessage="上傳失敗，請重試" ></div></li>
                <li><div mznUploadItem fileName="document.pdf" status="error" size="sub" errorMessage="上傳失敗，請重試" ></div></li>
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
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 400px;">
        <div>
          <h3>Icon Type - Main</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><div mznUploadItem fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="loading" ></div></li>
            <li><div mznUploadItem fileName="example.jpg" status="done" ></div></li>
            <li><div mznUploadItem fileName="failed-upload.txt" status="error" ></div></li>
            <li><div mznUploadItem fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="done" [disabled]="true" ></div></li>
          </ul>
        </div>
        <div>
          <h3>Icon Type - Sub</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><div mznUploadItem fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="loading" size="sub" ></div></li>
            <li><div mznUploadItem fileName="example.jpg" status="done" size="sub" ></div></li>
            <li><div mznUploadItem fileName="failed-upload.txt" status="error" size="sub" ></div></li>
            <li><div mznUploadItem fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="done" size="sub" [disabled]="true" ></div></li>
          </ul>
        </div>
        <div>
          <h3>Thumbnail Type - Main</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><div mznUploadItem fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="loading" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
            <li><div mznUploadItem fileName="example.jpg" status="done" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
            <li><div mznUploadItem fileName="failed-upload.txt" status="error" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
            <li><div mznUploadItem fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="done" thumbnailUrl="https://rytass.com/logo.png" [disabled]="true" ></div></li>
          </ul>
        </div>
        <div>
          <h3>Thumbnail Type - Sub</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><div mznUploadItem fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="loading" size="sub" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
            <li><div mznUploadItem fileName="example.jpg" status="done" size="sub" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
            <li><div mznUploadItem fileName="failed-upload.txt" status="error" size="sub" thumbnailUrl="https://rytass.com/logo.png" ></div></li>
            <li><div mznUploadItem fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="done" size="sub" thumbnailUrl="https://rytass.com/logo.png" [disabled]="true" ></div></li>
          </ul>
        </div>
      </div>
    `,
  }),
};
