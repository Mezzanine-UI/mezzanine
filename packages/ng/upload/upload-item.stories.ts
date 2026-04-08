import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznUploadItem } from './upload-item.component';

export default {
  title: 'Data Entry/Upload/UploadItem',
  decorators: [
    moduleMetadata({
      imports: [MznUploadItem],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the upload item actions are disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'The error message to display when status is "error".',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    fileName: {
      control: { type: 'text' },
      description: 'The file name to display (required).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    size: {
      options: ['main', 'sub'],
      control: { type: 'select' },
      description: 'The size of the upload item.',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
      },
    },
    status: {
      options: ['done', 'error', 'loading'],
      control: { type: 'select' },
      description: 'The upload status of the item.',
      table: {
        type: { summary: "'done' | 'error' | 'loading'" },
        defaultValue: { summary: "'done'" },
      },
    },
    thumbnailUrl: {
      control: { type: 'text' },
      description: 'The thumbnail URL for image preview.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  args: {
    disabled: false,
    errorMessage: '',
    fileName: 'example.pdf',
    size: 'main',
    status: 'done',
    thumbnailUrl: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-upload-item
        [disabled]="disabled"
        [errorMessage]="errorMessage"
        [fileName]="fileName"
        [size]="size"
        [status]="status"
        [thumbnailUrl]="thumbnailUrl"
      />
    `,
  }),
};

export const Type: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 400px;">
        <div>
          <h3>Type: icon</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><mzn-upload-item fileName="document.pdf" status="loading" /></li>
            <li><mzn-upload-item fileName="document.pdf" status="done" /></li>
            <li><mzn-upload-item fileName="document.pdf" status="error" errorMessage="上傳失敗，請重試" /></li>
            <li><mzn-upload-item fileName="document.pdf" status="done" [disabled]="true" /></li>
          </ul>
        </div>
        <div>
          <h3>Type: thumbnail (image)</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><mzn-upload-item fileName="example.jpg" status="loading" thumbnailUrl="https://rytass.com/logo.png" /></li>
            <li><mzn-upload-item fileName="example.jpg" status="done" thumbnailUrl="https://rytass.com/logo.png" /></li>
            <li><mzn-upload-item fileName="example.jpg" status="error" thumbnailUrl="https://rytass.com/logo.png" errorMessage="上傳失敗，請重試" /></li>
            <li><mzn-upload-item fileName="example.jpg" status="done" thumbnailUrl="https://rytass.com/logo.png" [disabled]="true" /></li>
          </ul>
        </div>
        <div>
          <h3>Type: thumbnail (file)</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Non-image files show a file icon in thumbnail mode</p>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><mzn-upload-item fileName="document.pdf" status="loading" /></li>
            <li><mzn-upload-item fileName="document.pdf" status="done" /></li>
            <li><mzn-upload-item fileName="example.txt" status="done" /></li>
            <li><mzn-upload-item fileName="document.pdf" status="error" errorMessage="上傳失敗，請重試" /></li>
            <li><mzn-upload-item fileName="document.pdf" status="done" [disabled]="true" /></li>
          </ul>
        </div>
      </div>
    `,
  }),
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
                <li><mzn-upload-item fileName="document.pdf" status="loading" size="main" /></li>
                <li><mzn-upload-item fileName="document.pdf" status="loading" size="sub" /></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: image thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><mzn-upload-item fileName="example.jpg" status="loading" size="main" thumbnailUrl="https://rytass.com/logo.png" /></li>
                <li><mzn-upload-item fileName="example.jpg" status="loading" size="sub" thumbnailUrl="https://rytass.com/logo.png" /></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: file thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><mzn-upload-item fileName="document.pdf" status="loading" size="main" /></li>
                <li><mzn-upload-item fileName="document.pdf" status="loading" size="sub" /></li>
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
                <li><mzn-upload-item fileName="document.pdf" status="done" size="main" /></li>
                <li><mzn-upload-item fileName="document.pdf" status="done" size="sub" /></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: image thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><mzn-upload-item fileName="example.jpg" status="done" size="main" thumbnailUrl="https://rytass.com/logo.png" /></li>
                <li><mzn-upload-item fileName="example.jpg" status="done" size="sub" thumbnailUrl="https://rytass.com/logo.png" /></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: file thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><mzn-upload-item fileName="document.pdf" status="done" size="main" /></li>
                <li><mzn-upload-item fileName="document.pdf" status="done" size="sub" /></li>
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
                <li><mzn-upload-item fileName="document.pdf" status="error" size="main" errorMessage="上傳失敗，請重試" /></li>
                <li><mzn-upload-item fileName="document.pdf" status="error" size="sub" errorMessage="上傳失敗，請重試" /></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: image thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><mzn-upload-item fileName="example.jpg" status="error" size="main" thumbnailUrl="https://rytass.com/logo.png" errorMessage="上傳失敗，請重試" /></li>
                <li><mzn-upload-item fileName="example.jpg" status="error" size="sub" thumbnailUrl="https://rytass.com/logo.png" errorMessage="上傳失敗，請重試" /></li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: normal;">Type: file thumbnail (main, sub)</h4>
              <ul style="display: flex; flex-direction: column; gap: 8px;">
                <li><mzn-upload-item fileName="document.pdf" status="error" size="main" errorMessage="上傳失敗，請重試" /></li>
                <li><mzn-upload-item fileName="document.pdf" status="error" size="sub" errorMessage="上傳失敗，請重試" /></li>
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
            <li><mzn-upload-item fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="loading" /></li>
            <li><mzn-upload-item fileName="example.jpg" status="done" /></li>
            <li><mzn-upload-item fileName="failed-upload.txt" status="error" /></li>
            <li><mzn-upload-item fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="done" [disabled]="true" /></li>
          </ul>
        </div>
        <div>
          <h3>Icon Type - Sub</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><mzn-upload-item fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="loading" size="sub" /></li>
            <li><mzn-upload-item fileName="example.jpg" status="done" size="sub" /></li>
            <li><mzn-upload-item fileName="failed-upload.txt" status="error" size="sub" /></li>
            <li><mzn-upload-item fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="done" size="sub" [disabled]="true" /></li>
          </ul>
        </div>
        <div>
          <h3>Thumbnail Type - Main</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><mzn-upload-item fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="loading" thumbnailUrl="https://rytass.com/logo.png" /></li>
            <li><mzn-upload-item fileName="example.jpg" status="done" thumbnailUrl="https://rytass.com/logo.png" /></li>
            <li><mzn-upload-item fileName="failed-upload.txt" status="error" thumbnailUrl="https://rytass.com/logo.png" /></li>
            <li><mzn-upload-item fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="done" thumbnailUrl="https://rytass.com/logo.png" [disabled]="true" /></li>
          </ul>
        </div>
        <div>
          <h3>Thumbnail Type - Sub</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px;">
            <li><mzn-upload-item fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="loading" size="sub" thumbnailUrl="https://rytass.com/logo.png" /></li>
            <li><mzn-upload-item fileName="example.jpg" status="done" size="sub" thumbnailUrl="https://rytass.com/logo.png" /></li>
            <li><mzn-upload-item fileName="failed-upload.txt" status="error" size="sub" thumbnailUrl="https://rytass.com/logo.png" /></li>
            <li><mzn-upload-item fileName="document-with-very-long-name-that-exceeds-normal-length-to-test-ellipsis-behavior-in-upload-item.pdf" status="done" size="sub" thumbnailUrl="https://rytass.com/logo.png" [disabled]="true" /></li>
          </ul>
        </div>
      </div>
    `,
  }),
};
