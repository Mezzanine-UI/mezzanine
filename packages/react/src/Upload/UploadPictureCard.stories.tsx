import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEffect, useState } from 'react';
import { action } from 'storybook/actions';
import type { UploadPictureCardProps } from '.';
import { UploadPictureCard } from '.';

export default {
  title: 'Data Entry/Upload/UploadPictureCard',
  component: UploadPictureCard,
} satisfies Meta<typeof UploadPictureCard>;

type Story = StoryObj<UploadPictureCardProps>;

// Helper function to load image from URL and convert to File object
async function createFileFromUrl(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || 'image/png' });
}

// React component for loading images
function UploadPictureCardWithImageLoader({
  args,
}: {
  args: UploadPictureCardProps;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    createFileFromUrl('https://rytass.com/logo.png', 'logo.png')
      .then(setImageFile)
      .catch((error) => {
        console.error('Failed to load image:', error);
        // use mock file if load image failed
        setImageFile(new File([''], 'example.jpg', { type: 'image/jpeg' }));
      });
  }, []);

  if (!imageFile) {
    return <></>;
  }

  return (
    <UploadPictureCard
      {...args}
      file={imageFile}
      size={args.size || 'main'}
      imageFit={args.imageFit || 'cover'}
      onDelete={args.onDelete || action('onDelete')}
    />
  );
}

export const Playground: Story = {
  render: (args) => <UploadPictureCardWithImageLoader args={args} />,
  args: {
    file: new File([''], 'example.jpg', { type: 'image/jpeg' }),
    onDelete: action('onDelete'),
    size: 'main',
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
      description: 'The size of the upload picture card',
      table: {
        type: { summary: 'UploadPictureCardSize' },
        defaultValue: { summary: 'main' },
      },
    },
    imageFit: {
      control: {
        type: 'select',
        options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      },
      description: 'The image fit of the upload picture card',
      table: {
        type: { summary: 'UploadPictureCardImageFit' },
        defaultValue: { summary: 'cover' },
      },
    },
    errorMessage: {
      control: {
        type: 'text',
      },
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

function BasicStoryContent() {
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    createFileFromUrl('https://rytass.com/logo.png', 'logo.png')
      .then(setImageFile)
      .catch((error) => {
        console.error('Failed to load image:', error);
      });
  }, []);

  if (!imageFile) {
    return <></>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: 400,
      }}
    >
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          listStyle: 'none',
          padding: 0,
        }}
      >
        <li>
          <UploadPictureCard
            file={imageFile}
            imageFit="contain"
            onDelete={action('onDelete')}
          />
        </li>
        <li>
          <UploadPictureCard
            file={imageFile}
            imageFit="contain"
            status="done"
            onDelete={action('onDelete')}
            onZoomIn={action('onZoomIn')}
            onDownload={action('onDownload')}
          />
        </li>
        <li>
          <UploadPictureCard
            file={imageFile}
            imageFit="contain"
            status="error"
            onDelete={action('onDelete')}
            onReload={action('onReload')}
          />
        </li>
        <li>
          <UploadPictureCard
            file={imageFile}
            imageFit="contain"
            status="done"
            disabled
            onZoomIn={action('onZoomIn')}
            onDownload={action('onDownload')}
            onDelete={action('onDelete')}
          />
        </li>
      </ul>
    </div>
  );
}

export const Basic: Story = {
  render: () => <BasicStoryContent />,
};

function NonImageFilesStoryContent() {
  // Create mock non-image files
  const pdfFile = new File(['PDF content'], 'document.pdf', {
    type: 'application/pdf',
  });
  const docFile = new File(['DOC content'], 'document.doc', {
    type: 'application/msword',
  });
  const txtFile = new File(['Text content'], 'document.txt', {
    type: 'text/plain',
  });
  const zipFile = new File(['ZIP content'], 'archive.zip', {
    type: 'application/zip',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: 400,
      }}
    >
      <h3
        style={{
          marginBottom: '8px',
          marginTop: 0,
          fontSize: '16px',
          fontWeight: 600,
        }}
      >
        Non-Image Files
      </h3>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          listStyle: 'none',
          padding: 0,
        }}
      >
        <li>
          <UploadPictureCard
            file={pdfFile}
            status="loading"
            onDelete={action('onDelete')}
          />
        </li>
        <li>
          <UploadPictureCard
            file={docFile}
            status="done"
            onDelete={action('onDelete')}
            onDownload={action('onDownload')}
            onZoomIn={action('onZoomIn')}
          />
        </li>
        <li>
          <UploadPictureCard
            file={txtFile}
            status="error"
            errorMessage="Upload failed"
            onDelete={action('onDelete')}
            onReload={action('onReload')}
          />
        </li>
        <li>
          <UploadPictureCard
            file={zipFile}
            status="done"
            disabled
            onDelete={action('onDelete')}
            onDownload={action('onDownload')}
            onZoomIn={action('onZoomIn')}
          />
        </li>
        <li>
          <UploadPictureCard
            file={pdfFile}
            status="done"
            size="sub"
            onDelete={action('onDelete')}
            onDownload={action('onDownload')}
            onZoomIn={action('onZoomIn')}
          />
        </li>
        <li>
          <UploadPictureCard
            file={docFile}
            status="done"
            size="minor"
            onDelete={action('onDelete')}
            onDownload={action('onDownload')}
            onZoomIn={action('onZoomIn')}
          />
        </li>
      </ul>
    </div>
  );
}

export const NonImageFiles: Story = {
  render: () => <NonImageFilesStoryContent />,
  parameters: {
    docs: {
      description: {
        story:
          'Examples of UploadPictureCard displaying non-image files (PDF, DOC, TXT, ZIP, etc.). When a non-image file is provided, the component will display accordingly based on the file type.',
      },
    },
  },
};

function ReplaceModeStoryContent() {
  const pdfFile = new File(['PDF content'], 'report.pdf', {
    type: 'application/pdf',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: 400,
      }}
    >
      <h3
        style={{
          marginBottom: '8px',
          marginTop: 0,
          fontSize: '16px',
          fontWeight: 600,
        }}
      >
        Replace Mode (hover to see overlay)
      </h3>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          listStyle: 'none',
          padding: 0,
        }}
      >
        <li>
          <UploadPictureCard
            file={pdfFile}
            status="done"
            onDelete={action('onDelete')}
            onReplace={action('onReplace')}
          />
        </li>
        <li>
          <UploadPictureCard
            file={pdfFile}
            status="done"
            size="sub"
            onDelete={action('onDelete')}
            onReplace={action('onReplace')}
          />
        </li>
      </ul>
    </div>
  );
}

export const ReplaceMode: Story = {
  render: () => <ReplaceModeStoryContent />,
  parameters: {
    docs: {
      description: {
        story:
          'When `onReplace` is provided and status is `done`, the card becomes a replacement trigger. Hover to reveal the "Click to Replace" overlay label. The trash button remains visible on hover; zoom and download buttons are omitted when not passed.',
      },
    },
  },
};
