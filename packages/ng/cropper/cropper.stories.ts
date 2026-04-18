import { Component, inject, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznUpload, type UploadFile } from '@mezzanine-ui/ng/upload';
import { cropToBlob, cropToDataURL } from './cropper-tools';
import { MznCropperModalService } from './cropper-modal.service';

const DEFAULT_IMAGE_URL = 'https://rytass.com/logo.png';

export default {
  title: 'Feedback/Cropper',
} satisfies Meta;

type Story = StoryObj;

@Component({
  selector: 'mzn-cropper-with-uploader-story',
  standalone: true,
  imports: [MznUpload],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div
        mznUpload
        accept="image/*"
        mode="cards"
        [maxFiles]="1"
        [files]="files()"
        [multiple]="false"
        [uploadHandler]="handleUpload"
        (filesChange)="onFilesChange($event)"
      >
        <span>點擊或拖放圖片至此區域上傳</span>
      </div>
    </div>
  `,
})
class WithUploaderStoryComponent {
  private readonly cropperModal = inject(MznCropperModalService);

  readonly files = signal<readonly UploadFile[]>([]);

  onFilesChange(next: readonly UploadFile[]): void {
    this.files.set(
      next.filter((f) => f.errorMessage !== '已取消') as readonly UploadFile[],
    );
  }

  readonly handleUpload = async (
    selectedFiles: File[],
  ): Promise<readonly UploadFile[]> => {
    const file = selectedFiles[0];
    if (!file) return [];

    const result = await this.cropperModal.open({
      cropperProps: {
        aspectRatio: 1,
        imageSrc: file,
      },
      dialogStyle: { maxWidth: '640px', width: '640px' },
      onCancel: () => {
        this.files.set([]);
      },
      size: 'wide',
      supportingText: '建議上傳尺寸為 2100 × 900 像素，以獲得最佳顯示效果。',
      title: '裁切頁首圖片',
    });

    if (result && result.cropArea && result.imageSrc) {
      const blob = await cropToBlob({
        cropArea: result.cropArea,
        format: 'image/png',
        imageSrc: result.imageSrc,
        quality: 0.9,
      });
      const dataUrl = await cropToDataURL({
        cropArea: result.cropArea,
        format: 'image/png',
        imageSrc: result.imageSrc,
        quality: 0.9,
      });
      const croppedName = `cropped-${Date.now()}.png`;
      const croppedFile = new File([blob], croppedName, {
        type: 'image/png',
      });
      return [
        {
          file: croppedFile,
          id: `cropped-${Date.now()}`,
          name: croppedName,
          status: 'done' as const,
          url: dataUrl,
        },
      ];
    }

    return [
      {
        errorMessage: '已取消',
        id: `cancel-${Date.now()}`,
        name: '已取消',
        status: 'error' as const,
      },
    ];
  };
}

export const WithUploader: Story = {
  decorators: [moduleMetadata({ imports: [WithUploaderStoryComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<mzn-cropper-with-uploader-story />`,
  }),
};

@Component({
  selector: 'mzn-cropper-with-button-story',
  standalone: true,
  imports: [MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; width: 600px;"
    >
      <button mznButton variant="base-primary" (click)="handleOpen()">
        開啟裁切
      </button>
      @if (previewUrl()) {
        <img
          alt="Cropped preview"
          [src]="previewUrl()!"
          style="max-width: 100%;"
        />
      }
    </div>
  `,
})
class WithButtonStoryComponent {
  private readonly cropperModal = inject(MznCropperModalService);

  readonly previewUrl = signal<string | null>(null);

  async handleOpen(): Promise<void> {
    await this.cropperModal.open({
      cropperProps: {
        aspectRatio: 4 / 3,
        imageSrc: DEFAULT_IMAGE_URL,
      },
      onConfirm: async ({ cropArea, imageSrc }) => {
        if (!cropArea || !imageSrc) return;
        const dataUrl = await cropToDataURL({
          cropArea,
          format: 'image/png',
          imageSrc,
          quality: 0.9,
        });
        this.previewUrl.set(dataUrl);
      },
      size: 'regular',
      supportingText: '建議上傳尺寸為 2100 × 900 像素，以獲得最佳顯示效果。',
      title: '裁切頁首圖片',
    });
  }
}

export const WithButton: Story = {
  decorators: [moduleMetadata({ imports: [WithButtonStoryComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<mzn-cropper-with-button-story />`,
  }),
};
