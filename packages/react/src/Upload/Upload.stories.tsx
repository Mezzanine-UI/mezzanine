import { Meta, StoryObj } from '@storybook/react-webpack5';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { action } from 'storybook/actions';
import type { UploadFile, UploadProps } from '.';
import { Upload } from '.';

export default {
  title: 'Data Entry/Upload/Upload',
  component: Upload,
} satisfies Meta<typeof Upload>;

type Story = StoryObj<UploadProps>;

// Helper function to load image from URL and convert to File object
async function createFileFromUrl(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type || 'image/png' });
}

const storyHandlers = {
  onDelete: action('onDelete'),
  onReload: action('onReload'),
  onDownload: action('onDownload'),
  onZoomIn: action('onZoomIn'),
};

async function simulateUpload(
  files: File[],
  setProgress?: (fileIndex: number, progress: number) => void,
) {
  action('onUpload')(files);

  for (let i = 0; i < files.length; i += 1) {
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setProgress?.(i, progress);
    }
  }
}

function useControlledFiles(
  initialFiles: UploadFile[] = [],
  onFilesChange?: (files: UploadFile[]) => void,
) {
  const [files, setFiles] = useState<UploadFile[]>(initialFiles);

  const handleChange = useCallback(
    (nextFiles: UploadFile[]) => {
      setFiles(nextFiles);
      onFilesChange?.(nextFiles);
    },
    [onFilesChange],
  );

  return { files, handleChange };
}

function UploadWithImageLoader({ args }: { args: UploadProps }) {
  const {
    onChange: argsOnChange,
    onUpload: argsOnUpload,
    onDelete: argsOnDelete,
    onReload: argsOnReload,
    onDownload: argsOnDownload,
    onZoomIn: argsOnZoomIn,
    ...restArgs
  } = args;

  const onFilesChange = useCallback(
    (next: UploadFile[]) => {
      action('onChange')(next);
      argsOnChange?.(next);
    },
    [argsOnChange],
  );

  const { files, handleChange } = useControlledFiles([], onFilesChange);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    createFileFromUrl('https://rytass.com/logo.png', 'logo.png')
      .then((file) => {
        if (!mounted) return;

        handleChange([
          {
            file,
            id: `story-preload-${Date.now()}`,
            progress: 100,
            status: 'done',
          },
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load image:', error);
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [handleChange]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Upload
      {...restArgs}
      files={files}
      onChange={handleChange}
      onUpload={argsOnUpload ?? simulateUpload}
      onDelete={argsOnDelete ?? storyHandlers.onDelete}
      onReload={argsOnReload ?? storyHandlers.onReload}
      onDownload={argsOnDownload ?? storyHandlers.onDownload}
      onZoomIn={argsOnZoomIn ?? storyHandlers.onZoomIn}
    />
  );
}

function FormBindingStory() {
  const [submittedValue, setSubmittedValue] = useState<string>('[]');
  const { files, handleChange } = useControlledFiles();

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmittedValue(
        JSON.stringify(
          files.map((file) => ({
            id: file.id,
            name: file.file.name,
            status: file.status,
          })),
          null,
          2,
        ),
      );
    },
    [files],
  );

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: 600,
      }}
    >
      <Upload
        files={files}
        mode="card-wall"
        multiple
        onChange={handleChange}
        onUpload={simulateUpload}
        onDelete={storyHandlers.onDelete}
        onReload={storyHandlers.onReload}
        onDownload={storyHandlers.onDownload}
        onZoomIn={storyHandlers.onZoomIn}
      />
      <button
        type="submit"
        style={{
          alignSelf: 'flex-start',
          padding: '8px 16px',
          cursor: 'pointer',
        }}
      >
        Submit Form
      </button>
      <div>
        <strong>Form Value:</strong>
        <pre
          style={{
            background: '#f7f7f7',
            padding: 12,
            borderRadius: 4,
            maxHeight: 200,
            overflow: 'auto',
          }}
        >
          {submittedValue}
        </pre>
      </div>
    </form>
  );
}

function IdNameBindingStory() {
  const uploadFieldId = 'storybook-upload-field';
  const uploadFieldName = 'storybookUpload';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputLogs, setInputLogs] = useState<string[]>([]);
  const { files, handleChange } = useControlledFiles();

  useEffect(() => {
    const node = inputRef.current;

    if (!node) {
      return undefined;
    }

    const handleNativeChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      setInputLogs((prev) => [
        ...prev.slice(-3),
        `input(name="${target.name}" id="${target.id}") changed @ ${new Date().toLocaleTimeString()}`,
      ]);
    };

    node.addEventListener('change', handleNativeChange);

    return () => {
      node.removeEventListener('change', handleNativeChange);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 600,
      }}
    >
      <label
        htmlFor={uploadFieldId}
        style={{ fontWeight: 600 }}
      >
        Upload Author Cover (via id/name binding)
      </label>
      <Upload
        id={uploadFieldId}
        name={uploadFieldName}
        inputRef={inputRef}
        files={files}
        onChange={handleChange}
        onUpload={simulateUpload}
        onDelete={storyHandlers.onDelete}
        onReload={storyHandlers.onReload}
        onDownload={storyHandlers.onDownload}
        onZoomIn={storyHandlers.onZoomIn}
      />
      <div>
        <strong>input change log：</strong>
        <ul>
          {inputLogs.map((log) => (
            <li key={log}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => <UploadWithImageLoader args={args} />,
  parameters: {
    controls: {
      sort: 'none',
    },
  },
  args: {
    accept: 'image/*',
    disabled: false,
    mode: 'list',
    showFileSize: true,
    size: 'main',
    multiple: true,
  },
  argTypes: {
    accept: {
      control: 'text',
      description: 'The accept attributes of native input element',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the upload is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    mode: {
      control: {
        type: 'radio',
        options: ['list', 'button-list', 'cards', 'card-wall'],
      },
      description: 'The display mode for the upload component',
      table: {
        type: { summary: "'list' | 'button-list' | 'cards' | 'card-wall'" },
        defaultValue: { summary: "'list'" },
      },
    },
    size: {
      control: {
        type: 'radio',
        options: ['main', 'sub'],
      },
      description: 'The size of the upload component',
      table: {
        type: { summary: 'UploadSize' },
        defaultValue: { summary: "'main'" },
      },
    },
    showFileSize: {
      control: 'boolean',
      description: 'Whether to show file size in list mode',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    multiple: {
      control: 'boolean',
      description: 'Whether can select multiple files to upload',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed to upload',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onUpload: {
      control: false,
      description: 'Fired when files are selected for upload',
      table: {
        type: { summary: '(files: File[], setProgress?: (fileIndex: number, progress: number) => void) => Promise<void> | void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onDelete: {
      control: false,
      description: 'Fired when a file is deleted',
      table: {
        type: { summary: '(fileId: string, file: File) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onReload: {
      control: false,
      description: 'Fired when a file upload is retried (error state)',
      table: {
        type: { summary: '(fileId: string, file: File) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onDownload: {
      control: false,
      description: 'Fired when a file is downloaded (done state)',
      table: {
        type: { summary: '(fileId: string, file: File) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onZoomIn: {
      control: false,
      description: 'Fired when zoom in is clicked on a picture card (done state)',
      table: {
        type: { summary: '(fileId: string, file: File) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onChange: {
      control: false,
      description: 'Fired when files list changes',
      table: {
        type: { summary: '(files: UploadFile[]) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
};

// Component for Basic story, displays Upload with preloaded image
function UploadWithPreloadedImage(props: UploadProps) {
  const onFilesChange = useCallback(
    (next: UploadFile[]) => {
      action('onChange')(next);
    },
    [],
  );

  const { files, handleChange } = useControlledFiles([], onFilesChange);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    createFileFromUrl('https://rytass.com/logo.png', 'logo.png')
      .then((file) => {
        if (!mounted) return;

        handleChange([
          {
            file,
            id: `story-preload-${Date.now()}-${Math.random()}`,
            progress: 100,
            status: 'done',
          },
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load image:', error);
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [handleChange]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Upload
      {...props}
      files={files}
      onChange={handleChange}
      onUpload={props.onUpload ?? simulateUpload}
      onDelete={props.onDelete ?? storyHandlers.onDelete}
      onReload={props.onReload ?? storyHandlers.onReload}
      onDownload={props.onDownload ?? storyHandlers.onDownload}
      onZoomIn={props.onZoomIn ?? storyHandlers.onZoomIn}
    />
  );
}

// Component for Basic story
function BasicStoryContent() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: 800,
      }}
    >
      <div>
        <h3>List Mode:</h3>
        <p>Display files in list format, images use UploadPictureCard, other files use UploadItem</p>
        <UploadWithPreloadedImage
          mode="list"
          size="main"
          showFileSize
          hints={[
            {
              label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。',
            },
          ]}
        />
      </div>

      <div>
        <h3>Button List Mode:</h3>
        <p>Display files in button list format</p>
        <UploadWithPreloadedImage
          mode="button-list"
          size="main"
          hints={[
            {
              label: '支援 JPG、PNG、PDF；單檔上限 500 KB。',
              type: 'info',
            },
            {
              label: '最多 5 個檔案。',
              type: 'info',
            },
          ]}
        />
      </div>

      <div>
        <h3>Cards Mode:</h3>
        <p>Display files in card format, images use UploadPictureCard, other files use UploadItem</p>
        <UploadWithPreloadedImage
          mode="cards"
          size="main"
          hints={[
            {
              label: '支援 JPG、PNG、PDF；單檔上限 500 KB。',
              type: 'info',
            },
            {
              label: '最多 5 個檔案。',
              type: 'info',
            },
          ]}
        />
      </div>

      <div>
        <h3>Card Wall Mode:</h3>
        <p>Display files in card wall format, all files use UploadPictureCard</p>
        <UploadWithPreloadedImage
          mode="card-wall"
          size="main"
          hints={[
            {
              label: '支援 JPG、PNG；單檔上限 500 KB；最多 5 個檔案。',
            },
          ]}
        />
      </div>
    </div>
  );
}

export const Basic: Story = {
  render: () => <BasicStoryContent />,
};

export const FormBinding: Story = {
  render: () => <FormBindingStory />,
};

export const IdNameBinding: Story = {
  render: () => <IdNameBindingStory />,
};

