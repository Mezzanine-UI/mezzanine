import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznCropper, type CropArea } from './cropper.component';

export default {
  title: 'Feedback/Cropper/CropperElement',
  decorators: [
    moduleMetadata({
      imports: [MznCropper],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

const DEFAULT_IMAGE_URL = 'https://rytass.com/logo.png';

// ─── Basic ───────────────────────────────────────────────────────────

@Component({
  selector: 'story-cropper-element-basic',
  standalone: true,
  imports: [MznCropper],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 1rem; width: min(100%, 32rem);"
    >
      <div
        mznCropper
        [imageSrc]="imageSrc"
        [aspectRatio]="1"
        (cropChange)="onCropChange($event)"
      ></div>
      @if (cropArea()) {
        <div style="font-size: 0.875rem;">
          <strong>裁切區域：</strong>
          x: {{ cropArea()!.x | number: '1.0-0' }}, y:
          {{ cropArea()!.y | number: '1.0-0' }}, width:
          {{ cropArea()!.width | number: '1.0-0' }}, height:
          {{ cropArea()!.height | number: '1.0-0' }}
        </div>
      }
    </div>
  `,
})
class BasicStoryComponent {
  readonly imageSrc = DEFAULT_IMAGE_URL;
  readonly cropArea = signal<CropArea | null>(null);

  onCropChange(area: CropArea): void {
    this.cropArea.set(area);
  }
}

export const Basic: Story = {
  decorators: [moduleMetadata({ imports: [BasicStoryComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-cropper-element-basic />`,
  }),
};

// ─── WithAspectRatio ─────────────────────────────────────────────────

@Component({
  selector: 'story-cropper-element-aspect-ratio',
  standalone: true,
  imports: [MznCropper],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 1rem; width: min(100%, 32rem);"
    >
      <div style="align-items: center; display: flex; gap: 0.5rem;">
        <label style="align-items: center; display: flex; gap: 0.5rem;">
          <strong>Aspect Ratio:</strong>
          <select
            (change)="onAspectRatioChange($any($event.target).value)"
            style="min-width: 7.5rem; padding: 0.25rem 0.5rem;"
          >
            <option value="">Free</option>
            <option value="1" [selected]="aspectRatio() === 1">1:1</option>
            <option value="16/9" [selected]="isClose(aspectRatio(), 16 / 9)"
              >16:9</option
            >
            <option value="4/3" [selected]="isClose(aspectRatio(), 4 / 3)"
              >4:3</option
            >
            <option value="3/2" [selected]="isClose(aspectRatio(), 3 / 2)"
              >3:2</option
            >
          </select>
        </label>
        @if (aspectRatio() !== undefined) {
          <span style="color: #666; font-size: 0.875rem;">
            當前比例: {{ aspectRatio()!.toFixed(3) }}
          </span>
        }
      </div>
      <div
        mznCropper
        [imageSrc]="imageSrc"
        [aspectRatio]="aspectRatio()"
        (cropChange)="onCropChange($event)"
      ></div>
      @if (cropArea()) {
        <div style="font-size: 0.875rem;">
          <strong>裁切區域：</strong>
          x: {{ cropArea()!.x | number: '1.0-0' }}, y:
          {{ cropArea()!.y | number: '1.0-0' }}, width:
          {{ cropArea()!.width | number: '1.0-0' }}, height:
          {{ cropArea()!.height | number: '1.0-0' }}
        </div>
      }
    </div>
  `,
})
class WithAspectRatioStoryComponent {
  readonly imageSrc = DEFAULT_IMAGE_URL;
  readonly aspectRatio = signal<number | undefined>(16 / 9);
  readonly cropArea = signal<CropArea | null>(null);

  onAspectRatioChange(value: string): void {
    if (!value) {
      this.aspectRatio.set(undefined);
      return;
    }

    if (value.includes('/')) {
      const [numerator, denominator] = value.split('/').map(Number.parseFloat);
      if (!Number.isNaN(numerator) && !Number.isNaN(denominator)) {
        this.aspectRatio.set(numerator / denominator);
      }
      return;
    }

    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      this.aspectRatio.set(parsed);
    }
  }

  onCropChange(area: CropArea): void {
    this.cropArea.set(area);
  }

  isClose(a: number | undefined, b: number): boolean {
    if (a === undefined) return false;
    return Math.abs(a - b) < 0.001;
  }
}

export const WithAspectRatio: Story = {
  decorators: [moduleMetadata({ imports: [WithAspectRatioStoryComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-cropper-element-aspect-ratio />`,
  }),
};

// ─── WithFileInput ───────────────────────────────────────────────────

@Component({
  selector: 'story-cropper-element-file-input',
  standalone: true,
  imports: [MznCropper],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 1rem; width: min(100%, 32rem);"
    >
      <input
        accept="image/*"
        type="file"
        (change)="onFileChange($any($event.target).files)"
      />
      @if (imageUrl()) {
        <div
          mznCropper
          [imageSrc]="imageUrl()!"
          [aspectRatio]="16 / 9"
          (cropChange)="onCropChange($event)"
        ></div>
      }
    </div>
  `,
})
class WithFileInputStoryComponent {
  readonly imageUrl = signal<string | null>(null);

  onFileChange(files: FileList | null): void {
    const file = files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const prev = this.imageUrl();
    if (prev) {
      URL.revokeObjectURL(prev);
    }

    this.imageUrl.set(URL.createObjectURL(file));
  }

  onCropChange(_area: CropArea): void {
    // crop area available for consumer use
  }
}

export const WithFileInput: Story = {
  decorators: [moduleMetadata({ imports: [WithFileInputStoryComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-cropper-element-file-input />`,
  }),
};
