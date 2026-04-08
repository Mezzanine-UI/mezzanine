import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { MznUploadPictureCard } from './upload-picture-card.component';

function createBlobFile(content: string, name: string, mimeType: string): File {
  const blob = new Blob([content], { type: mimeType });
  return new File([blob], name, { type: mimeType });
}

const imageUrl = 'https://picsum.photos/seed/upload/400/300';

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

export const Playground: Story = {
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['main', 'sub', 'minor'],
      description: 'The size of the upload picture card',
      table: {
        type: { summary: 'UploadPictureCardSize' },
        defaultValue: { summary: 'main' },
      },
    },
    imageFit: {
      control: { type: 'select' },
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      description: 'The image fit of the upload picture card',
      table: {
        type: { summary: 'UploadPictureCardImageFit' },
        defaultValue: { summary: 'cover' },
      },
    },
    status: {
      control: { type: 'select' },
      options: ['loading', 'done', 'error'],
      description: 'The status of the upload picture card',
      table: {
        type: { summary: 'UploadItemStatus' },
        defaultValue: { summary: 'loading' },
      },
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Error message to display when status is error',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the upload picture card is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readable: {
      control: { type: 'boolean' },
      description: 'Whether the upload picture card is readable',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    size: 'main',
    imageFit: 'cover',
    status: 'loading',
    disabled: false,
    readable: false,
  },
  render: (args) => ({
    props: {
      ...args,
      imageUrl,
      onDeleted: () => {},
      onDownloaded: () => {},
      onReloaded: () => {},
      onReplaced: () => {},
      onZoomed: () => {},
    },
    template: `
      <mzn-upload-picture-card
        [url]="imageUrl"
        [status]="status"
        [size]="size"
        [imageFit]="imageFit"
        [disabled]="disabled"
        [readable]="readable"
        [errorMessage]="errorMessage"
        (deleted)="onDeleted()"
        (downloaded)="onDownloaded()"
        (reloaded)="onReloaded()"
        (replaced)="onReplaced()"
        (zoomed)="onZoomed()"
      />
    `,
    styles: [
      `
      :host { display: inline-block; }
    `,
    ],
  }),
};

@Component({
  selector: 'story-upload-picture-card-basic',
  standalone: true,
  imports: [MznUploadPictureCard],
  template: `
    <ul
      style="display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0; margin: 0;"
    >
      <li>
        <p style="margin: 0 0 4px; font-weight: 600;">Uploading:</p>
        <mzn-upload-picture-card
          [file]="imageFile()"
          imageFit="contain"
          (deleted)="onDelete($event)"
        />
      </li>
      <li>
        <p style="margin: 8px 0 4px; font-weight: 600;"
          >Enable & Hover-Multiple Files:</p
        >
        <mzn-upload-picture-card
          [url]="imageUrl"
          imageFit="contain"
          status="done"
          (deleted)="onDelete($event)"
          (zoomed)="onZoom($event)"
          (downloaded)="onDownload($event)"
        />
      </li>
      <li>
        <p style="margin: 8px 0 4px; font-weight: 600;"
          >Hover-Limit Single File:</p
        >
        <mzn-upload-picture-card
          [file]="imageFile()"
          status="done"
          [ariaLabels]="ariaLabels"
          (deleted)="onDelete($event)"
          (replaced)="onReplace($event)"
        />
      </li>
      <li>
        <p style="margin: 8px 0 4px; font-weight: 600;">Error:</p>
        <mzn-upload-picture-card
          [url]="imageUrl"
          imageFit="contain"
          status="error"
          (deleted)="onDelete($event)"
          (reloaded)="onReload($event)"
        />
      </li>
      <li>
        <p style="margin: 8px 0 4px; font-weight: 600;">Disable:</p>
        <mzn-upload-picture-card
          [url]="imageUrl"
          imageFit="contain"
          status="done"
          [disabled]="true"
          (zoomed)="onZoom($event)"
          (downloaded)="onDownload($event)"
          (deleted)="onDelete($event)"
        />
      </li>
      <li>
        <p style="margin: 8px 0 4px; font-weight: 600;">Read Only:</p>
        <mzn-upload-picture-card
          [url]="imageUrl"
          imageFit="contain"
          status="done"
          [readable]="true"
          (zoomed)="onZoom($event)"
          (downloaded)="onDownload($event)"
          (deleted)="onDelete($event)"
        />
      </li>
    </ul>
  `,
})
class UploadPictureCardBasicComponent {
  readonly imageFile = signal<File | null>(null);
  readonly ariaLabels = { clickToReplace: 'Replace' };

  constructor() {
    fetch('https://picsum.photos/seed/upload/400/300')
      .then((r) => r.blob())
      .then((blob) => {
        this.imageFile.set(
          new File([blob], 'example.jpg', { type: 'image/jpeg' }),
        );
      });
  }

  onDelete(_event: MouseEvent): void {}
  onZoom(_event: MouseEvent): void {}
  onDownload(_event: MouseEvent): void {}
  onReload(_event: MouseEvent): void {}
  onReplace(_event: MouseEvent): void {}
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
        <mzn-upload-picture-card
          [file]="pdfFile"
          status="loading"
          (deleted)="onDelete($event)"
        />
      </li>
      <li>
        <mzn-upload-picture-card
          [file]="docFile"
          status="done"
          (deleted)="onDelete($event)"
          (downloaded)="onDownload($event)"
          (zoomed)="onZoom($event)"
        />
      </li>
      <li>
        <mzn-upload-picture-card
          [file]="txtFile"
          status="error"
          errorMessage="Upload failed"
          (deleted)="onDelete($event)"
          (reloaded)="onReload($event)"
        />
      </li>
      <li>
        <mzn-upload-picture-card
          [file]="zipFile"
          status="done"
          [disabled]="true"
          (deleted)="onDelete($event)"
          (downloaded)="onDownload($event)"
          (zoomed)="onZoom($event)"
        />
      </li>
      <li>
        <mzn-upload-picture-card
          [file]="pdfFile"
          status="done"
          size="sub"
          (deleted)="onDelete($event)"
          (downloaded)="onDownload($event)"
          (zoomed)="onZoom($event)"
        />
      </li>
      <li>
        <mzn-upload-picture-card
          [file]="docFile"
          status="done"
          size="minor"
          (deleted)="onDelete($event)"
          (downloaded)="onDownload($event)"
          (zoomed)="onZoom($event)"
        />
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
        <mzn-upload-picture-card
          [file]="pdfFile"
          status="done"
          (deleted)="onDelete($event)"
          (replaced)="onReplace($event)"
          [ariaLabels]="ariaLabels"
        />
      </li>
      <li>
        <mzn-upload-picture-card
          [file]="pdfFile"
          status="done"
          size="sub"
          (deleted)="onDelete($event)"
          (replaced)="onReplace($event)"
          [ariaLabels]="ariaLabels"
        />
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
