import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznButton } from '@mezzanine-ui/ng/button/button.directive';
import { MznMediaPreviewModal } from './media-preview-modal.component';

const sampleImages = [
  'https://picsum.photos/id/10/2560/1920',
  'https://picsum.photos/id/20/2560/1920',
  'https://picsum.photos/id/30/2560/1920',
  'https://picsum.photos/id/40/2560/1920',
  'https://picsum.photos/id/50/2560/1920',
];

export default {
  title: 'Feedback/MediaPreviewModal',
  component: MznMediaPreviewModal,
  decorators: [
    moduleMetadata({
      imports: [MznMediaPreviewModal, MznButton],
    }),
  ],
  argTypes: {
    defaultIndex: {
      control: { type: 'number' },
      description: '預設顯示的索引（非受控模式）。',
      table: { defaultValue: { summary: '0' } },
    },
    disableCloseOnBackdropClick: {
      control: { type: 'boolean' },
      description: '是否停用點擊遮罩關閉。',
      table: { defaultValue: { summary: 'true' } },
    },
    disableCloseOnEscapeKeyDown: {
      control: { type: 'boolean' },
      description: '是否停用 Escape 鍵關閉。',
      table: { defaultValue: { summary: 'false' } },
    },
    disableNext: {
      control: { type: 'boolean' },
      description: '是否停用下一頁按鈕。',
      table: { defaultValue: { summary: 'false' } },
    },
    disablePrev: {
      control: { type: 'boolean' },
      description: '是否停用上一頁按鈕。',
      table: { defaultValue: { summary: 'false' } },
    },
    enableCircularNavigation: {
      control: { type: 'boolean' },
      description: '啟用圓形導航（到末尾後回到開頭）。',
      table: { defaultValue: { summary: 'false' } },
    },
    showPaginationIndicator: {
      control: { type: 'boolean' },
      description: '是否顯示分頁指示器。',
      table: { defaultValue: { summary: 'true' } },
    },
  },
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    defaultIndex: 0,
    disableCloseOnBackdropClick: true,
    disableCloseOnEscapeKeyDown: false,
    enableCircularNavigation: false,
    showPaginationIndicator: true,
  },
  render: (args) => ({
    props: {
      ...args,
      open: signal(false),
      sampleImages,
    },
    template: `
      <button mznButton variant="base-primary" (click)="open.set(true)">
        Open Media Preview
      </button>
      <div mznMediaPreviewModal
        [open]="open()"
        [mediaItems]="sampleImages"
        [defaultIndex]="defaultIndex"
        [disableCloseOnBackdropClick]="disableCloseOnBackdropClick"
        [disableCloseOnEscapeKeyDown]="disableCloseOnEscapeKeyDown"
        [enableCircularNavigation]="enableCircularNavigation"
        [showPaginationIndicator]="showPaginationIndicator"
        (closed)="open.set(false)"
        (indexChange)="onIndexChange($event)"
      ></div>
    `,
  }),
};

export const TrackingIndexChanges: Story = {
  name: 'Tracking Index Changes',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      lastIndex: signal<number | null>(null),
      sampleImages,
    },
    template: `
      <div style="margin-bottom: 16px;">
        @if (lastIndex() !== null) {
          <p>Last viewed index: {{ lastIndex() }}</p>
        }
      </div>
      <button mznButton variant="base-primary" (click)="open.set(true)">
        Open Gallery (Track Index Changes)
      </button>
      <div mznMediaPreviewModal
        [open]="open()"
        [mediaItems]="sampleImages"
        [defaultIndex]="2"
        (closed)="open.set(false)"
        (indexChange)="lastIndex.set($event)"
      ></div>
    `,
  }),
};

export const SingleImage: Story = {
  name: 'Single Image',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      singleImage: [sampleImages[0]],
    },
    template: `
      <button mznButton variant="base-primary" (click)="open.set(true)">
        Open Single Image
      </button>
      <div mznMediaPreviewModal
        [open]="open()"
        [mediaItems]="singleImage"
        (closed)="open.set(false)"
      ></div>
    `,
  }),
};

export const CircularNavigation: Story = {
  name: 'Circular Navigation',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      sampleImages,
    },
    template: `
      <button mznButton variant="base-primary" (click)="open.set(true)">
        Open Gallery (Circular Navigation - Uncontrolled)
      </button>
      <div mznMediaPreviewModal
        [open]="open()"
        [mediaItems]="sampleImages"
        [enableCircularNavigation]="true"
        (closed)="open.set(false)"
      ></div>
    `,
  }),
};

@Component({
  selector: 'story-media-preview-modal-controlled',
  standalone: true,
  imports: [MznMediaPreviewModal, MznButton],
  template: `
    <div style="margin-bottom: 16px;">
      <p>Current index: {{ currentIndex() + 1 }}</p>
    </div>
    <button mznButton variant="base-primary" (click)="open.set(true)">
      Open Gallery (Circular Navigation - Controlled)
    </button>
    <div
      mznMediaPreviewModal
      [open]="open()"
      [mediaItems]="sampleImages"
      [currentIndex]="currentIndex()"
      (closed)="open.set(false)"
      (next)="onNext()"
      (prev)="onPrev()"
    ></div>
  `,
})
class MediaPreviewModalControlledComponent {
  readonly open = signal(false);
  readonly currentIndex = signal(0);
  readonly sampleImages = [
    'https://picsum.photos/id/10/2560/1920',
    'https://picsum.photos/id/20/2560/1920',
    'https://picsum.photos/id/30/2560/1920',
    'https://picsum.photos/id/40/2560/1920',
    'https://picsum.photos/id/50/2560/1920',
  ];

  onNext(): void {
    this.currentIndex.update((prev) => (prev + 1) % this.sampleImages.length);
  }

  onPrev(): void {
    this.currentIndex.update(
      (prev) =>
        (prev - 1 + this.sampleImages.length) % this.sampleImages.length,
    );
  }
}

export const ControlledModeWithCircularNavigation: Story = {
  name: 'Controlled Mode with Circular Navigation',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [MediaPreviewModalControlledComponent],
    }),
  ],
  render: () => ({
    template: `<story-media-preview-modal-controlled />`,
  }),
};

@Component({
  selector: 'story-media-preview-modal-custom-media',
  standalone: true,
  imports: [MznMediaPreviewModal, MznButton],
  template: `
    <ng-template #customContent1>
      <div
        style="align-items: center; background-color: #f0f0f0; color: #333; display: flex; font-size: 24px; height: 400px; justify-content: center; width: 600px;"
      >
        Custom Content 1
      </div>
    </ng-template>
    <ng-template #customContent2>
      <div
        style="align-items: center; background-color: #e0e0e0; color: #333; display: flex; font-size: 24px; height: 400px; justify-content: center; width: 600px;"
      >
        Custom Content 2
      </div>
    </ng-template>
    <ng-template #customVideo>
      <video
        controls
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        style="max-height: 600px; max-width: 800px;"
      ></video>
    </ng-template>

    <button mznButton variant="base-primary" (click)="open.set(true)">
      Open Custom Media
    </button>
    <div
      mznMediaPreviewModal
      [open]="open()"
      [mediaItems]="[customContent1, customContent2, customVideo]"
      (closed)="open.set(false)"
    ></div>
  `,
})
class MediaPreviewModalCustomMediaComponent {
  readonly open = signal(false);
}

export const CustomMedia: Story = {
  name: 'Custom Media',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [MediaPreviewModalCustomMediaComponent],
    }),
  ],
  render: () => ({
    template: `<story-media-preview-modal-custom-media />`,
  }),
};

export const WithPaginationIndicator: Story = {
  name: 'With Pagination Indicator',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      sampleImages,
    },
    template: `
      <button mznButton variant="base-primary" (click)="open.set(true)">
        Open Gallery with Pagination Indicator
      </button>
      <div mznMediaPreviewModal
        [open]="open()"
        [mediaItems]="sampleImages"
        [showPaginationIndicator]="true"
        (closed)="open.set(false)"
      ></div>
    `,
  }),
};

export const HidePaginationIndicator: Story = {
  name: 'Hide Pagination Indicator',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      sampleImages,
    },
    template: `
      <button mznButton variant="base-primary" (click)="open.set(true)">
        Open Gallery without Pagination Indicator
      </button>
      <div mznMediaPreviewModal
        [open]="open()"
        [mediaItems]="sampleImages"
        [showPaginationIndicator]="false"
        (closed)="open.set(false)"
      ></div>
    `,
  }),
};

export const MixedOrientations: Story = {
  name: 'Mixed Orientations',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      open: signal(false),
      mixedImages: [
        'https://picsum.photos/id/100/3840/2160',
        'https://picsum.photos/id/200/2160/3840',
        'https://picsum.photos/id/300/2048/2048',
        'https://picsum.photos/id/400/3840/2160',
        'https://picsum.photos/id/500/1920/2880',
      ],
    },
    template: `
      <button mznButton variant="base-primary" (click)="open.set(true)">
        Open Mixed Aspect Ratios
      </button>
      <div mznMediaPreviewModal
        [open]="open()"
        [mediaItems]="mixedImages"
        [defaultIndex]="2"
        (closed)="open.set(false)"
      ></div>
    `,
  }),
};

@Component({
  selector: 'story-local-file-upload',
  standalone: true,
  imports: [MznMediaPreviewModal, MznButton],
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <input
        accept="image/*"
        multiple
        type="file"
        (change)="onFileChange($event)"
      />
      <button
        mznButton
        variant="base-primary"
        [disabled]="blobUrls().length === 0"
        (click)="open.set(true)"
      >
        預覽已上傳圖片（{{ blobUrls().length }} 張）
      </button>
    </div>
    <div
      mznMediaPreviewModal
      [open]="open()"
      [mediaItems]="blobUrls()"
      [enableCircularNavigation]="true"
      (closed)="open.set(false)"
    ></div>
  `,
})
class LocalFileUploadComponent {
  readonly open = signal(false);
  readonly blobUrls = signal<string[]>([]);

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    this.blobUrls.update((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return files.map((file) => URL.createObjectURL(file));
    });
  }
}

export const LocalFileUpload: Story = {
  name: 'Local File Upload',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [LocalFileUploadComponent],
    }),
  ],
  render: () => ({
    template: `<story-local-file-upload />`,
  }),
};

@Component({
  selector: 'story-with-next-image-component',
  standalone: true,
  imports: [MznMediaPreviewModal, MznButton],
  template: `
    <button mznButton variant="base-primary" (click)="open.set(true)">
      Open with Next/Image (Mock)
    </button>
    <div
      mznMediaPreviewModal
      [open]="open()"
      [mediaItems]="imageUrls"
      (closed)="open.set(false)"
    ></div>
  `,
})
class WithNextImageComponentComponent {
  readonly open = signal(false);
  readonly imageUrls = [
    'https://picsum.photos/id/10/2560/1920',
    'https://picsum.photos/id/20/2560/1920',
    'https://picsum.photos/id/30/2560/1920',
  ];
}

export const WithNextImageComponent: Story = {
  name: 'With Next/Image Component',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [WithNextImageComponentComponent],
    }),
  ],
  render: () => ({
    template: `<story-with-next-image-component />`,
  }),
};
