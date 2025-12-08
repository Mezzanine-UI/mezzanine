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
    onDelete: action('onDelete'),
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
  },
};

export const Basic: Story = {
  render: () => {
    const createMockFile = (
      name: string,
      type: string = 'application/pdf',
      sizeInBytes: number = 1024,
    ) => {
      const sanitizedName = name.trim();
      const dangerousPatterns = [
        /\.\./g,
        /[/\\]/g,
        /^[a-zA-Z]:/g,
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(sanitizedName)) {
          throw new Error(`不安全的文件名稱: ${name}`);
        }
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      if (!allowedTypes.includes(type)) {
        throw new Error(`不允許的文件類型: ${type}`);
      }

      // 文件大小安全檢查：限制最大 100MB，防止記憶體攻擊
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
      if (sizeInBytes < 0 || sizeInBytes > MAX_FILE_SIZE) {
        throw new Error(`文件大小必須在 0 到 ${MAX_FILE_SIZE / 1024 / 1024}MB 之間`);
      }

      // 創建指定大小的 Blob 內容（使用空字節）
      const content = new Uint8Array(sizeInBytes);
      return new File([content], sanitizedName, { type });
    };

    const loadingFile = createMockFile('document.pdf', 'application/pdf', 2048);
    const doneFile = createMockFile('example.jpg', 'image/jpeg', 15360);
    const errorFile = createMockFile('failed-upload.txt', 'text/plain', 512);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: 400,
        }}
      >
        <h3>Main Size:</h3>
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
        <h3>Sub Size:</h3>
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
    );
  },
};

