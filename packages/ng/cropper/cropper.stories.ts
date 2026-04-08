import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznCropper, type CropArea } from './cropper.component';
import { MznUpload, type UploadFile } from '@mezzanine-ui/ng/upload';

export default {
  title: 'Feedback/Cropper',
  decorators: [
    moduleMetadata({
      imports: [MznCropper, MznUpload],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

@Component({
  selector: 'mzn-cropper-with-uploader-story',
  standalone: true,
  imports: [MznCropper, MznUpload],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      @if (pendingImageSrc()) {
        <div
          style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;"
        >
          <div
            style="background: #fff; border-radius: 8px; padding: 24px; width: 640px; max-width: 90vw; display: flex; flex-direction: column; gap: 16px;"
          >
            <h3 style="margin: 0;">裁切頁首圖片</h3>
            <p style="margin: 0; font-size: 14px; color: #666;"
              >建議上傳尺寸為 2100 × 900 像素，以獲得最佳顯示效果。</p
            >
            <div
              mznCropper
              [imageSrc]="pendingImageSrc()!"
              [aspectRatio]="1"
              (cropChange)="onCropChange($event)"
            ></div>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <button
                type="button"
                (click)="onCancel()"
                style="padding: 8px 16px; cursor: pointer;"
                >取消</button
              >
              <button
                type="button"
                (click)="onConfirm()"
                style="padding: 8px 16px; cursor: pointer; background: #1976d2; color: #fff; border: none; border-radius: 4px;"
                >確認</button
              >
            </div>
          </div>
        </div>
      }
      <div
        mznUpload
        accept="image/*"
        mode="cards"
        [files]="files()"
        [multiple]="false"
        (filesChange)="onFilesChange($event)"
        (fileSelect)="onFileSelect($event)"
      >
        <span>點擊或拖放圖片至此區域上傳</span>
      </div>
    </div>
  `,
})
class WithUploaderStoryComponent {
  readonly files = signal<UploadFile[]>([]);
  readonly pendingImageSrc = signal<string | null>(null);
  private pendingFile: File | null = null;

  onFilesChange(next: readonly UploadFile[]): void {
    this.files.set(next.filter((f) => f.status !== 'error') as UploadFile[]);
  }

  onFileSelect(fileList: FileList): void {
    const file = fileList[0];
    if (!file) return;
    this.pendingFile = file;
    const url = URL.createObjectURL(file);
    this.pendingImageSrc.set(url);
  }

  onCropChange(_area: CropArea): void {
    // crop area will be used when cropping is implemented
  }

  onCancel(): void {
    const src = this.pendingImageSrc();
    if (src) {
      URL.revokeObjectURL(src);
    }
    this.pendingImageSrc.set(null);
    this.pendingFile = null;
    this.files.set([]);
  }

  onConfirm(): void {
    if (this.pendingFile) {
      const id = `cropped-${Date.now()}`;
      const url = this.pendingImageSrc()!;
      this.files.set([
        {
          id,
          name: `cropped-${this.pendingFile.name}`,
          status: 'done',
          url,
        },
      ]);
    }
    this.pendingImageSrc.set(null);
    this.pendingFile = null;
  }
}

export const WithUploader: Story = {
  decorators: [
    moduleMetadata({
      imports: [WithUploaderStoryComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-cropper-with-uploader-story />`,
  }),
};

@Component({
  selector: 'mzn-cropper-with-button-story',
  standalone: true,
  imports: [MznCropper],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; width: 600px;"
    >
      @if (isOpen()) {
        <div
          style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;"
        >
          <div
            style="background: #fff; border-radius: 8px; padding: 24px; width: 640px; max-width: 90vw; display: flex; flex-direction: column; gap: 16px;"
          >
            <h3 style="margin: 0;">裁切頁首圖片</h3>
            <p style="margin: 0; font-size: 14px; color: #666;"
              >建議上傳尺寸為 2100 × 900 像素，以獲得最佳顯示效果。</p
            >
            <div
              mznCropper
              imageSrc="https://rytass.com/logo.png"
              [aspectRatio]="4 / 3"
              (cropChange)="onCropChange($event)"
            ></div>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <button
                type="button"
                (click)="close()"
                style="padding: 8px 16px; cursor: pointer;"
                >取消</button
              >
              <button
                type="button"
                (click)="confirm()"
                style="padding: 8px 16px; cursor: pointer; background: #1976d2; color: #fff; border: none; border-radius: 4px;"
                >確認</button
              >
            </div>
          </div>
        </div>
      }
      <button
        type="button"
        (click)="open()"
        style="align-self: flex-start; padding: 8px 16px; cursor: pointer; background: #1976d2; color: #fff; border: none; border-radius: 4px;"
      >
        開啟裁切
      </button>
      @if (previewUrl()) {
        <img
          [src]="previewUrl()!"
          alt="Cropped preview"
          style="max-width: 100%;"
        />
      }
    </div>
  `,
})
class WithButtonStoryComponent {
  readonly isOpen = signal(false);
  readonly previewUrl = signal<string | null>(null);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onCropChange(_area: CropArea): void {
    // crop area will be used when confirming
  }

  confirm(): void {
    this.previewUrl.set('https://rytass.com/logo.png');
    this.isOpen.set(false);
  }
}

export const WithButton: Story = {
  decorators: [
    moduleMetadata({
      imports: [WithButtonStoryComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-cropper-with-button-story />`,
  }),
};
