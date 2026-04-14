import { Component, input, signal, OnInit } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznUpload } from './upload.component';
import { MznUploader } from './uploader.component';
import { MznUploadItem } from './upload-item.component';
import { UploadFile } from './upload-file';

export default {
  title: 'Data Entry/Upload/Upload',
  decorators: [
    moduleMetadata({
      imports: [MznUpload, MznUploader, MznUploadItem],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

async function createFileFromUrl(url: string, name: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new File([blob], name, { type: blob.type || 'image/png' });
}

@Component({
  selector: 'story-upload-playground',
  standalone: true,
  imports: [MznUpload],
  template: `
    @if (!isLoading()) {
      <div
        mznUpload
        [accept]="accept()"
        [disabled]="disabled()"
        [hints]="hints()"
        [mode]="mode()"
        [multiple]="multiple()"
        [showFileSize]="showFileSize()"
        [size]="size()"
        [files]="files()"
        (filesChange)="onFilesChange($event)"
      ></div>
    }
  `,
})
class UploadPlaygroundStoryComponent implements OnInit {
  readonly accept = input<string>('image/*');
  readonly disabled = input(false);
  readonly hints = input<readonly { label: string; type?: string }[]>([
    { label: '支援 JPG、PNG；單檔上限 500 KB。', type: 'info' },
  ]);
  readonly mode = input<
    'list' | 'basic-list' | 'button-list' | 'cards' | 'card-wall'
  >('list');
  readonly multiple = input(true);
  readonly showFileSize = input(true);
  readonly size = input<'main' | 'sub'>('main');

  readonly files = signal<UploadFile[]>([]);
  readonly isLoading = signal(true);

  async ngOnInit(): Promise<void> {
    try {
      const file = await createFileFromUrl(
        'https://rytass.com/logo.png',
        'logo.png',
      );

      this.files.set([
        {
          file,
          id: `story-preload-${Date.now()}`,
          name: file.name,
          progress: 100,
          status: 'done',
        },
      ]);
    } catch (error) {
      console.error('Failed to load image:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onFilesChange(next: readonly UploadFile[]): void {
    this.files.set([...next]);
  }
}

export const Playground: Story = {
  argTypes: {
    accept: {
      control: { type: 'text' },
      description: 'The accept attributes of native input element.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the upload is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    mode: {
      options: ['list', 'basic-list', 'button-list', 'cards', 'card-wall'],
      control: { type: 'select' },
      description: 'The display mode for the upload component.',
      table: {
        type: {
          summary:
            "'list' | 'basic-list' | 'button-list' | 'cards' | 'card-wall'",
        },
        defaultValue: { summary: "'list'" },
      },
    },
    multiple: {
      control: { type: 'boolean' },
      description: 'Whether can select multiple files to upload.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showFileSize: {
      control: { type: 'boolean' },
      description: 'Whether to show file size in the upload list.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    size: {
      options: ['main', 'sub'],
      control: { type: 'inline-radio' },
      description: 'The size of the upload component.',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
      },
    },
  },
  args: {
    accept: 'image/*',
    disabled: false,
    mode: 'list',
    multiple: true,
    showFileSize: true,
    size: 'main',
  },
  decorators: [moduleMetadata({ imports: [UploadPlaygroundStoryComponent] })],
  render: (args) => ({
    props: args,
    template: `
      <story-upload-playground
        [accept]="accept"
        [disabled]="disabled"
        [mode]="mode"
        [multiple]="multiple"
        [showFileSize]="showFileSize"
        [size]="size"
      />
    `,
  }),
};

const basicListHints = [
  {
    label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。',
    type: 'info' as const,
  },
];

const basicDropzoneHintsList = [
  { label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。' },
];

const basicHintsList = [
  {
    label: '支援 JPG、PNG、PDF；單檔上限 500 KB。',
    type: 'info' as const,
  },
];

const basicHintsButtonCards = [
  {
    label: '支援 JPG、PNG、PDF；單檔上限 500 KB。',
    type: 'info' as const,
  },
  { label: '最多 5 個檔案。', type: 'info' as const },
];

const basicHintsCardWall = [
  { label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。' },
];

async function simulateUpload(
  files: File[],
  setProgress?: (fileIndex: number, progress: number) => void,
): Promise<void> {
  console.log('onUpload', files);
  for (let i = 0; i < files.length; i += 1) {
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress?.(i, progress);
    }
  }
}

@Component({
  selector: 'mzn-upload-basic-story',
  standalone: true,
  imports: [MznUpload],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; width: 800px;"
    >
      <div>
        <h3>List Mode:</h3>
        <p
          >Display files in list format with dropzone. Use
          <code>dropzoneHints</code> to show hints inside the dropzone, and
          <code>hints</code> to show hints below the uploader.</p
        >
        @if (!isLoading()) {
          <div
            mznUpload
            mode="list"
            size="main"
            [showFileSize]="true"
            [files]="listFiles()"
            [dropzoneHints]="dropzoneHintsList"
            [hints]="hintsList"
            [uploadHandler]="simulateUpload"
            (filesChange)="listFiles.set(asFiles($event))"
            (delete)="onDelete($event)"
            (reload)="onReload($event)"
            (download)="onDownload($event)"
            (zoomIn)="onZoomIn($event)"
          ></div>
        }
      </div>
      <div>
        <h3>Basic List Mode:</h3>
        <p
          >Display files in list format without drag-and-drop (basic
          uploader).</p
        >
        @if (!isLoading()) {
          <div
            mznUpload
            mode="basic-list"
            size="main"
            [showFileSize]="true"
            [files]="basicListFiles()"
            [hints]="basicHints"
            [uploadHandler]="simulateUpload"
            (filesChange)="basicListFiles.set(asFiles($event))"
            (delete)="onDelete($event)"
            (reload)="onReload($event)"
            (download)="onDownload($event)"
            (zoomIn)="onZoomIn($event)"
          ></div>
        }
      </div>
      <div>
        <h3>Button List Mode:</h3>
        <p>Display files in button list format</p>
        @if (!isLoading()) {
          <div
            mznUpload
            mode="button-list"
            size="main"
            [files]="buttonListFiles()"
            [hints]="buttonCardsHints"
            [uploadHandler]="simulateUpload"
            (filesChange)="buttonListFiles.set(asFiles($event))"
            (delete)="onDelete($event)"
            (reload)="onReload($event)"
            (download)="onDownload($event)"
            (zoomIn)="onZoomIn($event)"
          ></div>
        }
      </div>
      <div>
        <h3>Cards Mode:</h3>
        <p
          >Display files in card format, images use UploadPictureCard, other
          files use UploadItem</p
        >
        @if (!isLoading()) {
          <div
            mznUpload
            mode="cards"
            size="main"
            [files]="cardsFiles()"
            [hints]="buttonCardsHints"
            [uploadHandler]="simulateUpload"
            (filesChange)="cardsFiles.set(asFiles($event))"
            (delete)="onDelete($event)"
            (reload)="onReload($event)"
            (download)="onDownload($event)"
            (zoomIn)="onZoomIn($event)"
          ></div>
        }
      </div>
      <div>
        <h3>Card Wall Mode:</h3>
        <p
          >Display files in card wall format, all files use UploadPictureCard</p
        >
        @if (!isLoading()) {
          <div
            mznUpload
            mode="card-wall"
            size="main"
            [files]="cardWallFiles()"
            [hints]="cardWallHints"
            [uploadHandler]="simulateUpload"
            (filesChange)="cardWallFiles.set(asFiles($event))"
            (delete)="onDelete($event)"
            (reload)="onReload($event)"
            (download)="onDownload($event)"
            (zoomIn)="onZoomIn($event)"
          ></div>
        }
      </div>
    </div>
  `,
})
class BasicStoryComponent implements OnInit {
  readonly listFiles = signal<UploadFile[]>([]);
  readonly basicListFiles = signal<UploadFile[]>([]);
  readonly buttonListFiles = signal<UploadFile[]>([]);
  readonly cardsFiles = signal<UploadFile[]>([]);
  readonly cardWallFiles = signal<UploadFile[]>([]);
  readonly isLoading = signal(true);

  readonly dropzoneHintsList = basicDropzoneHintsList;
  readonly hintsList = basicHintsList;
  readonly basicHints = basicListHints;
  readonly buttonCardsHints = basicHintsButtonCards;
  readonly cardWallHints = basicHintsCardWall;

  readonly simulateUpload = simulateUpload;

  asFiles(next: readonly UploadFile[]): UploadFile[] {
    return [...next];
  }

  async ngOnInit(): Promise<void> {
    try {
      const file = await createFileFromUrl(
        'https://rytass.com/logo.png',
        'logo.png',
      );
      const makeFile = (key: string): UploadFile => ({
        file,
        id: `story-preload-${key}-${Date.now()}-${Math.random()}`,
        name: file.name,
        progress: 100,
        status: 'done',
      });

      this.listFiles.set([makeFile('list')]);
      this.basicListFiles.set([makeFile('basic')]);
      this.buttonListFiles.set([makeFile('button')]);
      this.cardsFiles.set([makeFile('cards')]);
      this.cardWallFiles.set([makeFile('cw')]);
    } catch (error) {
      console.error('Failed to load image:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onDelete(event: { fileId: string; file: File }): void {
    console.log('onDelete', event);
  }

  onReload(event: { fileId: string; file: File }): void {
    console.log('onReload', event);
  }

  onDownload(event: { fileId: string; file: File }): void {
    console.log('onDownload', event);
  }

  onZoomIn(event: { fileId: string; file: File }): void {
    console.log('onZoomIn', event);
  }
}

export const Basic: Story = {
  decorators: [
    moduleMetadata({
      imports: [BasicStoryComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-upload-basic-story />`,
  }),
};

@Component({
  selector: 'mzn-upload-form-binding-story',
  standalone: true,
  imports: [MznUpload],
  template: `
    <form
      (ngSubmit)="onSubmit()"
      style="display: flex; flex-direction: column; gap: 16px; width: 600px;"
    >
      <div
        mznUpload
        mode="card-wall"
        accept="image/*"
        [files]="files()"
        [multiple]="true"
        (filesChange)="onFilesChange($event)"
      >
        <span>點擊或拖放圖片至此區域上傳</span>
      </div>
      <button
        type="submit"
        style="align-self: flex-start; padding: 8px 16px; cursor: pointer;"
      >
        Submit Form
      </button>
      <div>
        <strong>Form Value:</strong>
        <pre
          style="background: #f7f7f7; padding: 12px; border-radius: 4px; max-height: 200px; overflow: auto;"
          >{{ submittedValue }}</pre
        >
      </div>
    </form>
  `,
})
class FormBindingStoryComponent {
  readonly files = signal<UploadFile[]>([]);
  submittedValue = '[]';

  onFilesChange(next: readonly UploadFile[]): void {
    this.files.set([...next]);
  }

  onSubmit(): void {
    this.submittedValue = JSON.stringify(
      this.files().map((f) => ({
        id: f.id,
        name: f.name,
        status: f.status,
      })),
      null,
      2,
    );
  }
}

export const FormBinding: Story = {
  decorators: [
    moduleMetadata({
      imports: [FormBindingStoryComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-upload-form-binding-story />`,
  }),
};

@Component({
  selector: 'mzn-upload-id-name-binding-story',
  standalone: true,
  imports: [MznUpload],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 600px;"
    >
      <label for="storybook-upload-field" style="font-weight: 600;">
        Upload Author Cover (via id/name binding)
      </label>
      <div
        mznUpload
        id="storybook-upload-field"
        name="storybookUpload"
        mode="list"
        accept="image/*"
        [files]="files()"
        [multiple]="false"
        (filesChange)="onFilesChange($event)"
        (fileSelect)="onFileSelect($event)"
      >
        <span>點擊或拖放檔案至此區域上傳</span>
      </div>
      <div>
        <strong>input change log：</strong>
        <ul>
          @for (log of inputLogs(); track log) {
            <li>{{ log }}</li>
          }
        </ul>
      </div>
    </div>
  `,
})
class IdNameBindingStoryComponent {
  readonly files = signal<UploadFile[]>([]);
  readonly inputLogs = signal<string[]>([]);

  onFilesChange(next: readonly UploadFile[]): void {
    this.files.set([...next]);
  }

  onFileSelect(_files: File[]): void {
    const time = new Date().toLocaleTimeString();
    this.inputLogs.update((prev) => [
      ...prev.slice(-3),
      `input(name="storybookUpload" id="storybook-upload-field") changed @ ${time}`,
    ]);
  }
}

export const IdNameBinding: Story = {
  decorators: [
    moduleMetadata({
      imports: [IdNameBindingStoryComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-upload-id-name-binding-story />`,
  }),
};

@Component({
  selector: 'mzn-upload-preloaded-image-from-url-story',
  standalone: true,
  imports: [MznUpload],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; width: 800px;"
    >
      <div>
        <h3>List Mode (Picture Item):</h3>
        <p
          >Display preloaded image from URL in list format using UploadItem with
          thumbnail</p
        >
        <div
          mznUpload
          mode="list"
          accept="image/*"
          [files]="listFiles()"
          [multiple]="true"
          (filesChange)="onListFilesChange($event)"
        >
          <span>點擊或拖放檔案至此區域上傳</span>
        </div>
      </div>
      <div>
        <h3>Cards Mode (Picture Card):</h3>
        <p
          >Display preloaded image from URL in card format using
          UploadPictureCard</p
        >
        <div
          mznUpload
          mode="cards"
          accept="image/*"
          [files]="cardsFiles()"
          [multiple]="true"
          (filesChange)="onCardsFilesChange($event)"
        >
          <span>點擊或拖放圖片至此區域上傳</span>
        </div>
      </div>
      <div>
        <h3>Card Wall Mode (Picture Card):</h3>
        <p
          >Display preloaded image from URL in card wall format using
          UploadPictureCard</p
        >
        <div
          mznUpload
          mode="card-wall"
          accept="image/*"
          [files]="cardWallFiles()"
          [multiple]="true"
          (filesChange)="onCardWallFilesChange($event)"
        >
          <span>點擊或拖放圖片至此區域上傳</span>
        </div>
      </div>
    </div>
  `,
})
class PreloadedImageFromUrlStoryComponent {
  readonly preloadedFile: UploadFile = {
    id: 'preload-url-1',
    name: 'logo.png',
    status: 'done',
    url: 'https://rytass.com/logo.png',
  };

  readonly listFiles = signal<UploadFile[]>([this.preloadedFile]);
  readonly cardsFiles = signal<UploadFile[]>([this.preloadedFile]);
  readonly cardWallFiles = signal<UploadFile[]>([this.preloadedFile]);

  onListFilesChange(next: readonly UploadFile[]): void {
    this.listFiles.set([...next]);
  }

  onCardsFilesChange(next: readonly UploadFile[]): void {
    this.cardsFiles.set([...next]);
  }

  onCardWallFilesChange(next: readonly UploadFile[]): void {
    this.cardWallFiles.set([...next]);
  }
}

export const PreloadedImageFromUrl: Story = {
  decorators: [
    moduleMetadata({
      imports: [PreloadedImageFromUrlStoryComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-upload-preloaded-image-from-url-story />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates loading pre-existing images from backend URLs. This scenario shows how Upload component handles files that are already uploaded to the server (using `url` prop instead of `file` object).',
      },
    },
  },
};

@Component({
  selector: 'mzn-upload-single-file-limit-story',
  standalone: true,
  imports: [MznUpload],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; width: 800px;"
    >
      <div>
        <h3>上傳一張照片的情境</h3>
        <div
          mznUpload
          mode="cards"
          accept="image/*"
          [files]="files()"
          [multiple]="false"
          (filesChange)="onFilesChange($event)"
        >
          <span>點擊或拖放圖片至此區域上傳</span>
        </div>
      </div>
    </div>
  `,
})
class SingleFileLimitStoryComponent {
  readonly files = signal<UploadFile[]>([]);

  onFilesChange(next: readonly UploadFile[]): void {
    this.files.set([...next]);
  }
}

export const SingleFileLimit: Story = {
  decorators: [
    moduleMetadata({
      imports: [SingleFileLimitStoryComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-upload-single-file-limit-story />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates limiting uploads to a single file using `maxFiles={1}`. The uploader disables itself once the limit is reached. Selecting additional files triggers `onMaxFilesExceeded`.',
      },
    },
  },
};
