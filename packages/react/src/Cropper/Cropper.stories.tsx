import type { ArgTypes } from '@storybook/react-webpack5';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useCallback, useState } from 'react';
import Cropper, { CropperModal, cropToBlob, cropToDataURL, type CropperModalProps } from '.';
import Button from '../Button';
import { Upload, type UploadFile } from '../Upload';

const DEFAULT_IMAGE_URL = 'https://rytass.com/logo.png';

const sizes: Array<'tight' | 'narrow' | 'regular' | 'wide'> = ['tight', 'narrow', 'regular', 'wide'];

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
    description: 'Whether to disable closing the modal when clicking the backdrop',
    table: {
      type: { summary: 'boolean' },
    },
  },
  disableCloseOnEscapeKeyDown: {
    control: {
      type: 'boolean',
    },
    description: 'Whether to disable closing the modal when pressing the Escape key',
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
      type: { summary: '(context: CropperModalConfirmContext) => void | Promise<void>' },
    },
  },
  showModalFooter: {
    control: {
      type: 'boolean',
    },
    description: 'Whether to show the modal footer with confirm and cancel buttons',
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
  component: Cropper,
  title: 'Feedback/Cropper',
} satisfies Meta<typeof Cropper>;

type Story = StoryObj<typeof Cropper>;

function UploaderStoryContent() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleUpload = useCallback(
    async (selectedFiles: File[]) => {
      const file = selectedFiles[0];
      if (!file) return [];
      setProcessing(true);

      let uploadResult: UploadFile[] | null = null;

      const result = await CropperModal.open({
        cropperProps: {
          imageSrc: file,
          aspectRatio: 1
        },
        onCancel: () => {
          setFiles([]);
        },
        size: 'wide',
        style: { width: '640px', maxWidth: '640px' },
        title: '裁切頁首圖片',
        supportingText: '建議上傳尺寸為 2100 × 900 像素，以獲得最佳顯示效果。'
      });

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

      setProcessing(false);
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
    },
    [setFiles],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Upload
        accept="image/*"
        disabled={processing}
        files={files}
        maxFiles={1}
        mode="cards"
        onChange={(nextFiles) =>
          setFiles(
            nextFiles.filter(
              (file) => file.errorMessage !== '已取消',
            ),
          )
        }
        onUpload={handleUpload}
      />
    </div>
  );
}

function ButtonStoryContent() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleOpen = useCallback(async () => {
    await CropperModal.open({
      cropperProps: {
        imageSrc: DEFAULT_IMAGE_URL,
        aspectRatio: 4 / 3
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
        setPreviewUrl(dataUrl);
      },
      title: '裁切頁首圖片',
      size: 'regular',
      supportingText: '建議上傳尺寸為 2100 × 900 像素，以獲得最佳顯示效果。'
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '600px' }}>
      <Button variant="base-primary" onClick={handleOpen}>開啟裁切</Button>
      {previewUrl && (
        <img alt="Cropped preview" src={previewUrl} style={{ maxWidth: '100%' }} />
      )}
    </div>
  );
}

export const WithUploader: Story = {
  render: () => <UploaderStoryContent />,
};

export const WithButton: Story = {
  render: () => <ButtonStoryContent />,
};

