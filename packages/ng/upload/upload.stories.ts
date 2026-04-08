import { Component, signal } from '@angular/core';
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
  },
  args: {
    accept: 'image/*',
    disabled: false,
    mode: 'list',
    multiple: true,
  },
  render: (args) => ({
    props: {
      ...args,
      files: [] as UploadFile[],
    },
    template: `
      <mzn-upload
        [accept]="accept"
        [disabled]="disabled"
        [files]="files"
        [mode]="mode"
        [multiple]="multiple"
      >
        <span>點擊或拖放檔案至此區域上傳</span>
      </mzn-upload>
    `,
  }),
};

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
          >Display files in list format with dropzone. Use dropzoneHints to show
          hints inside the dropzone, and hints to show hints below the
          uploader.</p
        >
        <mzn-upload
          mode="list"
          accept="image/*"
          [files]="files()"
          [multiple]="true"
          (filesChange)="onFilesChange($event)"
        >
          <span>點擊或拖放檔案至此區域上傳</span>
        </mzn-upload>
      </div>
      <div>
        <h3>Basic List Mode:</h3>
        <p
          >Display files in list format without drag-and-drop (basic
          uploader).</p
        >
        <mzn-upload
          mode="basic-list"
          accept="image/*"
          [files]="files()"
          [multiple]="true"
          (filesChange)="onFilesChange($event)"
        >
          <span>點擊或拖放檔案至此區域上傳</span>
        </mzn-upload>
      </div>
      <div>
        <h3>Button List Mode:</h3>
        <p>Display files in button list format</p>
        <mzn-upload
          mode="button-list"
          accept="image/*"
          [files]="files()"
          [multiple]="true"
          (filesChange)="onFilesChange($event)"
        >
          <span>選擇檔案</span>
        </mzn-upload>
      </div>
      <div>
        <h3>Cards Mode:</h3>
        <p
          >Display files in card format, images use UploadPictureCard, other
          files use UploadItem</p
        >
        <mzn-upload
          mode="cards"
          accept="image/*"
          [files]="files()"
          [multiple]="true"
          (filesChange)="onFilesChange($event)"
        >
          <span>點擊或拖放檔案至此區域上傳</span>
        </mzn-upload>
      </div>
      <div>
        <h3>Card Wall Mode:</h3>
        <p
          >Display files in card wall format, all files use UploadPictureCard</p
        >
        <mzn-upload
          mode="card-wall"
          accept="image/*"
          [files]="files()"
          [multiple]="true"
          (filesChange)="onFilesChange($event)"
        >
          <span>點擊或拖放檔案至此區域上傳</span>
        </mzn-upload>
      </div>
    </div>
  `,
})
class BasicStoryComponent {
  readonly files = signal<UploadFile[]>([]);

  onFilesChange(next: readonly UploadFile[]): void {
    this.files.set([...next]);
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
      <mzn-upload
        mode="card-wall"
        accept="image/*"
        [files]="files()"
        [multiple]="true"
        (filesChange)="onFilesChange($event)"
      >
        <span>點擊或拖放圖片至此區域上傳</span>
      </mzn-upload>
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
      <mzn-upload
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
      </mzn-upload>
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

  onFileSelect(_fileList: FileList): void {
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
        <mzn-upload
          mode="list"
          accept="image/*"
          [files]="listFiles()"
          [multiple]="true"
          (filesChange)="onListFilesChange($event)"
        >
          <span>點擊或拖放檔案至此區域上傳</span>
        </mzn-upload>
      </div>
      <div>
        <h3>Cards Mode (Picture Card):</h3>
        <p
          >Display preloaded image from URL in card format using
          UploadPictureCard</p
        >
        <mzn-upload
          mode="cards"
          accept="image/*"
          [files]="cardsFiles()"
          [multiple]="true"
          (filesChange)="onCardsFilesChange($event)"
        >
          <span>點擊或拖放圖片至此區域上傳</span>
        </mzn-upload>
      </div>
      <div>
        <h3>Card Wall Mode (Picture Card):</h3>
        <p
          >Display preloaded image from URL in card wall format using
          UploadPictureCard</p
        >
        <mzn-upload
          mode="card-wall"
          accept="image/*"
          [files]="cardWallFiles()"
          [multiple]="true"
          (filesChange)="onCardWallFilesChange($event)"
        >
          <span>點擊或拖放圖片至此區域上傳</span>
        </mzn-upload>
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
        <mzn-upload
          mode="cards"
          accept="image/*"
          [files]="files()"
          [multiple]="false"
          (filesChange)="onFilesChange($event)"
        >
          <span>點擊或拖放圖片至此區域上傳</span>
        </mzn-upload>
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
