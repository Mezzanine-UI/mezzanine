import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, input, OnInit, signal } from '@angular/core';
import type { IconDefinition } from '@mezzanine-ui/icons';
import {
  MznUploadPictureCard,
  UploadPictureCardImageFit,
  UploadPictureCardSize,
} from '@mezzanine-ui/ng/upload';

function createBlobFile(content: string, name: string, mimeType: string): File {
  const blob = new Blob([content], { type: mimeType });
  return new File([blob], name, { type: mimeType });
}

// Helper function to load image from URL and convert to File object
// (mirrors React's `createFileFromUrl` in UploadPictureCard.stories.tsx)
async function createFileFromUrl(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new File([blob], fileName, { type: blob.type || 'image/png' });
}

export default {
  title: 'Data Entry/Upload/UploadPictureCard',
  component: MznUploadPictureCard,
  decorators: [
    moduleMetadata({
      imports: [MznUploadPictureCard],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

// Wrapper component for the Playground story — mirrors React's
// `UploadPictureCardWithImageLoader`. Fetches a real image at ngOnInit,
// converts it to a File so the component's `file.type` branch kicks in
// (string URLs without file extensions would otherwise fail the image
// detection in `resolveFileType()`). The `@if (imageFile())` gate matches
// React's `if (!imageFile) return <></>` loading behaviour.
@Component({
  selector: 'story-upload-picture-card-playground',
  standalone: true,
  imports: [MznUploadPictureCard],
  template: `
    @if (imageFile()) {
      <div
        mznUploadPictureCard
        [file]="imageFile()!"
        [size]="size()"
        [imageFit]="imageFit()"
        [errorMessage]="errorMessage()"
        [errorIcon]="errorIcon()"
        (deleted)="onDeleted($event)"
      ></div>
    }
  `,
})
class UploadPictureCardPlaygroundStoryComponent implements OnInit {
  readonly size = input<UploadPictureCardSize>('main');
  readonly imageFit = input<UploadPictureCardImageFit>('cover');
  readonly errorMessage = input<string>();
  readonly errorIcon = input<IconDefinition>();

  readonly imageFile = signal<File | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const file = await createFileFromUrl(
        'https://rytass.com/logo.png',
        'logo.png',
      );

      this.imageFile.set(file);
    } catch (error) {
      console.error('Failed to load image:', error);
      // Fallback to mock File so the Playground still renders.
      this.imageFile.set(new File([''], 'example.jpg', { type: 'image/jpeg' }));
    }
  }

  onDeleted(event: MouseEvent): void {
    console.log('onDelete', event);
  }
}

export const Playground: Story = {
  args: {
    file: new File([''], 'example.jpg', { type: 'image/jpeg' }),
    size: 'main',
    imageFit: 'cover',
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
      options: ['main', 'sub', 'minor'],
      control: { type: 'select' },
      description: 'The size of the upload picture card',
      table: {
        type: { summary: 'UploadPictureCardSize' },
        defaultValue: { summary: 'main' },
      },
    },
    imageFit: {
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      control: { type: 'select' },
      description: 'The image fit of the upload picture card',
      table: {
        type: { summary: 'UploadPictureCardImageFit' },
        defaultValue: { summary: 'cover' },
      },
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Error message to display when status is error',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    errorIcon: {
      control: false,
      description: 'Error icon to display when status is error',
      table: {
        type: { summary: 'IconDefinition' },
        defaultValue: { summary: 'undefined' },
      },
    },
    deleted: {
      description: 'When delete icon is clicked, this callback will be fired',
      table: {
        type: { summary: 'EventEmitter<MouseEvent>' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [UploadPictureCardPlaygroundStoryComponent],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <story-upload-picture-card-playground
        [size]="size"
        [imageFit]="imageFit"
        [errorMessage]="errorMessage"
        [errorIcon]="errorIcon"
      ></story-upload-picture-card-playground>
    `,
  }),
};

@Component({
  selector: 'story-upload-picture-card-basic',
  standalone: true,
  imports: [MznUploadPictureCard],
  template: `
    @if (imageFile()) {
      <div
        style="display: flex; flex-direction: column; gap: 16px; width: 400px;"
      >
        <ul
          style="display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0;"
        >
          <li>
            <p>Uploading:</p>
            <div
              mznUploadPictureCard
              [file]="imageFile()!"
              imageFit="contain"
              (deleted)="onDelete($event)"
            ></div>
          </li>
          <li>
            <p>Enable & Hover-Multiple Files:</p>
            <div
              mznUploadPictureCard
              [file]="imageFile()!"
              imageFit="contain"
              status="done"
              [zoomInEnabled]="true"
              [downloadEnabled]="true"
              (deleted)="onDelete($event)"
              (zoomed)="onZoom($event)"
              (downloaded)="onDownload($event)"
            ></div>
          </li>
          <li>
            <p>Hover-Limit Single File:</p>
            <div
              mznUploadPictureCard
              [file]="imageFile()!"
              status="done"
              [replaceEnabled]="true"
              [ariaLabels]="ariaLabels"
              (deleted)="onDelete($event)"
              (replaced)="onReplace($event)"
            ></div>
          </li>
          <li>
            <p>Error:</p>
            <div
              mznUploadPictureCard
              [file]="imageFile()!"
              imageFit="contain"
              status="error"
              (deleted)="onDelete($event)"
              (reloaded)="onReload($event)"
            ></div>
          </li>
          <li>
            <p>Disable:</p>
            <div
              mznUploadPictureCard
              [file]="imageFile()!"
              imageFit="contain"
              status="done"
              [disabled]="true"
              [zoomInEnabled]="true"
              [downloadEnabled]="true"
              (zoomed)="onZoom($event)"
              (downloaded)="onDownload($event)"
              (deleted)="onDelete($event)"
            ></div>
          </li>
          <li>
            <p>Read Only:</p>
            <div
              mznUploadPictureCard
              [file]="imageFile()!"
              imageFit="contain"
              status="done"
              [readable]="true"
              [zoomInEnabled]="true"
              [downloadEnabled]="true"
              (zoomed)="onZoom($event)"
              (downloaded)="onDownload($event)"
              (deleted)="onDelete($event)"
            ></div>
          </li>
        </ul>
      </div>
    }
  `,
})
class UploadPictureCardBasicComponent implements OnInit {
  readonly imageFile = signal<File | null>(null);
  readonly ariaLabels = { clickToReplace: 'Replace' };

  async ngOnInit(): Promise<void> {
    try {
      const file = await createFileFromUrl(
        'https://rytass.com/logo.png',
        'logo.png',
      );

      this.imageFile.set(file);
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  }

  onDelete(event: MouseEvent): void {
    console.log('onDelete', event);
  }

  onZoom(event: MouseEvent): void {
    console.log('onZoomIn', event);
  }

  onDownload(event: MouseEvent): void {
    console.log('onDownload', event);
  }

  onReload(event: MouseEvent): void {
    console.log('onReload', event);
  }

  onReplace(event: MouseEvent): void {
    console.log('onReplace', event);
  }
}

export const Basic: Story = {
  name: 'Basic',
  decorators: [
    moduleMetadata({
      imports: [UploadPictureCardBasicComponent],
    }),
  ],
  render: () => ({
    template: `<story-upload-picture-card-basic />`,
  }),
};

@Component({
  selector: 'story-upload-picture-card-non-image',
  standalone: true,
  imports: [MznUploadPictureCard],
  template: `
    <ul
      style="display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0; margin: 0;"
    >
      <li>
        <div
          mznUploadPictureCard
          [file]="pdfFile"
          status="loading"
          (deleted)="onDelete($event)"
        ></div>
      </li>
      <li>
        <div
          mznUploadPictureCard
          [file]="docFile"
          status="done"
          (deleted)="onDelete($event)"
          (downloaded)="onDownload($event)"
          (zoomed)="onZoom($event)"
        ></div>
      </li>
      <li>
        <div
          mznUploadPictureCard
          [file]="txtFile"
          status="error"
          errorMessage="Upload failed"
          (deleted)="onDelete($event)"
          (reloaded)="onReload($event)"
        ></div>
      </li>
      <li>
        <div
          mznUploadPictureCard
          [file]="zipFile"
          status="done"
          [disabled]="true"
          (deleted)="onDelete($event)"
          (downloaded)="onDownload($event)"
          (zoomed)="onZoom($event)"
        ></div>
      </li>
      <li>
        <div
          mznUploadPictureCard
          [file]="pdfFile"
          status="done"
          size="sub"
          (deleted)="onDelete($event)"
          (downloaded)="onDownload($event)"
          (zoomed)="onZoom($event)"
        ></div>
      </li>
      <li>
        <div
          mznUploadPictureCard
          [file]="docFile"
          status="done"
          size="minor"
          (deleted)="onDelete($event)"
          (downloaded)="onDownload($event)"
          (zoomed)="onZoom($event)"
        ></div>
      </li>
    </ul>
  `,
})
class UploadPictureCardNonImageComponent {
  readonly pdfFile = createBlobFile(
    'PDF content',
    'document.pdf',
    'application/pdf',
  );
  readonly docFile = createBlobFile(
    'DOC content',
    'document.doc',
    'application/msword',
  );
  readonly txtFile = createBlobFile(
    'Text content',
    'document.txt',
    'text/plain',
  );
  readonly zipFile = createBlobFile(
    'ZIP content',
    'archive.zip',
    'application/zip',
  );

  onDelete(_event: MouseEvent): void {}
  onDownload(_event: MouseEvent): void {}
  onZoom(_event: MouseEvent): void {}
  onReload(_event: MouseEvent): void {}
}

export const NonImageFiles: Story = {
  name: 'Non Image Files',
  decorators: [
    moduleMetadata({
      imports: [UploadPictureCardNonImageComponent],
    }),
  ],
  render: () => ({
    template: `<story-upload-picture-card-non-image />`,
  }),
};

@Component({
  selector: 'story-upload-picture-card-replace',
  standalone: true,
  imports: [MznUploadPictureCard],
  template: `
    <ul
      style="display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0; margin: 0;"
    >
      <li>
        <div
          mznUploadPictureCard
          [file]="pdfFile"
          status="done"
          (deleted)="onDelete($event)"
          (replaced)="onReplace($event)"
          [ariaLabels]="ariaLabels"
        ></div>
      </li>
      <li>
        <div
          mznUploadPictureCard
          [file]="pdfFile"
          status="done"
          size="sub"
          (deleted)="onDelete($event)"
          (replaced)="onReplace($event)"
          [ariaLabels]="ariaLabels"
        ></div>
      </li>
    </ul>
  `,
})
class UploadPictureCardReplaceComponent {
  readonly pdfFile = createBlobFile(
    'PDF content',
    'report.pdf',
    'application/pdf',
  );
  readonly ariaLabels = { clickToReplace: 'Replace' };

  onDelete(_event: MouseEvent): void {}
  onReplace(_event: MouseEvent): void {}
}

export const ReplaceMode: Story = {
  name: 'Replace Mode',
  decorators: [
    moduleMetadata({
      imports: [UploadPictureCardReplaceComponent],
    }),
  ],
  render: () => ({
    template: `<story-upload-picture-card-replace />`,
  }),
};
