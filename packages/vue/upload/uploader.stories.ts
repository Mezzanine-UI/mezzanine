import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznUploader from './uploader.vue';
import type { UploaderProps } from './uploader.types';

export default {
  title: 'Data Entry/Upload/Uploader',
  component: MznUploader,
} satisfies Meta<typeof MznUploader>;

/**
 * React's props carry the callbacks and the ref, so its story documents them as
 * argTypes; the same rows are declared here so the two Controls panels match.
 */
type PlaygroundArgs = UploaderProps & {
  className?: string;
  inputRef?: unknown;
  onChange?: (event: Event) => void;
  onUpload?: (files: File[]) => void;
};

type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  args: {
    accept: undefined,
    disabled: false,
    id: 'playground-upload',
    mode: 'basic',
    multiple: false,
    name: 'playground-upload',
    label: {
      uploadLabel: undefined,
      uploadingLabel: undefined,
      success: undefined,
      error: undefined,
      clickToUpload: 'Click to upload',
    },
    icon: {
      upload: undefined,
      error: undefined,
      success: undefined,
      zoom: undefined,
      document: undefined,
      download: undefined,
      reload: undefined,
      delete: undefined,
    },
    hints: [
      {
        label: 'jpg/png files with a size less than 500KB.',
      },
    ],
    type: 'base',
  },
  argTypes: {
    accept: {
      control: {
        type: 'text',
      },
      description: 'The accept attributes of native input element',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    mode: {
      control: {
        type: 'select',
        options: ['basic', 'dropzone'],
      },
      description: 'The mode for upload component.',
      table: {
        type: { summary: "'basic' | 'dropzone'" },
        defaultValue: { summary: "'basic'" },
      },
    },
    multiple: {
      control: {
        type: 'boolean',
      },
      description: 'Whether can select multiple files to upload',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      control: {
        type: 'text',
      },
      description: 'The name attribute of the input element',
      table: {
        type: { summary: 'string' },
      },
    },
    id: {
      control: {
        type: 'text',
      },
      description: 'The id of input element',
      table: {
        type: { summary: 'string' },
      },
    },
    onUpload: {
      description: 'Fired after user selected files',
      table: {
        type: { summary: '(files: File[]) => void' },
      },
    },
    onChange: {
      description: 'Invoked by input change event',
      table: {
        type: { summary: 'ChangeEventHandler<HTMLInputElement>' },
      },
    },
    inputProps: {
      control: false,
      table: {
        disable: true,
      },
    },
    inputRef: {
      control: false,
      table: {
        disable: true,
      },
    },
    className: {
      control: false,
      table: {
        disable: true,
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['base', 'button'],
      },
      description: 'The type for upload component.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'base' },
      },
    },
  },
  render: (args) => ({
    components: { MznUploader },
    setup: () => ({
      args,
      handleChange: (event: Event): void => {
        // eslint-disable-next-line no-console
        console.log('Uploader changed:', {
          files: (event.target as HTMLInputElement).files,
          name: args.name,
        });
      },
      handleUpload: (files: File[]): void => {
        // eslint-disable-next-line no-console
        console.log('Files uploaded:', files);
      },
    }),
    template: `
      <MznUploader v-bind="args" @change="handleChange" @upload="handleUpload" />
    `,
  }),
};
